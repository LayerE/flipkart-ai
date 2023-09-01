import React, { useEffect, useState, useRef } from "react";
import Label from "../common/Label";
import { FileUpload, Input } from "../common/Input";
import { Row } from "../common/Row";
import DropdownInput from "../common/Dropdown";
import Button from "../common/Button";
import { coloreList, coloreMode } from "@/store/dropdown";
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
import { saveAs } from "file-saver";

import { SketchPicker } from "react-color";
import { motion } from "framer-motion";
import { arrayBufferToDataURL, dataURLtoFile } from "@/utils/BufferToDataUrl";

const Edit = () => {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);

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

    undoArray,
    setUndoArray,
    magicImage,
    setMagicImage,
    selectedImg,
    canvasInstance,
    setBack,
  } = useAppState();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleButtonClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsPopupOpen((prevIsPopupOpen) => !prevIsPopupOpen);
  };

  const [bgClick, setBgClick] = useState(false);

  const { setSelectedColoreMode, selectColoreMode } = useAppState();

  const handileDownload = () => {
    if (selectedImg) {
      const url = selectedImg;
      console.log(url);

      saveAs(url, `image${Date.now()}.png`);
    } else {
      // alert("No image selected!");
    }
  };
  const HandleBgRemover = async () => {
    // setBgRemove(true);
    // setPriviewLoader(true);
    // setPriviewLoader(false);
  };

  const HandleSuperResolutin = async () => {
    // setPriviewLoader(true);
    // setSuperResolution(true);
    // let temp;
    // setPriviewLoader(false);
  };

  const HandlePortraitSurfaceNormals = async () => {
    // setPriviewLoader(true);
    // let temp;
    // setPriviewLoader(false);
  };

  const HandlePortraitDepthEstimation = async () => {
    // setPriviewLoader(true);
    // let temp;
    // setPriviewLoader(false);
  };

  const HandleReplacebackground = async () => {
    // setPriviewLoader(false);
  };

  const HandleRemoveText = async () => {
    // setPriviewLoader(true);
    // setRemoveText(true);
    // setPriviewLoader(false);
  };

  const HandleInpainting = async () => {
    // setPriviewLoader(true);
    // setPriviewLoader(false);
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

  function addColorOverlayToSelectedImage(color, mode) {
    const canvas = canvasInstance.current;
    const activeObject = canvas.getActiveObject();

    if (activeObject && activeObject.type === "image") {
      activeObject.filters = []; // Clear existing filters

      if (mode !== "none") {
        let filter;
        switch (mode) {
          case "Overlay":
            filter = new fabric.Image.filters.BlendColor({
              color: color,
              mode: "overlay",
              alpha: 0.5,
            });
            break;
          case "Multiply":
            filter = new fabric.Image.filters.BlendColor({
              color: color,
              mode: "multiply",
              alpha: 1,
            });
            break;
          case "Add":
            filter = new fabric.Image.filters.BlendColor({
              color: color,
              mode: "add",
              alpha: 1,
            });
            break;
          case "Tint":
            filter = new fabric.Image.filters.Tint({
              color: color,
              opacity: 0.5,
            });
            break;
        }

        if (filter) {
          activeObject.filters.push(filter);
        }
      }

      activeObject.applyFilters();
      canvas.renderAll();
    } else {
      // alert("Please select an image on the canvas first.");
    }
  }

  useEffect(() => {
    addColorOverlayToSelectedImage(colore, selectColoreMode);
  }, [selectColoreMode]);

  const handleChangeComplete = (color) => {
    setColore(color.hex);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className={selectedImg ? "accest" : "accest blure"}
      style={{ paddingBottom: "50px" }}
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
              list: coloreMode,
              label: "color",
              action: setSelectedColoreMode,
              activeTab: selectColoreMode,
            }}
          />
          <div className="clolorpicker">
            <div
              className="colorBox"
              style={{ background: colore }}
              onClick={handleButtonClick}
            ></div>
            {isPopupOpen && (
              <div className="pikkeropen" ref={popupRef}>
                <SketchPicker
                  color={colore}
                  onChangeComplete={handleChangeComplete}
                />
              </div>
            )}
            <Input value={colore} style={{ width: "100px" }} />
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
                {/* <Input
                  value={bgpromt}
                  onChange={(e) => setBgpromt(e.target.value)}
                /> */}
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
        </div>
      </div>
      <Row>
        <Button
          onClick={() => handileDownload()}
          disabled={previewLoader === true ? true : false}
        >
          Download
        </Button>
      </Row>
    </motion.div>
  );
};

export default Edit;
