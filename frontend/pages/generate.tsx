import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Sidebar from "@/components/Sidebar";
import { styled } from "styled-components";
import { useAppState } from "@/context/app.context";
import assets from "@/public/assets";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });
const MainPage = styled.div`
  display: flex;
  .loader{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #3f3a3a40;
    font-size: 24px;
    color: #f9d00d;

  }

  .main-privier {
    padding: 2rem;
    padding-top: ${({ theme }) => theme.paddings.paddingTop};
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
      height: 350px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .imgadd {
        margin: 10px 0;
        width: 100%;
        max-height: 250px;
      }
      .more {
        padding: 0 50px;
        width: 100%;
        height: 100%;
      }
      picture{
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
`;

export default function Home() {
  const { selectedImage, setSelectedImage , modifidImage, setModifidImage, 
    previewLoader, setPriviewLoader,
  } = useAppState();

  useEffect(() => {
    console.log("new render")
   
  }, [previewLoader, modifidImage])
  

  return (
    <MainPage>
      <Sidebar />
      <div className="main-privier">
        <div className="tgide">
          <div className="preBox">
            <p>Place Your Product Here</p>
            <div className="imgadd">
              {selectedImage?.url ? (
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
               
              ) : (
                <div className="more">
                  <Image src={assets.images.dotbox} alt=""></Image>
                </div>
              )}
            </div>
            <p className="center">Step 1: Place your product inside here</p>
          </div>
          {selectedImage?.id > -1 ? (
            <div className="preBox">
              <p>Place Your Product Here</p>
              {
                previewLoader?
              <div className="loader">Loading...</div>
                
                :null
              }
              <div className="imgadd">

                {
                  modifidImage !== "" ? 
                    <img
                    src={modifidImage}
                    alt=""
                  /> 

                  :
                  <div className="more">
                  <Image src={assets.images.dotbox} alt=""></Image>
                </div>

                }
              
               
              </div>
              <p className="center">Step 1: Place your product inside here</p>
            </div>
          ) : null}
        </div>
      </div>
    </MainPage>
  );
}
