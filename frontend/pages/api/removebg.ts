import { NextResponse, NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const uploadImage = async (dataUrl: string) => {
  const formdata = new FormData();
  formdata.append("file", dataUrl);
  formdata.append("fileName", "img.png");

  const imageKitResponse = await fetch(
    "https://upload.imagekit.io/api/v1/files/upload",
    {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(process.env.IMAGEKIT_API_KEY + ":"),
      },
      body: formdata,
    }
  );

  const imageKitJson = await imageKitResponse.json();
  const { url, name, height, width } = imageKitJson;

  return { url, name, height, width };
};

export default async (req: NextRequest) => {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Method not allowed" });
    }

    const body = await req.json();
    const { user_id, dataUrl, project_id } = body;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" });
    }

    const response = await fetch(
      "https://dhanushreddy29-remove-background.hf.space/run/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: dataUrl,
        }),
      }
    );

    const data = await response.json();

    // Upload image to ImageKit
    const { url: imageUrl, height, width } = await uploadImage(data?.data[0]);

    // Add the image to the database
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/v1/${process.env.NEXT_PUBLIC_BACKGROUND_REMOVED_IMAGES_TABLE}`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_KEY as string,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}` as string,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          user_id,
          image_url: imageUrl,
          project_id: project_id || null,
        }),
      }
    );

    return NextResponse.json({ data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error removing background" });
  }
};
