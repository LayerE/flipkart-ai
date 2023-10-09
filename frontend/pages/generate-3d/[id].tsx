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
import CanvasBox from "@/components/Canvas";
// const CanvasBox = lazy(() => import("@/components/Canvas"));
import { useAuth } from "@clerk/nextjs";
import assert from "assert";
import assets from "@/public/assets";
import Regeneret from "@/components/Popup/Regeneret";
import { useRouter } from "next/router";
import Canvas3d from "@/components/Canvas/Canvas3d";
import Sidebar3d from "@/components/Sidebar/Generate3d";
import ThreeScene from "@/components/Canvas/3d/gltf";
import TDS from "@/components/Canvas/3d/tds";
import GLTF from "@/components/Canvas/3d/gltf";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

export default function Home() {
  const { userId } = useAuth();
  const { query, isReady } = useRouter();
  // const { id } = query;
  const id = (query.id as string[]) || [];

//   const [tdFormate, setTdFormate] = useState("obj");

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
    fetchGeneratedImages,
    regeneratePopup,
    generateImageHandeler,
    SaveProjexts,
    newassetonCanvas,
    setNewassetonCanvas,
    GetProjextById,
    setproject,
    project,
    jobId,
    addimgToCanvasSubject,
    projectId,
    setprojectId,
    uerId,
    setUserId,
    setGeneratedImgList,
    saveCanvasToDatabase,
    filteredArray,
    setFilteredArray,
    jobIdOne,
    setJobIdOne,
    setCanvasDisable,
    setassetsActiveTab,
    TDMode,
    set3dMode
    // tdFormate, setTdFormate

  } = useAppState();

  useEffect(() => {
    // const getUser = localStorage.getItem("userId");
    // if (!getUser) {
    //   if (userId) localStorage.setItem("userId", userId);
    // }
    if (isReady) {
      // setFilteredArray([])
      GetProjextById(id);
      //  fetchAssetsImages(userId, null);
      console.log(TDMode, "dddddddddddddddddddddddddddddddd");
    }
    set3dMode(true)

  }, [id, isReady, TDMode]);

  useEffect(() => {
    const times = setInterval(() => {
      if (isReady && userId) {
        fetchGeneratedImages(userId);
      }
    }, 5000);

    return () => {
      clearInterval(times);
    };
  }, []);

  const upateImage = (url) => {
    if (!loader) {
      addimgToCanvasGen(url);
      setSelectedImg({ status: true, image: url });
      setModifidImageArray((pre) => [
        ...pre,
        { url: url, tool: "generated-selected" },
      ]);
    }
  };

  useEffect(() => {
    setprojectId(id);
    setUserId(userId);
    setassetsActiveTab("product");
    // let filteredResult;

    // filteredResult = generatedImgList.filter((obj) =>
    //   jobId?.includes(obj?.task_id)
    // );

    // setFilteredArray(filteredResult);

    const canvas1 = canvasInstance.current;

    const objects = canvas1?.getObjects();
    const subjectObjects = [];
    objects?.forEach((object) => {
      if (object.category === "subject") {
        subjectObjects.push(object);
      }
    });

    // if (filteredResult?.length < jobId?.length) {
    //   // addimgToCanvasGen(filteredResult[0]?.modified_image_url);
    // }

    return () => {
      // setprojectId(null);
    };
  }, [jobId, setGeneratedImgList, regeneratePopup]);

  useEffect(() => {
    let time = setInterval(() => {
      if (isReady && userId) {
        fetchAssetsImages();
      }
    }, 5000);
    return () => {
      clearInterval(time);
    };
  }, [isReady, userId, jobId]);

  useEffect(() => {
    return () => {
      // setFilteredArray([]);
    };
  }, []);

  const fetchAssetsImages = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/generated3dImg?userId=${userId}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      // console.log(await data, "dfdd");
      console.log(data, "JOB");
      console.log(jobId, "JOBS");

      if (data?.length) {
        const filteredResults = await data?.filter((obj) =>
          jobIdOne?.includes(obj?.task_id)
        );
        // console.log(data?.length);

        const filteredResultss = data?.map(
          (obj) => obj?.task_id === jobIdOne[0]
        );
        console.log(filteredResults,"dfd", filteredResultss)

        if (filteredResults?.length) {
          // console.log(filteredResults,"fddscvcvcvcgd",jobIdOne)
          setLoader(false);
          setCanvasDisable(true);

          setJobIdOne([]);
        }

        setFilteredArray(data);
      }

      // setImages(data); // Update the state with the fetched images
      // setGeneratedImgList(data)

      // if(data[0]?.prompt === prompt){

      // }
      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const firstUpdate = useRef(true);

  useEffect(() => {
    const canvas1 = canvasInstance.current;

    const objects = canvas1?.getObjects();
    const subjectObjects = [];
    objects?.forEach((object) => {
      if (object.category === "subject") {
        subjectObjects.push(object);
      }
    });
    const state = false;
    setTimeout(() => {
      if (subjectObjects.length <= 0 && newassetonCanvas !== null) {
        console.log(
          newassetonCanvas,
          subjectObjects.length,
          newassetonCanvas !== null
        );
        let state = true;
        if (newassetonCanvas !== null && state) {
          state = false;

          addimgToCanvasSubject(newassetonCanvas);
        }

        setNewassetonCanvas(null);
      }
    }, 1000);
  }, []);

  return (
    <MainPages>
      {/* {loader ? <Loader /> : null} */}

      <div className="news">
        {popup?.status ? <PopupUpload /> : null}

        <Sidebar3d />
        <div
          className="Editor"
          ref={outerDivRef}
          style={
            {
              // overflow: 'auto', // Enable scrollbars
            }
          }
        >
          {regeneratePopup.status ? <Regeneret /> : null}

          <BottomTab />

          {filteredArray?.length > 0 ? (
            <div className="generatedBox">
              <div className="itemsWrapper">
                {filteredArray?.map((item, i) => (
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
                {/* {loader ? null : (
                  <div
                    className="itemsadd"
                    onClick={() => generateImageHandeler(userId, id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7 0C7.26522 0 7.51957 0.105357 7.70711 0.292893C7.89464 0.48043 8 0.734784 8 1V6H13C13.2652 6 13.5196 6.10536 13.7071 6.29289C13.8946 6.48043 14 6.73478 14 7C14 7.26522 13.8946 7.51957 13.7071 7.70711C13.5196 7.89464 13.2652 8 13 8H8V13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13V8H1C0.734784 8 0.48043 7.89464 0.292893 7.70711C0.105357 7.51957 0 7.26522 0 7C0 6.73478 0.105357 6.48043 0.292893 6.29289C0.48043 6.10536 0.734784 6 1 6H6V1C6 0.734784 6.10536 0.48043 6.29289 0.292893C6.48043 0.105357 6.73478 0 7 0Z"
                        fill="#585858"
                      />
                    </svg>
                  </div>
                )} */}
              </div>
            </div>
          ) : null}

          <div className="main-privier"></div>
          {/* <div className="canvase">
            <Canvas />
            <div className="generated">
              {selectedImg?.status ? (
                <picture>
               
                  <img
                    src={modifidImageArray[modifidImageArray.length - 1]?.url}
                    alt=""
                  />
                </picture>
              ) : null}
            </div>
            
          </div> */}
            <Canvas3d />
          {/* {tdFormate === "obj" ? (
          ) : tdFormate === "tds" ? (
            <TDS />
          ) : tdFormate === "gltf" ? (
            <GLTF />
          ) : null} */}
        </div>
      </div>
    </MainPages>
  );
}

const MainPages = styled.div`
  position: relative;
  .generated {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(249, 208, 13, 1);
    border-radius: 16px;

    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
      transition: all 0.3s ease;
    }
  }
  .canvase {
    display: grid;
    padding-right: 100px !important;
    grid-template-columns: 1fr 1fr;
    height: 75%;
    gap: 2rem;
    padding: 20px;
    padding-top: 100px;
  }

  .generatedBox {
    width: 100%;
    display: flex;
    position: absolute;
    bottom: 40px;
    padding-right: 30px;
    left: 20px;
    /* right: 20px; */
    justify-content: right;
    z-index: 10;
    z-index: 100;

    .itemsWrapper {
      display: flex;
      /* flex-direction: column; */
      width: 100%;
      gap: 10px;
      background-color: rgba(248, 248, 248, 1);
      padding: 10px 20px;
      border-radius: 8px;
      overflow: auto;

      &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      /* Track */
      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey;
        border-radius: 10px;
        height: 7px;
      }

      /* Handle */
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
      }
    }
    .items {
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 4px;
      min-width: 100px;
      overflow: hidden;
      &:hover {
        transform: scale(1.1);
      }

      img {
        width: 100px;
        height: 100px;
      }
    }
    .itemsadd {
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 4px;
      min-width: 100px;
      overflow: hidden;
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #dee0e0;

      &:hover {
        transform: scale(1.1);
      }

      img {
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
