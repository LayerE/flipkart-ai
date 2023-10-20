import React, { useEffect } from "react";

import Sidebar3d from "@/components/Sidebar/Generate3d";
import QuickBar from "@/components/Sidebar/QuickSlidbar";
import styled from "styled-components";
import { useAppState } from "@/context/app.context";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";
import QuickCanvas from "@/components/Canvas/Quick";



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
      // addimgToCanvasGen(url);
      setSelectedImg({ status: true, image: url });
      setDownloadImg(url);
    }
  };

  useEffect(() => {
    const times = setInterval(() => {
      if (isReady && userId) {
        // fetchGeneratedImages(userId);
        fetchAssetsImages();
        console.log('dgfdfd')
      }
    }, 5000);

    return () => {
      clearInterval(times);
    };
  }, [isReady,userId]);

  const fetchAssetsImages = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/generatedQuickImg?userId=${userId}`,
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
        {/* <div className="outputbox"></div> */}
        <QuickCanvas/>
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
    width: 100%;
    display: flex;
    position: absolute;
    bottom: 0px;
    padding-right: 30px;
    left: 20px;
    right: 20px;
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
