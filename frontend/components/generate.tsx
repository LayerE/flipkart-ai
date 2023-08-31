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

import Apps from "@/components/Canvas";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const inter = Inter({ subsets: ["latin"] });
const MainPage = styled.div`
  .new {
    display: flex;
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

  .main-privier {
    /* position: relative; */
    padding: 2rem;
    padding-top: ${({ theme }) => theme.paddings.paddingTop};
    width: 100%;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    .main-privier {
    padding: 2rem;
    padding-top: ${({ theme }) => theme.paddings.paddingTopMobile};
    }

    
  `}

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
          /* max-width: max-content !importent; */
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
    /* left:0; */
    display: grid;
    grid-template-columns: 1fr;
    /* gap: 20px; */
    /* background: red; */
    /* height: 100%; */
    /* position: relative; */
    .magicPrevie {
      /* position: relative; */
      display: flex;
      justify-content: center;
      align-items: center;
      height: 500px;
      width: 100%;

      canvas {
        /* position: absolute; */
        /* position: relative; */
        /* top: 100px; */

        /* background: #4444; */

        z-index: 30000;
        /* top: 0; */
        /* width: 500px;
        height: 500px; */
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
`;

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

  useEffect(() => {
    console.log("new render");
  }, [previewLoader, modifidImage, modifidImageArray]);
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

  useEffect(() => {
    if (magickErase && selectedImage.url) {
      // drawImageOnCanvas(selectedImage?.url)
    }
  }, [magickErase, selectedImage]);

  const [drawing, setDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [linesHistory, setLinesHistory] = useState([]);
  const [mode, setMode] = useState("pen");
  // const [scale, setScale] = useState(1);
  const imgRef = useRef(null);

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [brushSize, setBrushSize] = useState(5);

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

  useEffect(() => {
    if (status === "loaded") {
      setImageWidth(img.width);
      setImageHeight(img.height);
    }
  }, [img, status]);

  const handleMouseMove = (e) => {
    if (!drawing) return;

    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];

    if (lastLine) {
      lastLine.points = [...lastLine.points, point.x, point.y];
      setLines([...lines.slice(0, -1), lastLine]);
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const [bgColor, setBgColor] = useState("transparent");

  const handleDownload = () => {
    const stage = stageRef.current;

    // Update the coloring
    stage.findOne("Image").hide();
    setBgColor("black"); // Setting the background color using state

    stage.find("Line").forEach((line) => {
      line.stroke("white");
    });
    setBgColor("black");

    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = stage.toDataURL({ pixelRatio: 3 });
    link.click();

    // Reset the coloring (or refresh the component to reset)
    stage.findOne("Image").show();
    setBgColor("black"); // Resetting the background color
    stage.find("Line").forEach((line) => {
      line.stroke("white");
    });
  };
  const saveCanvasToBlobURL = () => {
    const canvas = stageRef.current;
    canvas.findOne("Image").hide();
    const base = canvas.toDataURL();
    canvas.findOne("Image").show();

    return base;
  };
  const saveImage = () => {
    const stage = stageRef.current;

    const dataURL = stage.toDataURL();

    return dataURL;
  };

  const HandleInpainting = async () => {
    setPriviewLoader(true);

    let temp;
    if (!modifidImageArray.length) {
      temp = selectedImage.baseUrl;
    } else {
      temp = modifidImageArray[modifidImageArray.length - 1]?.url;
    }
    setInpainting(true);
    const mask = await saveCanvasToBlobURL();
    const ogimage = await saveImage();
    setLines([]);

    const modifiedData = await Inpainting(ogimage, "hero.png", mask);

    if (modifiedData) {
      setModifidImageArray((pre) => [
        ...pre,
        { url: modifiedData, tool: "magic" },
      ]);
      setUndoArray([]);

      setSelectedImage((prevState) => ({
        ...prevState,
        tools: {
          ...prevState.tools,
          magic: true,
        },
      }));
    }

    setPriviewLoader(false);
  };
  const [scale, setScale] = useState(1);
  const handleZoomIn = () => {
    setScale(scale * 1.2);
  };
  const handleZoomOut = () => {
    setScale(scale / 1.2);
  };
  const undoLastDrawing = () => {
    if (linesHistory.length === 0) return;

    const lastVersion = linesHistory[linesHistory.length - 1];
    setLines(lastVersion);

    // Remove the last version from history
    setLinesHistory(linesHistory.slice(0, linesHistory.length - 1));
  };
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();

    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setScale(newScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };
  // canvs

  return (
    <MainPage>
      {/* <Apps /> */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="new"
      >
        <Sidebar />
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
                {selectedImage?.url ? (
                  <div
                    className="close"
                    onClick={() => {
                      setSelectedImage({});
                      setFile(null);
                    }}
                  >
                    X
                  </div>
                ) : null}
                <p>Place Your Product Here</p>
                <div className="imgadd">
                  {selectedImage?.url ? (
                    <>
                      {" "}
                      <div className="file"></div>
                      <picture>
                        <img
                          src={
                            selectedImage?.url
                              ? selectedImage?.url
                              : assets.images.dotbox
                          }
                          alt=""
                        />
                      </picture>
                    </>
                  ) : (
                    <div className="more">
                      <div className="file">
                        <FileUpload />
                      </div>
                      <NextImage src={assets.images.dotbox} alt=""></NextImage>
                    </div>
                  )}
                </div>
                <p className="center">Step 1: Place your product inside here</p>
              </motion.div>
              {selectedImage?.id > -1 ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="preBox"
                >
                  <p>Place Your Product Here</p>
                  {previewLoader ? (
                    <div className="loader">Loading...</div>
                  ) : null}
                  <div className="imgadd">
                    {modifidImageArray.length ? (
                      <img
                        src={
                          modifidImageArray[modifidImageArray.length - 1].url
                        }
                        alt=""
                      />
                    ) : (
                      <div className="more">
                        <NextImage
                          src={assets.images.dotbox}
                          alt=""
                        ></NextImage>
                      </div>
                    )}
                  </div>
                  <p className="center">
                    Step 1: Place your product inside here
                  </p>
                </motion.div>
              ) : null}
            </div>
          ) : null}

          {magickErase ? (
            <div className="tgrideOne">
              <div className="closs" onClick={() => setMagickErase(false)}>
                X
              </div>
              <div className="tools">
                {/* <button onClick={() => setMode("pen")} className={mode === "pen"? "activeTool": ""}>Pen</button> */}
                {/* <button onClick={() => setMode("eraser")} className={mode === "eraser"? "activeTool": ""}>Eraser</button> */}
                {/* <button onClick={() => handleZoomi()}>Zoom In</button>
                <button onClick={() => handleZoomOut()}>Zoom Out</button> */}
                <input
                  type="range"
                  max={100}
                  min={5}
                  onChange={(e) => setBrushSize(e.target.value)}
                />
                <button className="btn" onClick={undoLastDrawing}>
                  Undo
                </button>
                {/* <button onClick={handleDownload}>Download</button> */}
                <Button className="button" onClick={HandleInpainting}>
                  Erase
                </Button>
              </div>
              <div style={{ margin: "20px" }}>
                {previewLoader ? (
                  <div className="loaderq">Loading...</div>
                ) : null}
                <Stage
                  width={600}
                  height={600}
                  scaleX={scale}
                  scaleY={scale}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  // x={stagePos.x}
                  // y={stagePos.y}
                  // onWheel={handleWheel}
                  ref={stageRef}
                >
                  <Layer>
                    {/* <Rect
                      width={imageWidth}
                      height={imageHeight}
                      fill={bgColor}
                    /> */}
                    <KonvaImage image={img} width={600} height={600} />
                    {lines.map((line, i) => (
                      <Line
                        key={i}
                        points={line.points}
                        stroke={line.mode !== "pen" ? "white" : "white"}
                        strokeWidth={brushSize}
                        tension={0.5}
                        lineCap="round"
                        globalCompositeOperation={
                          line.mode === "pen"
                            ? "source-over"
                            : "destination-out"
                        }
                      />
                    ))}
                  </Layer>
                </Stage>
                {/* <img
                  src="https://preview.redd.it/need-an-npm-package-that-lets-you-create-an-image-mask-v0-12kzpoiivwha1.png?width=512&format=png&auto=webp&s=e19be5fdbd7406757e148f419eca861b7ae7f2dd"
                  alt="hidden"
                  ref={imgRef}
                  style={{ display: "none" }}
                /> */}
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </MainPage>
  );
}
