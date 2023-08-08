import React, { useEffect, useState } from "react";
import Label from "../common/Label";
import { FileUpload, Input } from "../common/Input";
import { Row } from "../common/Row";
import DropdownInput from "../common/Dropdown";
import Button from "../common/Button";
import { coloreList } from "@/store/dropdown";
import { useAppState } from "@/context/app.context";
import {
  BgRemover,
  Inpainting,
  PortraitDepthEstimation,
  PortraitSurfaceNormals,
  RemoveText,
  Replacebackground,
  superResolutionFuc,
} from "@/store/api";

const Edit = () => {
  const {
    colore,
    setColore,
    bgRemove,
    setBgRemove,
    magickErase,
    setMagickErase,
    upScale,
    setupscale,
    front,
    setFront,
    back,
    selectedImage,
    modifidImage,
    setModifidImage,
    previewLoader,
    setPriviewLoader,
    inpainting,
    setInpainting,
    removeText,
    setRemoveText,
    replaceBg,
    setReplaceBg,
    PDE,
    setPDE,
    PSN,
    setPSN,
    superResolution,
    setSuperResolution,

    setBack,
  } = useAppState();

  const { selectColore, setSelectedColore } = useAppState();

  function downloadImage(blob: Blob, filename: string) {
    const url = blob;

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;

    // Append the anchor to the document and programmatically click on it
    document.body.appendChild(anchor);
    anchor.click();

    // Remove the anchor from the document
    document.body.removeChild(anchor);

    // Revoke the object URL to release memory
    URL.revokeObjectURL(url);
  }

  const handileDownload = () => {
    downloadImage(modifidImage, "new.png");
  };
  const HandleBgRemover = async () => {
    setPriviewLoader(true);
    setBgRemove(!bgRemove);
    console.log(bgRemove);
    if (bgRemove) {
      const modifiedData = await BgRemover(selectedImage?.url, "hero.png");
      setModifidImage(await modifiedData);
    }
    setPriviewLoader(false);
  };

  const HandleSuperResolutin = async () => {
    setPriviewLoader(true);
    setSuperResolution(!superResolution);
    if (superResolution) {
      const modifiedData = await superResolutionFuc(
        selectedImage?.url,
        "hero.png"
      );
      setModifidImage(await modifiedData);
    }
    setPriviewLoader(false);
  };

  const HandlePortraitSurfaceNormals = async () => {
    setPriviewLoader(true);
    let temp;

    if (modifidImage === null || modifidImage === "") {
      temp = selectedImage.url;
    } else {
      temp = modifidImage;
    }
    setPSN(!PSN);
    if (PSN) {
      const modifiedData = await PortraitSurfaceNormals(temp, "hero.png");
      setModifidImage(await modifiedData);
    }
    setPriviewLoader(false);
  };

  const HandlePortraitDepthEstimation = async () => {
    setPriviewLoader(true);
    let temp;

    if (modifidImage === null || modifidImage === "") {
      temp = selectedImage.url;
    } else {
      temp = modifidImage;
    }
    setPDE(!PDE);
    if (PDE) {
      const modifiedData = await PortraitDepthEstimation(temp, "hero.png");
      setModifidImage(await modifiedData);
    }
    setPriviewLoader(false);
  };

  const HandleReplacebackground = async () => {
    setPriviewLoader(true);
    setReplaceBg(!replaceBg);
    let temp;
    if (modifidImage === null || modifidImage === "") {
      temp = selectedImage.url;
    } else {
      temp = modifidImage;
    }
    if (replaceBg) {
      const modifiedData = await Replacebackground(temp, "hero.png");
      setModifidImage(await modifiedData);
    }
    setPriviewLoader(false);
  };

  const HandleRemoveText = async () => {
    setPriviewLoader(true);
    let temp;
    if (modifidImage === null || modifidImage === "") {
      temp = selectedImage.url;
    } else {
      temp = modifidImage;
    }
    setRemoveText(!removeText);
    if (removeText) {
      const modifiedData = await RemoveText(temp, "hero.png");
      setModifidImage(await modifiedData);
    }
    setPriviewLoader(false);
  };

  const HandleInpainting = async () => {
    setPriviewLoader(true);
    let temp;
    if (modifidImage === null || modifidImage === "") {
      temp = selectedImage.url;
    } else {
      temp = modifidImage;
    }
    setInpainting(!inpainting);
    if (inpainting) {
      const modifiedData = await Inpainting(temp, "hero.png");
      setModifidImage(await imageArray);
    }
    setPriviewLoader(false);
  };

  return (
    <div className="accest">
      <div className="gap">
        {/* <Row>
          <FileUpload></FileUpload>
        </Row> */}
      </div>
      <div className="gap">
        <Label>Arrange</Label>
        <div className="selectbox">
          <div
            className={front ? "selectone ativeimg" : "selectone"}
            onClick={() => setFront(!front)}
          >
            Bring to Front
          </div>
          <div
            className={back ? "selectone ativeimg" : "selectone"}
            onClick={() => setBack(!back)}
          >
            Send to back
          </div>
        </div>
      </div>

      <div className="gap">
        <Label>Color</Label>
        <div className="rowwothtwo">
          <DropdownInput
            data={{
              list: coloreList,
              label: "color",
              action: setSelectedColore,
              activeTab: selectColore,
            }}
          />
          <div className="clolorpicker">
            <div className="colorBox" style={{ background: colore }}></div>
            <Input onChange={(e) => setColore(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="gap">
        <Label>Tools</Label>
        <div className="gap">
          <div
            className={bgRemove ? "selectTool ativeimg" : "selectTool"}
            onClick={() => HandleBgRemover()}
          >
            <Label>Remove Background</Label>
            <div>
              <p>Remove the background of your image in one click</p>
            </div>
          </div>

          <div
            className={removeText ? "selectTool ativeimg" : "selectTool"}
            onClick={() => HandleRemoveText()}
          >
            <Label>Remove Text</Label>
            <div>
              <p>Remove the text that appears on your pictures</p>
            </div>
          </div>
          <div
            className={replaceBg ? "selectTool ativeimg" : "selectTool"}
            onClick={() => HandleReplacebackground()}
          >
            <Label>Replace background</Label>
            <div>
              <p>Replace background</p>
            </div>
          </div>
          <div
            className={PDE ? "selectTool ativeimg" : "selectTool"}
            onClick={() => HandlePortraitDepthEstimation()}
          >
            <Label>Portrait Depth Estimation</Label>
            <div>
              <p>Portrait Depth Estimation</p>
            </div>
          </div>
          <div
            className={PSN ? "selectTool ativeimg" : "selectTool"}
            onClick={() => HandlePortraitSurfaceNormals()}
          >
            <Label>Portrait Surface Normals</Label>
            <div>
              <p>Portrait Surface Normals</p>
            </div>
          </div>
          <div
            className={superResolution ? "selectTool ativeimg" : "selectTool"}
            onClick={() => HandleSuperResolutin()}
          >
            <Label>Super resolution</Label>
            <div>
              <p>Super resolution</p>
            </div>
          </div>
          {/* <div
            className={magickErase ? "selectTool ativeimg" : "selectTool"}
            onClick={() => setMagickErase(!magickErase)}
          >
            <Label>Magic Erase</Label>
            <div>
              <p>Paint over objects to erase from the image</p>
            </div>
          </div>
          <div
            className={upScale ? "selectTool ativeimg" : "selectTool"}
            onClick={() => setupscale(!upScale)}
          >
            <Label>Upscale</Label>
            <div>
              <p>Upscale image up to 2k resolution</p>
            </div>
          </div> */}
        </div>
      </div>
      <Row>
        <Button onClick={() => handileDownload()}>Download</Button>
      </Row>
    </div>
  );
};

export default Edit;
