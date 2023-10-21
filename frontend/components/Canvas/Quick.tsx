import { useAppState } from "@/context/app.context";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { saveAs } from "file-saver";
import { fabric } from "fabric";
import { useRouter } from "next/router";

const QuickCanvas = () => {
  const { activeSize, selectedImg,setSelectedImg,setDownloadImg, loader, addimgToCanvasQuike, canvasInstanceQuick } =
    useAppState();
  const canvasRef = useRef(null);
  const canvasBox = useRef(null);
  const { query, isReady } = useRouter();

  // const canvasInstanceQuick = useRef(null);
  const h = 512;
  const w = 512;

  useEffect(() => {
    canvasInstanceQuick.current = new fabric.Canvas(canvasRef?.current, {
      width: 512,
      height: 512,
      preserveObjectStacking: true,
    });
    const canvasInstanceQuickRef = canvasInstanceQuick?.current;

    return () => {
      setTimeout(() => {
        canvasInstanceQuickRef?.dispose();
      }, 500);
    };
  }, [canvasInstanceQuick, isReady]);

  useEffect(() => {
    if (canvasInstanceQuick?.current && isReady) {
      const canvasInstanceQuickRef = canvasInstanceQuick?.current;

      // When a user clicks on an image on the canvas
      canvasInstanceQuickRef.on("mouse:down", function (options) {
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
            // setDownloadImg(selectedObject);
          }
        }
      });

      canvasInstanceQuickRef.on("object:moving", function (event) {
        const movedObject = event.target;
      });
      canvasInstanceQuickRef.on("selection:created", (e) => {
        var selectedObjects = e.target;

        // If the object is a subject, add it to the subject objects array
      });

      document.addEventListener("keydown", (e) => {
        // Check if the pressed key is 'Delete' (code: 46) or 'Backspace' (code: 8) for wider compatibility
        if (e.keyCode === 46 || e.keyCode === 8) {
          // Check if the focus is NOT on an input or textarea
          if (
            document.activeElement.tagName !== "INPUT" &&
            document.activeElement.tagName !== "TEXTAREA"
          ) {
            const activeObject = canvasInstanceQuickRef?.getActiveObject();
            if (activeObject) {
              canvasInstanceQuickRef?.remove(activeObject);
              canvasInstanceQuickRef?.renderAll();
            }
          }
        }
      });
    }
  }, [canvasInstanceQuick.current]);

  const downlaedImf = () => {
    if (selectedImg?.image) {
      // const url = modifidImageArray[modifidImageArray.length - 1]?.url;
      const url = selectedImg?.image;
      console.log(url);
      saveAs(url, `image${Date.now()}.png`);
    } else {
    }
  };
  const DeletIrem = () => {
     setSelectedImg(null);
     setDownloadImg(null);
  };
  return (
    <CnavasQuick canvasDisable={loader}>
      <div className="boxsss">
        <div
          className="genrtbox"
          ref={canvasBox}
          style={{ minWidth: w, height: h }}
        >
          <canvas ref={canvasRef} width={512} height={512} />
        </div>
        <div style={{ minWidth: w, height: h }} className="outputbox">
          {selectedImg?.image ? (
            <>
              <div className="btn">
                <button className="selectone" onClick={() => DeletIrem()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="delet"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
                      fill-rule="evenodd"
                      d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>

              <picture>
                <img src={selectedImg?.image} />
              </picture>
            </>
          ) : null}
        </div>
        {/* <button
          style={{ position: "relative", zIndex: "100" }}
          onClick={() => {
            addimgToCanvasQuike(
              "https://cdn-img1.imgworlds.com/assets/781da344-4cd0-4ba7-ade1-744a991fa009.jpg?key=large-image"
            );
          }}
        >
          fgfdg
        </button> */}
      </div>
    </CnavasQuick>
  );
};

export default QuickCanvas;

const CnavasQuick = styled.div`
  padding: 20px;
  margin-top: 100px;
  min-width: 100%;

  height: 100%;
  /* overflow: scroll; */
  canvas {

pointer-events:${(props) => (props.canvasDisable ? "none" : "auto")}

}
  .boxsss {
    display: flex;
    gap: 20px;
    transform: scale(0.8) translateX(-10%) translateY(-15%);

    /* overflow: scroll; */
  }
  .genrtbox {
    border: 2px solid rgba(249, 208, 13, 1);
  }

  .outputbox {
    border: 2px solid rgba(249, 208, 13, 1);
    position: relative;
    .btn {
    position: absolute;
    z-index: 100;
    right: 10px;
    top: 10px;
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
  .delet {
    width: 20px;
    height: 20px;
  }
    picture{
      width: 100%;
      height: 100%;
      img{
        width: 100%;
      height: 100%;
      }
    }
  }
`;
