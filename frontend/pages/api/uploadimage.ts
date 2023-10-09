import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import FormData from "form-data";
const { createCanvas, loadImage } = require("canvas");

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb", // Set desired value here
    },
  },
};

async function getImageDimensions(base64Url: string) {
  const canvas = createCanvas();
  const ctx = canvas.getContext("2d");

  try {
    const image = await loadImage(base64Url);
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    const dimensions = {
      width: canvas.width,
      height: canvas.height,
    };
    return dimensions;
  } catch (error) {
    console.error("Error:", error.message);
    return { error: error.message };
  }
}

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

export default async function handler(req: NextRequest, res: NextResponse) {
  try {
    if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }

    const { body } = req;
    const payload = body;
    const { user_id, dataUrl, project_id } = payload;

    console.log(dataUrl);

    if (!user_id) {
      res.status(400).send("Missing user_id");
      return;
    }

    const inputBase64Url = dataUrl;

    // Get the image dimensions of the image from its base64Url
    const { width: img_width, height: img_height } = await getImageDimensions(
      inputBase64Url
    );

    if (!img_width || !img_height) {
      res.status(400).send("Image is corrupted or unsupported dimensions");
      return;
    }

    // Check if image is less than 25MP
    if (img_width * img_height > 25000000) {
      res.status(400).send("Image is too big");
      return;
    }

    // Upload image to ImageKit
    const { url: imageUrl, height, width } = await uploadImage(inputBase64Url);

    res.status(200).send(
      JSON.stringify({
        url: imageUrl,
        height,
        width,
      })
    );
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send("Error removing background");
    return;
  }
}
