import React, { useEffect, useState, useRef } from "react";
import Label from "../common/Label";
import { Row } from "../common/Row";
import DropdownInput from "../common/Dropdown";
import Button from "../common/Button";
import { useAppState } from "@/context/app.context";


const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};
import { saveAs } from "file-saver";
import { SketchPicker } from "react-color";
import { motion } from "framer-motion";
import { arrayBufferToDataURL, dataURLtoFile } from "@/utils/BufferToDataUrl";
import { coloreMode } from "@/store/dropdown";
import { Input } from "../common/Input";

const Edit = () => {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const {
    colore,
    setColore,
    previewLoader,
    setPriviewLoader,
    downloadImg,
    canvasInstance,
    isMagic, setIsMagic
  } = useAppState();
/* eslint-disable */


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

  const { setSelectedColoreMode, selectColoreMode } = useAppState();

  const handileDownload = () => {
    if (downloadImg) {
      const url = downloadImg;
      console.log(url);

      saveAs(url, `image${Date.now()}.png`);
    } else {
    }
  };

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
/* eslint-disable */

  useEffect(() => {
    addColorOverlayToSelectedImage(colore, selectColoreMode);
  }, [selectColoreMode, addColorOverlayToSelectedImage, colore]);

  const handleChangeComplete = (color: string) => {
    setColore(color.hex);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className={downloadImg ? "accest" : "accest blure"}
      style={{ paddingBottom: "50px" }}
    >
      <div className="gap"></div>
      <div className="gap">
        <Label>Arrange</Label>
        <div className="selectbox">
          <div className={"selectone"} onClick={() => ""}>
            Bring to Front
          </div>
          <div className={"selectone"} onClick={() => ""}>
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
            className={"selectTool"}
            onClick={() => {
              "";
            }}
          >
            <Label>Remove Background</Label>
            <div>
              <p>Remove the background of your image in one click</p>
            </div>
          </div>

          <div
            className={
              "selectTool "

              //  "selectTool ativeimg"
            }
            onClick={() => ""}
          >
            <Label>Upscale</Label>
            <div>
              <p>Super resolution</p>
            </div>
          </div>
          <div className={"selectTool"} onClick={() => setIsMagic(true)}>
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
