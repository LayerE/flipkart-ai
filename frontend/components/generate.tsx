import Head from "next/head";
import NextImage from "next/image";
import React, { useRef, useState } from "react";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Sidebar from "@/components/Sidebar";
import { styled } from "styled-components";
import { useAppState } from "@/context/app.context";
import assets from "@/public/assets";
import { useEffect } from "react";
import { FileUpload, Input } from "@/components/common/Input";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const inter = Inter({ subsets: ["latin"] });
const MainPage = styled.div`
  .new {
    display: flex;
  }
  .loader {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #29262640;
    font-size: 24px;
    color: #f9d00d;
    z-index: 3;
  }
  .loaderq {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #e6e6e60;
    font-size: 24px;
    color: #f9d00d;
    z-index: 3;
    border-radius: 12px;
  }

  .main-privier {
    padding: 2rem;
    padding-top: ${({ theme }) => theme.paddings.paddingTop};
    width: 100%;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    .main-privier {
    padding: 2rem;
    padding-top: ${({ theme }) => theme.paddings.paddingTopMobile};
    }

    
  `}

  .tgide {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    .preBox {
      position: relative;
      font-size: 10px;
      font-weight: 500;
      border: 2px solid #f9d00d;
      padding: 1rem;
      min-height: 350px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .close {
        position: absolute;
        right: 20px;
        top: 10px;
        font-size: 18px;
        cursor: pointer;
      }

      .imgadd {
        margin: 10px 0;
        width: 100%;
        max-height: 250px;
      }
      .more {
        padding: 0 50px;
        width: 100%;
        height: 100%;
        position: relative;
        .file {
          position: absolute;
          height: 100%;
          width: 100%;
          left: 0;
        }
      }
      picture {
        width: 100%;
        height: 100%;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .center {
        text-align: center;
      }
    }
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
  .tgide {
    display: grid;
    grid-template-columns: 1fr ;
    gap: 20px;

  }

 
  `}

  .undoBox {
    position: absolute;
    bottom: 100px;
    left: 0;
    z-index: 10;
    width: 100%;
    .undoWrapper {
      display: flex;
      gap: 30px;
      justify-content: center;
      width: 100%;

      .undo {
        picture {
        }
        img {
          cursor: pointer;
          width: 50px;
          height: 50px;
        }
      }
    }
  }
  .tgrideOne {
    position: relative !important;
    display: grid;
    grid-template-columns: 1fr;

    .magicPrevie {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 500px;
      width: 100%;

      canvas {
        z-index: 30000;
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
      border: 1px solid ${({ theme }) => theme.btnPrimary} */
      width: max-content;
    }
    input[type="range"] {
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
   
    .activeTool {
      background: ${({ theme }) => theme.btnPrimary};
    }
  }
  .closs {
    position: absolute;
    right: 50px;
    top: 0px;
    font-size: 28px;
    cursor: pointer;
  }

  .sample-canvas {
    border: 1px solid #555;
  }
`;

export default function Home() {
  const {
    previewLoader,
    setPriviewLoader,
    modifidImageArray,
    undoArray,
    setUndoArray,
    magickErase,
    setFile,
    setMagickErase,
  } = useAppState();

  const saveCanvasToBlobURL = () => {
    const canvas = stageRef.current;
    canvas.findOne("Image").hide();
    const base = canvas.toDataURL();
    canvas.findOne("Image").show();

    return base;
  };

  return (
    <MainPage>
      {/* <Apps /> */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="new"
      >
        <Sidebar />
        <div className="main-privier">
          <div className="tgide">
            <motion.div
              className="preBox"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              {selectedImage?.url ? (
                <div
                  className="close"
                  onClick={() => {
                    setFile(null);
                  }}
                >
                  X
                </div>
              ) : null}
              <p>Place Your Product Here</p>
              <div className="imgadd">
                {selectedImage?.url ? (
                  <>
                    {" "}
                    <div className="file"></div>
                    <picture>
                      <img
                        src={
                          selectedImage?.url
                            ? selectedImage?.url
                            : assets.images.dotbox
                        }
                        alt=""
                      />
                    </picture>
                  </>
                ) : (
                  <div className="more">
                    <div className="file">
                      <FileUpload />
                    </div>
                    <NextImage src={assets.images.dotbox} alt=""></NextImage>
                  </div>
                )}
              </div>
              <p className="center">Step 1: Place your product inside here</p>
            </motion.div>
            {selectedImage?.id > -1 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="preBox"
              >
                <p>Place Your Product Here</p>
                {previewLoader ? (
                  <div className="loader">Loading...</div>
                ) : null}
                <div className="imgadd">
                  {modifidImageArray.length ? (
                    <picture>
                      <img
                        src={
                          modifidImageArray[modifidImageArray.length - 1].url
                        }
                        alt=""
                      />
                    </picture>
                  ) : (
                    <div className="more">
                      <NextImage src={assets.images.dotbox} alt=""></NextImage>
                    </div>
                  )}
                </div>
                <p className="center">Step 1: Place your product inside here</p>
              </motion.div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </MainPage>
  );
}
