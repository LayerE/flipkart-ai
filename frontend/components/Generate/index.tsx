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

const Generate = () => {
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

  console.log(imageArray);
  const generateImageHandeler = async () => {
    setGenerationLoader(true)
    try {
      const data = await generateimge(promt);
      console.log(data, "dff");
      if (data) {
        setImageArray((prev) => [...prev, {url:data.url, baseUrl:data.baseUrl}]);
      
      }
      console.log(data, "dff",imageArray);

    } catch (error) {
      console.error("Error generating image:", error);
    } finally{
      setGenerationLoader(false)
    }
  };

  return (
    <motion.div 
    initial="hidden"
    animate="visible"
    variants={fadeIn}
    className="accest">
      <div className="gap">
        <Row>
          <TestArea value={promt} onChange={(e) => setpromt(e.target.value)} />
        </Row>
        <Row>
          <Button onClick={() => generateImageHandeler()} disabled={promt === ""? true: false}>{ generationLoader ? "Loading...": "Generate"}</Button>
        </Row>
      </div>
      <div className="bigGap">
        {/* <Label>Edit the the prompt in the form below.</Label> */}
      </div>
      <div className="gap">
        <ResponsiveRowWraptwo>
          {imageArray.map((test, i) => (
            <div
              key={i}
              className={
                selectedImage.id === i ? "imageBox ativeimg" : "imageBox"
              }
              onClick={() =>{ setSelectedImage({ id: i, url: test.url ,baseUrl: test.baseUrl, tools: {bgRemove:false, removeText:false, replaceBg:false, psn:false, pde:false, superResolution:false,magic:false} }); setModifidImageArray([])}}
            >
              <picture>
                <img src={test.baseUrl} alt="" />
              </picture>
            </div>
          ))}
        </ResponsiveRowWraptwo>
      </div>
      {/* <div className="filde gap">
        <DisabledLabel>Product</DisabledLabel>
        <Input value={product}  onChange={(e)=> setProduct(e.target.value)}></Input>
      </div>
      <div className="gap">
        <DisabledLabel>Placement</DisabledLabel>
        <div className="two-side">
          <DropdownInput
            data={{
              list: placementList,
              action: setSelectedPlacement,
              label: "placement",

              activeTab: selectPlacement,
            }}
          ></DropdownInput>
          <Input value={placementTest}  onChange={(e)=> setPlacementTest(e.target.value)}></Input>
        </div>
      </div>
      <div className="gap">
        <DisabledLabel>Surrounding</DisabledLabel>
        <div className="two-side">
          <DropdownInput
            data={{
              list: surroundingList,
              action: setSelectedSurrounding,
              label: "surrounding",

              
              activeTab: selectSurrounding,
            }}
          ></DropdownInput>
          <Input value={surroundingTest}  onChange={(e)=> setSurroundingTest(e.target.value)}></Input>
        </div>
      </div>
      <div className="gap">
        <DisabledLabel>Background</DisabledLabel>
        <div className="two-side">
          <DropdownInput
            data={{
              list: BackgroundList,
              label: "background",

              action: setSelectedBackground,
              activeTab: selectBackground,
            }}
          ></DropdownInput>
          <Input value={backgroundTest}  onChange={(e)=> setBackgrundTest(e.target.value)}></Input>
        </div>
      </div>
      <div className="rowwothtwo">
        <Label>Number of results</Label>
        <div className="dropdown-smaill">
          <DropdownNOBorder
            data={{
              list: resultList,
              action: setSelectedRender,
              activeTab: selectResult,
            }}
          ></DropdownNOBorder>
        </div>
      </div>
      <div className="rowwothtwo">
        <Label>Render strength</Label>
        <div className="dropdown-smaill">
          <DropdownNOBorder
            data={{
              list: resultList,
              action: setSelectedRender,
              activeTab: selectRunder,
            }}
          ></DropdownNOBorder>
        </div>
      </div>
      <div className="rowwothtwo">
        <Label>Color strength</Label>
        <div className="dropdown-smaill">
          <DropdownNOBorder
            data={{
              list: resultList,
              action: setSelectedColoreStrength,
              activeTab: selectColoreStrength,
            }}
          ></DropdownNOBorder>
        </div>
      </div>
      <div className="rowwothtwo">
        <Label>Outline strength</Label>
        <div className="dropdown-smaill">
          <DropdownNOBorder
            data={{
              list: resultList,
              action: setSelectedOutline,
              activeTab: selectOutLline,
            }}
          ></DropdownNOBorder>
        </div>
      </div> */}
    </motion.div>
  );
};

export default Generate;
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
