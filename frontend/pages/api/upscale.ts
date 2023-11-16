// @ts-nocheck

import { NextResponse, NextRequest } from "next/server";
const axios = require("axios");
export const maxDuration = 300;

async function imageUrlToBase64(url: string) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const base64String = Buffer.from(response.data, "binary").toString(
      "base64"
    );
    return "data:image/png;base64," + base64String;
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while converting the image to base64.");
  }
}

export default async (req: NextRequest, res: NextResponse) => {
  try {
    if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
    }

    const { body } = req;
    const { image_url, user_id } = body;

    if (!image_url) {
      res.status(400).send("Missing image_url");
    }

    if (!user_id) {
      res.status(400).send("Missing user_id");
    }

    // Convert image_url to base64string in order to send to Replicate
    const imageBase64 = await imageUrlToBase64(image_url);

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_KEY,
      },
      body: JSON.stringify({
        version:
          "42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
        input: {
          image: imageBase64,
        },
        webhook: `${process.env.REPLICATE_WEBHOOK}/?user_id=${user_id}`,
        webhook_events_filter: ["completed"],
      }),
    });

    const resp = await response.json();
    res.status(200).send({ message: "Job started", ok: true, id: resp.id });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error generating image");
  }
};
