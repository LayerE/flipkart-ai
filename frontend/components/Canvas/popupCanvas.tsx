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
    HandleInpainting

    // canvasRef
  } = useAppState();

  const [previewLoader, setpreviewLoader] = useState(false);

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [drawing, setDrawing] = useState(false);
  // const [scale, setScale] = useState(1);
  const imgRef = useRef(null);

  let temp =
    "data:image/jpeg;base64,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";

  const [img, status] = useImage(downloadImg);
  const handleMouseDown = () => {
    setDrawing(true);
    const pos = stageRef.current.getPointerPosition();
    setLinesHistory([...linesHistory, lines]);

    setLines([...lines, { mode, points: [pos.x, pos.y] }]);
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
        {/* <div className="tools">
          <button
            onClick={() => setMode("pen")}
            className={mode === "pen" ? "activeTool" : ""}
          >
            Pen
          </button>
          <button
            onClick={() => setMode("eraser")}
            className={mode === "eraser" ? "activeTool" : ""}
          >
            Eraser
          </button>

          <Button className="button" onClick={HandleInpainting}>
            Erase
          </Button>
        </div> */}
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
                  strokeWidth={brushSize}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation={
                    line.mode === "pen" ? "source-over" : "destination-out"
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
      {/* ) : null} */}
    </Wrapper>
  );
};

export default PopupCanvas;
const Wrapper = styled.div`
border: 1px solid black;
  display: flex;
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
    svg{
        width: 20px;
    }
  }
`;
