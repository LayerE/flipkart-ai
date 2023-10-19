import React, { useEffect } from "react";
import { styled } from "styled-components";
import { useState, useCallback } from "react";
import { useAppState } from "@/context/app.context";

import Button from "../common/Button";
import { saveAs } from "file-saver";
import { AssetsLoader } from "../Loader/AssetsLoader";
import { RemoveLoader } from "../Loader/RemoveLoader";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "react-toastify";

import { arrayBufferToDataURL, dataURLtoFile } from "@/utils/BufferToDataUrl";

const RemoveBox = ({ type }) => {
  const session = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    if (session) {
      setUserId(session.user.id);
    }
  }, [session]);

  const {
    addimgToCanvasCropped,
    crop,
    setCrop,
    downloadImg,
    addimgToCanvasGen,
    TDMode,
    setromovepopu3d,
    selectedImg,
    romovepopu3d,
    downloadeImgFormate,
  } = useAppState();

  // const [cropSize, setCropSize] = useState({ x: 0, y: 0 })
  const [loader, setLoader] = useState(false);
  const [updateImg, setupdateImg] = useState(null);

  const downloadH = async () => {
    // const url = canvas.toDataURL("image/png");

    saveAs(updateImg, `image${Date.now()}.${downloadeImgFormate}`);

    // setCrop(false)

    // setIsMagic(false);

    // return dataURL;
  };

  const HandelBG = async () => {
    setLoader(true);

    try {
      const response = await fetch("/api/removebg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataUrl: downloadImg,
          user_id: userId,
          project_id: null,
        }),
      });
      const data = await response.json();
      if (data) {
        setupdateImg(data?.data?.data[0]);
        //   addimgToCanvasSubject(data?.data?.data[0]);
        // addimgToCanvasGen(data?.data[0]);
        // setSelectedImg({ status: true, image: data?.data[0] });
        // addimgToCanvasGen(data);

        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      toast.error("Error removing background");
      setromovepopu3d(false);
      setupdateImg(null);
    }
    setLoader(false);
    // setromovepopu3d(false);
    // setLoader(false);
  };
  async function toB64(imgUrl: string): Promise<string> {
    const datas = await fetch(imgUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64data = reader.result;
          return base64data;

          // setBase64Image(base64data);
        };
        reader.readAsDataURL(blob);
      });
  }

  const upSacle = async (photo: string, filename: string): Promise<string> => {
    const form = new FormData();
    const fileItem = await dataURLtoFile(photo, filename);
    form.append("image_file", fileItem);
    form.append("target_width", 2048);
    form.append("target_height", 2048);
    const response = await fetch(
      "https://clipdrop-api.co/image-upscaling/v1/upscale",
      {
        method: "POST",
        headers: {
          "x-api-key":
            "ca2c46b3fec7f2917642e99ab5c48d3e23a2f940293a0a3fbec2e496566107f9d8b192d030b7ecfd85cfb02b6adb32f4",
        },
        body: form,
      }
    );

    const buffer = await response.arrayBuffer();
    const dataURL = await arrayBufferToDataURL(buffer);
    localStorage.setItem("m-images", JSON.stringify(dataURL));
    console.log(buffer, response, dataURL, "imgs");

    if (response.status === 402) {
      toast.error("Not enough credits to process the request");
      setromovepopu3d(false);
      setupdateImg(null);
    }
    // const response = await fetch("/api/upscale", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     image_url: photo,
    //     user_id: userId,

    //   }),
    // });

    return dataURL;
  };

  const UpscaleBG = async () => {
    setLoader(true);

    // const datatacke = {
    //   image: await toB64(downloadImg),
    //   scale: 2,
    // };
    // const response = await fetch("https://api.segmind.com/v1/esrgan", {
    //   method: "POST",
    //   headers: {
    //     "x-api-key": "SG_86fe6533d0888ca0",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(datatacke),
    // });
    // const data = await response;
    // console.log(await data, "upscale ");
    try {
      //   const data = await upSacle(downloadImg, "imger");
      const data = await upSacle(downloadImg, "imger");

      if (data) {
        console.log(updateImg);
        // addimgToCanvasGen(data);
        setupdateImg(data);

        //   setSelectedImg({ status: true, image: data });
      }
    } catch (error) {
      setLoader(false);
      toast.error("Error upscale Image");
      setromovepopu3d(false);
      setupdateImg(null);
    }

    setLoader(false);
  };
  useEffect(() => {
    if (romovepopu3d.type === "bgRemove") {
      HandelBG();
    } else {
      UpscaleBG();
    }
  }, []);

  return (
    <Wrapper>
      <div className="cropperbox">
        <div className="imgbox">
          {loader ? (
            <RemoveLoader />
          ) : (
            <picture>
              <img src={updateImg} alt="" />
            </picture>
          )}
        </div>

        <div className="flex">
          {TDMode ? (
            <Button
              onClick={() => downloadH()}
              disabled={updateImg ? false : true}
            >
              Download
            </Button>
          ) : // <Button onClick={() => HandleCrope()}>Done</Button>
          null}

          <Button
            onClick={() => {
              setupdateImg(null);
              setromovepopu3d(false);
            }}
          >
            Close
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default RemoveBox;

const Wrapper = styled.div`
  .nm {
    object-fit: contain;
    width: 1005;
  }

  .flex {
    display: flex;
    justify-content: end;
    gap: 20px;
    button {
      max-width: fit-content;
    }
  }
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100vh;
  right: 0;
  /* bottom: 0; */
  z-index: 400;
  background-color: #ffffff;

  .ReactCrop {
    width: 400px;
    height: 400px;
    position: relative;
    /* margin-top: 80px !important; */
  }
  .reactEasyCrop_Container {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
  }
  .imgbox {
    width: 400px;
    height: 400px;
    border: 1px solid rgba(249, 208, 13, 1);
    padding: 5px;
    margin-bottom: 10px;
  }
`;
