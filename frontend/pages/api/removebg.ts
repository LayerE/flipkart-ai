import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import FormData from "form-data";

const uploadImage = async (dataUrl: string) => {
  const formdata = new FormData();
  formdata.append("file", dataUrl);
  formdata.append("fileName", "img.png");

  try {
    const response = await axios.post(
      "https://upload.imagekit.io/api/v1/files/upload",
      formdata,
      {
        headers: {
          Authorization: "Basic " + btoa(process.env.IMAGEKIT_API_KEY + ":"),
          ...formdata.getHeaders(),
        },
      }
    );

    const { data } = response;
    const { url, name, height, width } = data;

    return { url, name, height, width };
  } catch (error) {
    // Handle errors here
    console.error("Error uploading image:", error);
    throw error;
  }
};

export default async function handler(req: NextRequest, res) {
  try {
    if (req.method !== "POST") {
      // return NextResponse.json({ error: "Method not allowed" });
      res.status(405).send("Method not allowed");
      return;
    }

    const { body } = req;
    const payload = body;
    const { user_id, dataUrl, project_id } = payload;

    console.log(dataUrl);

    if (!user_id) {
      // return NextResponse.json({ error: "Missing user_id" });
      res.status(400).send("Missing user_id");
      return;
    }

    const inputBase64Url = dataUrl;

    // Encode the base64 data as a buffer
    const inputBuffer = Buffer.from(
      inputBase64Url.split(";base64,").pop(),
      "base64"
    );

    let form = new FormData();
    form.append("image_file", inputBuffer, {
      filename: "input.jpg",
      contentType: "image/jpeg",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://clipdrop-api.co/remove-background/v1",
      headers: {
        "x-api-key": process.env.CLIPDROP_API_KEY || null,
        ...form.getHeaders(),
      },
      data: form,
      responseType: "arraybuffer",
    };

    const response = axios.request(config);

    // Get base64url from response
    const { data } = await response;
    const outputBase64Url = `data:image/png;base64,${data.toString("base64")}`;

    // Upload image to ImageKit
    const { url: imageUrl, height, width } = await uploadImage(outputBase64Url);

    // Add the image to the database
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${process.env.NEXT_PUBLIC_BACKGROUND_REMOVED_IMAGES_TABLE}`,
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

    res.status(200).send(
      JSON.stringify({
        data: { data: [outputBase64Url] },
        imageUrl,
      })
    );
    return;
  } catch (error) {
    console.log(error);
    // return NextResponse.json({ error: "Error removing background" });
    res.status(500).send("Error removing background");
    return;
  }
}
