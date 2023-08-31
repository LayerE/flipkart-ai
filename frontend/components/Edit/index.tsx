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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

import { motion } from "framer-motion";
import { arrayBufferToDataURL, dataURLtoFile } from "@/utils/BufferToDataUrl";

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
    setSelectedImage,
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
    bgpromt,
    setBgpromt,
    modifidImageArray,
    setModifidImageArray,
    undoArray,
    setUndoArray,
  magicImage, setMagicImage,


    setBack,
  } = useAppState();

  useEffect(() => {
    console.log("ss");
  }, [previewLoader, bgRemove, modifidImageArray]);

  const [bgClick, setBgClick] = useState(false);

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
    downloadImage(
      modifidImageArray[modifidImageArray.length - 1].url,
      "new.png"
    );
  };
  const HandleBgRemover = async () => {
    setBgRemove(true);
    setPriviewLoader(true);
    console.log(bgRemove);
    console.log("sdfws", bgRemove);

    let temp;
    if (!modifidImageArray.length) {
      temp = selectedImage.baseUrl;
    } else {
      temp = modifidImageArray[modifidImageArray.length - 1].url;
    }
    const modifiedData = await BgRemover(temp, "hero.png");

    if(modifiedData){
      
      setModifidImageArray((pre) => [
        ...pre,
        { url: modifiedData, tool: "bgRemove" },
      ]);
    
  
      setUndoArray([]);
  
      setSelectedImage((prevState) => ({
        ...prevState,
        tools: {
          ...prevState.tools,
          bgRemove: true,
        },
      }));
    }

    setPriviewLoader(false);
  };

  const HandleSuperResolutin = async () => {
    setPriviewLoader(true);
    setSuperResolution(true);
    let temp;
    if (!modifidImageArray.length ) {
      temp = selectedImage.baseUrl;
    } else {
      temp = modifidImageArray[modifidImageArray.length - 1].url;
    }
    const modifiedData = await superResolutionFuc(temp, "hero.png");
    // setModifidImage(await modifiedData);
    if(modifiedData){
      
      setModifidImageArray((pre) => [
        ...pre,
        { url: modifiedData, tool: "superResolution" },
      ]);
      setUndoArray([]);
  
      setSelectedImage((prevState) => ({
        ...prevState,
        tools: {
          ...prevState.tools,
          superResolution: true,
        },
      }));
    }


    setPriviewLoader(false);
  };

  const HandlePortraitSurfaceNormals = async () => {
    setPriviewLoader(true);
    let temp;

    if (!modifidImageArray.length) {
      temp = selectedImage.baseUrl;
    } else {
      temp = modifidImageArray[modifidImageArray.length - 1].url;
    }
    setPSN(true);

    const modifiedData = await PortraitSurfaceNormals(temp, "hero.png");
    // setModifidImage(await modifiedData);

    if(modifiedData){
      
      setModifidImageArray((pre) => [...pre, { url: modifiedData, tool: "psn" }]);
      setSelectedImage((prevState) => ({
        ...prevState,
        tools: {
          ...prevState.tools,
          psn: true,
        },
      }));
      setUndoArray([]);
    }

    setPriviewLoader(false);
  };

  const HandlePortraitDepthEstimation = async () => {
    setPriviewLoader(true);
    let temp;

    if (!modifidImageArray.length) {
      temp = selectedImage.baseUrl;
    } else {
      temp = modifidImageArray[modifidImageArray.length - 1].url;
    }
    setPDE(true);

    const modifiedData = await PortraitDepthEstimation(temp, "hero.png");
    // setModifidImage(await modifiedData);
    if(modifiedData){
      
      setModifidImageArray((pre) => [...pre, { url: modifiedData, tool: "pde" }]);
  
      setSelectedImage((prevState) => ({
        ...prevState,
        tools: {
          ...prevState.tools,
          pde: true,
        },
      }));
      setUndoArray([]);
    }

    setPriviewLoader(false);
  };

  const HandleReplacebackground = async () => {
    setPriviewLoader(true);
    setReplaceBg(true);
    let temp;
    if (!modifidImageArray.length) {
      temp = selectedImage.baseUrl;
    } else {
      temp = modifidImageArray[modifidImageArray.length - 1].url;
    }

    const modifiedData = await Replacebackground(temp, "hero.png", bgpromt);
    // setModifidImage(await modifiedData);
    if(modifiedData){
      
      setModifidImageArray((pre) => [
        ...pre,
        { url: modifiedData, tool: "replaceBg" },
      ]);
  
      setSelectedImage((prevState) => ({
        ...prevState,
        tools: {
          ...prevState.tools,
          replaceBg: true,
        },
      }));
      setUndoArray([]);
    }

    setPriviewLoader(false);
  };

  const HandleRemoveText = async () => {
    setPriviewLoader(true);
    let temp;
    if (!modifidImageArray.length) {
      temp = selectedImage.baseUrl;
    } else {
      temp = modifidImageArray[modifidImageArray.length - 1].url;
    }
    setRemoveText(true);

    const modifiedData = await RemoveText(temp, "hero.png");
    // setModifidImage(await modifiedData);
    if(modifiedData){

      setModifidImageArray((pre) => [
        ...pre,
        { url: modifiedData, tool: "removeText" },
      ]);
  
      setSelectedImage((prevState) => ({
        ...prevState,
        tools: {
          ...prevState.tools,
          removeText: true,
        },
      }));
      setUndoArray([]);
    }

    setPriviewLoader(false);
  };

  const HandleInpainting = async () => {
    setPriviewLoader(true);
    let temp;
    if (modifidImage === null || modifidImage === "") {
      temp = selectedImage.baseUrl;
    } else {
      temp = modifidImageArray[modifidImageArray.length - 1].url;
    }
    setInpainting(true);

    const modifiedData = await Inpainting(temp, "hero.png");
    setModifidImage(await modifiedData);
    setUndoArray([]);

    setPriviewLoader(false);
  };

  // const handleImageChange = (file) => {
  //   // const file = e.target.files[0];
  //   const reader = new FileReader();

  //   reader.onloadend = function() {
  //     setMagicImage(reader.result);

  //   };

  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // };
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const blobUrlToDataUrl = async (blobUrl) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.onloadend = () => {
      setMagicImage(reader.result);
      console.log(magicImage)
    };
    reader.readAsDataURL(blob);


};
  const  handeleMG=async () =>{
    setMagickErase(!magickErase)

    const urlfile = modifidImageArray[modifidImageArray.length -1]?.url
    const tofilr = await blobUrlToDataUrl(urlfile)
    // const newurl = await fileToBase64(tofilr)
  
  // magicImage, setMagicImage

  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className={selectedImage.url ? "accest" : "accest blure"}
    >
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
            className={
              selectedImage?.tools?.bgRemove
                ? "selectTool ativeimg"
                : "selectTool"
            }
            onClick={() => {
              selectedImage?.tools?.bgRemove ? null : HandleBgRemover();
            }}
          >
            <Label>Remove Background</Label>
            <div>
              <p>Remove the background of your image in one click</p>
            </div>
          </div>

          <div
            className={
              selectedImage?.tools?.removeText
                ? "selectTool ativeimg"
                : "selectTool"
            }
            onClick={() =>
              selectedImage?.tools?.removeText ? null : HandleRemoveText()
            }
          >
            <Label>Remove Text</Label>
            <div>
              <p>Remove the text that appears on your pictures</p>
            </div>
          </div>
          <div
            className={
              selectedImage?.tools?.replaceBg
                ? "selectTool ativeimg"
                : "selectTool"
            }
            onClick={() =>
              selectedImage?.tools?.replaceBg
                ? setBgClick(false)
                : bgClick
                ? null
                : setBgClick(true)
            }
          >
            {bgClick ? (
              <div className="cardClose" onClick={() => setBgClick(false)}>
                <div className="x">X</div>
              </div>
            ) : null}

            {/* HandleReplacebackground() */}
            <Label>Replace background</Label>
            <div>
              <p>Replace background</p>
            </div>
            {bgClick ? (
              <div className="gen">
                <Input
                  value={bgpromt}
                  onChange={(e) => setBgpromt(e.target.value)}
                />
                <Button
                  disabled={bgpromt === "" ? true : false}
                  onClick={() => HandleReplacebackground()}
                >
                  Generate Background
                </Button>
              </div>
            ) : null}
          </div>
          <div
            className={
              selectedImage?.tools?.pde ? "selectTool ativeimg" : "selectTool"
            }
            onClick={() =>
              selectedImage?.tools?.pde ? null : HandlePortraitDepthEstimation()
            }
          >
            <Label>Portrait Depth Estimation</Label>
            <div>
              <p>Portrait Depth Estimation</p>
            </div>
          </div>
          <div
            className={
              selectedImage?.tools?.psn ? "selectTool ativeimg" : "selectTool"
            }
            onClick={() =>
              selectedImage?.tools?.psn ? null : HandlePortraitSurfaceNormals()
            }
          >
            <Label>Portrait Surface Normals</Label>
            <div>
              <p>Portrait Surface Normals</p>
            </div>
          </div>
          <div
            className={
              selectedImage?.tools?.superResolution
                ? "selectTool ativeimg"
                : "selectTool"
            }
            onClick={() =>
              selectedImage?.tools?.superResolution
                ? null
                : HandleSuperResolutin()
            }
          >
            <Label>Super resolution</Label>
            <div>
              <p>Super resolution</p>
            </div>
          </div>
          <div
            className={magickErase ? "selectTool ativeimg" : "selectTool"}
            onClick={() => handeleMG()}
          >
            <Label>Magic Erase</Label>
            <div>
              <p>Paint over objects to erase from the image</p>
            </div>
          </div>
          {/* <div
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
        <Button
          onClick={() => handileDownload()}
          disabled={
            previewLoader === true
              ? true
              : modifidImageArray.length
              ? false
              : false
          }
        >
          Download
        </Button>
      </Row>
    </motion.div>
  );
};

export default Edit;
