import base64
import hashlib
import io
import json
import os
import subprocess
from io import BytesIO

import modal
import replicate
import requests
from celery import Celery
from imagekitio import ImageKit
from PIL import Image
from supabase import Client, create_client

from helpers import (
    get_b2_resource,
    get_chatgpt_response,
    hash,
    upload_file,
    upload_file_to_supabase,
)

imagekit = ImageKit(
    private_key=os.getenv("IMAGEKIT_PRIVATE_KEYY"),
    public_key=os.getenv("IMAGEKIT_PUBLIC_KEYY"),
    url_endpoint=os.getenv("IMAGEKIT_URL_ENDPOINTY"),
)

headers = {"Content-Type": "application/json", "User-Agent": "CommerceCopilotv1.0"}

supabase: Client = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_KEY"],
)

endpoint = os.getenv("S3_ENDPOINT")
key_id = os.getenv("B2_KEY_ID")
application_key = os.getenv("B2_APPLICATION_KEY")
bucket_name = os.getenv("BUCKET_NAME")

app = Celery(
    "images",
    broker=os.getenv("CLOUDAMQP_URL"),
)


@app.task
def create_task(
    base64URL: str,
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
            if webhook_url:
                path = os.path.join("/tmp", unique_id)
                if not os.path.exists(path):
                    os.makedirs(path)

                f = modal.Function.lookup(
                    "epicrealism-dev",
                    "ImageGenerator.generate",
                )

                # Convert the image which is as base64 URL to bytes
                image_as_bytes = io.BytesIO(
                    base64.b64decode(
                        base64URL.split("base64,")[1]
                        if "base64," in base64URL
                        else base64URL
                    )
                ).getvalue()

                images = f.remote(prompt, image_as_bytes, num_images)

                # Save the images to a temporary directory
                number_of_images = len(images)
                for i, image in enumerate(images):
                    supabase.storage.from_(os.getenv("API_IMAGES_BUCKET")).upload(
                        file=image,
                        path=f"/{unique_id}/{i}.png",
                        file_options={"content-type": "image/png"},
                    )

                # Upload the image to Supabase Storage
                image_urls = [
                    f"{os.getenv('SUPABASE_URL')}/storage/v1/object/public/{os.getenv('API_IMAGES_BUCKET')}/{unique_id}/{i}.png"
                    for i in range(number_of_images)
                ]

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
            supabase.table(os.getenv("API_REQUESTS_TABLE")).update(
                {"result": image_urls}
            ).eq("task_id", unique_id).execute()
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
            supabase.table(os.getenv("API_REQUESTS_TABLE")).update(
                {"result": ["Failed! Your API Key is invalid"]}
            ).eq("task_id", unique_id).execute()

    except Exception as e:
        print(e)


@app.task()
def generate_image_copilot(prompt, image_url, user_id, object, is_production=False):
    try:
        # Get the celery task id
        task_id = generate_image_copilot.request.id
        path = os.path.join("/tmp", task_id)
        if not os.path.exists(path):
            os.makedirs(path)

        original_image_path = os.path.join(path, "original.png")
        canny_image_path = os.path.join(path, "canny.png")

        # Download the original image
        image_response = requests.get(image_url)
        img = Image.open(BytesIO(image_response.content))
        img.save(original_image_path)

        # Download the canny image
        image_response = requests.post(
            os.getenv("CANNY_SERVER"),
            headers={"Content-Type": "application/json"},
            data=json.dumps({"image_url": image_url, "key": os.getenv("KEY")}),
        )

        image_response = image_response.json()
        image_data = image_response["image"]

        # Save the base64 image to a file
        image_data = image_data.split(",")[1]
        image_data = base64.b64decode(image_data)
        with open(canny_image_path, "wb") as f:
            f.write(image_data)

        with open(canny_image_path, "rb") as f:
            image_data = f.read()
        pil_image = Image.open(BytesIO(image_data))

        # Free memory by deleting variables
        img = None
        image_data = None

        # Get the prompt from chatgpt
        response = get_chatgpt_response(prompt)
        if response is not None:
            prompt = response

        print("Prompt is: ", prompt)

        # Call modal to generate the images
        f = modal.Function.lookup("copilot-motionfour", "ImageGenerator.generate")
        images = f.remote(
            "masterpiece," + prompt + ",light and shadow,motion design,C4D,rendering",
            pil_image,
        )

        # Save the images to a temporary directory
        number_of_images = len(images)
        for i, image in enumerate(images):
            with open(os.path.join(path, f"{i}.png"), "wb") as f:
                f.write(image)

        # Upload the image to B2 storage
        b2 = get_b2_resource(endpoint, key_id, application_key)
        original_file_urls = []
        for i in range(number_of_images):
            file_url = upload_file(
                bucket_name,
                path,
                f"{i}.png",
                b2,
                endpoint,
                b2path=hash(user_id) + "/" + str(task_id) + "/original_images"
                if is_production
                else user_id + "/" + str(task_id) + "/original_images_test",
            )
            original_file_urls.append(file_url)

        # Overlay the original image on all the generated images
        overlay_img = Image.open(original_image_path)
        overlay_img = overlay_img.convert("RGBA")
        for i in range(number_of_images):
            base_img = Image.open(os.path.join(path, f"{i}.png"))
            base_img.paste(overlay_img, (0, 0), overlay_img)
            base_img.save(os.path.join(path, f"modified_{i}.png"))

        # Upload the modified images to B2 storage
        modified_file_urls = []
        for i in range(number_of_images):
            file_url = upload_file(
                bucket_name,
                path,
                f"modified_{i}.png",
                b2,
                endpoint,
                b2path=hash(user_id) + "/" + str(task_id) + "/modified_images"
                if is_production
                else user_id + "/" + str(task_id) + "/modified_images_test",
            )
            modified_file_urls.append(file_url)

        # Add the image urls to the database
        if is_production:
            table_name = os.getenv("TABLE_NAME_PROD")
            pending_jobs_table = os.getenv("PENDING_JOBS_TABLE_PROD")
        else:
            table_name = os.getenv("TABLE_NAME")
            pending_jobs_table = os.getenv("PENDING_JOBS_TABLE")

        # Insert into the supabase database
        requests.post(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{table_name}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps(
                [
                    {
                        "user_id": user_id,
                        "image_url": "https://res.cloudinary.com/dq8wvjoeq/image/fetch/"
                        + original_file_urls[i],
                        "modified_image_url": "https://res.cloudinary.com/dq8wvjoeq/image/fetch/"
                        + modified_file_urls[i],
                        "prompt": prompt,
                        "title": object,
                    }
                    for i in range(number_of_images)
                ]
            ),
        )

        table_name = (
            os.getenv("NEXT_PUBLIC_SUPABASE_TABLE_PROD")
            if is_production
            else os.getenv("NEXT_PUBLIC_SUPABASE_TABLE")
        )

        # Get the user credits
        response = requests.get(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{table_name}?user_id=eq.{user_id}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
                "Content-Type": "application/json",
            },
        )
        user_credits = response.json()[0]["credits"]

        # Update the user credits
        requests.patch(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{table_name}?user_id=eq.{user_id}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps({"credits": user_credits - 1}),
        )

        # Delete the user from the pending jobs table
        requests.delete(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{pending_jobs_table}?user_id=eq.{user_id}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
                "Content-Type": "application/json",
            },
        )

        # Upload the canny image to B2 storage
        upload_file(
            bucket_name,
            path,
            "canny.png",
            b2,
            endpoint,
            b2path=hash(user_id) + "/" + str(task_id) + "/canny_images"
            if is_production
            else user_id + "/" + str(task_id) + "/canny_images_test",
        )

        # Delete the temporary directory
        subprocess.run(["rm", "-rf", path])
    except Exception as e:
        print("Error is: ", e)
        if is_production:
            pending_jobs_table = os.getenv("PENDING_JOBS_TABLE_PROD")
        else:
            pending_jobs_table = os.getenv("PENDING_JOBS_TABLE")
        # Delete the user from the pending jobs table
        requests.delete(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{pending_jobs_table}?user_id=eq.{user_id}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
                "Content-Type": "application/json",
            },
        )


