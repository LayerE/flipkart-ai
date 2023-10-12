import React from "react";
import { styled } from "styled-components";
import {
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  useState,
} from "react";
// import { fabric } from "fabric";
import Button from "../common/Button";
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
import { useAppState } from "@/context/app.context";
import { arrayBufferToDataURL, dataURLtoFile } from "@/utils/BufferToDataUrl";
import { saveAs } from "file-saver";

const PopupCanvas = () => {
  const popucanvasRef = useRef(null);

  const {
    // magickErase,
    // setMagickErase,

    isMagic,
    setIsMagic,
    downloadImg,
    addimgToCanvasGen,
    brushSize,
    setBrushSize,
    linesHistory,
    setLinesHistory,
    lines,
    setLines,
    mode,
    setMode,
    Inpainting,
    stageRef,
    TDMode,
    downloadeImgFormate,
    // HandleInpainting,
    addimgToCanvasSubject,

    // canvasRef
  } = useAppState();

  const [previewLoader, setpreviewLoader] = useState(false);

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [drawing, setDrawing] = useState(false);
  // const [scale, setScale] = useState(1);
  const imgRef = useRef(null);

  
  const [img, status] = useImage(downloadImg, "Anonymous");
  const handleMouseDown = () => {
    setDrawing(true);
    const pos = stageRef.current.getPointerPosition();
    setLinesHistory([...linesHistory, lines]);

    setLines([
      ...lines,
      { mode, points: [pos.x, pos.y], brushSize: brushSize },
    ]);
  };
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

  const closeHanddler = () => {
    setLinesHistory([]);
    setLines([]);

    setIsMagic(false);
  };

  const saveImage = () => {
    const stage = stageRef?.current;

    const dataURL = stage.toDataURL();

    addimgToCanvasSubject(dataURL);
    setLinesHistory([]);
    setLines([]);

    setIsMagic(false);

    // return dataURL;
  };
  const downloadH = () => {
    const stage = stageRef.current;

    const dataURL = stage.toDataURL();

    saveAs(dataURL, `image${Date.now()}.${downloadeImgFormate}`);

    // addimgToCanvasSubject(dataURL);
    setLinesHistory([]);
    setLines([]);

    // setIsMagic(false);

    // return dataURL;
  };

  return (
    <Wrapper>
      {/* <div className="popuCanvas">
        <div className="canvaswrapper">
          <canvas ref={popucanvasRef} />
        </div>
      </div> */}

      {/* {magickErase ? ( */}
      <div className="tgrideOne">
        <div className="clo" onClick={() => closeHanddler()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 30 30"
          >
            <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
          </svg>
        </div>

        <div style={{ margin: "20px" }}>
          {previewLoader ? <div className="loaderq">Loading...</div> : null}
          <Stage
            width={300}
            height={300}
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
              <KonvaImage image={img} width={300} height={300} />
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.mode !== "pen" ? "white" : "white"}
                  strokeWidth={line.brushSize}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation={
                    line.mode === "pen" ? "destination-out" : "destination-out"
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
      <div className="bvtns">
        {TDMode ? (
          <Button
            onClick={() => downloadH()}
            //   disabled={linesHistory.length === 0 ? true : false}
          >
            Download
          </Button>
        ) : (
          <Button
            onClick={() => saveImage()}
            //   disabled={linesHistory.length === 0 ? true : false}
          >
            Done
          </Button>
        )}

        {/* <Button
                      onClick={() => saveImage()}
                    //   disabled={linesHistory.length === 0 ? true : false}
                    >
                     Close
                    </Button> */}
      </div>
      {/* ) : null} */}
    </Wrapper>
  );
};

export default PopupCanvas;
const Wrapper = styled.div`
  .bvtns {
    display: flex;
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
  background-color: #fff;
  .tgrideOne {
    position: relative !important;
    /* left:0; */

    display: grid;
    grid-template-columns: 1fr;
    /* gap: 20px; */
    background: rgba(249, 208, 13, 0.23);
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
  .clo {
    position: absolute;
    right: -20px;
    top: -20px;
    font-size: 28px;
    cursor: pointer;
    svg {
      width: 20px;
    }
  }
`;
