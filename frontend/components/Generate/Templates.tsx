import React, { useEffect, useState } from "react";
import { Row } from "../common/Row";
import { Input, TestArea } from "../common/Input";
import Button from "../common/Button";
import Label, { DisabledLabel } from "../common/Label";
import DropdownInput, { DropdownNOBorder } from "../common/Dropdown";
import {
  BackgroundList,
  placementList,
  resultList,
  surroundingList,
  templets,
  test,
} from "@/store/dropdown";
import { useAppState } from "@/context/app.context";
import { styled } from "styled-components";
import { BgRemover, generateimge } from "@/store/api";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } }
};


import { motion } from "framer-motion";

const Tamplates = () => {
  const {
    selectPlacement,
    setSelectedPlacement,
    selectSurrounding,
    setSelectedSurrounding,
    selectBackground,
    setSelectedBackground,
    selectResult,
    setSelectedresult,
    selectRunder,
    setSelectedRender,
    selectColoreStrength,
    setSelectedColoreStrength,
    selectOutLline,
    setSelectedOutline,
    promt,
    setpromt,
    product,
    setProduct,
    placementTest,
    setPlacementTest,
    backgroundTest,
    setBackgrundTest,
    surroundingTest,
    setSurroundingTest,
    setSelectedImage,
    selectedImage,
    modifidImage,
    setModifidImage,
    imageArray, setImageArray,
    previewLoader, setPriviewLoader,
    generationLoader, setGenerationLoader,
    setModifidImageArray
  } = useAppState();


  // const imageArrays = JSON.parse(localStorage.getItem("g-images")) || [];

  

  return (
    <motion.div 
    initial="hidden"
    animate="visible"
    variants={fadeIn}
    className="accest">

<ResponsiveRowWraptwo>
          {templets.map((test, i) => (
            <div
              key={i}
              className={
                selectedImage.id === i ? "imageBox ativeimg" : "imageBox"
              }
              onClick={() => {
                setSelectedImage({
                  id: i,
                  url: test.image,
                  baseUrl: test.image,
                  tools: {
                    bgRemove: false,
                    removeText: false,
                    replaceBg: false,
                    psn: false,
                    pde: false,
                    superResolution: false,
                    magic: false,
                  },
                });
                setModifidImageArray([]);
              }}
            >
              <picture>
                <img src={test.image} alt="" />
              </picture>
            </div>
          ))}
        </ResponsiveRowWraptwo>
      
    
    </motion.div>
  );
};

export default Tamplates;
export const ResponsiveRowWraptwo = styled(Row)`
  display: grid !important;
  gap: 1rem;
  ${({ theme }) => theme.minMediaWidth.atleastSmall`
      grid-template-columns: repeat(2, 1fr);
  `}
  ${({ theme }) => theme.minMediaWidth.atleastLarge`
    grid-template-columns: repeat(2, 1fr);
   `}
`;