@app.task()
def generate_imagemask_copilot(
    prompt, image_url, user_id, object, mask_base64_image, is_production=False
):
    try:
        print("Inside image mask: ", len(mask_base64_image))
        # Get the celery task id
        task_id = generate_imagemask_copilot.request.id
        path = os.path.join("/tmp", task_id)
        if not os.path.exists(path):
            os.makedirs(path)

        original_image_path = os.path.join(path, "original.png")
        canny_image_path = os.path.join(path, "canny.png")

        # Download the original image
        image_response = requests.get(image_url)
        img = Image.open(BytesIO(image_response.content))
        img.save(original_image_path)

        # Download the canny image
        image_response = requests.post(
            os.getenv("CANNY_SERVER"),
            headers={"Content-Type": "application/json"},
            data=json.dumps({"image_url": image_url, "key": os.getenv("KEY")}),
        )

        image_response = image_response.json()
        image_data = image_response["image"]

        # Save the base64 image to a file
        image_data = image_data.split(",")[1]
        image_data = base64.b64decode(image_data)
        with open(canny_image_path, "wb") as f:
            f.write(image_data)

        pil_image = Image.open(canny_image_path)

        # Free memory by deleting variables
        img = None
        image_data = None

        # Get the prompt from chatgpt
        response = get_chatgpt_response(prompt)
        if response is not None:
            prompt = response

        print("Prompt is: ", prompt)

        mask_image = base64.b64decode(
            mask_base64_image[len("data:image/png;base64,") :]
            if mask_base64_image.startswith("data:image/png;base64,")
            else mask_base64_image
        )
        mask_image = Image.open(BytesIO(mask_image))

        # Invert the mask_image, keeping the transparency
        mask_image = mask_image.convert("RGBA")
        for x in range(mask_image.size[0]):
            for y in range(mask_image.size[1]):
                r, g, b, a = mask_image.getpixel((x, y))
                if a != 0:
                    mask_image.putpixel((x, y), (255 - r, 255 - g, 255 - b, a))

        pil_image.paste(mask_image, (0, 0), mask_image)
        pil_image.save(canny_image_path)

        with open(canny_image_path, "rb") as f:
            pil_image = f.read()
        pil_image = Image.open(BytesIO(pil_image))

        # Call modal to generate the images
        f = modal.Function.lookup("copilot-motionfour", "ImageGenerator.generate")
        images = f.remote(
            "masterpiece," + prompt + ",light and shadow,motion design,C4D,rendering",
            pil_image,
        )

        # Save the images to a temporary directory
        number_of_images = len(images)
        for i, image in enumerate(images):
            with open(os.path.join(path, f"{i}.png"), "wb") as f:
                f.write(image)

        # Upload the image to B2 storage
        b2 = get_b2_resource(endpoint, key_id, application_key)
        original_file_urls = []
        for i in range(number_of_images):
            file_url = upload_file(
                bucket_name,
                path,
                f"{i}.png",
                b2,
                endpoint,
                b2path=hash(user_id) + "/" + str(task_id) + "/original_images"
                if is_production
                else user_id + "/" + str(task_id) + "/original_images_test",
            )
            original_file_urls.append(file_url)

        # Overlay the original image on all the generated images
        overlay_img = Image.open(original_image_path)
        overlay_img = overlay_img.convert("RGBA")
        for i in range(number_of_images):
            base_img = Image.open(os.path.join(path, f"{i}.png"))
            base_img.paste(overlay_img, (0, 0), overlay_img)
            base_img.save(os.path.join(path, f"modified_{i}.png"))

        # Upload the modified images to B2 storage
        modified_file_urls = []
        for i in range(number_of_images):
            file_url = upload_file(
                bucket_name,
                path,
                f"modified_{i}.png",
                b2,
                endpoint,
                b2path=hash(user_id) + "/" + str(task_id) + "/modified_images"
                if is_production
                else user_id + "/" + str(task_id) + "/modified_images_test",
            )
            modified_file_urls.append(file_url)

        # Add the image urls to the database
        if is_production:
            table_name = os.getenv("TABLE_NAME_PROD")
            pending_jobs_table = os.getenv("PENDING_JOBS_TABLE_PROD")
        else:
            table_name = os.getenv("TABLE_NAME")
            pending_jobs_table = os.getenv("PENDING_JOBS_TABLE")

        # Insert into the supabase database
        requests.post(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{table_name}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps(
                [
                    {
                        "user_id": user_id,
                        "image_url": "https://res.cloudinary.com/dq8wvjoeq/image/fetch/"
                        + original_file_urls[i],
                        "modified_image_url": "https://res.cloudinary.com/dq8wvjoeq/image/fetch/"
                        + modified_file_urls[i],
                        "prompt": prompt,
                        "title": object,
                    }
                    for i in range(number_of_images)
                ]
            ),
        )

        table_name = (
            os.getenv("NEXT_PUBLIC_SUPABASE_TABLE_PROD")
            if is_production
            else os.getenv("NEXT_PUBLIC_SUPABASE_TABLE")
        )

        # Get the user credits
        response = requests.get(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{table_name}?user_id=eq.{user_id}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
                "Content-Type": "application/json",
            },
        )
        user_credits = response.json()[0]["credits"]

        # Update the user credits
        requests.patch(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{table_name}?user_id=eq.{user_id}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps({"credits": user_credits - 1}),
        )

        # Delete the user from the pending jobs table
        requests.delete(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{pending_jobs_table}?user_id=eq.{user_id}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
                "Content-Type": "application/json",
            },
        )

        # Upload the canny image to B2 storage
        upload_file(
            bucket_name,
            path,
            "canny.png",
            b2,
            endpoint,
            b2path=hash(user_id) + "/" + str(task_id) + "/canny_images"
            if is_production
            else user_id + "/" + str(task_id) + "/canny_images_test",
        )

        # Delete the temporary directory
        subprocess.run(["rm", "-rf", path])
    except Exception as e:
        print("Error is: ", e)
        if is_production:
            pending_jobs_table = os.getenv("PENDING_JOBS_TABLE_PROD")
        else:
            pending_jobs_table = os.getenv("PENDING_JOBS_TABLE")
        # Delete the user from the pending jobs table
        requests.delete(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{pending_jobs_table}?user_id=eq.{user_id}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
                "Content-Type": "application/json",
            },
        )


