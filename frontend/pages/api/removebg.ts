// @ts-nocheck

import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import FormData from "form-data";
const { createCanvas, loadImage } = require("canvas");

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb", // Set desired value here
    },
  },
};

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

function isUrl(url: string) {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(url);
}

export default async function handler(req: NextRequest, res: NextResponse) {
  try {
    if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }

    const { body } = req;
    const payload = body;
    const { user_id, dataUrl, project_id, type } = payload;

    var fileExtension = "png";
    if (dataUrl.includes("jpeg") || dataUrl.includes("jpg")) {
      fileExtension = "jpeg";
    }
    if (dataUrl.includes("webp")) {
      fileExtension = "webp";
    }

    if (!user_id) {
      res.status(400).send("Missing user_id");
      return;
    }

    // If DataUrl is a website url, fetch the image and convert it to a base64Url
    // Check if dataUrl is a url
    const is_url = isUrl(dataUrl);

    var inputBase64Url = "";

    if (is_url) {
      const response = await axios.get(dataUrl, {
        responseType: "arraybuffer",
      });

      const base64Url = `data:image/png;base64,${response.data.toString(
        "base64"
      )}`;
      inputBase64Url = base64Url;
    } else {
      inputBase64Url = dataUrl;
    }

    const useClipDrop = true;
    var outputBase64Url = "";
    var caption = "";

    if (useClipDrop) {
      // Encode the base64 data as a buffer
      const inputBuffer = Buffer.from(
        inputBase64Url.split(";base64,").pop(),
        "base64"
      );

      const caption_response = await fetch(
        "https://dehiddenformodal--onlycaption-caption.modal.run",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            img: inputBase64Url,
          }),
        }
      );

      let form = new FormData();
      form.append("image_file", inputBuffer, {
        filename: "input." + fileExtension,
        contentType: "image/" + fileExtension,
      });

      let config = {
        method: "post",
        maxBodyLength: 10 * 1024 * 1024,
        url: "https://clipdrop-api.co/remove-background/v1",
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY || null,
          ...form.getHeaders(),
        },
        data: form,
        responseType: "arraybuffer",
      };

      const response = axios.request(config);

      //  Get the caption
      const caption_data = await caption_response.json();

      console.log(caption_data);

      caption = caption_data["caption"];

      // Get base64url from response
      const { data } = await response;
      outputBase64Url = `data:image/png;base64,${data.toString("base64")}`;
    } else {
      const caption_bg_response = await fetch(
        "https://dehiddenformodal--bgremove-caption-removebg-and-caption.modal.run",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            img: inputBase64Url,
          }),
        }
      );

      const caption_bg_data = await caption_bg_response.json();
      outputBase64Url = caption_bg_data["image"];
      caption = caption_bg_data["caption"];
    }

    // Upload image to ImageKit
    const { url: imageUrl, height, width } = await uploadImage(outputBase64Url);

    // Add the image to the database
    const respy = await fetch(
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
          type: type === null ? "image" : type,
        }),
      }
    );

    res.status(200).send(
      JSON.stringify({
        data: { data: [outputBase64Url] },
        caption,
        imageUrl,
      })
    );
    return;
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error removing background");
    return;
  }
}
