import json
import os
import requests
from uuid import uuid4
from flask_swagger_ui import get_swaggerui_blueprint

from flask import Flask, Response, request
from celery import Celery

copilot = Celery(
    "images",
    broker=os.environ["TEST_QUEUE_URL"],
)


@copilot.task(name="copilot.create_task")
def create_task(
    image: str,
    prompt: str,
    num_images: int,
    api_key: str,
    unique_id: str,
    webhook_url: str = None,
):
    print("image url is", image)


app = Flask(__name__)

SWAGGER_URL = "/api/docs"
API_URL = "/static/openapi.json"

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={"app_name": "Commerce Copilot"},
)

app.register_blueprint(swaggerui_blueprint)


@app.get("/getTaskResult")
def getTaskResult():
    # Get the request headers
    headers = request.headers

    # Get the request parameters
    params = request.args

    # Get the value of x-api-key in the header
    api_key = headers.get("x-api-key")

    if api_key is None:
        return Response(
            response=json.dumps(
                {"message": "Error, No API Key is Provided"}
            ),
            status=404,
            mimetype="application/json",
        )

    # Get the value of task_id in the params
    task_id = params.get("task_id")

    if task_id is None:
        return Response(
            response=json.dumps(
                {"message": "Error, No Task ID is Provided"}
            ),
            status=404,
            mimetype="application/json",
        )

    # Get the result from database
    result = requests.get(
        f"{os.environ['SUPABASE_URL']}/rest/v1/APIRequests?select=result&task_id=eq.{task_id}",
        headers={
            "apikey": os.environ["SUPABASE_KEY"],
            "Authorization": "Bearer " + os.environ["SUPABASE_KEY"],
            "Content-Type": "application/json",
        },
    )

    if result.status_code == 200:
        return Response(
            response=json.dumps(result.json()[0]["result"]),
            status=200,
            mimetype="application/json",
        )

    return Response(
        response=json.dumps({"message": "Error, Please Try again"}),
        status=500,
        mimetype="application/json",
    )


@app.post("/createTask")
def create():
    try:
        # Get the request headers
        headers = request.headers

        # Get the request body
        body = request.get_json()

        # Get the value of x-api-key in the header
        api_key = headers.get("x-api-key")

        if api_key is None:
            return Response(
                response=json.dumps(
                    {"message": "Error, No API Key is Provided", "task_id": None}
                ),
                status=404,
                mimetype="application/json",
            )

        # Generate a unique id
        unique_id = uuid4().hex

        # Get the base64 encoded value of the image
        image = body.get("image")

        # Get the value of prompt in the body
        prompt = body.get("prompt")

        # Get the value of num_images in the body
        num_images = body.get("num_images") or 1

        # Get the value of webhook_url in the body
        webhook_url = body.get("webhook_url") or None

        response = Response(
            response=json.dumps({"message": "Success", "task_id": str(unique_id)}),
            status=200,
            mimetype="application/json",
        )

        # @response.call_on_close
        # def process_after_request():
        a = create_task.delay(
            image=image,
            prompt=prompt,
            num_images=num_images,
            api_key=api_key,
            unique_id=unique_id,
            webhook_url=webhook_url,
        )
        print(a)

        # Return a response
        return response
    except Exception as e:
        print(e)
        return Response(
            response=json.dumps({"message": "Error, Please Try again"}),
            status=500,
            mimetype="application/json",
        )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
