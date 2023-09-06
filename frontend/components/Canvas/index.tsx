import React, { useRef, useState } from "react";
import { useAppState } from "@/context/app.context";
import { useEffect } from "react";
import { fabric } from "fabric";

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
    currentStep, setCurrentStep,
    setEditorBox,
  } = useAppState();

  const canvasRef = useRef(null);

  /* eslint-disable */
  useEffect(() => {
    if (!canvasInstance.current) {
      canvasInstance.current = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth,
        height: window.innerHeight,
      });
      canvasHistoryRef.current.push(canvasInstance.current.toDatalessJSON());
      setCurrentStep(0);
    }
    const canvasInstanceRef = canvasInstance.current;

      // Load saved canvas data from local storage
      const savedCanvasData = localStorage.getItem('canvasData');
      if (savedCanvasData) {
       canvasInstanceRef.loadFromJSON(savedCanvasData, () => {
         canvasInstanceRef.renderAll();
        });
      }
 

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
      width: 380,
      height: 400,
      selectable: false,
      fill: "transparent",
      stroke: "rgba(249, 208, 13, 1)",
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
      left: 450,
      top: 120,
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

      selectable: false, // Make it non-selectable
      evented: false, // Make it non-selectable
      hasControls: false,
      fill: "rgba(0, 0, 0, 1)",
    });

    newEditorBox.on("mousedown", function () {
      const originalStrokeColor = newEditorBox.stroke;
      const originalStrokeWidth = newEditorBox.strokeWidth;

      // Make the rectangle stroke transparent
      newEditorBox.set("stroke", "transparent");
      newEditorBox.set("strokeWidth", 0);
      canvasInstanceRef.renderAll();
      const dataURL = canvasInstanceRef.toDataURL({
        format: "png",
        left: newEditorBox.left,
        top: newEditorBox.top,
        width: newEditorBox.width,
        height: newEditorBox.height,
      });
      setSelectedImg(dataURL);
      setDownloadImg(dataURL);

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

    canvasInstanceRef.on("selection:cleared", function () {
      setDownloadImg(null);
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
      // saveCanvasDataToLocal()
    };
  }, []);

  useEffect(() => {}, []);

  const saveCanvasDataToLocal = () => {
    // Serialize canvas data to JSON and save it to local storage
    const canvasData = JSON.stringify(canvasInstance.current.toJSON());
    localStorage.setItem('canvasData', canvasData);
  };

  return (
    <>
      <div className="convas-continer">
        <canvas ref={canvasRef} />
      </div>
    </>
  );
}
