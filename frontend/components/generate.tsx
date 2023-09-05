
"use client";

import Head from "next/head";
import React, { lazy, useEffect, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { styled } from "styled-components";
import { useAppState } from "@/context/app.context";
import { motion } from "framer-motion";
import PopupUpload from "@/components/Popup";
import Canvas from "@/components/Canvas/Canvas";
import Loader from "@/components/Loader";
import BottomTab from "@/components/BottomTab";
// import CanvasBox from "@/components/Canvas";
const CanvasBox = lazy(() => import("@/components/Canvas"));
import { useAuth } from "@clerk/nextjs";


const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

export default function Home() {
  const { userId } = useAuth();

  const {
    outerDivRef,
    popup,
    generatedImgList,
    selectedImg,
    setSelectedImg,
    loader,
    addimgToCanvasGen,
    setLoader,
    canvasInstance,
    modifidImageArray,
    setModifidImageArray,
    setGeneratedImgList
  } = useAppState();

  useEffect(() => {
    console.log("render");
  }, [selectedImg, setSelectedImg, loader]);

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `https://tvjjvhjhvxwpkohjqxld.supabase.co/rest/v1/public_images?select=*&order=created_at.desc&user_id=eq.${userId}`,
        {
          method: "GET",
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2amp2aGpodnh3cGtvaGpxeGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI4Njg5NDQsImV4cCI6MjAwODQ0NDk0NH0.dwKxNDrr7Jw5OjeHgIbk8RLyvJuQVwZ_48Bv71P1n3Y", // Replace with your actual API key
          },
        }
      );
      const data = await response.json();

      setGeneratedImgList(await data)
      // setImages(data); // Update the state with the fetched images
      // setGeneratedImgList(data)

      // if(data[0]?.prompt === prompt){

      // }
      // return data;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const upateImage = (url) => {
    setSelectedImg({ status: true, image: url });
    setModifidImageArray((pre) => [
      ...pre,
      { url: url, tool: "generated-selected" },
    ]);

    // canvasInstance.current.clear();

    // addimgToCanvasGen(url);
  };

  useEffect(() => {
    let pollInterval

    if(userId){
      console.log("dfd", userId)


    
     pollInterval = setInterval(() => {

      console.log("polling", userId)
      fetchImages(); // Fetch images every 10
    }, 10000); // Adjust the interval as needed (e.g., 20000 for 20 seconds)
  }

    // Don't forget to clean up the interval when the component unmounts
    return () => clearInterval(pollInterval);
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <MainPages>
      {loader ? <Loader /> : null}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="news"
      >
        {popup?.status ? <PopupUpload /> : null}
        <Sidebar />
        <div className="Editor">
          <BottomTab />

          {generatedImgList?.length > 1 ? (
            <div className="generatedBox">
              <div className="itemsWrapper">
                {generatedImgList?.map((item, i) => (
                  <div
                    key={i}
                    className="items"
                    onClick={() => upateImage(item?.modified_image_url)}
                  >
                    <picture>
                      <img src={item?.modified_image_url} alt="" />
                    </picture>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="main-privier"></div>
          <div className="canvase">
            <Canvas />
            <div className="generated">
              {selectedImg?.status ? (
                <picture>
                  {/* <img src={selectedImg?.image} alt="" /> */}
                  <img
                    src={modifidImageArray[modifidImageArray.length - 1]?.url}
                    alt=""
                  />
                </picture>
              ) : null}
            </div>
            {/* // ) : ( */}
          </div>
          {/* <CanvasBox /> */}
        </div>
      </motion.div>
    </MainPages>
  );
}

const MainPages = styled.div`
  .generated {
    /* width: 400px;
    height: 440px; */
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* padding: 20px; */
    border: 2px solid rgba(249, 208, 13, 1);
    border-radius: 16px;

    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
      transition: all 0.3s ease;

      /* &:hover{
      transform: scale(1.01);
    } */
    }
  }
  .canvase {
    display: grid;
    padding-right: 100px !important;
    grid-template-columns: 1fr 1fr;
    /* justify-content: center; */
    /* align-items: center; */
    height: 75%;
    /* background-color: #13bba4; */
    gap: 2rem;
    padding: 20px;
    padding-top: 100px;
  }

  .generatedBox {
    /* width: 100%; */
    display: flex;
    position: absolute;
    bottom: 40px;
    left: 20px;
    /* right: 20px; */
    justify-content: right;
    z-index: 10;

    .itemsWrapper {
      display: flex;
      /* flex-direction: column; */

      gap: 10px;
      background-color: rgba(248, 248, 248, 1);
      padding: 10px 20px;
      border-radius: 8px;
    }
    .items {
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 4px;
      overflow: hidden;
      &:hover {
        transform: scale(1.1);
      }

      img {
        width: 100px;
        height: 100px;
      }
    }
  }

  display: block;
  width: 100%;
  min-height: 100vh;
  .news {
    display: flex;
    min-width: 100%;
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
  .overlay {
    position: fixed;
    z-index: 999;
    top: 100px;
  }
  .Editor {
    width: 100%;
    min-height: 100%;
    position: relative;
  }
  .main-privier {
    padding: 2rem;
    padding-top: ${({ theme }) => theme.paddings.paddingTop};
    width: 100%;
    height: 100%;
    display: none;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    .main-privier {
    padding: 2rem;
    padding-top: ${({ theme }) => theme.paddings.paddingTopMobile};
    }
    
  `}

  .convas-continer {
    /* border: 1px solid #434343; */
    width: 100%;
    min-height: 100%;
    position: absolute;
    top: 0;
  }

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
  .canvas-style {
    width: 100%;
    height: 100%;
    display: block;
  }
`;