@app.task()
def generate_without_auth(prompt, image_url, mask_image=None, user_id=None):
    try:
        # Get the celery task id
        task_id = generate_without_auth.request.id
        path = os.path.join("/tmp", task_id)
        if not os.path.exists(path):
            os.makedirs(path)

        original_image_path = os.path.join(path, "original.png")
        canny_image_path = os.path.join(path, "canny.png")

        # Download the original image
        image_response = requests.get(image_url)
        img = Image.open(BytesIO(image_response.content))
        img.save(original_image_path)

        # Download the canny image
        image_response = requests.post(
            os.getenv("CANNY_SERVER"),
            headers={"Content-Type": "application/json"},
            data=json.dumps({"image_url": image_url, "key": os.getenv("KEY")}),
        )

        image_response = image_response.json()
        image_data = image_response["image"]

        # Save the base64 image to a file
        image_data = image_data.split(",")[1]
        image_data = base64.b64decode(image_data)
        with open(canny_image_path, "wb") as f:
            f.write(image_data)

        pil_image = Image.open(canny_image_path)

        # Free memory by deleting variables
        img = None
        image_data = None

        print("Prompt is: ", prompt)

        if mask_image is not None:
            mask_image = base64.b64decode(
                mask_image[len("data:image/png;base64,") :]
                if mask_image.startswith("data:image/png;base64,")
                else mask_image
            )
            mask_image = Image.open(BytesIO(mask_image))

            # Convert to RGBA
            mask_image = mask_image.convert("RGBA")

            # Threshold the image to either black or white and ignore regions where the alpha is 0
            for x in range(mask_image.width):
                for y in range(mask_image.height):
                    if mask_image.getpixel((x, y))[3] == 0:
                        mask_image.putpixel((x, y), (255, 255, 255, 0))
                    elif sum(mask_image.getpixel((x, y))[:3]) / 3 > 127:
                        mask_image.putpixel((x, y), (0, 0, 0, 255))
                    else:
                        mask_image.putpixel((x, y), (255, 255, 255, 0))

            # Invert the mask_image, keeping the transparency
            for x in range(mask_image.size[0]):
                for y in range(mask_image.size[1]):
                    r, g, b, a = mask_image.getpixel((x, y))
                    if a != 0:
                        mask_image.putpixel((x, y), (255 - r, 255 - g, 255 - b, a))

            pil_image.paste(mask_image, (0, 0), mask_image)
            pil_image.save(canny_image_path)

        with open(canny_image_path, "rb") as f:
            pil_image = f.read()
        pil_image = Image.open(BytesIO(pil_image))

        # Get the prompt from chatgpt
        response = get_chatgpt_response(prompt)
        if response is not None:
            prompt = response

        print("Prompt is: ", prompt)

        # Call modal to generate the images
        f = modal.Function.lookup("copilot-motionfour", "ImageGenerator.generate")

        images = f.remote(
            "masterpiece," + prompt + ",light and shadow,motion design,C4D,rendering",
            pil_image,
        )

        # Save the images to a temporary directory
        number_of_images = len(images)
        for i, image in enumerate(images):
            with open(os.path.join(path, f"{i}.png"), "wb") as f:
                f.write(image)

        # Upload the image to B2 storage
        b2 = get_b2_resource(endpoint, key_id, application_key)
        original_file_urls = []
        for i in range(number_of_images):
            file_url = upload_file(
                bucket_name,
                path,
                f"{i}.png",
                b2,
                endpoint,
                b2path=str(task_id) + "/original_image",
            )
            original_file_urls.append(file_url)

        # Overlay the original image on all the generated images
        overlay_img = Image.open(original_image_path)
        overlay_img = overlay_img.convert("RGBA")
        for i in range(number_of_images):
            base_img = Image.open(os.path.join(path, f"{i}.png"))
            base_img.paste(overlay_img, (0, 0), overlay_img)
            base_img.save(os.path.join(path, f"modified_{i}.png"))

        # Upload the modified images to B2 storage
        modified_file_urls = []
        for i in range(number_of_images):
            file_url = upload_file(
                bucket_name,
                path,
                f"modified_{i}.png",
                b2,
                endpoint,
                b2path=str(task_id) + "/modified_images",
            )
            modified_file_urls.append(file_url)

        # Add the image urls to the database
        table_name = os.getenv("TABLE_NAME_WITHOUT_AUTH")

        # Insert into the supabase database
        requests.post(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{table_name}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps(
                [
                    {
                        "image_url": "https://res.cloudinary.com/dq8wvjoeq/image/fetch/"
                        + original_file_urls[i],
                        "modified_image_url": "https://res.cloudinary.com/dq8wvjoeq/image/fetch/"
                        + modified_file_urls[i],
                        "prompt": prompt,
                        "user_id": user_id,
                        "task_id": task_id,
                    }
                    for i in range(number_of_images)
                ]
            ),
        )

        # Delete the temporary directory
        subprocess.run(["rm", "-rf", path])
    except Exception as e:
        print("Error is: ", e)
        pass


