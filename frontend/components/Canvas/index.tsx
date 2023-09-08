import React, { useRef, useState } from "react";
import { useAppState } from "@/context/app.context";
import { useEffect } from "react";
import { fabric } from "fabric";
import { styled } from "styled-components";

export default function CanvasBox() {
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
  } = useAppState();
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  /* eslint-disable */
  useEffect(() => {
    if (!canvasInstance.current) {
      canvasInstance.current = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth,
        height: window.innerHeight,
        // transparentCorners: false,
        originX: "center",
        originY: "center",
      });
      canvasHistory.current.push(canvasInstance.current.toDatalessJSON());
      currentCanvasIndex.current++;
    }
    const canvasInstanceRef = canvasInstance.current;
    fabric.Object.prototype.transparentCorners = false;
    // fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
    // Add a custom method to the Fabric canvas prototype

    fabric.Canvas.prototype.getAbsoluteCoords = function (object) {
      return {
        left: object.left + this._offset.left,
        top: object.top + this._offset.top,
      };
    };

    // Get references to the button element and set its initial position
    const btn = PosisionbtnRef.current;
    const rebtn = regenerateRef.current
    const genBox = generateBox.current;

    // Load saved canvas data from local storage
    const savedCanvasData = localStorage.getItem("canvasData");
    if (savedCanvasData) {
      canvasInstanceRef.loadFromJSON(savedCanvasData, () => {
        canvasInstanceRef.renderAll();
      });
    }

    // Load and add an image to the canvas

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
    // const canvasInstanceRef = canvasInstance.current;
    // Create the newEditorBox when the component mounts
    const newEditorBox = new fabric.Rect({
      left: 30,
      top: 120,
      width: 340,
      height: 380,
      selectable: false,
      fill: "transparent",
      // stroke: "rgba(249, 208, 13, 1)",
      strokeWidth: 1,
    });

    canvasInstanceRef.add(newEditorBox);
    canvasInstanceRef.renderAll();

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
      width: 340,
      height: 380,
      selectable: false,
      // fill: "rgba(249, 208, 13, 0.23)",
      fill: "transparent",
    });

    // canvasInstanceRef.add(imageGenRect);

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

    // imageGenRect.on("mousedown", function () {
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

    document.addEventListener("keydown", (e) => {
      // Check if the pressed key is 'Delete' (code: 46) or 'Backspace' (code: 8) for wider compatibility
      if (e.keyCode === 46 || e.keyCode === 8) {
        // Check if the focus is NOT on an input or textarea
        if (
          document.activeElement.tagName !== "INPUT" &&
          document.activeElement.tagName !== "TEXTAREA"
        ) {
          const activeObject = canvasInstanceRef.getActiveObject();
          if (activeObject) {
            canvasInstanceRef.remove(activeObject);
            canvasInstanceRef.renderAll();
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

    // Resize canvas when the window is resized
    window.addEventListener("resize", () => {
      canvasInstanceRef.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });

    return () => {
      window.removeEventListener("resize", null);
      // Clean up resources (if needed) when the component unmounts
      //  canvasInstanceRef.dispose();
      saveCanvasDataToLocal()
    };
  }, []);

  useEffect(() => {}, []);

  const saveCanvasDataToLocal = () => {
    // Serialize canvas data to JSON and save it to local storage
    const canvasData = JSON.stringify(canvasInstance.current.toJSON());
    localStorage.setItem("canvasData", canvasData);
  };

  const generationBoxStyle = {
    left: `${30 + canvasPosition.x}px`,
    top: `${120 + canvasPosition.y}px`,
    width: `${340 * canvasZoom}px`, // Adjust the width based on canvas zoom
    height: `${380 * canvasZoom}px`, // Adjust the height based on canvas zoom
  };
  const PreviewBoxStyle = {
    left: `${400 + canvasPosition.x}px`,
    top: `${120 + canvasPosition.y}px`,
    width: `${340 * canvasZoom}px`, // Adjust the width based on canvas zoom
    height: `${380 * canvasZoom}px`, // Adjust the height based on canvas zoom
    backgroundColor: "rgba(249, 208, 13, 0.23)",
  };

  return (
    <Wrapper>
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
            setRegeneratePopup({ status: true, url: "" });
            setActiveTab(6)
            console.log("sdsfs");
          }}
        >
          <button className="selectone">
          Regenrate Product

          </button>
        </div>
        <canvas ref={canvasRef} />
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
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
