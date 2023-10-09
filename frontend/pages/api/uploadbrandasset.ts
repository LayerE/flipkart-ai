import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";
import { v4 as uuidv4 } from "uuid";

export const config = {
  runtime: "edge",
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string,
  {
    auth: {
      persistSession: false,
    },
  }
);

export default async (req: NextRequest) => {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Method not allowed" });
    }

    const body = await req.json();
    const { user_id, dataUrl } = body;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" });
    }

    if (!dataUrl) {
      return NextResponse.json({ error: "Missing dataUrl" });
    }

    const randomFileName = uuidv4().toString() + ".png";

    const modified_url = dataUrl.replace(/^data:image\/\w+;base64,/, "");

    // Upload the file to supabase storage
    const { data, error } = await supabase.storage
      .from(process.env.BRAND_ASSETS_BUCKET as string)
      .upload(randomFileName, decode(modified_url));

    if (error) {
      return NextResponse.json({ error: error.message });
    }

    // Get the file url
    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.BRAND_ASSETS_BUCKET}/${randomFileName}`;

    const postURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${process.env.BRAND_ASSETS_TABLE}`;

    const response = await fetch(postURL, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_KEY as string,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}` as string,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        user_id,
        image_url: fileUrl,
      }),
    });

    // Get the status_code of the response
    const { status } = response;
    // Return status code
    if (status !== 201) {
      return NextResponse.json({ error: "Error saving image" });
    } else {
      // Send 201 response
      return NextResponse.json(
        { status: "Image saved", image_url: fileUrl },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error fetching images" });
  }
};
