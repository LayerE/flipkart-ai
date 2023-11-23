// @ts-nocheck

import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 300;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb", // Set desired value here
    },
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

export default async function handler(req: NextRequest, res: NextResponse) {
  try {
    if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }

    const { body } = req;
    const payload = body;
    var { user_id, image_urls, project_id, type } = payload;

    if (!user_id) {
      res.status(400).send("Missing user_id");
      return;
    }

    if (!image_urls) {
      res.status(400).send("Missing image_urls");
      return;
    }

    if (!project_id) {
      res.status(400).send("Missing project_id");
      return;
    }

    // Upsert rows which match the image_urls to is_regenerated = false
    const updateObject = [];
    for (var i = 0; i < image_urls.length; i++) {
      updateObject.push({
        user_id: user_id,
        project_id: project_id,
        modified_image_url: image_urls[i],
        is_regenerated: false,
      });
    }

    const { data, error } = await supabase
      .from(process.env.NEXT_PUBLIC_IMAGE_TABLE as string)
      .upsert(updateObject);

    if (error) {
      console.log(error.message);
      res.status(500).send("Error in Updating Image");
      return;
    }

    res.status(200).send({ success: true, message: "Image updated" });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating image");
    return;
  }
}
