import React from "react";
import { styled } from "styled-components";
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { useAppState } from "@/context/app.context";
// import ReactCrop, { type Crop } from 'react-image-crop'
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Button from "../common/Button";
import { saveAs } from "file-saver";

const CropperBox = () => {
  const {
    addimgToCanvasCropped,
    crop,
    setCrop,
    downloadImg,
    addimgToCanvasGen,
    TDMode,
    downloadeImgFormate,
    downloadImgEdit, setDownloadImgEdit,
    canvasInstance
  } = useAppState();

  // const [cropSize, setCropSize] = useState({ x: 0, y: 0 })
  const [cropSize, setCropSize] = useState();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(1);

  const HandleCrope = async () => {
    console.log("dfg");
    if (cropSize.width && cropSize.height) {
      console.log("dfg");

      const canvas = document.createElement("canvas");
      const image = document.getElementById("img");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = cropSize.width;
      canvas.height = cropSize.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        cropSize.x * scaleX,
        cropSize.y * scaleY,
        cropSize.width * scaleX,
        cropSize.height * scaleY,
        0,
        0,
        cropSize.width,
        cropSize.height
      );

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      const url = URL.createObjectURL(blob);

      // const link = document.createElement('a');
      // link.href = url;
      // link.download = 'cropped_image.png';
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      DeletIrem()

      addimgToCanvasGen(url);
      setCrop(false);
    }
  };
  const downloadH = async () => {
    console.log("dfg");
    if (cropSize.width && cropSize.height) {
      console.log("dfg");

      const canvas = document.createElement("canvas");
      const image = document.getElementById("img");
      image.setAttribute("crossOrigin", "anonymous");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = cropSize.width;
      canvas.height = cropSize.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        cropSize.x * scaleX,
        cropSize.y * scaleY,
        cropSize.width * scaleX,
        cropSize.height * scaleY,
        0,
        0,
        cropSize.width,
        cropSize.height
      );

      // const blob = await new Promise((resolve) =>
      // );
      const url = canvas.toDataURL();
      // const url = URL.createObjectURL(blob);

      // const link = document.createElement('a');
      // link.href = url;
      // link.download = 'cropped_image.png';
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);

      saveAs(url, `image${Date.now()}.${downloadeImgFormate}`);

      // setCrop(false)
    }

    // setIsMagic(false);

    // return dataURL;
  };

  const DeletIrem = () => {
    const activeObject = canvasInstance?.current?.getActiveObject();
    if (activeObject) {
      canvasInstance?.current?.remove(activeObject);
      canvasInstance?.current?.renderAll();
    }
  };
  return (
    <Wrapper>
      <div className="cropperbox">
        {/* <Cropper
      image={downloadImg}
      crop={cropSize}
      zoom={zoom}
    //   aspect={4 / 3}
      onCropChange={setCropSize}
      onCropComplete={onCropComplete}
      onZoomChange={setZoom}
    /> */}

        <ReactCrop
          crop={cropSize}
          onChange={(c) => setCropSize(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
          minWidth={50}
          minHeight={50}
        >
          <img className="nm" src={downloadImg} id="img" />
        </ReactCrop>

        <div className="flex">
          {TDMode ? (
            <Button
              onClick={() => downloadH()}
              //   disabled={linesHistory.length === 0 ? true : false}
            >
              Download
            </Button>
          ) : (
            <Button onClick={() => HandleCrope()}>Done</Button>
          )}

          <Button onClick={() => setCrop(false)}>Close</Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default CropperBox;

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
`;
