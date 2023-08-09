import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Sidebar from "@/components/Sidebar";
import { styled } from "styled-components";
import { useAppState } from "@/context/app.context";
import assets from "@/public/assets";
import { useEffect } from "react";
import { FileUpload } from "@/components/common/Input";
import { motion } from "framer-motion";
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const inter = Inter({ subsets: ["latin"] });
const MainPage = styled.div`
.new{
  display: flex;

}  .loader {
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
    position: relative;
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
          /* max-width: max-content !importent; */
        }
        img {
          cursor: pointer;
          width: 50px;
          height: 50px;
        }
      }
    }
  }
`;

export default function Home() {
  const {
    selectedImage,
    setSelectedImage,
    modifidImage,
    setModifidImage,
    previewLoader,
    setPriviewLoader,
    modifidImageArray,
    bgRemove,
    setModifidImageArray,
    undoArray,
    setUndoArray,
  } = useAppState();

  useEffect(() => {
    console.log("new render");
  }, [previewLoader, modifidImage, modifidImageArray]);
  const handileUndo = () => {
    if (modifidImageArray.length > 0) {
      setUndoArray((pre) => [
        ...pre,
        modifidImageArray[modifidImageArray.length - 1],
      ]);

      setModifidImageArray((pre) => {
        const lastElement = pre[pre.length - 1];
        if (lastElement && lastElement.tool) {
          setSelectedImage((prevState) => ({
            ...prevState,
            tools: {
              ...prevState.tools,
              [lastElement.tool]: false,
            },
          }));
        }

        return pre.slice(0, -1);
      });
    }
  };
  const handilePre = () => {
    if (undoArray.length > 0) {
      setModifidImageArray((pre) => [...pre, undoArray[undoArray.length - 1]]);
      setUndoArray((pre) => {
        const lastElement = pre[pre.length - 1];
        if (lastElement && lastElement.tool) {
          setSelectedImage((prevState) => ({
            ...prevState,
            tools: {
              ...prevState.tools,
              [lastElement.tool]: true,
            },
          }));
        }

        return pre.slice(0, -1);
      });
    }
  };

  return (
    <MainPage>
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="new">
      <Sidebar />
      <div className="main-privier">
        {modifidImageArray.length > 0 ? (
          <div className="undoBox">
            <div className="undoWrapper">
             {
              modifidImageArray.length >0 ?
              <div className="undo" onClick={() => handileUndo()}>
              <picture>
                <img
                  width="80"
                  height="80"
                  src="https://img.icons8.com/dotty/80/undo.png"
                  alt="undo"
                />
              </picture>
            </div>: null
             }
             {
              undoArray.length >0?
              <div className="undo" onClick={() => handilePre()}>
              <picture>
                <img
                  width="80"
                  height="80"
                  src="https://img.icons8.com/dotty/80/redo.png"
                  alt="redo"
                />
              </picture>
            </div>:null
             }
            </div>
          </div>
        ) : null}
        <div className="tgide">
          <motion.div className="preBox"
            initial="hidden" animate="visible" variants={fadeIn}
          
          >
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
                  <Image src={assets.images.dotbox} alt=""></Image>
                </div>
              )}
            </div>
            <p className="center">Step 1: Place your product inside here</p>
          </motion.div>
          {selectedImage?.id > -1 ? (
            <motion.div 
            initial="hidden" animate="visible" variants={fadeIn}
            className="preBox">
              <p>Place Your Product Here</p>
              {previewLoader ? <div className="loader">Loading...</div> : null}
              <div className="imgadd">
                {modifidImageArray.length ? (
                  <img
                    src={modifidImageArray[modifidImageArray.length - 1].url}
                    alt=""
                  />
                ) : (
                  <div className="more">
                    <Image src={assets.images.dotbox} alt=""></Image>
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
