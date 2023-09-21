import { useAppState } from "@/context/app.context";
import React, { useState } from "react";
import { styled } from "styled-components";

const BottomTab = () => {
  const {
    canvasInstance,
    undoArray,
    setUndoArray,
    modifidImageArray,
    setModifidImageArray,
    setSelectedImg,
    currentStep,
    setCurrentStep,
    canvasHistoryRef,
    canvasHistory,
    currentCanvasIndex,
    zoom, setZoomCanvas,
    handleZoomIn,
    handleZoomOut,
  } = useAppState();

  // canvs

  //   const canvasRef = useRef(null);

  // const [canvas, setCanvas] = useState(null);
  // const [canvasHistory, setCanvasHistory] = useState([]);
  // const [currentStep, setCurrentStep] = useState(-1);
  // Initialize the canvas when the component mounts

  const handileUndo = () => {
    if (currentCanvasIndex.current > 0) {
      currentCanvasIndex.current--;
      canvasInstance.current.loadFromJSON(
        canvasHistory.current[currentCanvasIndex.current]
      );
      canvasInstance.current.renderAll();
    }
    // if (modifidImageArray.length > 1) {
    //   setUndoArray((pre) => [
    //     ...pre,
    //     modifidImageArray[modifidImageArray.length - 1],
    //   ]);

    //   setModifidImageArray((pre) => {
    //     const lastElement = pre[pre.length - 1];
    //     if (lastElement && lastElement.tool) {
    //         setSelectedImg((prevState) => ({
    //         ...prevState,
    //         tools: {
    //           ...prevState.tools,
    //           [lastElement.tool]: false,
    //         },
    //       }));
    //     }

    //     return pre.slice(0, -1);
    //   });
    // }
  };
  const handilePre = () => {
    if (currentCanvasIndex.current < canvasHistory.current.length - 1) {
      currentCanvasIndex.current++;
      canvasInstance.current.loadFromJSON(
        canvasHistory.current[currentCanvasIndex.current]
      );
      canvasInstance.current.renderAll();
    }
    // if (undoArray.length > 0) {
    //   setModifidImageArray((pre) => [...pre, undoArray[undoArray.length - 1]]);
    //   setUndoArray((pre) => {
    //     const lastElement = pre[pre.length - 1];
    //     if (lastElement && lastElement.tool) {
    //         setSelectedImg((prevState) => ({
    //         ...prevState,
    //         tools: {
    //           ...prevState.tools,
    //           [lastElement.tool]: true,
    //         },
    //       }));
    //     }

    //     return pre.slice(0, -1);
    //   });
    // }
  };

  return (
    <BottomTabWtapper>
      <div className="bottomTab">

        {/* <div className="left">
          <div className="zoom">
          <svg onClick={()=>handleZoomOut()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="serch"><path d="M6.75 8.25a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z"></path><path fill-rule="evenodd" d="M9 2a7 7 0 104.391 12.452l3.329 3.328a.75.75 0 101.06-1.06l-3.328-3.329A7 7 0 009 2zM3.5 9a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z" clip-rule="evenodd"></path></svg>
          <div className="scrooller">
          <input
              type="range"
              // value={}
              // onChange={(e) => setsize(e.target.value)}
            />
          </div>
          <svg onClick={()=>handleZoomIn()}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"  className="serch"><path d="M9 6a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 6z"></path><path fill-rule="evenodd" d="M2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9zm7-5.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" clip-rule="evenodd"></path></svg>
          </div>
        </div> */}
        <div className="right">
          <div className="undo" onClick={handileUndo}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="14"
              viewBox="0 0 16 14"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.70679 0.292786C5.89426 0.480314 5.99957 0.734622 5.99957 0.999786C5.99957 1.26495 5.89426 1.51926 5.70679 1.70679L3.41379 3.99979H8.99979C10.8563 3.99979 12.6368 4.73728 13.9495 6.05004C15.2623 7.36279 15.9998 9.14327 15.9998 10.9998V12.9998C15.9998 13.265 15.8944 13.5194 15.7069 13.7069C15.5194 13.8944 15.265 13.9998 14.9998 13.9998C14.7346 13.9998 14.4802 13.8944 14.2927 13.7069C14.1051 13.5194 13.9998 13.265 13.9998 12.9998V10.9998C13.9998 9.6737 13.473 8.40193 12.5353 7.46425C11.5976 6.52657 10.3259 5.99979 8.99979 5.99979H3.41379L5.70679 8.29279C5.8023 8.38503 5.87848 8.49538 5.93089 8.61738C5.9833 8.73939 6.01088 8.87061 6.01204 9.00339C6.01319 9.13616 5.98789 9.26784 5.93761 9.39074C5.88733 9.51364 5.81307 9.62529 5.71918 9.71918C5.62529 9.81307 5.51364 9.88733 5.39074 9.93761C5.26784 9.98789 5.13616 10.0132 5.00339 10.012C4.87061 10.0109 4.73939 9.9833 4.61738 9.93089C4.49538 9.87848 4.38503 9.8023 4.29279 9.70679L0.292786 5.70679C0.105315 5.51926 0 5.26495 0 4.99979C0 4.73462 0.105315 4.48031 0.292786 4.29279L4.29279 0.292786C4.48031 0.105315 4.73462 0 4.99979 0C5.26495 0 5.51926 0.105315 5.70679 0.292786Z"
                fill="black"
              />
            </svg>
          </div>
          <div className="predo" onClick={handilePre}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="14"
              viewBox="0 0 16 14"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.293 0.292786C10.1055 0.480314 10.0002 0.734622 10.0002 0.999786C10.0002 1.26495 10.1055 1.51926 10.293 1.70679L12.586 3.99979H6.99997C5.14345 3.99979 3.36298 4.73728 2.05022 6.05004C0.737468 7.36279 -3.05176e-05 9.14327 -3.05176e-05 10.9998V12.9998C-3.05176e-05 13.265 0.105326 13.5194 0.292862 13.7069C0.480398 13.8944 0.734753 13.9998 0.999969 13.9998C1.26519 13.9998 1.51954 13.8944 1.70708 13.7069C1.89461 13.5194 1.99997 13.265 1.99997 12.9998V10.9998C1.99997 9.6737 2.52675 8.40193 3.46444 7.46425C4.40212 6.52657 5.67389 5.99979 6.99997 5.99979H12.586L10.293 8.29279C10.1975 8.38503 10.1213 8.49538 10.0689 8.61738C10.0165 8.73939 9.98887 8.87061 9.98772 9.00339C9.98656 9.13616 10.0119 9.26784 10.0621 9.39074C10.1124 9.51364 10.1867 9.62529 10.2806 9.71918C10.3745 9.81307 10.4861 9.88733 10.609 9.93761C10.7319 9.98789 10.8636 10.0132 10.9964 10.012C11.1291 10.0109 11.2604 9.9833 11.3824 9.93089C11.5044 9.87848 11.6147 9.8023 11.707 9.70679L15.707 5.70679C15.8944 5.51926 15.9998 5.26495 15.9998 4.99979C15.9998 4.73462 15.8944 4.48031 15.707 4.29279L11.707 0.292786C11.5194 0.105315 11.2651 0 11 0C10.7348 0 10.4805 0.105315 10.293 0.292786Z"
                fill="black"
              />
            </svg>
          </div>
        </div>
      </div>
    </BottomTabWtapper>
  );
};

