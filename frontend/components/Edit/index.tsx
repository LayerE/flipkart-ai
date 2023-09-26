import React, { useEffect, useState, useRef } from "react";
import Label, { DisabledLabel } from "../common/Label";
import { Row } from "../common/Row";
import DropdownInput, { DropdownNOBorder } from "../common/Dropdown";
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
import { ImgFormate, coloreMode } from "@/store/dropdown";
import { Input } from "../common/Input";
import { Console } from "console";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { styled } from "styled-components";
import { fabric } from "fabric";
import TextLoader from "../Loader/text";

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
    addimgToCanvasGen,
    addimgToCanvasSubject,
    modifidImageArray,
    isMagic,
    setIsMagic,
    setModifidImageArray,
    setSelectedImg,
    bringImageToFront,
    sendImageToBack,
    setLoader,
    downloadeImgFormate,
    setDownloadeImgFormate,
    mode,
    setMode,
    brushSize,
    setBrushSize,
    linesHistory,
    setLinesHistory,
    lines,
    setLines,
    magicLoader,
    setMagicloder,
    HandleInpainting,
    crop, setCrop,
    loader
  } = useAppState();

  const { userId } = useAuth();
  const { query, isReady } = useRouter();
  // const { id } = query;
  const id = (query.id as string[]) || [];
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
      // const url = modifidImageArray[modifidImageArray.length - 1]?.url;
      const url = downloadImg;

      console.log(url);

      saveAs(url, `image${Date.now()}.${downloadeImgFormate}`);
    } else {
    }
  };

  function addColorOverlayToSelectedImage(color, mode) {
    const canvas = canvasInstance.current;
    const activeObject = canvas?.getActiveObject();

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

  const HandelBG = async () => {
    setIsMagic(false);

    setLoader(true);
    const response = await fetch("/api/removebg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dataUrl: downloadImg,
        user_id: userId,
        project_id: id,
      }),
    });
    const data = await response.json();
    if (data) {
      addimgToCanvasSubject(data?.data?.data[0]);
      // addimgToCanvasGen(data?.data[0]);
      // setSelectedImg({ status: true, image: data?.data[0] });
      // addimgToCanvasGen(data);

      setModifidImageArray((pre) => [
        ...pre,
        { url: data?.data[0], tool: "upscale" },
      ]);
    }

    setLoader(false);
  };

  async function toB64(imgUrl: string): Promise<string> {
    const response = await fetch(imgUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64String = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    return base64String;
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
    setIsMagic(false);

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

    const data = await upSacle(downloadImg, "imger");
    console.log(data, "upscale ");

    if (data) {
      addimgToCanvasGen(data);
      setSelectedImg({ status: true, image: data });

      setModifidImageArray((pre) => [...pre, { url: data, tool: "upscale" }]);
    }

    setLoader(false);
  };
  useEffect(() => {
    addColorOverlayToSelectedImage(colore, selectColoreMode);
  }, [selectColoreMode, addColorOverlayToSelectedImage, colore]);

  const handleChangeComplete = (color: string) => {
    setColore(color.hex);
  };

  const [size, setsize] = useState(40);

  const [isEraseMode, setIsEraseMode] = useState(false);
  const history = useRef([]);
  const historyIndex = useRef(-1);
  useEffect(() => {
    canvasInstance.current.on("object:added", () => {
      history.current.push(JSON.stringify(canvasInstance.current.toJSON()));
      historyIndex.current += 1;
    });
  }, [size, canvasInstance]);

  const toggleEraseMode = () => {
    setIsEraseMode(!isEraseMode);
    const activeObject = canvasInstance.current.getActiveObject();

    if (activeObject && activeObject.type === "image") {
      canvasInstance.current.isDrawingMode = true;
      canvasInstance.current.freeDrawingBrush.color = "black"; // Set brush color
      canvasInstance.current.freeDrawingBrush.width = 2; // Set brush width
      canvasInstance.current.freeDrawingBrush.shadow = null; // Remove shadow

      // Create a mask from the selected image
      const mask = new fabric.Rect({
        width: activeObject.width,
        height: activeObject.height,
        left: activeObject.left,
        top: activeObject.top,
        opacity: 0, // Make the mask invisible
        selectable: false, // Disable selection for the mask
        evented: false, // Disable events for the mask
      });

      // Set the mask as a clipping object to restrict drawing
      activeObject.set({
        clipTo: function (ctx) {
          return function () {
            mask.render(ctx);
          };
        },
      });

      canvasInstance.current.add(mask); // Add the mask to the canvas
    } else {
      canvasInstance.current.isDrawingMode = false;
    }
  };
  const undoAction = () => {
    if (historyIndex.current === 0) return;

    historyIndex.current -= 1;
    const prevState = JSON.parse(history.current[historyIndex.current]);
    canvasInstance.current.loadFromJSON(prevState);
  };

  const clearDrawing = () => {
    setIsEraseMode(false);
    const objects = canvasInstance.current.getObjects();
    objects.forEach((object) => {
      if (object.type === "path") {
        // Assuming paths are used for free drawing and erasing
        canvasInstance.current.remove(object);
      }
    });
  };

  const undoLastDrawing = () => {
    if (linesHistory.length === 0) return;

    const lastVersion = linesHistory[linesHistory.length - 1];
    setLines(lastVersion);

    // Remove the last version from history
    setLinesHistory(linesHistory.slice(0, linesHistory.length - 1));
  };

  const HandelCrop = ()=>{
    setCrop(true)
    setIsMagic(false)

  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className={downloadImg && !loader ? "accest" : "accest blure"}
      style={{ paddingBottom: "50px" }}
    >
      <WrapperEdit>
        {/* <div className="gap"></div> */}
        <div className="gaps">
          <Label>Arrange</Label>
          <div className="selectbox">
            <div className={"selectone"} onClick={() => bringImageToFront()}>
              Bring to Front
            </div>
            <div className={"selectone"} onClick={() => sendImageToBack()}>
              Send to back
            </div>
          </div>
        </div>

        {/* <div className="gap">
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
      </div> */}
        <div className="gap">
          <Label>Tools</Label>

          <div className="gaps">
            <div className={isMagic ?  "selectTool activeTool" :"selectTool"} onClick={() => {setIsMagic(true); 
    setCrop(false)
            
            }}>
              <div className="mageic">
                <div className="gaps">
                  <Label>Magic Erase</Label>
                  <DisabledLabel>
                    Erase then click Generate to replace any unwanted parts of
                    the background.
                  </DisabledLabel>
                </div>
                <div className="gaps">
                  <div className="flex">
                    <Label>Mode</Label>
                    {/* {linesHistory.length === 0 ? null : (
                      <div onClick={undoLastDrawing}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="14"
                          viewBox="0 0 16 14"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M5.70679 0.292786C5.89426 0.480314 5.99957 0.734622 5.99957 0.999786C5.99957 1.26495 5.89426 1.51926 5.70679 1.70679L3.41379 3.99979H8.99979C10.8563 3.99979 12.6368 4.73728 13.9495 6.05004C15.2623 7.36279 15.9998 9.14327 15.9998 10.9998V12.9998C15.9998 13.265 15.8944 13.5194 15.7069 13.7069C15.5194 13.8944 15.265 13.9998 14.9998 13.9998C14.7346 13.9998 14.4802 13.8944 14.2927 13.7069C14.1051 13.5194 13.9998 13.265 13.9998 12.9998V10.9998C13.9998 9.6737 13.473 8.40193 12.5353 7.46425C11.5976 6.52657 10.3259 5.99979 8.99979 5.99979H3.41379L5.70679 8.29279C5.8023 8.38503 5.87848 8.49538 5.93089 8.61738C5.9833 8.73939 6.01088 8.87061 6.01204 9.00339C6.01319 9.13616 5.98789 9.26784 5.93761 9.39074C5.88733 9.51364 5.81307 9.62529 5.71918 9.71918C5.62529 9.81307 5.51364 9.88733 5.39074 9.93761C5.26784 9.98789 5.13616 10.0132 5.00339 10.012C4.87061 10.0109 4.73939 9.9833 4.61738 9.93089C4.49538 9.87848 4.38503 9.8023 4.29279 9.70679L0.292786 5.70679C0.105315 5.51926 0 5.26495 0 4.99979C0 4.73462 0.105315 4.48031 0.292786 4.29279L4.29279 0.292786C4.48031 0.105315 4.73462 0 4.99979 0C5.26495 0 5.51926 0.105315 5.70679 0.292786Z"
                            fill="black"
                          ></path>
                        </svg>
                      </div>
                    )} */}
                  </div>
                  <div className="modeBtns">
                    <div
                      className={`btn ${mode === "pen" ? "activBtn" : ""}`}
                      onClick={() => {
                        setMode("pen");
                        // toggleEraseMode();
                      }}
                    >
                      Erase
                    </div>
                    <div
                      className={`btn ${mode === "eraser" ? "activBtn" : ""}`}
                      onClick={() => {
                        undoLastDrawing()
                        setMode("eraser");
                        // clearDrawing();
                      }}
                    >
                      Restore
                    </div>
                  </div>
                </div>
                <div className="">
                  <Label>Brush size</Label>
                  <div className="rangebox">
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="1"
                      value={brushSize}
                      onChange={(e) =>
                        setBrushSize(parseInt(e.target.value, 10))
                      }
                    />
                  </div>
                </div>
                {/* <Row>
                  {magicLoader ? (
                    <TextLoader />
                  ) : (
                    <Button
                      onClick={() => HandleInpainting()}
                      disabled={linesHistory.length === 0 ? true : false}
                    >
                      Generate
                    </Button>
                  )}
                </Row> */}
              </div>
            </div>
            {/* <div className={"selectTool"} onClick={() => setIsMagic(true)}>
            <Label>Magic Erase</Label>
            <div>
              <p>Paint over objects to erase from the image</p>
            </div>
          </div> */}

            <div
              className={
                "selectTool "
                //  "selectTool ativeimg"
              }
              onClick={() => UpscaleBG()}
            >
              <Label>Upscale</Label>
              <div>
                <p>Upscale image up to 2k resolution</p>
              </div>
            </div>

            <div
              className={"selectTool"}
              onClick={() => {
                HandelBG();
              }}
            >
              <Label>Remove Background</Label>
              <div>
                <p>Remove the background of your image in one click</p>
              </div>
            </div>
            <div
        
            className={crop ?  "selectTool activeTool" :"selectTool"} 

              onClick={() => {
                HandelCrop();
              }}
            >
              <Label>Crop Images</Label>
              <div>
                <p>Crop your image </p>
              </div>
            </div>
          </div>
        </div>

        <div className="gaps">
          <div className="rowwothtwo">
            <Label>Select image file formats</Label>
            <div className="two-side">
              <DropdownNOBorder
                data={{
                  list: ImgFormate,
                  action: setDownloadeImgFormate,
                  activeTab: downloadeImgFormate,
                }}
              ></DropdownNOBorder>
            </div>
          </div>
        </div>

        <Row>
          <Button
            disabled={previewLoader === true ? true : false}
            onClick={() => handileDownload()}
          >
            Download
          </Button>
        </Row>
      </WrapperEdit>
    </motion.div>
  );
};