@app.task()
def generate_allinone(
    prompt, image_url, num_images=1, lora_type=None, mask_image=None, user_id=None
):
    try:
        # Get the celery task id
        task_id = generate_allinone.request.id
        path = os.path.join("/tmp", task_id)
        if not os.path.exists(path):
            os.makedirs(path)

        original_image_path = os.path.join(path, "original.png")
        canny_image_path = os.path.join(path, "canny.png")

        # Download the original image
        image_response = requests.get(image_url)
        img = Image.open(BytesIO(image_response.content))
        img.save(original_image_path)

        # Download the canny image
        image_response = requests.post(
            os.getenv("CANNY_SERVER"),
            headers={"Content-Type": "application/json"},
            data=json.dumps({"image_url": image_url, "key": os.getenv("KEY")}),
        )

        image_response = image_response.json()
        image_data = image_response["image"]

        # Save the base64 image to a file
        image_data = image_data.split(",")[1]
        image_data = base64.b64decode(image_data)
        with open(canny_image_path, "wb") as f:
            f.write(image_data)

        pil_image = Image.open(canny_image_path)

        # Free memory by deleting variables
        img = None
        image_data = None

        print("Prompt is: ", prompt)

        if mask_image is not None:
            mask_image = base64.b64decode(
                mask_image[len("data:image/png;base64,") :]
                if mask_image.startswith("data:image/png;base64,")
                else mask_image
            )
            mask_image = Image.open(BytesIO(mask_image))

            # Convert to RGBA
            mask_image = mask_image.convert("RGBA")

            # Threshold the image to either black or white and ignore regions where the alpha is 0
            for x in range(mask_image.width):
                for y in range(mask_image.height):
                    if mask_image.getpixel((x, y))[3] == 0:
                        mask_image.putpixel((x, y), (255, 255, 255, 0))
                    elif sum(mask_image.getpixel((x, y))[:3]) / 3 > 127:
                        mask_image.putpixel((x, y), (0, 0, 0, 255))
                    else:
                        mask_image.putpixel((x, y), (255, 255, 255, 0))

            # Invert the mask_image, keeping the transparency
            for x in range(mask_image.size[0]):
                for y in range(mask_image.size[1]):
                    r, g, b, a = mask_image.getpixel((x, y))
                    if a != 0:
                        mask_image.putpixel((x, y), (255 - r, 255 - g, 255 - b, a))

            pil_image.paste(mask_image, (0, 0), mask_image)
            pil_image.save(canny_image_path)

        with open(canny_image_path, "rb") as f:
            pil_image = f.read()
        pil_image = Image.open(BytesIO(pil_image))

        # Get the prompt from chatgpt
        response = get_chatgpt_response(prompt)
        if response is not None:
            prompt = response

        print("Prompt is: ", prompt)

        # Call modal to generate the images
        f = modal.Function.lookup("copilot-allinone", "SDGenerator.generate")

        images = f.remote(prompt, pil_image, num_images, lora_type)

        # Save the images to a temporary directory
        number_of_images = len(images)
        for i, image in enumerate(images):
            with open(os.path.join(path, f"{i}.png"), "wb") as f:
                f.write(image)

        # Upload the image to B2 storage
        b2 = get_b2_resource(endpoint, key_id, application_key)
        original_file_urls = []
        for i in range(number_of_images):
            file_url = upload_file(
                bucket_name,
                path,
                f"{i}.png",
                b2,
                endpoint,
                b2path=str(task_id) + "/original_image",
            )
            original_file_urls.append(file_url)

        # Overlay the original image on all the generated images
        overlay_img = Image.open(original_image_path)
        overlay_img = overlay_img.convert("RGBA")
        for i in range(number_of_images):
            base_img = Image.open(os.path.join(path, f"{i}.png"))
            base_img.paste(overlay_img, (0, 0), overlay_img)
            base_img.save(os.path.join(path, f"modified_{i}.png"))

        # Upload the modified images to B2 storage
        modified_file_urls = []
        for i in range(number_of_images):
            file_url = upload_file(
                bucket_name,
                path,
                f"modified_{i}.png",
                b2,
                endpoint,
                b2path=str(task_id) + "/modified_images",
            )
            modified_file_urls.append(file_url)

        # Add the image urls to the database
        table_name = os.getenv("TABLE_NAME_WITHOUT_AUTH")

        # Insert into the supabase database
        requests.post(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{table_name}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps(
                [
                    {
                        "image_url": "https://res.cloudinary.com/dq8wvjoeq/image/fetch/"
                        + original_file_urls[i],
                        "modified_image_url": "https://res.cloudinary.com/dq8wvjoeq/image/fetch/"
                        + modified_file_urls[i],
                        "prompt": prompt,
                        "user_id": user_id,
                        "task_id": task_id,
                    }
                    for i in range(number_of_images)
                ]
            ),
        )

        print("Modified image urls are: ", modified_file_urls)
        print("Original image urls are: ", original_file_urls)

        # Upload canny image to B2 storage
        upload_file(
            bucket_name,
            path,
            "canny.png",
            b2,
            endpoint,
            b2path=str(task_id) + "/canny_images",
        )

        # Delete the temporary directory
        subprocess.run(["rm", "-rf", path])
    except Exception as e:
        print("Error is: ", e)
        pass