const BottomTabWtapper = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: start;
  align-items: center;
  height: 50px;
  width: 100%;
  padding: 0 50px;
  z-index: 100;

  .serch{
    width: 20px;
    height: 20px;
  }
  .left{
    display: flex;
      justify-content: start;
      align-items: center;
      width: 100%;

    .zoom{
    display: flex;
    gap: 10px;

    svg{
      cursor: pointer;
    }
    
     

    }

  }

  .bottomTab {
    width: 100%;
    display: flex;
  }
  .right {
    width: 100%;

    display: flex;
    gap: 20px;
    justify-content: end;

    svg {
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        transform: scale(1.2);
      }
    }
  }
  .undo {
  }




    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }

  input[type="range"] {
    height: 20px;
    -webkit-appearance: none;
    /* margin: 10px 0; */
    width: 100%;
    background: #fff;
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    /* box-shadow: 0px 0px 0px #000000; */
    background: rgba(249, 208, 13, 1);
    border-radius: 1px;
    border: 0px solid #000000;
  }
  input[type="range"]::-webkit-slider-thumb {
    /* box-shadow: 0px 0px 0px #000000; */
    border: 1px solid rgba(249, 208, 13, 1);
    height: 15px;
    width: 15px;
    border-radius: 25px;
    background: #dac149;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -6px;
  }
  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: rgba(249, 208, 13, 1);
  }
  input[type="range"]::-moz-range-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: rgba(249, 208, 13, 1);
    border-radius: 1px;
    border: 0px solid #000000;
  }
  input[type="range"]::-moz-range-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid #rgba(249, 208, 13, 1);
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: rgba(249, 208, 13, 1);
    cursor: pointer;
  }
  input[type="range"]::-ms-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type="range"]::-ms-fill-lower {
    background: rgba(249, 208, 13, 1);
    border: 0px solid #000000;
    border-radius: 2px;
    /* box-shadow: 0px 0px 0px #000000; */
  }
  input[type="range"]::-ms-fill-upper {
    background: rgba(249, 208, 13, 1);
    border: 0px solid #000000;
    border-radius: 2px;
    /* box-shadow: 0px 0px 0px #000000; */
  }
  input[type="range"]::-ms-thumb {
    margin-top: 1px;
    /* box-shadow: 0px 0px 0px #000000; */
    border: 1px solid rgba(249, 208, 13, 1);
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: rgba(249, 208, 13, 1);
    cursor: pointer;
  }
  input[type="range"]:focus::-ms-fill-lower {
    background: rgba(249, 208, 13, 1);
  }
  input[type="range"]:focus::-ms-fill-upper {
    background: rgba(249, 208, 13, 1);
  }
`;

export default BottomTab;
