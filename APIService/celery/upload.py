import base64
import os

from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions

imagekit = ImageKit(
    public_key=os.environ["IMAGEKIT_PUBLIC_KEYY"],
    private_key=os.environ["IMAGEKIT_PRIVATE_KEYY"],
    url_endpoint=os.environ["IMAGEKIT_URL_ENDPOINTY"],
)


def uploadImage(imgstr):
    upload = imagekit.upload(
        file=imgstr,
        file_name="img.png",
        options=UploadFileRequestOptions(folder="apiImages", tags=["api"]),
    )
    return upload.url + "?tr=orig-true"


if __name__ == "__main__":
    with open("Dog.png", "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read())
        print(uploadImage(encoded_string))