@app.task()
def generate_inpaint(
    prompt, image_url, num_images=1, lora_type=None, mask_image=None, user_id=None
):
    try:
        mask_image = None
        # Get the celery task id
        task_id = generate_inpaint.request.id
        path = os.path.join("/tmp", task_id)
        if not os.path.exists(path):
            os.makedirs(path)

        original_image_path = os.path.join(path, "original.png")

        # Download the original image
        image_response = requests.get(image_url)
        img = Image.open(BytesIO(image_response.content))
        img.save(original_image_path)

        # Free memory by deleting variables
        img = None
        image_data = None

        print("Prompt is: ", prompt)

        if mask_image is not None:
            mask_image = base64.b64decode(
                mask_image[len("data:image/png;base64,") :]
                if mask_image.startswith("data:image/png;base64,")
                else mask_image
            )
            mask_image = Image.open(BytesIO(mask_image))

            # Convert to RGBA
            mask_image = mask_image.convert("RGBA")

            # Threshold the image to either black or white and ignore regions where the alpha is 0
            for x in range(mask_image.width):
                for y in range(mask_image.height):
                    if mask_image.getpixel((x, y))[3] == 0:
                        mask_image.putpixel((x, y), (255, 255, 255, 0))
                    elif sum(mask_image.getpixel((x, y))[:3]) / 3 > 127:
                        mask_image.putpixel((x, y), (0, 0, 0, 255))
                    else:
                        mask_image.putpixel((x, y), (255, 255, 255, 0))

            # Invert the mask_image, keeping the transparency
            for x in range(mask_image.size[0]):
                for y in range(mask_image.size[1]):
                    r, g, b, a = mask_image.getpixel((x, y))
                    if a != 0:
                        mask_image.putpixel((x, y), (255 - r, 255 - g, 255 - b, a))

            pil_image.paste(mask_image, (0, 0), mask_image)

        # Get the prompt from chatgpt
        response = get_chatgpt_response(prompt)
        if response is not None:
            prompt = response

        pil_image = Image.open(original_image_path)

        print("Prompt is: ", prompt)

        # Call modal to generate the images
        f = modal.Function.lookup("copilot-inpaint", "SDGenerator.generate")

        images = f.remote(prompt, pil_image, num_images, lora_type)

        # Save the images to a temporary directory
        number_of_images = len(images)
        for i, image in enumerate(images):
            with open(os.path.join(path, f"{i}.png"), "wb") as f:
                f.write(image)

        # Upload the image to B2 storage
        b2 = get_b2_resource(endpoint, key_id, application_key)
        original_file_urls = []
        for i in range(number_of_images):
            file_url = upload_file(
                bucket_name,
                path,
                f"{i}.png",
                b2,
                endpoint,
                b2path=str(task_id) + "/original_image",
            )
            original_file_urls.append(file_url)

        # Add the image urls to the database
        table_name = os.getenv("TABLE_NAME_WITHOUT_AUTH")

        # Insert into the supabase database
        requests.post(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{table_name}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps(
                [
                    {
                        "image_url": "https://res.cloudinary.com/dq8wvjoeq/image/fetch/"
                        + original_file_urls[i],
                        "modified_image_url": "https://res.cloudinary.com/dq8wvjoeq/image/fetch/"
                        + original_file_urls[i],
                        "prompt": prompt,
                        "user_id": user_id,
                        "task_id": task_id,
                    }
                    for i in range(number_of_images)
                ]
            ),
        )

        print("Original image urls are: ", original_file_urls)

        # # Upload canny image to B2 storage
        # upload_file(
        #     bucket_name,
        #     path,
        #     "canny.png",
        #     b2,
        #     endpoint,
        #     b2path=str(task_id) + "/canny_images",
        # )

        # Delete the temporary directory
        subprocess.run(["rm", "-rf", path])
    except Exception as e:
        print("Error is: ", e)
        pass


