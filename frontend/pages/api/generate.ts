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
    const { dataUrl, prompt, maskDataUrl, user_id, num_images, lora_type, category, caption, is_3d } = body;

    if (!dataUrl) {
      return NextResponse.json({ error: "Missing dataUrl" });
    }

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" });
    }

    console.log("Prompt was " + prompt);

    const { url: imageUrl, height, width } = await uploadImage(dataUrl);

    if (height > 768 || width > 768 || height < 256 || width < 256) {
      return NextResponse.json({
        error: "Image must be between 256px and 768px",
      });
    }

    console.log(dataUrl);

    const response = await fetch(process.env.CELERY_WORKER_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: process.env.KEY,
        image_url: imageUrl + "?tr=orig-true",
        prompt: prompt,
        mask_image: maskDataUrl,
        user_id: user_id,
        num_images: num_images,
        lora_type: lora_type,
        category: category,
        is_dev_site: true,
        caption: caption,
        is_3d: is_3d,
      }),
    });

    const json = await response.json();
    console.log(json);

    const job_id = json?.id || null;
    if (!job_id) {
      throw new Error("Sorry server is busy, please try again later");
    }

    return NextResponse.json({ message: "Job started", ok: true, job_id });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error Generating Image" });
  }
};