export default Edit;

const WrapperEdit = styled.div`
  .gaps {
    margin-bottom: 10px;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .modeBtns {
    display: flex;
    width: 100%;
    border: 1px solid rgba(249, 208, 13, 1);
    border-radius: 6px;
    justify-content: space-between;
  }
  .btn {
    width: 100%;
    padding: 5px;
    cursor: pointer;

    text-align: center;
  }

  .activBtn {
    background: rgba(249, 208, 13, 1);
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
  .actives {
    background-color: #f8d62bfe !important;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }

  input[type="range"] {
    height: 20px;
    -webkit-appearance: none;
    /* margin: 10px 0; */
    width: 100%;
    background: #fff;
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    /* box-shadow: 0px 0px 0px #000000; */
    background: rgba(249, 208, 13, 1);
    border-radius: 1px;
    border: 0px solid #000000;
  }
  input[type="range"]::-webkit-slider-thumb {
    /* box-shadow: 0px 0px 0px #000000; */
    border: 1px solid rgba(249, 208, 13, 1);
    height: 15px;
    width: 15px;
    border-radius: 25px;
    background: #dac149;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -6px;
  }
  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: rgba(249, 208, 13, 1);
  }
  input[type="range"]::-moz-range-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: rgba(249, 208, 13, 1);
    border-radius: 1px;
    border: 0px solid #000000;
  }
  input[type="range"]::-moz-range-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid #rgba(249, 208, 13, 1);
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: rgba(249, 208, 13, 1);
    cursor: pointer;
  }
  input[type="range"]::-ms-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type="range"]::-ms-fill-lower {
    background: rgba(249, 208, 13, 1);
    border: 0px solid #000000;
    border-radius: 2px;
    /* box-shadow: 0px 0px 0px #000000; */
  }
  input[type="range"]::-ms-fill-upper {
    background: rgba(249, 208, 13, 1);
    border: 0px solid #000000;
    border-radius: 2px;
    /* box-shadow: 0px 0px 0px #000000; */
  }
  input[type="range"]::-ms-thumb {
    margin-top: 1px;
    /* box-shadow: 0px 0px 0px #000000; */
    border: 1px solid rgba(249, 208, 13, 1);
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: rgba(249, 208, 13, 1);
    cursor: pointer;
  }
  input[type="range"]:focus::-ms-fill-lower {
    background: rgba(249, 208, 13, 1);
  }
  input[type="range"]:focus::-ms-fill-upper {
    background: rgba(249, 208, 13, 1);
  }
`;
