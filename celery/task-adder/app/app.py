import os

from celery import Celery
from flask import Flask, jsonify, request

copilot = Celery(
    "images",
    broker=os.getenv("CELERY_BROKER"),
)


@copilot.task(name="copilot.generate_normal")
def generate_normal(rawJson):
    print("Generate normal")


@copilot.task(name="copilot.regenerate")
def regenerate(rawJson):
    print("regenerate")


@copilot.task(name="copilot.generate_threed")
def generate_threed(rawJson):
    print("generate_threed")


app = Flask(__name__)
app.config["DEBUG"] = True


@app.route("/generate", methods=["POST"])
def generate():
    try:
        # Get the request body data
        data = request.get_json()

        # A very basic key based check, to prevent abuse, DDOS, etc.
        key = data["key"]
        if key != os.getenv("KEY"):
            return jsonify({"message": "Server is down 🥹"}), 200

        keys_with_defaults = {
            "prompt": None,
            "image_url": None,
            "user_id": None,
            "num_images": 1,
            "lora_type": None,
            "category": None,
            "caption": None,
            "is_regenerate": False,
            "is_3d": False,
            "project_id": None,
            "is_quick_generation": False,
        }

        rawJson = {
            key: data.get(key, default) for key, default in keys_with_defaults.items()
        }

        function_map = {
            "regenerate": regenerate.delay,
            "3d": generate_threed.delay,
            "default": generate_normal.delay,
        }

        if rawJson["is_regenerate"]:
            result = function_map["regenerate"](rawJson)
        elif rawJson["is_3d"]:
            result = function_map["3d"](rawJson)
        else:
            result = function_map["default"](rawJson)

        # Return a success response
        return jsonify({"message": "Image generation started!", "id": result.id}), 200
    except Exception as e:
        return jsonify({"message": "Image generation failed! " + str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0")
