import Head from "next/head";
import NextImage from "next/image";
import React, { useRef, useState } from "react";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Sidebar from "@/components/Sidebar";
import { styled } from "styled-components";
import { useAppState } from "@/context/app.context";
import assets from "@/public/assets";
import { useEffect } from "react";
import { FileUpload, Input } from "@/components/common/Input";
import { motion } from "framer-motion";
import { theme } from "@/theme";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Image as KonvaImage,
  Line,
} from "react-konva";
import Konva from "konva";
import useImage from "use-image";
import { Inpainting } from "@/store/api";
import { arrayBufferToDataURL } from "@/utils/BufferToDataUrl";
import Button from "@/components/common/Button";
import { fabric } from "fabric";
import Apps from "@/components/Canvas";
import { saveAs } from "file-saver";
import Draggable from "react-draggable";
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const {
    selectedImage,
    setSelectedImage,
    modifidImage,
    setModifidImage,
    previewLoader,
    setPriviewLoader,
    modifidImageArray,
    bgRemove,
    setModifidImageArray,
    undoArray,
    setUndoArray,
    magickErase,
    setFile,
    setMagickErase,
    setInpainting,
  } = useAppState();

  // useEffect(() => {
  //   console.log("new render");
  // }, [previewLoader, modifidImage, modifidImageArray]);
  const handileUndo = () => {
    if (modifidImageArray.length > 0) {
      setUndoArray((pre) => [
        ...pre,
        modifidImageArray[modifidImageArray.length - 1],
      ]);

      setModifidImageArray((pre) => {
        const lastElement = pre[pre.length - 1];
        if (lastElement && lastElement.tool) {
          setSelectedImage((prevState) => ({
            ...prevState,
            tools: {
              ...prevState.tools,
              [lastElement.tool]: false,
            },
          }));
        }

        return pre.slice(0, -1);
      });
    }
  };
  const handilePre = () => {
    if (undoArray.length > 0) {
      setModifidImageArray((pre) => [...pre, undoArray[undoArray.length - 1]]);
      setUndoArray((pre) => {
        const lastElement = pre[pre.length - 1];
        if (lastElement && lastElement.tool) {
          setSelectedImage((prevState) => ({
            ...prevState,
            tools: {
              ...prevState.tools,
              [lastElement.tool]: true,
            },
          }));
        }

        return pre.slice(0, -1);
      });
    }
  };

  // useEffect(() => {
  //   if (magickErase && selectedImage.url) {
  //     // drawImageOnCanvas(selectedImage?.url)
  //   }
  // }, [magickErase, selectedImage]);

  const [drawing, setDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [linesHistory, setLinesHistory] = useState([]);
  const [mode, setMode] = useState("pen");
  // const [scale, setScale] = useState(1);
  const imgRef = useRef(null);

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [brushSize, setBrushSize] = useState(5);
  // const [canvas, setCanvas] = useState(null);
  const stageRef = useRef(null);

  let temp;

  if (!modifidImageArray.length) {
    temp = selectedImage.baseUrl;
  } else {
    temp = modifidImageArray[modifidImageArray.length - 1]?.url;
  }

  const [img, status] = useImage(temp);
  const handleMouseDown = () => {
    setDrawing(true);
    const pos = stageRef.current.getPointerPosition();
    setLinesHistory([...linesHistory, lines]);

    setLines([...lines, { mode, points: [pos.x, pos.y] }]);
  };

  // useEffect(() => {
  //   if (status === "loaded") {
  //     setImageWidth(img.width);
  //     setImageHeight(img.height);
  //   }
  // }, [img, status]);

  const [bgColor, setBgColor] = useState("transparent");

  const [scale, setScale] = useState(1);

  // canvs
  const outerDivRef = useRef(null);

  const canvasRef = useRef(null);
  // const canvasInstanceRef  = useRef(null);
  // let canvasInstance
  const [selectedImaged, setDownloadImage] = useState(null);
  let canvasInstance;
  // let selectedImaged = null;

  const getBase64FromUrl = async (url: string) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };
  useEffect(() => {
    const canvasInstanceRef = new fabric.Canvas(canvasRef.current, {
      width: outerDivRef.current.clientWidth,
      height: outerDivRef.current.clientHeight,
    });

    // Allow dropping of images onto the canvas
    canvasInstanceRef.on("drop", function (options) {
      const e = options.e;

      const img = new Image();
      img.src = e.dataTransfer.getData("text");

      img.onload = function () {
        const fabricImg = new fabric.Image(img, {
          left: e.layerX,
          top: e.layerY,
          angle: 0,
          opacity: 1,
          selectable: true,
          hasControls: true,
          lockMovementX: false,
          lockMovementY: false,
        });
        fabricImg.scaleToWidth(200);
        fabricImg.setControlVisible("mtr", true); // This allows for rotation
        canvasInstanceRef.add(fabricImg).renderAll();
        canvasInstanceRef.setActiveObject(fabricImg);
        fabricImg.set("selectable", true);

        // const tempCanvas = document.createElement('canvas');
        // tempCanvas.width = img.width;
        // tempCanvas.height = img.height;
        // const ctx = tempCanvas.getContext('2d');
        // ctx.drawImage(img, 0, 0);
        // const base64URL = tempCanvas.toDataURL("image/png");

        // // Now, base64URL contains the Base64 URL representation of the image.
        // // You can store it, send it somewhere, or log it
        // console.log(base64URL);




      };

      e.preventDefault();
    });
    // When a user clicks on an image on the canvas
    canvasInstanceRef.on("mouse:down", function (options) {
      if (options.target && options.target.type === "image") {
        const selectedObject = options.target._element.src;

        setDownloadImage(selectedObject);
      }
    });
    canvasInstanceRef.on("object:selected", function (event) {
      console.log("Object selected:", event.target);
    });

    // const bringToFrontBtn = document.getElementById("bringToFrontBtn");
    // const sendToBackBtn = document.getElementById("sendToBackBtn");
    // const add = document.getElementById("asdd");

    // sendToBackBtn.addEventListener("click", () => {
    //   const activeObject = canvasInstanceRef.getActiveObject();
    //   if (activeObject) {
    //     activeObject.sendToBack();
    //     canvasInstanceRef.renderAll();
    //   }
    // });

    // ractanghlw
    const downloadRect = new fabric.Rect({
      left: 450,
      top: 120,
      width: 400,
      height: 360,
      fill: "rgba(249, 208, 13, 0.23)",
      selectable: false,
    });

    const downloadText = new fabric.Text("Download", {
      left: 110 + 75, // center of the rectangle
      top: 210 + 25, // center of the rectangle
      fontSize: 20,
      originX: "center",
      originY: "center",
      selectable: false,
    });

    canvasInstanceRef.add(downloadRect);

    downloadRect.on("mousedown", function () {
      // canvasInstanceRef.add(downloadText);
      const originalFillColor = downloadRect.fill;

      // Make the rectangle background transparent
      downloadRect.set("fill", "transparent");
      canvasInstanceRef.renderAll();

      const dataURL = canvasInstanceRef.toDataURL({
        format: "png",
        left: downloadRect.left,
        top: downloadRect.top,
        width: downloadRect.width,
        height: downloadRect.height,
      });
      setDownloadImage(dataURL);

      // Reset the rectangle's fill color
      downloadRect.set("fill", originalFillColor);
      canvasInstanceRef.renderAll(); // Refresh canvas to revert the change
    });

    // Adding the Image Generator Rectangle
    const imageGenRect = new fabric.Rect({
      left: 30,
      top: 130,
      width: 400,
      height: 350,
      fill: "transparent",
      selectable: false,
      stroke: "rgba(249, 208, 13, 1)", // border color of the rectangle
      strokeWidth: 1,
    });

    const imageGenText = new fabric.Text("Add Image", {
      left: 100 + 75, // center of the rectangle
      top: 270 + 25, // center of the rectangle
      fontSize: 20,
      originX: "center",
      originY: "center",
      selectable: false,
    });

    // add.addEventListener("click", async () => {
    //   fabric.Image.fromURL(
    //     await getBase64FromUrl(
    //       "https://image.imgcreator.ai/ImgCreator/c3b7fbf516f74638820f53c25f40c744/hq/ae988912-f0b0-11ed-988f-0242ac110002_0.webp"
    //     ),
    //     function (img) {
    //       // Set the image's dimensions
    //       img.scaleToWidth(downloadRect.width);
    //       // img.scaleToHeight(150);
    //       // Scale the image to have the same width and height as the rectangle
    //       const scaleX = downloadRect.width / img.width;
    //       const scaleY = downloadRect.height / img.height;

    //       // Position the image to be in the center of the rectangle
    //       img.set({
    //         left: downloadRect.left,
    //         top: downloadRect.top,
    //         scaleX: scaleX,
    //         scaleY: scaleY,
    //       });

    //       canvasInstanceRef.add(img);
    //       canvasInstanceRef.renderAll();
    //     }
    //   );
    // });

    // const deleteBtn = document.getElementById("deleteBtn");

// deleteBtn.addEventListener("click", () => {
//   const activeObject = canvasInstanceRef.getActiveObject();

//   if (activeObject) {
//     canvasInstanceRef.remove(activeObject);
//     canvasInstanceRef.renderAll();
//   }
// });

document.addEventListener("keydown", (e) => {
  // Check if the pressed key is 'Delete' (code: 46) or 'Backspace' (code: 8) for wider compatibility
  if (e.keyCode === 46 || e.keyCode === 8) {
      const activeObject = canvasInstanceRef.getActiveObject();

      if (activeObject) {
          canvasInstanceRef.remove(activeObject);
          canvasInstanceRef.renderAll();
      }

      // Prevent the default behavior of the backspace key (going back in browser history)
      if (e.keyCode === 8) {
          e.preventDefault();
      }
  }
});


    // bringToFrontBtn.addEventListener("click", () => {
    //   const activeObject = canvasInstanceRef.getActiveObject();
    //   console.log(activeObject, "dfdsf");
    //   if (activeObject) {
    //     activeObject.bringToFront();
    //     canvasInstanceRef.renderAll();
    //   }
    // });
    canvasInstanceRef.add(imageGenRect);
    // canvasInstanceRef.add(imageGenText);

    imageGenRect.on("mousedown", function () {
      // Add your logic for generating/adding the image inside this box.
    });

    // Make the canvas accept drops
    canvasInstanceRef.getElement().ondragover = function (e) {
      e.preventDefault();
    };

   
  }, []);

  function downloadCanvasContent() {
    if (selectedImaged) {
      const url = selectedImaged;
      console.log(url);

      saveAs(url, "downloaded-image.png");
    } else {
      alert("No image selected!");
    }
  }

  return (
    <MainPages>
      {/* <Apps /> */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="news"
      >
        <Sidebar />
        <div className="Editor" ref={outerDivRef}>
          <div className="main-privier">
            {modifidImageArray.length > 0 && !magickErase ? (
              <div className="undoBox">
                <div className="undoWrapper">
                  {modifidImageArray.length > 0 ? (
                    <div className="undo" onClick={() => handileUndo()}>
                      <picture>
                        <img
                          width="80"
                          height="80"
                          src="https://img.icons8.com/dotty/80/undo.png"
                          alt="undo"
                        />
                      </picture>
                    </div>
                  ) : null}
                  {undoArray.length > 0 ? (
                    <div className="undo" onClick={() => handilePre()}>
                      <picture>
                        <img
                          width="80"
                          height="80"
                          src="https://img.icons8.com/dotty/80/redo.png"
                          alt="redo"
                        />
                      </picture>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
            {!magickErase ? (
              <div className="tgide">
                <motion.div
                  className="preBox"
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                >
                  <p>Place Your Product Here</p>
                  <div className="imgadd"></div>
                  <p className="center">
                    Step 1: Place your product inside here
                  </p>
                </motion.div>
                {/* {selectedImage?.id > -1 ? ( */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="preBox"
                >
                  <p>Place Your Product Here</p>

                  <div className="imgadd"></div>
                  <p className="center">
                    Step 1: Place your product inside here
                  </p>
                </motion.div>
              </div>
            ) : null}
          </div>
          {/* <div className="overlay">
            <button onClick={downloadCanvasContent}>Download Image</button>
            <button id="bringToFrontBtn">Bring to Front</button>
            <button id="sendToBackBtn">Send to Back</button>
            <button id="asdd">Add</button>
            <button id="deleteBtn">Delete Selected</button>
          </div> */}

          <div
            className="convas-continer"
            // onDrop={handleDrop}
            // onDragOver={(e) => e.preventDefault()}
            // onDrop={onDrop}
            // onDragOver={(e) => e.preventDefault()}
          >
            <canvas ref={canvasRef} />
          </div>
        </div>
      </motion.div>
    </MainPages>
  );
}
const MainPages = styled.div`
  display: block;
  width: 100%;
  min-height: 100vh;
  .news {
    display: flex;
    min-width: 100%;
  }
  .loader {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #29262640;
    font-size: 24px;
    color: #f9d00d;
    z-index: 3;
  }
  .loaderq {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #e6e6e60;
    font-size: 24px;
    color: #f9d00d;
    z-index: 3;
    border-radius: 12px;
  }
  .overlay {
    position: fixed;
    z-index: 999;
    top: 100px;
  }
  .Editor {
    width: 100%;
    min-height: 100%;
  }
  .main-privier {
    padding: 2rem;
    padding-top: ${({ theme }) => theme.paddings.paddingTop};
    width: 100%;
    display: none;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    .main-privier {
    padding: 2rem;
    padding-top: ${({ theme }) => theme.paddings.paddingTopMobile};
    }
    
  `}

  .convas-continer {
    /* border: 1px solid #434343; */
    width: 100%;
    min-height: 100%;
    position: absolute;
    top: 0;
  }

  .tgide {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    .preBox {
      position: relative;
      font-size: 10px;
      font-weight: 500;
      border: 2px solid #f9d00d;
      padding: 1rem;
      min-height: 350px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .close {
        position: absolute;
        right: 20px;
        top: 10px;
        font-size: 18px;
        cursor: pointer;
      }

      .imgadd {
        margin: 10px 0;
        width: 100%;
        max-height: 250px;
      }
      .more {
        padding: 0 50px;
        width: 100%;
        height: 100%;
        position: relative;
        .file {
          position: absolute;
          height: 100%;
          width: 100%;
          left: 0;
        }
      }
      picture {
        width: 100%;
        height: 100%;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .center {
        text-align: center;
      }
    }
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
  .tgide {
    display: grid;
    grid-template-columns: 1fr ;
    gap: 20px;

  }

 
  `}

  .undoBox {
    position: absolute;
    bottom: 100px;
    left: 0;
    z-index: 10;
    width: 100%;
    .undoWrapper {
      display: flex;
      gap: 30px;
      justify-content: center;
      width: 100%;

      .undo {
        picture {
        }
        img {
          cursor: pointer;
          width: 50px;
          height: 50px;
        }
      }
    }
  }
  .tgrideOne {
    position: relative !important;
    display: grid;
    grid-template-columns: 1fr;
    .magicPrevie {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 500px;
      width: 100%;

      canvas {
        z-index: 30000;
      }
    }
  }
  .tools {
    display: flex;
    gap: 10px;
    justify-content: start;
    align-items: center;
    .btn {
      padding: 10px 30px !important;
      background: transparent;
      border: 1px solid ${({ theme }) => theme.btnPrimary};
      font-weight: 500;
    }
    .button {
      padding: 10px 80px !important;
      /* background: transparent;
      border: 1px solid ${({ theme }) => theme.btnPrimary} */
      width: max-content;
    }
    input[type="range"] {
      /* overflow: hidden; */
      width: 250px;
      height: 15px;
      -webkit-appearance: none;
      background-color: ${({ theme }) => theme.btnPrimary};
      border-radius: 12px;
    }

    input[type="range"]::-webkit-slider-runnable-track {
      height: 20px;
      -webkit-appearance: none;
      color: #13bba4;
      margin-top: -10px;
    }

    input[type="range"]::-webkit-slider-thumb {
      width: 30px;
      -webkit-appearance: none;
      height: 30px;
      border-radius: 50%;
      /* margin-top: -4px; */
      cursor: ew-resize;
      background: #434343;
      /* box-shadow: -80px 0 0 80px #43e5f7; */
    }
    input {
      color: ;
    }
    .activeTool {
      background: ${({ theme }) => theme.btnPrimary};
    }
  }
  .closs {
    position: absolute;
    right: 50px;
    top: 0px;
    font-size: 28px;
    cursor: pointer;
  }

  .sample-canvas {
    border: 1px solid #555;
  }
  .canvas-style {
    width: 100%;
    height: 100%;
    display: block;
  }
`;
