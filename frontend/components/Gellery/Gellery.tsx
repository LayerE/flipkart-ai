import { images } from "@/next.config";
import React, { useEffect, useState } from "react";
import { styled } from "styled-components";

import { motion } from "framer-motion";
import { useAppState } from "@/context/app.context";
import { useAuth } from "@clerk/nextjs";
import PopupCard from "../Popup/PopupCard";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const Gellery = () => {
  const { userId } = useAuth();

  const { fetchGeneratedImages, generatedImgList,setPopupImage, setGeneratedImgList } =
    useAppState();

  useEffect(() => {
    if (userId) {
      fetchGeneratedImages(userId);
    }
  }, []);

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      <GelleryWrapper>
        <div className="hederbox">
          <div className="headerText">Gallery</div>
          {/* <div className="small-tabs">
          <div className="tab">Product Images </div>
          <div className="tab">Al Model Images </div>
        </div> */}
        </div>

        <div className="imageBox">
          <div className="grid-img">
            {generatedImgList?.map((image, i) => (
              <div key={i} className="img" onClick={()=> setPopupImage({url:image?.modified_image_url, status: true})}>
                <picture>
                  <img src={image?.modified_image_url} alt="" />
                </picture>
              </div>
            ))}
          </div>
        </div>
      </GelleryWrapper>
    </motion.div>
  );
};

export default Gellery;

const GelleryWrapper = styled.div`
  height: 100%;
  .headerText {
    font-size: 32px;
    font-weight: 700;
  }
  .hederbox {
    display: flex;
    gap: 50px;

    .small-tabs {
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: start;
    }
    .tab {
      font-size: 16px;
      font-weight: 500;
      background: #ececec;
      height: max-content;
      padding: 4px 15px;
      border-radius: 7px;
    }
  }
  .imageBox {
    margin-top: 20px;
    border-radius: 7px;
    border: 1px solid #d9d9d9;
    min-height: 75vh;

    .grid-img {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      gap: 20px;
      padding: 20px;
      min-height: 100%;
    }
    .img {
      width: 100%;
      height: 180px;
      background-color: #d9d9d9;
      border-radius: 7px;
      overflow: hidden;
      border: 1px solid #d9d9d9;
      transition: all 0.3s ease-in-out;
      &:hover {
        border: 3px solid rgba(249, 208, 13, 1);
        transform: scale(1.1);
      }
    }
    img {
      width: 100%;
      height: 180px;
      /* object-fit: cover; */
    }
  }
`;
