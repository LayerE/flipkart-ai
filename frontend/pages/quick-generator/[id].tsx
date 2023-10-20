import React, { useEffect } from "react";

import Sidebar3d from "@/components/Sidebar/Generate3d";
import QuickBar from "@/components/Sidebar/QuickSlidbar";
import styled from "styled-components";
import { useAppState } from "@/context/app.context";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";
import Quick from "@/components/Canvas/quick";


const QuickGenerator = () => {
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
    setDownloadImg,
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
    set3dMode,
    userId,
    setUserID,
  } = useAppState();


  const { query, isReady } = useRouter();
  const id = (query.id as string[]) || [];
  useEffect(() => {
    if (isReady) {
      const checkSession = async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // router.push("/");
          setUserID(data.session.user.id);
        
        }else{
          // router.push("/sign-in");

        }
      };
      checkSession();
      
    }
  }, []);
  const upateImage = (url) => {
    if (!loader) {
      addimgToCanvasGen(url);
      setSelectedImg({ status: true, image: url });
      setDownloadImg(url);
    }
  };

  useEffect(() => {
    const times = setInterval(() => {
      if (isReady && userId) {
        fetchGeneratedImages(userId);
        fetchAssetsImages();
      }
    }, 5000);

    return () => {
      clearInterval(times);
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
        console.log(filteredResults, "dfd", filteredResultss);

        if (filteredResults?.length) {
          // console.log(filteredResults,"fddscvcvcvcgd",jobIdOne)
          setLoader(false);
          setCanvasDisable(true);

          setJobIdOne([]);
        }

        setFilteredArray(data);
      }

      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };
  return (
    <MainPages>
      <QuickBar />
      <div className="Editor">
        {/* <div className="outputbox"></div> */}
        <Quick/>
      </div>
    </MainPages>
  );
};

export default QuickGenerator;

const MainPages = styled.div`
  position: relative;

  display: flex;
  width: 100%;
  min-height: 100vh;

  .Editor {
    width: 100%;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    height: 100vh;
    display: flex;
    /* justify-content: center;
    align-items: center; */
    /* padding-top: 100px; */
  }

  /* .outputbox {
    width: 512px;
    height: 512px;
    border: 2px solid rgba(249, 208, 13, 1);
    transform: scale(0.8);
    background-color: rgba(249, 208, 13, 0.23);
  } */
  .generatedBox {
    /* width: 100%;
    display: flex;
    position: absolute;
    bottom: 0px;
    padding-right: 30px;
    left: 20px;
    /* right: 20px; */
    /* justify-content: right;
    z-index: 10;
    z-index: 100; */ */

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
`;
