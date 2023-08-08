import { arrayBufferToDataURL, dataURLtoFile } from "@/utils/BufferToDataUrl";

export const generateimge = async (promt: string) => {
  const promte = new FormData();
  promte.append("prompt", promt);

  const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
    method: "POST",
    headers: {
      "x-api-key":
        "33f74f9d17bd2f90f81d61af8fd8875f834961c457e81caba25a0bbfecbed37ddf5360ee064c84e930c54cfb06fb7379",
    },
    body: promte,
  });

  const buffer = await response.arrayBuffer();
  const dataURL = await arrayBufferToDataURL(buffer);
  const imageArray = JSON.parse(localStorage.getItem("g-images")) || [];
  const array = [...imageArray, dataURL];
  localStorage.setItem("g-images", JSON.stringify(array));

  return dataURL;
};

export const BgRemover = async (
  photo: string,
  filename: string
): Promise<string> => {
  const form = new FormData();
  const fileItem = await dataURLtoFile(photo, filename);
  form.append("image_file", fileItem);
  const response = await fetch("https://clipdrop-api.co/remove-background/v1", {
    method: "POST",
    headers: {
      "x-api-key":
        "33f74f9d17bd2f90f81d61af8fd8875f834961c457e81caba25a0bbfecbed37ddf5360ee064c84e930c54cfb06fb7379",
    },
    body: form,
  });

  const buffer = await response.arrayBuffer();
  const dataURL = await arrayBufferToDataURL(buffer);
  localStorage.setItem("m-images", JSON.stringify(dataURL));
  console.log(buffer, response, dataURL, "imgs");

  return dataURL;
};

export const superResolutionFuc = async (
  photo: string,
  filename: string
): Promise<string> => {
  const form = new FormData();
  const fileItem = await dataURLtoFile(photo, filename);
  form.append("image_file", fileItem);
  form.append("upscale", 2);
  const response = await fetch("https://clipdrop-api.co/super-resolution/v1", {
    method: "POST",
    headers: {
      "x-api-key":
        "33f74f9d17bd2f90f81d61af8fd8875f834961c457e81caba25a0bbfecbed37ddf5360ee064c84e930c54cfb06fb7379",
    },
    body: form,
  });

  const buffer = await response.arrayBuffer();
  const dataURL = await arrayBufferToDataURL(buffer);

  return dataURL;
};
export const PortraitSurfaceNormals = async (
  photo: string,
  filename: string
): Promise<string> => {
  const form = new FormData();
  const fileItem = await dataURLtoFile(photo, filename);
  form.append("image_file", fileItem);
  const response = await fetch(
    "https://clipdrop-api.co/portrait-surface-normals/v1",
    {
      method: "POST",
      headers: {
        "x-api-key":
          "33f74f9d17bd2f90f81d61af8fd8875f834961c457e81caba25a0bbfecbed37ddf5360ee064c84e930c54cfb06fb7379",
      },
      body: form,
    }
  );

  const buffer = await response.arrayBuffer();
  const dataURL = await arrayBufferToDataURL(buffer);

  return dataURL;
};

export const PortraitDepthEstimation = async (
  photo: string,
  filename: string
): Promise<string> => {
  const form = new FormData();
  const fileItem = await dataURLtoFile(photo, filename);
  form.append("image_file", fileItem);
  const response = await fetch(
    "https://clipdrop-api.co/portrait-depth-estimation/v1",
    {
      method: "POST",
      headers: {
        "x-api-key":
          "33f74f9d17bd2f90f81d61af8fd8875f834961c457e81caba25a0bbfecbed37ddf5360ee064c84e930c54cfb06fb7379",
      },
      body: form,
    }
  );

  const buffer = await response.arrayBuffer();
  const dataURL = await arrayBufferToDataURL(buffer);

  return dataURL;
};

export const Replacebackground = async (
  photo: string,
  filename: string,
  prompt: string
): Promise<string> => {
  const form = new FormData();
  const fileItem = await dataURLtoFile(photo, filename);
  form.append("image_file", fileItem);
  form.append("prompt", prompt);
  const response = await fetch(
    "https://clipdrop-api.co/replace-background/v1",
    {
      method: "POST",
      headers: {
        "x-api-key":
          "33f74f9d17bd2f90f81d61af8fd8875f834961c457e81caba25a0bbfecbed37ddf5360ee064c84e930c54cfb06fb7379",
      },
      body: form,
    }
  );

  const buffer = await response.arrayBuffer();
  const dataURL = await arrayBufferToDataURL(buffer);

  return dataURL;
};

export const RemoveText = async (
  photo: string,
  filename: string
): Promise<string> => {
  const form = new FormData();
  const fileItem = await dataURLtoFile(photo, filename);
  form.append("image_file", fileItem);

  const response = await fetch("https://clipdrop-api.co/remove-text/v1", {
    method: "POST",
    headers: {
      "x-api-key":
        "33f74f9d17bd2f90f81d61af8fd8875f834961c457e81caba25a0bbfecbed37ddf5360ee064c84e930c54cfb06fb7379",
    },
    body: form,
  });

  const buffer = await response.arrayBuffer();
  const dataURL = await arrayBufferToDataURL(buffer);

  return dataURL;
};

export const Inpainting = async (
  photo: string,
  filename: string
): Promise<string> => {
  const form = new FormData();
  const fileItem = await dataURLtoFile(photo, filename);
  form.append("image_file", fileItem);
  // form.append('mask_file', mask)

  const response = await fetch("https://clipdrop-api.co/remove-text/v1", {
    method: "POST",
    headers: {
      "x-api-key":
        "33f74f9d17bd2f90f81d61af8fd8875f834961c457e81caba25a0bbfecbed37ddf5360ee064c84e930c54cfb06fb7379",
    },
    body: form,
  });

  const buffer = await response.arrayBuffer();
  const dataURL = await arrayBufferToDataURL(buffer);

  return dataURL;
};
