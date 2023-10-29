// use client
/// <reference no-default-lib="true"/>
import React, { useRef, useState } from "react";
import { useAppState } from "@/context/app.context";
import { useEffect, useLayoutEffect, useCallback } from "react";
import { fabric } from "fabric";
import { styled } from "styled-components";
import { useRouter } from "next/router";
import axios from "axios";
import Loader from "../Loader";
import { setInterval } from "timers";
import { saveAs } from "file-saver";
import PopupCanvas from "./popupCanvas";
import CropperBox from "./Cropper";

// import { useBeforeUnload } from "react-router-dom";

export default function CanvasBox({
  proid,
  userId,
}: {
  proid: any;
  userId: string;
}) {
  const { query, isReady } = useRouter();
  const router = useRouter();

  const id = (query.id as string[]) || [];
  const {
    setSelectedImg,
    canvasInstance,
    getBase64FromUrl,
    activeTab,
    setActiveTab,
    setSelectedColoreMode,
    downloadImg,
    setDownloadImg,
    RegenerateImageHandeler,
    GetProjextById,
    isMagic,
    setEditorBox,
    bringImageToFront,
    sendImageToBack,
    PosisionbtnRef,
    regenerateRef,
    setRegeneratePopup,
    previewBox,
    canvasHistory,
    currentCanvasIndex,
    generateBox,
    GetProjexts,
    SaveProjexts,
    project,
    loadercarna,
    setloadercarna,
    saveCanvasToDatabase,
    setRegenratedImgsJobid,

    positionBtn,
    newEditorBox,
    imageGenRect,
    zoom,
    setZoomCanvas,
    activeSize,
    downloadeImgFormate,
    setActiveSize,
    crop,
    setCrop,
    canvasDisable,
    setCanvasDisable,
    loader,

    setregeneraatingId,

    // canvasRef
  } = useAppState();
  // let newEditorBox;
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
      preserveObjectStacking: true,
      // selectionLineWidth: 2,
      // transparentCorners: false,
      // originX: "center",
      // originY: "center",
      // renderOnAddRemove: false,
    });

    const canvasInstanceRef = canvasInstance.current;
    if (canvasInstanceRef) {
      // Resize canvas when the window is resized
      window.addEventListener("resize", () => {
        canvasInstanceRef?.setDimensions({
          width: window?.innerWidth,
          height: window?.innerHeight,
        });
      });
    }

    setTimeout(() => {
      setStar(true);
    }, 1000);

    return () => {
      saveCanvasToDatabase();
      setTimeout(() => {
        canvasInstanceRef?.dispose();
      }, 500);
    };
  }, [isReady, canvasInstance]);

  const [re, setRe] = useState(1);
  const [state, setStar] = useState(false);

  useEffect(() => {
    if (canvasInstance?.current && state && isReady) {
      const canvasInstanceRef = canvasInstance?.current;
      const btn = PosisionbtnRef.current;
      const rebtn = regenerateRef.current;
      const preBox = previewBox.current;

      canvasInstance?.current.renderAll();

      // When a user clicks on an image on the canvas
      canvasInstanceRef.on("mouse:down", function (options) {
        if (options.target && options.target.type === "image") {
          let selectedObject;
          if (options.target._element instanceof Image) {
            console.log(options.target.id, "option");
            // selectedObject = options.target._element.src;
            const img = new Image();
            img.src = options.target._element.src;
            // Resize the image to 512x521 pixels
            const canvas = document.createElement("canvas");
            canvas.width = 710;
            canvas.height = 710;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, 710, 710);

            // Convert the canvas to a data URL
            selectedObject = canvas.toDataURL("image/png");
          } else if (options.target._element instanceof HTMLCanvasElement) {
            selectedObject = options.target._element.toDataURL();
          }

          if (selectedObject) {
            if (options.target.id) {
              setregeneraatingId(options.target.id);
            }
            setDownloadImg(selectedObject);
            setSelectedColoreMode("None");
          }
        }
      });

      // Create the newEditorBox when the component mounts

      const EditorBoxText = new fabric.Text("Place Your Product Here", {
        left: newEditorBox.left + 20, // center of the rectangle
        top: newEditorBox.top + 20, // center of the rectangle
        fontSize: 24,
        // originX: "center",
        // originY: "center",
        selectable: false,
        excludeFromExport: true,
        fill: "rgba(0, 0, 0, 1)",
      });
      canvasInstanceRef.add(EditorBoxText);

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

      const objects = canvasInstanceRef.getObjects();

      objects.forEach((object) => {
        // If the object is a mask, add it to the mask objects array
        if (object.category === "mask") {
          positionBtn(object);
        }
        // If the object is a subject, add it to the subject objects array
        if (object.category === "subject") {
          // subjectObjects.push(object);
          positionBtn(object);
        }
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
      // setEditorBox(newEditorBox);
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

      canvasInstanceRef.on("selection:created", (e) => {
        var selectedObjects = e.target;
        // var hasGenerated = selectedObjects.some(function (obj) {
        //   return obj.category === "generated";
        // });
        // selectedObjects.selectable = false;

        // if (hasGenerated) {
        // Show the additional button if at least one object has the category "generated"
        // rebtn.style.display = "block";
        // }
        btn.style.display = "flex";

        // If the object is a subject, add it to the subject objects array
      });

      canvasInstanceRef.on("selection:cleared", function (e) {
        var selectedObjects = e.target;

        // var hasGenerated = selectedObjects.some(function (obj) {
        //   return obj.category !== "generated";
        // });
        btn.style.display = "none";

        // if (hasGenerated) {
        rebtn.style.display = "none";
        // Show the additional button if at least one object has the category "generated"
        // }
        // rebtn.style.display = "block";
        setDownloadImg(null);

        if (activeTab === 5) {
          setActiveTab(1);
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
    }

    return () => {
      // if(canvasInstance.current)
      // canvasInstance.current?.dispose();
      // saveCanvasToDatabase();
      // setTimeout(() => {
      // }, 300);
      // canvasInstance?.current.remove(newEditorBox);
      // canvasInstance?.current.remove(imageGenRect);
    };
  }, [canvasInstance.current, state, activeSize]);
  // , activeSize, setActiveSize, re, state

  const DeletIrem = () => {
    const activeObject = canvasInstance?.current?.getActiveObject();
    if (activeObject) {
      canvasInstance?.current?.remove(activeObject);
      canvasInstance?.current?.renderAll();
    }
  };

  useEffect(() => {
    if (canvasInstance?.current && loadercarna) {
      const canvasInstanceRef = canvasInstance?.current;
      // canvasInstanceRef.on("mouse:wheel", function (opt) {
      //   var delta = opt.e.deltaY;
      //   var zooms = canvasInstanceRef.getZoom();

      //   zooms *= 0.999 ** delta;
      //   if (zooms > 2) zooms = 2;
      //   if (zooms < 0.3) zooms = 0.3;
      //   canvasInstanceRef.zoomToPoint(
      //     { x: opt.e.offsetX, y: opt.e.offsetY },
      //     zooms
      //   );
      //   setZoomCanvas(zooms)

      //   console.log(zoom)

      //   // genBox.style.transform = `scale(${zoom})`;
      //   // genBox.style.transform = `scale(${zoom}) translate(${newEditorBox.x}px, ${newEditorBox.y}px)`;
      //   // Get the coordinates of the inner rectangle

      //   // Update the position and zoom of the outer div
      //   // genBox.style.transform = `scale(${zoom})`;
      //   // genBox.style.left = `${innerRectCoords.left * zoom}px`;
      //   // genBox.style.top = `${innerRectCoords.top * zoom}px`;
      //   // Calculate the adjusted position for the outer div
      //   // var canvasContainer = document.getElementById('canvas-container');

      //   opt.e.preventDefault();
      //   opt.e.stopPropagation();
      // });

      fabric.Object.prototype.transparentCorners = false;
      // fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
      // Add a custom method to the Fabric canvas prototype

      // Set the zoom level (e.g., zoom in by a factor of 2)
      var zoomLevel = zoom;

      canvasInstanceRef.setZoom(zoom);
      var zooms = canvasInstanceRef.getZoom();

      console.log(" position", zooms);

      // Set the zooming point (x, y) coordinates
      var zoomPointX = 100; // X-coordinate of the zooming point
      var zoomPointY = 100; // Y-coordinate of the zooming point

      // Calculate the zoom origin based on the zooming point
      var zoomOriginX = canvasInstanceRef.width / 2 - zoomPointX * zoom;
      var zoomOriginY = canvasInstanceRef.height / 2 - zoomPointY * zoom;

      // Set the zoom origin
      canvasInstanceRef.zoomToPoint(
        new fabric.Point(zoomOriginX, zoomOriginY),
        zoom
      );

      fabric.Canvas.prototype.getAbsoluteCoords = function (object) {
        return {
          left: object.left * zoom,
          top: object.top * zoom,
        };
      };
      setZoomCanvas(zooms);
    }
  }, [canvasInstance.current]);

  useEffect(() => {
    // Fetch canvas data from your API and load it into the canvas
    const canvasInstanceRef = canvasInstance?.current;

    setloadercarna(true);
    if (isReady && userId) {
      console.log("canvasInstance", userId, proid);
      axios
        .post(`/api/canvasdata`, {
          user_id: userId,
          project_id: proid,
        })
        .then((response) => {
          if (canvasInstanceRef) {
            canvasInstanceRef.loadFromJSON(
              response?.data.newData.canvasdata,
              canvasInstanceRef.renderAll.bind(canvasInstanceRef),
              function (o, object) {
                console.log(o, object);
              }
            );
            setloadercarna(false);
            // canvasInstanceRef.loadFromJSON(savedCanvasDataLocal, () => {
            //   canvasInstanceRef.renderAll();
            // });
          }
        })

        .catch((error) => {
          console.error(error);
          setloadercarna(false);

          return error;
        });

      // try {

      //   if (canvasInstanceRef) {
      //     const canvasInstanceRef = canvasInstance.current;
      //     canvasInstance.current.clear();

      //     const savedCanvasDataLocal = localStorage.getItem(proid);
      //     const savedCanvasDB = project?.canvas;
      //     // console.log(savedCanvasDataLocal, "dfdsf");
      //     if (savedCanvasDB && !savedCanvasDataLocal) {
      //       localStorage.setItem(proid, savedCanvasDB);
      //     }
      //     if (savedCanvasDataLocal) {
      //       // console.log(savedCanvas,"dfdfsdgfdgfd")
      //       canvasInstanceRef.clear();
      //       canvasInstanceRef.isDrawingMode = false;

      //       canvasInstanceRef.loadFromJSON(
      //         savedCanvasDataLocal,
      //         canvasInstanceRef.renderAll.bind(canvasInstanceRef),
      //         function (o, object) {
      //           console.log(o, object);
      //         }
      //       );
      //     }
      //     setloadercarna(false);
      //   }
      // } catch (error) {
      //   console.error("An error occurred:", error);
      // }

      // console.log("canvasInstance",canvasInstanceRef)
    }
  }, [isReady, userId]);

  useEffect(() => {
    return () => {
      return () => {
        router.events.off("routeChangeStart", saveCanvasToDatabase);

        saveCanvasToDatabase();
      };
    };
  }, []);

  const generationBoxStyle = {
    left: `${activeSize?.l * zoom}px`,
    top: `${activeSize?.t * zoom}px`,
    width: `${activeSize?.w * zoom}px`, // Adjust the width based on canvas zoom
    height: `${activeSize?.h * zoom}px`, // Adjust the height based on canvas zoom
  };
  const PreviewBoxStyle = {
    left: `${activeSize.gl * zoom}px`,
    top: `${activeSize.gt * zoom}px`,
    width: `${activeSize.w * zoom}px`, // Adjust the width based on canvas zoom
    height: `${activeSize.h * zoom}px`, // Adjust the height based on canvas zoom
    backgroundColor: "rgba(249, 208, 13, 0.23)",
  };

  const handelRegenrate = () => {
    if (downloadImg !== null) {
      RegenerateImageHandeler(userId, proid, downloadImg);
      setRegenratedImgsJobid([]);
      setTimeout(() => {
        setRegeneratePopup({ status: true, url: downloadImg });
        console.log("Success", downloadImg);
        // setActiveTab(6);
      }, 500);
    }
  };

  const downlaedImf = () => {
    if (downloadImg) {
      // const url = modifidImageArray[modifidImageArray.length - 1]?.url;
      const url = downloadImg;

      console.log(url);

      saveAs(url, `image${Date.now()}.${downloadeImgFormate}`);
    } else {
    }
  };

  return (
    <Wrapper canvasDisable={loader}>
      {loadercarna ? <Loader /> : null}

      {isMagic ? <PopupCanvas /> : null}
      {crop ? <CropperBox /> : null}
      {loader ? <div className="divovelay"></div> : null}

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
          <button className="selectone" onClick={() => DeletIrem()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="delet"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              ></path>
            </svg>
          </button>
          <button className="selectone" onClick={() => downlaedImf()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="delet"
            >
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div
          id="inline-btn"
          className="regenrat"
          ref={regenerateRef}
          style={{ display: "none" }}
          onClick={() => {
            handelRegenrate();
          }}
        >
          <button className="selectone yello">Regenerate Product</button>
        </div>

        <div className="ss">
          {/* <button onClick={handleButtonClick}>,/fdvd</button> */}
          {/* <picture>
            <img
              onClick={() => saveCanvasToDatabase()}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAYFBMVEX///8AAAD4+Pjv7+8aGhoTExOYmJiTk5P09PQICAiQkJD6+vp/f39WVlbGxsaurq5ubm6FhYUnJye8vLwfHx9oaGjR0dHq6urg4OB1dXWkpKS2trY0NDQpKSlNTU1fX19H7sBTAAADJUlEQVR4nO3d224iMRBFUbo7QLhDrkwyM/n/vxwhTR5AUDbUsV1Ee78iFSw5pIliN6MRERERERERERERERERxWvRn29xy7CTGVc9WqR+vVu9dOeb3jLwZMYx4vHk0YnEYNVPni7o6gi7uYRxuWeDpxHOEsLbniO7pQ2sIixK3CaAdYQFiakVrCUsRky8BysKC/266dPAasIyqziNJCyxir11HawvLLCK6wxgTaF+FXfRhPJVXIUTildxcenDdkOhdhVzrhXVhdJVjClUEoMKhcSoQh0xrFBGjCtUEQMLRReNyELNKoYWSoixhQpicKGAGF3oJ4YXuonxhd6Lxh0Inat4D0LfKt6FsPP88w0hQoQIf5Aw9V/uexTOp0cd7+f4EUIzhAjzQ4jw1hDWFur3D0QT/pLJvnsPJny4aYOp1UcwYfcpo/0vZ49LVaHrOc40vwpYRfh7kOlG1/6M1hF240/Ze3Gf3O3ZRNh1f17nE0HLv9f6qgkbhhBh/BAijB9ChPFDiDB+CBHGDyHC+CFEGD+ECOOHEGH8ECKMH0KE8UOIMH5VhF+bN+mWmtHwtvmKIxxPtbrvhsk4hnBbxndoyNo9VFq4kXnOtWkvfJZhzpdxv7iywrIreCi9ikWFWxnkcsn3YlFhjbvDFn0RqeHl7w17aNJQ+ChTWKV27hcUvsoQdq/NhB8yg11iW3RB4V5msNs3E77LDHaJAyblhLNyH0iPG1oJx9WE9t8YCK0Qygx2CB2jEcoMdggdoxHKDHYIHaMRygx2CB2jEcoMdggdoxHKDHYIHaMRygx2CB2jEcoMdggdoxHKDHYIHaMRygx2CB2jEcoMdggdoxHKDHYIHaMRygx2CB2jEcoMdggdoxPC/VCnfSth91Ar+2V4hHnf6dy4F9ctjLO+l7txKw8w77vVG7dzCdetX35Ga5ewv+7+7y16cp7bmbYGJPOe2wl/EnjmXMKs839NE5x/XLY2mC39wIzzfw0TnX+Me1GUrOCh51lryvmEZ5D7Sbzr4tNUe4C1X+9WcT6Gv6x26xIHdBd9lORfTkRERERERERERERERESC/gF2IVePB+evpwAAAABJRU5ErkJggg=="
              alt=""
            />
          </picture> */}
        </div>

        <canvas ref={canvasRef} />
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`

.divovelay {
    /* display: ${(props) => (props.canvasDisable ? "none" : "block")}; */
    z-index: 10;
    position: absolute;
    width: 100%;
    height: 100%;
    /* background-color: #000; */
  }
  canvas {
    pointer-events: ${(props) => (props.canvasDisable ? "none" : "auto")};
  }
  .convas-continer {
    /* width: 1800px;
  height: 1800px; */
    overflow: auto;
  }
  .delet {
    width: 20px;
    height: 20px;
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
    z-index: 8;
    display: flex;
    justify-content: center;
  }
  .selectone {
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid rgba(249, 208, 13, 1);
    padding: 5px 8px;
    background: rgba(249, 208, 13, 1) !important;

    color: #000;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.3 ease;
    margin-right: 3px;

    &:hover {
      border: 2px solid rgba(249, 208, 13, 1);
    }
  }

  .yello {
  }
`;
