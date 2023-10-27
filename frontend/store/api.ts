// /* eslint-disable react/jsx-key */
// import {
//   arrayBufferToDataURL,
//   arrayBufferToDataURLNew,
//   dataURLtoFile,
// } from "@/utils/BufferToDataUrl";

// export const generateimge = async (promt: string) => {
//   const promte = new FormData();
//   promte.append("prompt", promt);

//   const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
//     method: "POST",
//     headers: {
//       "x-api-key":
//         "5f28e1037978f6eee7cfc6d61439fc02dd23c4ca3b73fc1ee7521b3948b852d06cfae5fd52cc626460bd1eabce6120fd",
//     },
//     body: promte,
//   });

//   const buffer = await response.arrayBuffer();
//   const dataURL = await arrayBufferToDataURL(buffer);
//   const datbase = await arrayBufferToDataURLNew(buffer);

//   // const imageArray = JSON.parse(localStorage.getItem("g-images")) || [];
//   // const array = [...imageArray, dataURL];
//   // localStorage.setItem("g-images", JSON.stringify(array));

//   return { url: dataURL, baseUrl: datbase };
// };

// export const BgRemover = async (
//   photo: string,
//   filename: string
// ): Promise<string> => {
//   const form = new FormData();
//   const fileItem = await dataURLtoFile(photo, filename);
//   form.append("image_file", fileItem);
//   const response = await fetch("https://clipdrop-api.co/remove-background/v1", {
//     method: "POST",
//     headers: {
//       "x-api-key":
//         "5f28e1037978f6eee7cfc6d61439fc02dd23c4ca3b73fc1ee7521b3948b852d06cfae5fd52cc626460bd1eabce6120fd",
//     },
//     body: form,
//   });

//   const buffer = await response.arrayBuffer();
//   const dataURL = await arrayBufferToDataURL(buffer);
//   localStorage.setItem("m-images", JSON.stringify(dataURL));
//   console.log(buffer, response, dataURL, "imgs");

//   return dataURL;
// };
// export const upSacle = async (
//   photo: string,
//   filename: string
// ): Promise<string> => {
//   const form = new FormData();
//   const fileItem = await dataURLtoFile(photo, filename);
//   form.append("image_file", fileItem);
//   form.append("target_width", 2048);
//   form.append("target_height", 2048);
//   const response = await fetch(
//     "https://clipdrop-api.co/image-upscaling/v1/upscale",
//     {
//       method: "POST",
//       headers: {
//         "x-api-key":
//           "5f28e1037978f6eee7cfc6d61439fc02dd23c4ca3b73fc1ee7521b3948b852d06cfae5fd52cc626460bd1eabce6120fd",
//       },
//       body: form,
//     }
//   );

//   const buffer = await response.arrayBuffer();
//   const dataURL = await arrayBufferToDataURL(buffer);
//   localStorage.setItem("m-images", JSON.stringify(dataURL));
//   console.log(buffer, response, dataURL, "imgs");

//   return dataURL;
// };

// export const superResolutionFuc = async (
//   photo: string,
//   filename: string
// ): Promise<string> => {
//   const form = new FormData();
//   const fileItem = await dataURLtoFile(photo, filename);
//   form.append("image_file", fileItem);
//   form.append("upscale", 2);
//   const response = await fetch("https://clipdrop-api.co/super-resolution/v1", {
//     method: "POST",
//     headers: {
//       "x-api-key":
//         "5f28e1037978f6eee7cfc6d61439fc02dd23c4ca3b73fc1ee7521b3948b852d06cfae5fd52cc626460bd1eabce6120fd",
//     },
//     body: form,
//   });

//   const buffer = await response.arrayBuffer();
//   const dataURL = await arrayBufferToDataURL(buffer);

