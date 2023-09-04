import React, { useRef, useState } from "react";
import { useAppState } from "@/context/app.context";
import { useEffect } from "react";
import { fabric } from "fabric";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

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
  } = useAppState();

  // canvs

  const canvasRef = useRef(null);

  /* eslint-disable */
  useEffect(() => {
    if (!canvasInstance.current) {
      canvasInstance.current = new fabric.Canvas(canvasRef.current, {
        width: outerDivRef?.current?.clientWidth,
        height: outerDivRef?.current?.clientHeight,
      });
    }
    const canvasInstanceRef = canvasInstance.current;

    const EditorBox = new fabric.Rect({
      left: 30,
      top: 200,
      width: 380,
      height: 400,
      selectable: false,
      fill: "transparent",

      stroke: "rgba(249, 208, 13, 1)", // border color of the rectangle
      strokeWidth: 1,
    });

    canvasInstanceRef.add(EditorBox);
    // Adding the Image Generator Rectangle
    const imageGenRect = new fabric.Rect({
      left: 450,
      top: 200,
      width: 380,
      height: 400,
      selectable: false,
      fill: "rgba(249, 208, 13, 0.23)",
    });

    canvasInstanceRef.add(imageGenRect);

    const imageGenText = new fabric.Text("Generated image will appear here", {
      left: 450 + 20,
      top: 200 + 20,
      fontSize: 16,
      // originX: "center",
      // originY: "center",
      selectable: false,
      fill: "rgba(0, 0, 0, 1)",
    });
    const EditorBoxText = new fabric.Text("Place Your Product Here", {
      left: 30 + 20, // center of the rectangle
      top: 200 + 20, // center of the rectangle
      fontSize: 16,
      // originX: "center",
      // originY: "center",
      selectable: false,
      fill: "rgba(0, 0, 0, 1)",
    });
    canvasInstanceRef.add(EditorBoxText);
    canvasInstanceRef.add(imageGenText);

    EditorBox.on("mousedown", function () {
      const originalStrokeColor = EditorBox.stroke;
      const originalStrokeWidth = EditorBox.strokeWidth;

      // Make the rectangle stroke transparent
      EditorBox.set("stroke", "transparent");
      EditorBox.set("strokeWidth", 0);

      canvasInstanceRef.renderAll();

      const dataURL = canvasInstanceRef.toDataURL({
        format: "png",
        left: EditorBox.left,
        top: EditorBox.top,
        width: EditorBox.width,
        height: EditorBox.height,
      });
      setSelectedImg(dataURL);

      // Reset the rectangle's stroke properties
      EditorBox.set("stroke", originalStrokeColor);
      EditorBox.set("strokeWidth", originalStrokeWidth);
      canvasInstanceRef.renderAll();
    });

    imageGenRect.on("mousedown", function () {
      // Add your logic for generating/adding the image inside this box.
    });

    // Allow dropping of images onto the canvas
    canvasInstanceRef.on("drop", async function (options) {
      const e = options.e;
      const img = new Image();
      const dataUrl = await getBase64FromUrl(e.dataTransfer.getData("text"));
      img.src = dataUrl;

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
      };

      e.preventDefault();
    });

    canvasInstanceRef.on("object:moving", function (event) {
      const movedObject = event.target;

      const e = event.e;

      if (
        e.layerX >= EditorBox.left &&
        e.layerX <= EditorBox.left + EditorBox.width &&
        e.layerY >= EditorBox.top &&
        e.layerY <= EditorBox.top + EditorBox.height
      ) {
        // Remove the EditorBoxText if the image is inside the EditorBox
        canvasInstanceRef.remove(EditorBoxText);
        canvasInstanceRef.renderAll();
      }
    });

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
    canvasInstanceRef.on("object:selected", function (event) {
      console.log("Object selected:", event.target);
    });

    // Zoom and Pan event handlers
    canvasInstanceRef.on("mouse:wheel", (opt) => {
      const delta = opt.e.deltaY;
      let zoom = canvasInstanceRef.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvasInstanceRef.zoomToPoint(
        { x: canvasInstanceRef.width / 2, y: canvasInstanceRef.height / 2 },
        zoom
      );
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

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

    // Make the canvas accept drops
    canvasInstanceRef.getElement().ondragover = function (e) {
      e.preventDefault();
    };
    canvasInstanceRef.on("selection:cleared", function () {
      setDownloadImg(null);

      console.log(activeTab);
      if (activeTab === 5) {
        setActiveTab(1);
      }
    });
  }, []);

  const bringImageToFront = () => {
    const activeObject = canvasInstance.current.getActiveObject();
    if (activeObject) {
      activeObject.bringToFront();
      canvasInstance.current.renderAll();
    }
  };

  const sendImageToBack = () => {
    const activeObject = canvasInstance.current.getActiveObject();
    if (!activeObject) {
      // alert("Please select an object on the canvas first.");
      return;
    }
    // if (activeObject) {
    activeObject.sendToBack();
    canvasInstance.current.renderAll();
    // }
  };

  return (
    <>
      {/* <div className="overlay">
        <div className="controls">
          <button onClick={toggleEraseMode}>Erase</button>
          <button onClick={downloadCanvas}>Download</button>
          <button onClick={undoAction}>Undo</button>
          <button onClick={clearDrawing}>Clear</button>
        </div>
      </div> */}

      <div className="convas-continer">
        <canvas ref={canvasRef} />
      </div>
    </>
  );
}