@app.task()
def generate_replicate(
    prompt, image_url, num_images=1, category=None, mask_image=None, user_id=None
):
    try:
        # Get the celery task id
        task_id = generate_replicate.request.id
        original_file_urls = []
        print("Prompt is: ", prompt)

        # Get the prompt from chatgpt
        # response = get_chatgpt_response(prompt)
        # if response is not None:
        #     prompt = response

        # print("Prompt is: ", prompt)

        # Save the image locally as /tmp/task_id.png
        image_response = requests.get(image_url, stream=True)
        with open(f"/tmp/{task_id}.png", "wb") as f:
            f.write(image_response.content)

        for _ in range(num_images):
            if category == "Mobile & Laptops":
                # Get the image dimensions
                try:
                    w, h = Image.open(f"/tmp/{task_id}.png").size
                except:
                    print("Size is:", Image.open(f"/tmp/{task_id}.png").size)
                    print("Could not get the image dimensions")
                    w, h = 512, 512
                output = replicate.run(
                    "wolverinn/realistic-background:f77210f166f419c82faf53e313a8b18b24c2695d58116b4a77a900b2715f595a",
                    input={
                        "image": open(f"/tmp/{task_id}.png", "rb"),
                        "prompt": prompt
                        + ",Realistic, volumetric, beautiful, bright, masterpiece, sharp edges",
                        "negative_prompt": "bad image,sketch,additional features added to product image,tampered product image,reflection,low quality, out of frame, illustration, 3d, sepia, painting, cartoons, sketch, watermark, text, Logo, advertisement",
                        "cfg_scale": 7,
                        "denoising_strength": 0.75,
                        "max_width": w,
                        "max_height": h,
                        "seed": -1,
                    },
                )
            else:
                # Get the image dimensions
                try:
                    w, h = Image.open(f"/tmp/{task_id}.png").size
                    if w == 512 and h == 512:
                        w, h = 1024, 1024
                except:
                    print("Size is:", Image.open(f"/tmp/{task_id}.png").size)
                    print("Could not get the image dimensions")
                    w, h = 1024, 1024

                output = replicate.run(
                    "catacolabs/sdxl-ad-inpaint:9c0cb4c579c54432431d96c70924afcca18983de872e8a221777fb1416253359",
                    input={
                        "image": open(f"/tmp/{task_id}.png", "rb"),
                        "prompt": prompt
                        + ",Realistic, volumetric, beautiful, bright, masterpiece, sharp edges",
                        "img_size": str(w) + ", " + str(h),
                        "negative_prompt": "bad image,sketch,additional features added to product image,tampered product image,reflection,low quality, out of frame, illustration, 3d, sepia, painting, cartoons, sketch, watermark, text, Logo, advertisement",
                        "scheduler": "K_EULER_ANCESTRAL",
                        "product_fill": "Original",
                        "num_inference_steps": 40,
                        "guidance_scale": 7.5,
                        "condition_scale": 0.37,
                        "num_refine_steps": 20,
                        "apply_img": True,
                        "seed": 0,
                    },
                )

            print("Output is: ", output)

            # Check if output is list
            if type(output) == list:
                output = output[1:]
                for out in output:
                    # Upload the images to imagekit
                    upload = imagekit.upload_file(
                        file=out,
                        file_name="1.png",
                    )
                    original_file_urls.append(upload.url)
            else:
                if type(output) == dict:
                    output = output["image"]
                # Upload the images to imagekit
                upload = imagekit.upload_file(
                    file=output,
                    file_name="1.png",
                )
                original_file_urls.append(upload.url)

        # Add the image urls to the database
        table_name = os.getenv("TABLE_NAME_WITHOUT_AUTH")

        # Insert into the supabase database
        requests.post(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{table_name}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps(
                [
                    {
                        "image_url": original_file_urls[i],
                        "modified_image_url": original_file_urls[i],
                        "prompt": prompt,
                        "user_id": user_id,
                        "task_id": task_id,
                    }
                    for i in range(len(original_file_urls))
                ]
            ),
        )

        print("Original image urls are: ", original_file_urls)

        try:
            # Delete the file
            os.remove(f"/tmp/{task_id}.png")
        except:
            pass

    except Exception as e:
        print("Error is: ", e)
        pass