//   return dataURL;
// };
// export const PortraitSurfaceNormals = async (
//   photo: string,
//   filename: string
// ): Promise<string> => {
//   const form = new FormData();
//   const fileItem = await dataURLtoFile(photo, filename);
//   form.append("image_file", fileItem);
//   const response = await fetch(
//     "https://clipdrop-api.co/portrait-surface-normals/v1",
//     {
//       method: "POST",
//       headers: {
//         "x-api-key":
//           "5f28e1037978f6eee7cfc6d61439fc02dd23c4ca3b73fc1ee7521b3948b852d06cfae5fd52cc626460bd1eabce6120fd",
//       },
//       body: form,
//     }
//   );

//   const buffer = await response.arrayBuffer();
//   const dataURL = await arrayBufferToDataURL(buffer);

//   return dataURL;
// };

// export const PortraitDepthEstimation = async (
//   photo: string,
//   filename: string
// ): Promise<string> => {
//   const form = new FormData();
//   const fileItem = await dataURLtoFile(photo, filename);
//   form.append("image_file", fileItem);
//   const response = await fetch(
//     "https://clipdrop-api.co/portrait-depth-estimation/v1",
//     {
//       method: "POST",
//       headers: {
//         "x-api-key":
//           "5f28e1037978f6eee7cfc6d61439fc02dd23c4ca3b73fc1ee7521b3948b852d06cfae5fd52cc626460bd1eabce6120fd",
//       },
//       body: form,
//     }
//   );

//   const buffer = await response.arrayBuffer();
//   const dataURL = await arrayBufferToDataURL(buffer);

//   return dataURL;
// };

// export const Replacebackground = async (
//   photo: string,
//   filename: string,
//   prompt: string
// ): Promise<string> => {
//   const form = new FormData();
//   const fileItem = await dataURLtoFile(photo, filename);
//   form.append("image_file", fileItem);
//   form.append("prompt", prompt);
//   const response = await fetch(
//     "https://clipdrop-api.co/replace-background/v1",
//     {
//       method: "POST",
//       headers: {
//         "x-api-key":
//           "5f28e1037978f6eee7cfc6d61439fc02dd23c4ca3b73fc1ee7521b3948b852d06cfae5fd52cc626460bd1eabce6120fd",
//       },
//       body: form,
//     }
//   );

//   const buffer = await response.arrayBuffer();
//   const dataURL = await arrayBufferToDataURL(buffer);

//   return dataURL;
// };

// export const RemoveText = async (
//   photo: string,
//   filename: string
// ): Promise<string> => {
//   const form = new FormData();
//   const fileItem = await dataURLtoFile(photo, filename);
//   form.append("image_file", fileItem);

//   const response = await fetch("https://clipdrop-api.co/remove-text/v1", {
//     method: "POST",
//     headers: {
//       "x-api-key":
//         "5f28e1037978f6eee7cfc6d61439fc02dd23c4ca3b73fc1ee7521b3948b852d06cfae5fd52cc626460bd1eabce6120fd",
//     },
//     body: form,
//   });

//   const buffer = await response.arrayBuffer();
//   const dataURL = await arrayBufferToDataURL(buffer);

//   return dataURL;
// };

// export const Inpainting = async (
//   photo: string,
//   filename: string,
//   mask: string
// ): Promise<string> => {
//   const form = new FormData();
//   const fileItem = await dataURLtoFile(photo, filename);
//   const maskFile = await dataURLtoFile(mask, "mask.png");

//   form.append("image_file", fileItem);
//   form.append("mask_file", maskFile);

//   const response = await fetch("https://clipdrop-api.co/cleanup/v1", {
//     method: "POST",
//     headers: {
//       "x-api-key":
//         "5f28e1037978f6eee7cfc6d61439fc02dd23c4ca3b73fc1ee7521b3948b852d06cfae5fd52cc626460bd1eabce6120fd",
//     },
//     body: form,
//   });

//   const buffer = await response.arrayBuffer();
//   const dataURL = await arrayBufferToDataURL(buffer);

//   return dataURL;
// };
