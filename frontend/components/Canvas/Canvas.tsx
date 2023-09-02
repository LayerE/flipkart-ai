import React, { useRef, useState } from "react";
import { useAppState } from "@/context/app.context";
import { useEffect } from "react";
import { fabric } from "fabric";
import { styled } from "styled-components";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

export default function Canvas() {
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
        width:360,
        height: 400,
 
      });
    }
    const canvasInstanceRef = canvasInstance.current;

     // Allow dropping of images onto the canvas
    //  canvasInstanceRef.on("drop", async function (options) {
    //     const e = options.e;
    //     const img = new Image();
    //     const dataUrl = await getBase64FromUrl(e.dataTransfer.getData("text"));
    //     img.src = dataUrl;
  
    //     img.onload = function () {
    //       const fabricImg = new fabric.Image(img, {
    //         left: e.layerX,
    //         top: e.layerY,
    //         angle: 0,
    //         opacity: 1,
    //         selectable: true,
    //         hasControls: true,
    //         lockMovementX: false,
    //         lockMovementY: false,
    //       });
    //       fabricImg.scaleToWidth(200);
    //       fabricImg.setControlVisible("mtr", true); // This allows for rotation
    //       canvasInstanceRef.add(fabricImg).renderAll();
    //       canvasInstanceRef.setActiveObject(fabricImg);
    //       fabricImg.set("selectable", true);
    //       fabricImg.set("category", "subject");

    //     };
  
    //     e.preventDefault();
    //   });

    

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
    // canvasInstanceRef.add(EditorBoxText);
    // canvasInstanceRef.add(imageGenText);

 
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

      <CnavasWrapper className="">
        <canvas ref={canvasRef} />
      </CnavasWrapper>
    </>
  );
}


const CnavasWrapper = styled.div`
canvas{

    border: 2px solid rgba(249, 208, 13, 1);
}

    

`
