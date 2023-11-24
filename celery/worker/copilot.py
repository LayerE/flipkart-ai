import json
import os
from io import BytesIO

import modal
import requests
from celery import Celery
from PIL import Image
from supabase import Client, create_client

from helpers import (
    NEXT_PUBLIC_IMAGE_TABLE,
    NEXT_PUBLIC_SUPABASE_URL,
    determine_model,
    get_chatgpt_response,
    upload_file_to_supabase,
)

supabase: Client = create_client(
    NEXT_PUBLIC_SUPABASE_URL,
    os.environ["SUPABASE_SERVICE_KEY"],
)

app = Celery(
    "images",
    broker=f"amqp://{os.environ['RABBITMQ_DEFAULT_USER']}:{os.environ['RABBITMQ_DEFAULT_PASS']}@{os.environ['RABBITMQ_HOST']}",
)


@app.task()
def generate_normal(rawJson):
    try:
        prompt, image_url, num_images, caption, user_id = rawJson.values()

        is_quick_generation = (
            rawJson["is_quick_generation"]
            if "is_quick_generation" in rawJson
            else False
        )

        # Get the celery task id
        task_id = str(generate_normal.request.id)
        path = os.path.join("/tmp", task_id)
        if not os.path.exists(path):
            os.makedirs(path)

        image_response = requests.get(image_url).content
        image_response = Image.open(BytesIO(image_response))

        with BytesIO() as buf:
            image_response.save(buf, "PNG")
            image_response = buf.getvalue()

        if len(image_url) < 1000:
            print("Image url is: ", image_url)
        else:
            print("A Base 64 image is sent")

        prompt = caption + " " + prompt
        prompt = prompt.strip()
        print("Original Prompt is: ", prompt)
        if len(prompt) < 50:
            response = get_chatgpt_response(prompt)
            if response is not None:
                prompt = response

        print("Modified Prompt is: ", prompt)
        model_used = determine_model(prompt)

        # Call modal to generate the images
        f = modal.Function.lookup(
            model_used,
            "ImageGenerator.generate",
        )

        args = [prompt, image_response, num_images]
        if model_used != "epicrealism-new":
            args.extend([caption, is_quick_generation])

        images = f.remote(*args)
        number_of_images = len(images)

        original_file_urls = []

        for i in range(number_of_images):
            try:
                uploadToSupabase = upload_file_to_supabase(
                    bucketName=NEXT_PUBLIC_IMAGE_TABLE,
                    image=images[i],
                    filePath=f"{task_id}/{i}.png",
                )
                if uploadToSupabase:
                    original_file_urls.append(
                        f"{NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/{NEXT_PUBLIC_IMAGE_TABLE}/{task_id}/{i}.png"
                    )
            except Exception as e:
                print("Exception catched error is: ", e)
                pass

        # Insert into the supabase database
        requests.post(
            f"{NEXT_PUBLIC_SUPABASE_URL}/rest/v1/{NEXT_PUBLIC_IMAGE_TABLE}",
            headers={
                "apikey": os.getenv("SUPABASE_SERVICE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_SERVICE_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps(
                [
                    {
                        "image_url": image_url,
                        "modified_image_url": original_file_urls[i],
                        "prompt": prompt,
                        "user_id": user_id,
                        "task_id": task_id,
                        "caption": caption,
                        "is_quick": is_quick_generation,
                        "project_id": rawJson["project_id"],
                    }
                    for i in range(number_of_images)
                ]
            ),
        )

        print("Generated Image URL's are:", original_file_urls)
    except Exception as e:
        print("Error is: ", e)
        pass


@app.task()
def generate_threed(rawJson):
    try:
        prompt, image_url, num_images, caption, user_id = rawJson.values()

        # Get the celery task id
        task_id = str(generate_threed.request.id)

        image_response = requests.get(image_url)

        prompt = caption + " " + prompt
        prompt = prompt.strip()

        print("Original Prompt is: ", prompt)

        if len(prompt) < 50:
            response = get_chatgpt_response(prompt)
            if response is not None:
                prompt = response

        print("Modified Prompt is: ", prompt)
        if len(image_url) < 1000:
            print("Image url is: ", image_url)
        else:
            print("A Base 64 image is sent")

        model_used = determine_model(prompt)
        # Call modal to generate the images
        f = modal.Function.lookup(
            model_used,
            "ImageGenerator.generate",
        )

        args = [prompt, image_response, num_images]
        if model_used != "epicrealism-new":
            args.extend([caption])

        images = f.remote(*args)

        # Save the images to a temporary directory
        number_of_images = len(images)

        original_file_urls = []
        for i in range(number_of_images):
            uploadToSupabase = upload_file_to_supabase(
                bucketName=NEXT_PUBLIC_IMAGE_TABLE,
                image=images[i],
                filePath=f"{task_id}/{i}.png",
            )
            if uploadToSupabase:
                original_file_urls.append(
                    f"{NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/{NEXT_PUBLIC_IMAGE_TABLE}/{task_id}/{i}.png"
                )

        # Insert into the supabase database
        requests.post(
            f"{NEXT_PUBLIC_SUPABASE_URL}/rest/v1/{THREED_IMAGES_TABLE_NAME}",
            headers={
                "apikey": os.getenv("SUPABASE_SERVICE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_SERVICE_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps(
                [
                    {
                        "image_url": image_url,
                        "modified_image_url": original_file_urls[i],
                        "prompt": prompt,
                        "user_id": user_id,
                        "task_id": task_id,
                        "caption": caption,
                    }
                    for i in range(number_of_images)
                ]
            ),
        )

        print("Generated Image URL's are:", original_file_urls)
    except Exception as e:
        print("Error is: ", e)
        pass


@app.task()
def regenerate(rawJson):
    try:
        image_url, user_id = rawJson.values()
        # Get the celery task id
        task_id = str(regenerate.request.id)

        # Get the prompt and caption from the database
        response = requests.get(
            f"{NEXT_PUBLIC_SUPABASE_URL}/rest/v1/{NEXT_PUBLIC_IMAGE_TABLE}?modified_image_url=eq.{image_url}",
            headers={
                "apikey": os.getenv("SUPABASE_SERVICE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_SERVICE_KEY')}",
                "Content-Type": "application/json",
            },
        )

        response = response.json()
        prompt, caption, user_id, image_url, project_id = response[0].values()

        image_response = requests.get(image_url).content
        image_response = Image.open(BytesIO(image_response))

        with BytesIO() as buf:
            image_response.save(buf, "PNG")
            image_response = buf.getvalue()

        model_used = determine_model(prompt)

        # Call modal to generate the images
        f = modal.Function.lookup(
            model_used,
            "ImageGenerator.generate",
        )

        args = [prompt, image_response, 3]
        if model_used != "epicrealism-new":
            args.extend([caption])

        images = f.remote(*args)

        # Save the images to a temporary directory
        number_of_images = len(images)
        original_file_urls = []
        for i in range(number_of_images):
            uploadToSupabase = upload_file_to_supabase(
                bucketName=NEXT_PUBLIC_IMAGE_TABLE,
                image=images[i],
                filePath=f"{task_id}/{i}.png",
            )
            if uploadToSupabase:
                original_file_urls.append(
                    f"{NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/{NEXT_PUBLIC_IMAGE_TABLE}/{task_id}/{i}.png"
                )

        # Insert into the supabase database
        # Insert into the supabase database
        response = requests.post(
            f"{NEXT_PUBLIC_SUPABASE_URL}/rest/v1/{NEXT_PUBLIC_IMAGE_TABLE}",
            headers={
                "apikey": os.getenv("SUPABASE_SERVICE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_SERVICE_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps(
                [
                    {
                        "image_url": image_url,
                        "modified_image_url": original_file_urls[i],
                        "prompt": prompt,
                        "user_id": user_id,
                        "task_id": task_id,
                        "caption": caption,
                        "is_3d": True,
                        "project_id": None,
                    }
                    for i in range(number_of_images)
                ]
            ),
        )

        print("Generated Image URL's are:", original_file_urls)
    except Exception as e:
        print("Error is: ", e)
        pass
