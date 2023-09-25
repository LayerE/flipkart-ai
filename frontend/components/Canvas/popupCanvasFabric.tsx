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
// import {
//   Stage,
//   Layer,
//   Rect,
//   Text,
//   Image as KonvaImage,
//   Line,
// } from "react-konva";
// import Konva from "konva";
import useImage from "use-image";
import { useAppState } from "@/context/app.context";
import { arrayBufferToDataURL, dataURLtoFile } from "@/utils/BufferToDataUrl";

const PopupCanvasFabric = () => {
  const popustageRef = useRef(null);

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

    // stageRef
  } = useAppState();
  const fabric = window.fabric;

  // const [previewLoader, setpreviewLoader] = useState(false);

  // const [imageWidth, setImageWidth] = useState(0);
  // const [imageHeight, setImageHeight] = useState(0);
  // const [drawing, setDrawing] = useState(false);
  // // const [scale, setScale] = useState(1);
  // const imgRef = useRef(null);

  // const [img, status] = useImage(downloadImg);
  // const handleMouseDown = () => {
  //   setDrawing(true);
  //   const pos = stageRef.current.getPointerPosition();
  //   setLinesHistory([...linesHistory, lines]);

  //   setLines([...lines, { mode, points: [pos.x, pos.y] }]);
  // };
  // const handleMouseMove = (e) => {
  //   if (!drawing) return;

  //   const stage = stageRef.current;
  //   const point = stage.getPointerPosition();
  //   let lastLine = lines[lines.length - 1];

  //   if (lastLine) {
  //     lastLine.points = [...lastLine.points, point.x, point.y];
  //     setLines([...lines.slice(0, -1), lastLine]);
  //   }
  // };

  // const handleMouseUp = () => {
  //   setDrawing(false);
  // };

 

 
  // const [scale, setScale] = useState(1);
  // const handleZoomIn = () => {
  //   setScale(scale * 1.2);
  // };
  // const handleZoomOut = () => {
  //   setScale(scale / 1.2);
  // };
  // const undoLastDrawing = () => {
  //   if (linesHistory.length === 0) return;

  //   const lastVersion = linesHistory[linesHistory.length - 1];
  //   setLines(lastVersion);

  //   // Remove the last version from history
  //   setLinesHistory(linesHistory.slice(0, linesHistory.length - 1));
  // };
  // const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  // const handleWheel = (e) => {
  //   e.evt.preventDefault();

  //   const scaleBy = 1.1;
  //   const stage = e.target.getStage();
  //   const oldScale = stage.scaleX();

  //   const pointer = stage.getPointerPosition();

  //   const mousePointTo = {
  //     x: (pointer.x - stage.x()) / oldScale,
  //     y: (pointer.y - stage.y()) / oldScale,
  //   };

  //   const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

  //   setScale(newScale);
  //   setStagePos({
  //     x: pointer.x - mousePointTo.x * newScale,
  //     y: pointer.y - mousePointTo.y * newScale,
  //   });
  // };

  // const closeHanddler = () => {
  //   setLinesHistory([]);
  //   setLines([]);

  //   setIsMagic(false);
  // };



  // 

  const [erasingRemovesErasedObjects, setErasingRemovesErasedObjects] = useState(false);
  const Canva = useRef(null);

  useEffect(() => {
     Canva.current = new fabric.Canvas(popustageRef.current, {
      width: 300,
      height: 300,
      preserveObjectStacking:true
      // selectionLineWidth: 2,
      // transparentCorners: false,
      // originX: "center",
      // originY: "center",
      // renderOnAddRemove: false,
    });
     const Insta = Canva.current

     Insta.freeDrawingBrush = new fabric.PencilBrush(Insta);
     Insta.freeDrawingBrush.width = 35;
     Insta.isDrawingMode = true;
     Insta.freeDrawingBrush = new fabric.SprayBrush(Insta);

     Insta.freeDrawingBrush = new fabric.EraserBrush(Insta);
    // function changeAction(target) {
    //   // ['select', 'erase', 'undo', 'draw', 'spray'].forEach(action => {
    //   //   const t = document.getElementById(action);
    //   //   t.classList.remove('active');
    //   // });

    //   // if (typeof target === 'string') target = document.getElementById(target);
    //   // target.classList.add('active');
    //   switch (target.id) {
    //     case "select":
    //       canvas.isDrawingMode = false;
    //       break;
    //     case "erase":
    //       canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
    //       canvas.freeDrawingBrush.width = 10;
    //       canvas.isDrawingMode = true;
    //       break;
    //     case "undo":
    //       canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
    //       canvas.freeDrawingBrush.width = 10;
    //       canvas.freeDrawingBrush.inverted = true;
    //       canvas.isDrawingMode = true;
    //       break;
    //     case "draw":
    //       canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    //       canvas.freeDrawingBrush.width = 35;
    //       canvas.isDrawingMode = true;
    //       break;
    //     case "spray":
    //       canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
    //       canvas.freeDrawingBrush.width = 35;
    //       canvas.isDrawingMode = true;
    //       break;
    //     default:
    //       break;
    //   }
    // }

    function init() {
      Insta.setOverlayColor("rgba(0,0,255,0.4)", undefined, { erasable: false });
    
      const t = new fabric.Triangle({
        top: 300,
        left: 210,
        width: 100,
        height: 100,
        fill: "blue",
        erasable: false,
      });
    
      Insta.add(
        new fabric.Rect({
          top: 50,
          left: 100,
          width: 50,
          height: 50,
          fill: "#f55",
          opacity: 0.8,
        }),
        new fabric.Rect({
          top: 50,
          left: 150,
          width: 50,
          height: 50,
          fill: "#f55",
          opacity: 0.8,
        }),
        new fabric.Group(
          [
            t,
            new fabric.Circle({ top: 140, left: 230, radius: 75, fill: "green" }),
          ],
          { erasable: "deep" }
        )
      );

      
    
      fabric.Image.fromURL(
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPYvs5arsp3PA8-XCi7bsP-Ms1eiikfBZzvQ&usqp=CAU',
        function (img) {
          img.scaleToWidth(480);
          img.clone((img) => {
            Insta.add(
              img
                .set({
                  left: 400,
                  top: 350,
                  clipPath: new fabric.Circle({
                    radius: 200,
                    originX: "center",
                    originY: "center",
                  }),
                  angle: 30,
                })
                .scale(0.25)
            );
            Insta.renderAll();
          });
    
          img.set({ opacity: 0.7 });
          function animate() {
            img.animate("opacity", img.get("opacity") === 0.7 ? 0.4 : 0.7, {
              duration: 1000,
              onChange: Insta.renderAll.bind(Insta),
              onComplete: animate,
            });
          }
          // animate();
          Insta.setBackgroundImage(img);
          img.set({ erasable: false });
          // Insta.on("erasing:end", ({ targets, drawables }) => {
          //   var output = document.getElementById("output");
          //   output.innerHTML = JSON.stringify(
          //     {
          //       objects: targets.map((t) => t.type),
          //       drawables: Object.keys(drawables),
          //     },
          //     null,
          //     '\t'
          //   );
          //   if (erasingRemovesErasedObjects) {
          //     targets.forEach((obj) =>
          //       obj.group?.removeWithUpdate(obj) || Insta.remove(obj)
          //     );
          //   }
          // });
          Insta.renderAll();
        },
        { crossOrigin: "anonymous" }
      );
    
      function animate() {
        try {
          canvas
            .item(0)
            .animate(
              "top",
              Insta.item(0).get("top") === 500 ? "100" : "500",
              {
                duration: 1000,
                onChange: Insta.renderAll.bind(Insta),
                onComplete: animate,
              }
            );
        } catch (error) {
          setTimeout(animate, 500);
        }
      }
    
      animate();
    }
    
    init();
    // changeAction('erase');

    return () => {
      // Cleanup code if needed
    };
  }, []);

  const setDrawableErasableProp = (drawable, value) => {
    const canvas = Canva.current

    canvas.get(drawable)?.set({ erasable: value });
    // changeAction('erase');
  };

  const setBgImageErasableProp = (input) =>
    setDrawableErasableProp("backgroundImage", input.checked);

  const downloadImage = () => {
    // ... (downloadImage code)
  };
  const er = ()=>{
    const canvas = Canva.current


    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
          canvas.freeDrawingBrush.width = 35;
          canvas.isDrawingMode = true;
    // const daa = new fabric.EraserBrush(canvas);

    // canvas.freeDrawingBrush = daa 
          // canvas.freeDrawingBrush.width = 10;
          // canvas.isDrawingMode = true;
    
  }

  const downloadSVG = () => {
    // ... (downloadSVG code)
  };

  const toJSON = async () => {
    // ... (toJSON code)
  };
  return (
    <Wrapper>
    

 
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
          {/* {previewLoader ? <div className="loaderq">Loading...</div> : null} */}
         
          <div>
        <div className="controls">
        <button id="select" type="button" onClick={(e)=> er()}>select</button>
    {/* <button id="erase" type="button" onClick={(e)=> changeAction(e)}>erase</button>
    <button id="undo" type="button" onClick={(e)=> changeAction(e)}>undo erasing</button>
    <button id="draw" type="button" onClick={(e)=> changeAction(e)}>draw</button>
    <button id="spray" type="button" onClick={(e)=> changeAction(e)}>spray</button> */}
        </div>
        <div>
          {/* Your checkboxes and event handlers */}
        </div>
        <div>
          {/* Your buttons for toJSON, downloadImage, downloadSVG */}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div>
            <canvas id="c" ref={popustageRef}></canvas>
          </div>
          <div style={{ margin: '0 1rem' }}>
            <code>erasing:end</code>
            <code id="output">N/A</code>
          </div>
        </div>
      </div>
        </div>
      </div>
     
    </Wrapper>
  );
};

export default PopupCanvasFabric;
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