@app.task()
def generate_runwayml_inpaint(rawJson):
    try:
        prompt = rawJson["prompt"]
        image_url = rawJson["image_url"]
        num_images = rawJson["num_images"]
        caption = rawJson["caption"]
        user_id = rawJson["user_id"]
        # Get the celery task id
        task_id = generate_runwayml_inpaint.request.id
        path = os.path.join("/tmp", task_id)
        if not os.path.exists(path):
            os.makedirs(path)

        image_response = requests.get(image_url)
        print("Prompt is: ", prompt)
        print("Image url is: ", image_url)

        # Get the prompt from chatgpt
        use_chatgpt = rawJson["use_chatgpt"]
        if use_chatgpt:
            response = get_chatgpt_response(prompt)
            if response is not None:
                prompt = response

        print("Prompt is: ", prompt)

        # Call modal to generate the images
        f = modal.Function.lookup(
            "epicrealism-new",
            "ImageGenerator.generate",
        )

        images = f.remote(
            "Realistic, volumetric, beautiful, bright, masterpiece, sharp edges,"
            + prompt,
            image_response.content,
            num_images,
        )

        # Save the images to a temporary directory
        number_of_images = len(images)
        for i, image in enumerate(images):
            with open(os.path.join(path, f"{i}.png"), "wb") as f:
                f.write(image)

        # Upload the image to B2 storage
        b2 = get_b2_resource(endpoint, key_id, application_key)
        original_file_urls = []
        for i in range(number_of_images):
            file_url = upload_file(
                bucket_name,
                path,
                f"{i}.png",
                b2,
                endpoint,
                b2path=str(task_id) + "/original_image",
            )
            original_file_urls.append(file_url)

        # Add the image urls to the database
        table_name = os.getenv("TABLE_NAME_WITHOUT_AUTH")

        # Insert into the supabase database
        requests.post(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{table_name}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps(
                [
                    {
                        "image_url": image_url,
                        "modified_image_url": "https://res.cloudinary.com/dq8wvjoeq/image/fetch/"
                        + original_file_urls[i],
                        "prompt": prompt,
                        "user_id": user_id,
                        "task_id": task_id,
                        "caption": caption,
                    }
                    for i in range(number_of_images)
                ]
            ),
        )

        print("Original image urls are: ", original_file_urls)

        # Delete the temporary directory
        subprocess.run(["rm", "-rf", path])
    except Exception as e:
        print("Error is: ", e)
        pass


@app.task()
def generate_runwayml_inpaint_dev(rawJson):
    try:
        prompt = rawJson["prompt"]
        image_url = rawJson["image_url"]
        num_images = rawJson["num_images"]
        caption = rawJson["caption"]
        user_id = rawJson["user_id"]

        is_quick_generation = (
            rawJson["is_quick_generation"]
            if "is_quick_generation" in rawJson
            else False
        )

        # Get the celery task id
        task_id = generate_runwayml_inpaint_dev.request.id
        path = os.path.join("/tmp", task_id)
        if not os.path.exists(path):
            os.makedirs(path)

        image_response = requests.get(image_url).content
        image_response = Image.open(BytesIO(image_response))
        # original_width, original_height = image_response.size
        # print("Old Size is: ", image_response.size)
        # if not is_quick_generation:
        #     image_response = image_response.resize(
        #         (original_width // 4, original_height // 4)
        #     )
        # else:
        #     image_response = image_response.resize(
        #         (original_width // 4, original_height // 4)
        #     )
        # print("New Size is: ", image_response.size)
        with BytesIO() as buf:
            image_response.save(buf, "PNG")
            image_response = buf.getvalue()

        if len(image_url) < 1000:
            print("Image url is: ", image_url)
        else:
            print("A Base 64 image is sent")

        if len(prompt) < 50:
            response = get_chatgpt_response(prompt)
            if response is not None:
                prompt = response

        # prompt = caption + " " + prompt
        print("Prompt is: ", prompt)

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
            # else "epicrealism-new"
            # if "bedroom" in prompt
            else "epicrealism-sam"
        )
        # Call modal to generate the images
        f = modal.Function.lookup(
            model_used,
            "ImageGenerator.generate",
        )

        if model_used == "epicrealism-new":
            images = f.remote(prompt, image_response, num_images)
        else:
            images = f.remote(
                prompt, image_response, num_images, caption, is_quick_generation
            )

        # Save the images to a temporary directory
        number_of_images = len(images)
        # for i, image in enumerate(images):
        #     with open(os.path.join(path, f"{i}.png"), "wb") as f:
        #         f.write(image)

        original_file_urls = []
        for i in range(number_of_images):
            try:
                uploadToSupabase = upload_file_to_supabase(
                    bucketName=os.getenv("TABLE_NAME_WITHOUT_AUTH"),
                    image=images[i],
                    filePath=f"{str(task_id)}/{i}.png",
                )
                if uploadToSupabase:
                    original_file_urls.append(
                        f"{os.getenv('SUPABASE_URL')}/storage/v1/object/public/{os.getenv('TABLE_NAME_WITHOUT_AUTH')}/{str(task_id)}/{i}.png"
                    )
            except Exception as e:
                print("Exception catched Error is: ", e)
                pass

        # Add the image urls to the database
        table_name = os.getenv("TABLE_NAME_WITHOUT_AUTH")

        # Insert into the supabase database
        requests.post(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{table_name}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
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

        print("Original image urls are: ", original_file_urls)
    except Exception as e:
        print("Error is: ", e)
        pass


@app.task()
def generate_threed(rawJson):
    try:
        prompt = rawJson["prompt"]
        image_url = rawJson["image_url"]
        user_id = rawJson["user_id"]
        caption = rawJson["caption"]
        num_images = rawJson["num_images"]

        # Get the celery task id
        task_id = generate_threed.request.id

        image_response = requests.get(image_url)

        if len(prompt) < 50:
            response = get_chatgpt_response(prompt)
            if response is not None:
                prompt = response

        # prompt = caption + " " + prompt
        print("Prompt is: ", prompt)
        if len(image_url) < 1000:
            print("Image url is: ", image_url)
        else:
            print("A Base 64 image is sent")

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
            # else "epicrealism-new"
            # if "bedroom" in prompt
            else "epicrealism-sam"
        )
        # Call modal to generate the images
        f = modal.Function.lookup(
            model_used,
            "ImageGenerator.generate",
        )

        if model_used == "epicrealism-new":
            images = f.remote(prompt, image_response.content, num_images)
        else:
            images = f.remote(prompt, image_response.content, num_images, caption)

        # Save the images to a temporary directory
        number_of_images = len(images)

        original_file_urls = []
        for i in range(number_of_images):
            uploadToSupabase = upload_file_to_supabase(
                bucketName=os.getenv("TABLE_NAME_WITHOUT_AUTH"),
                image=images[i],
                filePath=f"{str(task_id)}/{i}.png",
            )
            if uploadToSupabase:
                original_file_urls.append(
                    f"{os.getenv('SUPABASE_URL')}/storage/v1/object/public/{os.getenv('TABLE_NAME_WITHOUT_AUTH')}/{str(task_id)}/{i}.png"
                )

        # Add the image urls to the database
        table_name = os.getenv("TABLE_NAME_WITHOUT_AUTH")

        # Insert into the supabase database
        requests.post(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{table_name}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
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
                        "project_id": rawJson["project_id"],
                    }
                    for i in range(number_of_images)
                ]
            ),
        )

        print("Original image urls are: ", original_file_urls)
    except Exception as e:
        print("Error is: ", e)
        pass


