import hashlib
import os
import subprocess
from io import BytesIO

import modal
import openai
import requests
from PIL import Image
from supabase import Client, create_client

from celery import Celery

app = Celery(
    "images",
    broker=os.getenv("TEST_QUEUE_URL"),
)

headers = {"Content-Type": "application/json", "User-Agent": "CommerceCopilotv1.0"}

supabase: Client = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_KEY"],
)


def get_dominant_color(pil_img):
    img = pil_img.copy()
    img = img.convert("RGBA")
    img = img.resize((1, 1), resample=0)
    dominant_color = img.getpixel((0, 0))
    return dominant_color

# Function to make a request to chatgpt API and return the response
def get_chatgpt_response(prompt):
    try:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            temperature=0.2,
            messages=[
                {
                    "role": "system",
                    "content": "You are a product photography expert, you will be generating prompts for Stable Diffusion, a Generative Adversarial Network (GAN) that can take text and output images. Your goal is to create a prompt for the iage that the GAN can use to generate an image. For example, if the text prompt was 'A Fridge in a kitchen', a description may be: 'A culinary enthusiast's dream kitchen with a professional-grade fridge, complemented by a large cooking range and an array of premium cookware, symbolizing a space dedicated to the art of gastronomy and culinary exploration'. Send the entire response as a single line of text with a maximum of 20 words in total.",
                },
                {"role": "user", "content": prompt},
            ],
        )
        return completion.choices[0].message.content
    except Exception as e:
        print("error", e)
        return prompt

@app.task
def create_task(
    image: str,
    prompt: str,
    num_images: int,
    api_key: str,
    unique_id: str,
    webhook_url: str = None,
):
    try:
        # Check if api_key is valid
        hashed_key = hashlib.sha256(api_key.encode()).hexdigest()

        # Check it in the database
        result = (
            supabase.rpc(
                "check_api_key_and_credits",
                {"api_key_arg": hashed_key, "task_id_arg": unique_id},
            )
            .execute()
            .model_dump()
        )

        should_process = result["data"][0]["should_process"]

        if should_process:
            image_urls = []
            path = os.path.join("/tmp", unique_id)
            if not os.path.exists(path):
                os.makedirs(path)
            if webhook_url:
                print("Image URL was: ", image)

                image_as_bytes = requests.get(image, stream=True).content

                model_used = (
                    "sdxlcanny"
                    if "podium" in prompt
                    else "sdxlcanny"
                    if "stage" in prompt
                    else "sdxlcanny"
                    if "platform" in prompt
                    else "epicrealism-new"
                    if "kitchen" in prompt
                    else "epicrealism-new"
                    if "bathroom" in prompt
                    else "epicrealism-new"
                    if "fridge" in prompt
                    else "epicrealism-new"
                    if "refrigerator" in prompt
                    else "epicrealism-new"
                    if "washing" in prompt
                    else "epicrealism-new"
                    if "bathroom" in prompt
                    else "epicrealism-sam"
                )

                f = modal.Function.lookup(
                    model_used,
                    "ImageGenerator.generate",
                )

                caption = prompt.split(",")[0]
                caption = caption.replace('"', "")
                # prompt = get_chatgpt_response(prompt)
                print("Prompt, Caption: ", prompt, caption)
                if model_used == "epicrealism-new":
                    images = f.remote(prompt, image_as_bytes, num_images)
                else:
                    images = f.remote(
                        prompt, image_as_bytes, num_images, caption, False, True
                    )

                # Save the images to a temporary directory
                number_of_images = len(images)
                for i, image in enumerate(images):
                    supabase.storage.from_("api_images").upload(
                        file=image,
                        path=f"/{unique_id}/{i}.png",
                        file_options={"content-type": "image/png"},
                    )

                # Upload the image to Supabase Storage
                image_urls = [
                    f"{os.getenv('SUPABASE_URL')}/storage/v1/object/public/api_images/{unique_id}/{i}.png"
                    for i in range(number_of_images)
                ]

                print("Output Image URLs: ", image_urls)

                # Delete the temporary directory
                subprocess.run(["rm", "-rf", path])
                requests.post(
                    webhook_url,
                    json={
                        "message": "success",
                        "image_url": image_urls,
                    },
                    headers=headers,
                )
            # Update the status of the task in the database
            # supabase.table("APIRequests").update({"result": image_urls}).eq(
            #     "task_id", unique_id
            # ).execute()
            requests.patch(
                f"{os.getenv('SUPABASE_URL')}/rest/v1/APIRequests?task_id=eq.{unique_id}",
                json={"result": image_urls},
                headers={
                    "apikey": os.getenv("SUPABASE_KEY"),
                    "Authorization": "Bearer " + os.getenv("SUPABASE_KEY"),
                    "Content-Type": "application/json",
                },
            )

            print("Image URLs: ", image_urls)
        else:
            if webhook_url:
                # Send a POST request to the webhook_url
                requests.post(
                    webhook_url,
                    json={
                        "message": "failed",
                        "image_url": None,
                        "reason": "Your API Key is invalid",
                    },
                    headers=headers,
                )
            # Update the status of the task in the database
            supabase.table("APIRequests").update(
                {"result": ["Failed! Your API Key is invalid"]}
            ).eq("task_id", unique_id).execute()

    except Exception as e:
        print(e)
        return
