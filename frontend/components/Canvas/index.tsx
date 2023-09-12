// use client

import React, { useRef, useState } from "react";
import { useAppState } from "@/context/app.context";
import { useEffect, useLayoutEffect, useCallback } from "react";
import { fabric } from "fabric";
import { styled } from "styled-components";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import Loader from "../Loader";

export default function CanvasBox({ proid, userId }) {
  const { query, isReady } = useRouter();
  const id = (query.id as string[]) || [];
  const {
    setSelectedImg,
    canvasInstance,
    getBase64FromUrl,
    activeTab,
    setActiveTab,
    setSelectedColoreMode,
    outerDivRef,
    downloadImg,
    setDownloadImg,
    // newEditorBox
    editorBox,
    canvasHistoryRef,
    currentStep,
    setCurrentStep,
    RegenerateImageHandeler,
    GetProjextById,
    setEditorBox,
    bringImageToFront,
    sendImageToBack,
    PosisionbtnRef,
    regenerateRef,
    setRegeneratePopup,
    btnVisible,
    previewBox,
    canvasHistory,
    currentCanvasIndex,
    generateBox,
    GetProjexts,
    generateImageHandeler,
    SaveProjexts,
    project,
    loadercarna,
    setloadercarna,
    saveCanvasToDatabase,
    setRegenratedImgsJobid,
    genRect, setgenRect

    // canvasRef
  } = useAppState();
  let newEditorBox 
  // const [loadercarna, setloadercarna] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  /* eslint-disable */

  useEffect(() => {
    // if (!canvasInstance.current) {
    // console.log("canvas",canvasInstance.current)
    canvasInstance.current = new fabric.Canvas(canvasRef?.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      // transparentCorners: false,
      originX: "center",
      originY: "center",
      // renderOnAddRemove: false,
    });

  


    // setCanvas( new fabric.Canvas(canvasRef?.current, {
    //   width: window.innerWidth,
    //   height: window.innerHeight,
    //   // transparentCorners: false,
    //   originX: "center",
    //   originY: "center",
    //   renderOnAddRemove: false,
    // }));
    // canvasHistory.current.push(canvasInstance.current.toDatalessJSON());
    // currentCanvasIndex.current++;
    // }

    const canvasInstanceRef = canvasInstance.current;

     newEditorBox = new fabric.Rect({
      left: 30,
      top: 120,
      width: 380,
      height: 380,
      selectable: false,
      fill: "transparent",
      stroke: "#0df977",
      strokeWidth: 2,
    });

    setgenRect(newEditorBox)

    // genBox.style.width =newEditorBox.width + "px";
    // genBox.style.height =newEditorBox.height + "px";
    // genBox.style.top =newEditorBox.y + "px";

    // genBox.style.left =newEditorBox.x + "px";

    canvasInstanceRef.add(newEditorBox).renderAll();
    fabric.Object.prototype.transparentCorners = false;
    // fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
    // Add a custom method to the Fabric canvas prototype

    fabric.Canvas.prototype.getAbsoluteCoords = function (object) {
      return {
        left: object.left ,
        top: object.top 
      };
    };

    // getCanvs(project);

    // Resize canvas when the window is resized
    // window.addEventListener("resize", () => {
    //   canvasInstanceRef?.setDimensions({
    //     width: window?.innerWidth,
    //     height: window?.innerHeight,
    //   });
    // });

    return () => {
      // saveCanvasToDatabase()
      canvasInstanceRef?.dispose();
      // setTimeout(() => {

      // }, 300);
    };
  }, [isReady, canvasInstance]);

  // Load canvas data from the database when the component mounts
  // useEffect(() => {
  //   // Fetch canvas data from your API and load it into the canvas
  //   const canvasInstanceRef = canvasInstance.current;
  //   setloadercarna(true);
  //   if (isReady && userId) {
  //     axios
  //       .post(`/api/canvasdata`, {
  //         user_id: userId,
  //         project_id: proid,
  //       })
  //       .then((response) => {
  //         console.log(response);
  //         console.log(
  //           response?.data?.data[response?.data?.data?.length - 1]?.canvasdata,
  //           "adsfnbdhjskgvyuifdsgh"
  //         );
  //         if (canvasInstanceRef) {
  //           canvasInstanceRef.loadFromJSON(
  //             JSON.stringify(
  //               response?.data?.data[response?.data?.data?.length - 1]
  //                 .canvasdata
  //             ),
  //             canvasInstanceRef.requestRenderAll.bind(canvasInstanceRef)
  //           );
  //           setloadercarna(false);
  //           // canvasInstanceRef.loadFromJSON(savedCanvasDataLocal, () => {
  //           //   canvasInstanceRef.renderAll();
  //           // });
  //         }
  //       })

  //       .catch((error) => {
  //         console.error(error);
  //         setloadercarna(false);

  //         return error;
  //       });

  //     // return () => {

  //     //   saveCanvasToDatabase()
  //     // };
  //   }
  // }, [isReady, userId]);

  useEffect(() => {
    if (canvasInstance?.current) {
      const canvasInstanceRef = canvasInstance?.current;

      const btn = PosisionbtnRef.current;
      const rebtn = regenerateRef.current;
      const genBox = generateBox.current;
      const preBox = previewBox.current;

      // When a user clicks on an image on the canvas
      canvasInstanceRef.on("mouse:down", function (options) {
        if (options.target && options.target.type === "image") {
          let selectedObject;
          if (options.target._element instanceof Image) {
            selectedObject = options.target._element.src;
          } else if (options.target._element instanceof HTMLCanvasElement) {
            selectedObject = options.target._element.toDataURL();
          }

          if (selectedObject) {
            setDownloadImg(selectedObject);
            setSelectedColoreMode("None");
          }
        }
      });

      // Create the newEditorBox when the component mounts
  
      const EditorBoxText = new fabric.Text("Place Your Product Here", {
        left: newEditorBox.left + 20, // center of the rectangle
        top: newEditorBox.top + 20, // center of the rectangle
        fontSize: 16,
        // originX: "center",
        // originY: "center",
        selectable: false,
        fill: "rgba(0, 0, 0, 1)",
      });
      canvasInstanceRef.add(EditorBoxText);
      const imageGenRect = new fabric.Rect({
        left: 400,
        top: 120,
        width: 380,
        height: 380,
        selectable: false,
        // fill: "rgba(249, 208, 13, 0.23)",
        // fill: "transparent",
      });

      const imageGenText = new fabric.Text("Generated image will appear here", {
        left: 450 + 20,
        top: 200 + 20,
        fontSize: 16,
        // originX: "center",
        // originY: "center",

        selectable: false, // Make it non-selectable
        evented: false, // Make it non-selectable
        hasControls: false,
        fill: "rgba(0, 0, 0, 1)",
      });

      genBox.addEventListener("click", (e) => {
        // Check if the pressed key is 'Delete' (code: 46) or 'Backspace' (code: 8) for wider compatibility
        const dataURL = canvasInstanceRef.toDataURL({
          format: "png",
          left: parseInt(genBox.style.left),
          top: parseInt(genBox.style.top),
          width: parseInt(genBox.style.width),
          height: parseInt(genBox.style.height),
        });
        // setDownloadImg(dataURL);
        setDownloadImg(dataURL);
      });
      newEditorBox.on("mousedown", function () {
        const originalStrokeColor = newEditorBox.stroke;
        const originalStrokeWidth = newEditorBox.strokeWidth;

        // Make the rectangle stroke transparent
        newEditorBox.set("stroke", "transparent");
        newEditorBox.set("strokeWidth", 0);
        canvasInstanceRef.renderAll();
        console.log(parseInt(genBox.style.left), genBox.style.top);

        const dataURL = canvasInstanceRef.toDataURL({
          format: "png",
          left: parseInt(genBox.style.left),
          top: parseInt(genBox.style.top),
          width: parseInt(genBox.style.width),
          height: parseInt(genBox.style.height),
        });
        // setDownloadImg(dataURL);
        setDownloadImg(dataURL);
        setSelectedImg(dataURL);
        // Reset the rectangle's stroke properties
        newEditorBox.set("stroke", originalStrokeColor);
        newEditorBox.set("strokeWidth", originalStrokeWidth);
        canvasInstanceRef.renderAll();
      });

      //   // Add your logic for generating/adding the image inside this box.
      // });
      canvasInstanceRef.on("object:moving", function (event) {
        const movedObject = event.target;

        const e = event.e;
        if (movedObject.category === "subject") {
          if (
            e.layerX >= newEditorBox.left &&
            e.layerX <= newEditorBox.left + newEditorBox.width &&
            e.layerY >= newEditorBox.top &&
            e.layerY <= newEditorBox.top + newEditorBox.height
          ) {
            // Remove the EditorBoxText if the image is inside the newEditorBox
            canvasInstanceRef.remove(EditorBoxText).renderAll();
          }
        }
      });

      // Set the newEditorBox in the global context
      setEditorBox(newEditorBox);
      canvasInstanceRef.on("object:selected", function (event) {
        console.log("Object selected:", event.target);
        const selectedObject = event.target;
        if (selectedObject === newEditorBox) {
          // Hide the border by setting stroke to transparent
          selectedObject.set("stroke", "transparent");
          selectedObject.set("strokeWidth", 0);
          canvasInstanceRef.renderAll();
        }
      });

      document.addEventListener("keydown", (e) => {
        // Check if the pressed key is 'Delete' (code: 46) or 'Backspace' (code: 8) for wider compatibility
        if (e.keyCode === 46 || e.keyCode === 8) {
          // Check if the focus is NOT on an input or textarea
          if (
            document.activeElement.tagName !== "INPUT" &&
            document.activeElement.tagName !== "TEXTAREA"
          ) {
            const activeObject = canvasInstanceRef?.getActiveObject();
            if (activeObject) {
              canvasInstanceRef?.remove(activeObject);
              canvasInstanceRef?.renderAll();
            }
          }
        }
      });
      canvasInstanceRef.on("selection:created", () => {
        btn.style.display = "block";
        rebtn.style.display = "block";
      });
      canvasInstanceRef.on("selection:cleared", function () {
        setDownloadImg(null);
        btn.style.display = "none";
        rebtn.style.display = "none";

        console.log(activeTab);
        if (activeTab === 5) {
          setActiveTab(1);
        }
      });
      // Zoom and Pan event handlers

      // canvasInstanceRef.on("mouse:wheel", (opt) => {
      //   const delta = opt.e.deltaY;
      //   let zoom = canvasInstanceRef.getZoom();
      //   zoom *= 0.999 ** delta;
      //   if (zoom > 20) zoom = 20;
      //   if (zoom < 0.01) zoom = 0.01;
      //   setCanvasZoom(zoom);
      //   canvasInstanceRef.zoomToPoint(
      //     { x: canvasInstanceRef.width / 2, y: canvasInstanceRef.height / 2 },
      //     zoom
      //   );
      //   // setCanvasPosition({
      //   //   x: canvasInstanceRef.viewportTransform[4],
      //   //   y: canvasInstanceRef.viewportTransform[5],
      //   // });
      //   opt.e.preventDefault();
      //   opt.e.stopPropagation();
      // });
      canvasInstanceRef.on("mouse:wheel", function (opt) {
        var delta = opt.e.deltaY;
        var zoom = canvasInstanceRef.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        canvasInstanceRef.zoomToPoint(
          { x: opt.e.offsetX, y: opt.e.offsetY },
          zoom
        );

        // genBox.style.transform = `scale(${zoom})`;
        // genBox.style.transform = `scale(${zoom}) translate(${newEditorBox.x}px, ${newEditorBox.y}px)`;

        // Get the coordinates of the inner rectangle
        var innerRectCoords = newEditorBox.getBoundingRect();

        // Update the position and zoom of the outer div

        // genBox.style.transform = `scale(${zoom})`;
        // genBox.style.left = `${innerRectCoords.left * zoom}px`;
        // genBox.style.top = `${innerRectCoords.top * zoom}px`;

        // Calculate the adjusted position for the outer div
        // var canvasContainer = document.getElementById('canvas-container');
        var canvasScrollLeft = genBox.scrollLeft;
        var canvasScrollTop = genBox.scrollTop;
        var adjustedLeft = (innerRectCoords.left - canvasScrollLeft) * zoom;
        var adjustedLeftPr =
          (innerRectCoords.left + 400 - canvasScrollLeft) * zoom;

        var adjustedTop = (innerRectCoords.top - canvasScrollTop) * zoom;

        // Update the position and zoom of the outer div
        preBox.style.transform = `scale(${zoom})`;
        genBox.style.transform = `scale(${zoom})`;
        genBox.style.left = `${adjustedLeft}px`;
        genBox.style.top = `${adjustedTop}px`;
        preBox.style.top = `${adjustedTop}px`;
        preBox.style.left = `${adjustedLeftPr}px`;

        opt.e.preventDefault();
        opt.e.stopPropagation();
      });

       // Handle mouse wheel scrolling
       canvasInstanceRef.on('mouse:wheel', (event) => {
      const delta = event.e.deltaY;
      const zoom = canvasInstanceRef.getZoom();
      const zoomFactor = 1.1; // Adjust the zoom factor as needed

      if (delta > 0) {
        canvasInstanceRef.zoomToPoint(
          {
            x: event.e.offsetX,
            y: event.e.offsetY,
          },
          zoom / zoomFactor
        );
      } else {
        canvasInstanceRef.zoomToPoint(
          {
            x: event.e.offsetX,
            y: event.e.offsetY,
          },
          zoom * zoomFactor
        );
      }

      event.e.preventDefault();
      canvasInstanceRef.renderAll();
    });
    }
  }, [canvasInstance]);

  // const saveCanvasToDatabase = () => {
  //   const canvasData = canvasInstance.current.toJSON();
  //   if (canvasData.objects.length > 1) {
  //     // console.log("sdsdfs,", userId, proid, canvasData, "dsffff");
  //     SaveProjexts(userId, proid, canvasData);
  //   }
  // };

  const saveCanvasDataToLocal = () => {
    // if(isReady){

    // Serialize canvas data to JSON and save it to local storage
    if (!proid === undefined || !proid === " " || !proid === null) {
      const canvasData = JSON.stringify(canvasInstance.current.toJSON());
      SaveProjexts(userId, proid, canvasData);
      localStorage.setItem(proid, canvasData);
    }
  };

  const getCanvs = async (pro) => {
    // Load saved canvas data from local storage
    if (!proid === undefined || !proid === " " || !proid === null) {
      const canvasInstanceRef = canvasInstance.current;
      const savedCanvasDataLocal = localStorage.getItem(proid);
      const savedCanvasDB = project?.canvas;
      console.log(savedCanvasDataLocal, "dfdsf");
      if (savedCanvasDB && !savedCanvasDataLocal) {
        localStorage.setItem(proid, savedCanvasDB);
      }
      if (savedCanvasDataLocal) {
        // console.log(savedCanvas,"dfdfsdgfdgfd")
        canvasInstanceRef.loadFromJSON(savedCanvasDataLocal, () => {
          canvasInstanceRef.renderAll();
        });
      }
    }
  };

  const generationBoxStyle = {
    left: `${30}px`,
    top: `${120}px`,
    width: `${380}px`, // Adjust the width based on canvas zoom
    height: `${380}px`, // Adjust the height based on canvas zoom
  };
  const PreviewBoxStyle = {
    left: `${430}px`,
    top: `${120}px`,
    width: `${380}px`, // Adjust the width based on canvas zoom
    height: `${380}px`, // Adjust the height based on canvas zoom
    backgroundColor: "rgba(249, 208, 13, 0.23)",
  };

  const handelRegenrate = () => {
    if (downloadImg !== null) {
      RegenerateImageHandeler(userId, proid, downloadImg);
      setRegenratedImgsJobid([]);
      setTimeout(() => {
        setRegeneratePopup({ status: true, url: downloadImg });
        console.log("Success", downloadImg);
        setActiveTab(6);
        console.log("sdsfs");
      }, 500);
    }
  };

  return (
    <Wrapper>
      {loadercarna ? <Loader /> : null}
      <div className="convas-continer">
        <div className="generationBox">
          <div
            className="leftbox"
            ref={generateBox}
            style={generationBoxStyle}
          ></div>
          <div
            className="rightbox"
            ref={previewBox}
            style={PreviewBoxStyle}
          ></div>
        </div>
        <div id="inline-btn" ref={PosisionbtnRef}>
          <button className="selectone" onClick={() => bringImageToFront()}>
            Front
          </button>
          <button className="selectone" onClick={() => sendImageToBack()}>
            Back
          </button>
        </div>
        <div
          id="inline-btn"
          className="regenrat"
          ref={regenerateRef}
          // style={{ display: btnVisible ? "block" : "none" }}
          onClick={() => {
            handelRegenrate();
          }}
        >
          <button className="selectone">Regenrate Product</button>
        </div>

        <div className="ss">
          <picture>
            <img
              onClick={() => saveCanvasToDatabase()}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAYFBMVEX///8AAAD4+Pjv7+8aGhoTExOYmJiTk5P09PQICAiQkJD6+vp/f39WVlbGxsaurq5ubm6FhYUnJye8vLwfHx9oaGjR0dHq6urg4OB1dXWkpKS2trY0NDQpKSlNTU1fX19H7sBTAAADJUlEQVR4nO3d224iMRBFUbo7QLhDrkwyM/n/vxwhTR5AUDbUsV1Ee78iFSw5pIliN6MRERERERERERERERERxWvRn29xy7CTGVc9WqR+vVu9dOeb3jLwZMYx4vHk0YnEYNVPni7o6gi7uYRxuWeDpxHOEsLbniO7pQ2sIixK3CaAdYQFiakVrCUsRky8BysKC/266dPAasIyqziNJCyxir11HawvLLCK6wxgTaF+FXfRhPJVXIUTildxcenDdkOhdhVzrhXVhdJVjClUEoMKhcSoQh0xrFBGjCtUEQMLRReNyELNKoYWSoixhQpicKGAGF3oJ4YXuonxhd6Lxh0Inat4D0LfKt6FsPP88w0hQoQIf5Aw9V/uexTOp0cd7+f4EUIzhAjzQ4jw1hDWFur3D0QT/pLJvnsPJny4aYOp1UcwYfcpo/0vZ49LVaHrOc40vwpYRfh7kOlG1/6M1hF240/Ze3Gf3O3ZRNh1f17nE0HLv9f6qgkbhhBh/BAijB9ChPFDiDB+CBHGDyHC+CFEGD+ECOOHEGH8ECKMH0KE8UOIMH5VhF+bN+mWmtHwtvmKIxxPtbrvhsk4hnBbxndoyNo9VFq4kXnOtWkvfJZhzpdxv7iywrIreCi9ikWFWxnkcsn3YlFhjbvDFn0RqeHl7w17aNJQ+ChTWKV27hcUvsoQdq/NhB8yg11iW3RB4V5msNs3E77LDHaJAyblhLNyH0iPG1oJx9WE9t8YCK0Qygx2CB2jEcoMdggdoxHKDHYIHaMRygx2CB2jEcoMdggdoxHKDHYIHaMRygx2CB2jEcoMdggdoxHKDHYIHaMRygx2CB2jEcoMdggdoxHKDHYIHaMRygx2CB2jEcoMdggdoxPC/VCnfSth91Ar+2V4hHnf6dy4F9ctjLO+l7txKw8w77vVG7dzCdetX35Ga5ewv+7+7y16cp7bmbYGJPOe2wl/EnjmXMKs839NE5x/XLY2mC39wIzzfw0TnX+Me1GUrOCh51lryvmEZ5D7Sbzr4tNUe4C1X+9WcT6Gv6x26xIHdBd9lORfTkRERERERERERERERESC/gF2IVePB+evpwAAAABJRU5ErkJggg=="
              alt=""
            />
          </picture>
        </div>

        <canvas ref={canvasRef} />
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
.convas-continer{
  /* width: 1800px;
  height: 1800px;
  overflow: auto; */
}
  .ss {
    position: absolute;
    bottom: 10px;
    left: 20px;
    z-index: 400;
    cursor: pointer;
    width: 25px;
    height: 25px;

    transition: all 0.2s ease-in-out;
    &:hover {
      transform: scale(1.1);
    }
    img {
      width: 25px;
    }
  }
  .rightbox {
  }
  .leftbox,
  .rightbox {
    /* background-color: red; */
    border: 1px solid rgba(249, 208, 13, 1);
    pointer-events: none;
    user-select: none;
    width: 100px;
    position: absolute;
    /* z-index: 200; */
  }
  .generationBox {
    /* border: 1px solid red; */
    position: absolute;
    /* z-index: 200; */
    display: flex;
    gap: 20px;
  }
  #inline-btn {
    position: absolute;
    z-index: 200;
  }
  .selectone {
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid #d9d9d9;
    padding: 8px 13px;

    font-size: 12px;
    font-weight: bold;
    transition: all 0.3 ease;

    &:hover {
      border: 2px solid rgba(249, 208, 13, 1);
    }
  }
`;