@app.task()
def regenerate(rawJson):
    try:
        image_url = rawJson["image_url"]
        user_id = rawJson["user_id"]
        # Get the celery task id
        task_id = regenerate.request.id

        # Get the prompt, caption from the database using the image url
        table_name = os.getenv("TABLE_NAME_WITHOUT_AUTH")

        # Get the prompt and caption from the database
        response = requests.get(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{table_name}?modified_image_url=eq.{image_url}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
                "Content-Type": "application/json",
            },
        )

        response = response.json()

        prompt = response[0]["prompt"]
        caption = response[0]["caption"]
        user_id = response[0]["user_id"]
        image_url = response[0]["image_url"]
        project_id = response[0]["project_id"]

        image_response = requests.get(image_url).content
        image_response = Image.open(BytesIO(image_response))
        original_width, original_height = image_response.size
        # print("Old Size in regenerate is: ", image_response.size)
        # image_response = image_response.resize(
        #     (original_width // 4, original_height // 4)
        # )
        # print("New Size in regenerate is: ", image_response.size)

        with BytesIO() as buf:
            image_response.save(buf, "PNG")
            image_response = buf.getvalue()

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
            # else "epicrealism-new"
            # if "bedroom" in prompt
            else "epicrealism-sam"
        )
        # Call modal to generate the images
        f = modal.Function.lookup(
            model_used,
            "ImageGenerator.generate",
        )

        if model_used == "epicrealism-new":
            images = f.remote(prompt, image_response, 3)
        else:
            images = f.remote(prompt, image_response, 3, caption)

        # Save the images to a temporary directory
        number_of_images = len(images)
        original_file_urls = []
        for i in range(number_of_images):
            uploadToSupabase = upload_file_to_supabase(
                bucketName=os.getenv("TABLE_NAME_WITHOUT_AUTH"),
                image=images[i],
                filePath=f"{str(task_id)}/{i}.png",
            )
            if uploadToSupabase:
                original_file_urls.append(
                    f"{os.getenv('SUPABASE_URL')}/storage/v1/object/public/{os.getenv('TABLE_NAME_WITHOUT_AUTH')}/{str(task_id)}/{i}.png"
                )

        # Insert into the supabase database
        requests.post(
            f"{os.getenv('SUPABASE_URL')}/rest/v1/{table_name}",
            headers={
                "apikey": os.getenv("SUPABASE_KEY"),
                "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps(
                [
                    {
                        "image_url": image_url,
                        "modified_image_url": original_file_urls[i],
                        "prompt": caption + " " + prompt,
                        "user_id": user_id,
                        "task_id": task_id,
                        "caption": caption,
                        "project_id": project_id,
                    }
                    for i in range(number_of_images)
                ]
            ),
        )

        print("Original image urls are: ", original_file_urls)
    except Exception as e:
        print("Error is: ", e)
        pass


# docker stop ad && docker rm ad && docker build -t celeryworkerwebsite . && docker run -d --restart always --env-file <(doppler secrets download --no-file --format docker) celeryworkerwebsite
