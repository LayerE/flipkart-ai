import React, { useEffect, useState } from "react";
import { Row } from "../common/Row";
import Button from "../common/Button";
import { useAppState } from "@/context/app.context";
import { styled } from "styled-components";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

import { motion } from "framer-motion";
import EditorSection from "./Editor";
import Tamplates from "./Templates";
import { fabric } from "fabric";
import Label, { DisabledLabel } from "../common/Label";
import SuggetionInput from "./SuggetionInput";
import { PlacementSuggestions, productSuggestions } from "@/store/dropdown";

const Generate = () => {
  const {
    product,
    placementTest,
    backgroundTest,
    surroundingTest,
    generationLoader,
    setGenerationLoader,
    selectPlacement,
    selectSurrounding,
    selectBackground,
    getBase64FromUrl,
    canvasInstance,
    setProduct,
    selectedImg
  } = useAppState();

  const [changeTab, setChangeTab] = useState(false);
  // const imageArrays = JSON.parse(localStorage.getItem("g-images")) || [];

  const addimgToCanvas = async (url: string) => {
    fabric.Image.fromURL(await getBase64FromUrl(url), function (img: any) {
      // Set the image's dimensions
      img.scaleToWidth(380);
      img.scaleToHeight(400);
      // Scale the image to have the same width and height as the rectangle
      const scaleX = 380 / img.width;
      const scaleY = 400 / img.height;
      // Position the image to be in the center of the rectangle
      img.set({
        left: 450,
        top: 200,
        scaleX: scaleX,
        scaleY: scaleY,
      });

      canvasInstance.current.add(img);
      canvasInstance.current.renderAll();
    });
  };
/* eslint-disable */

  const generateImageHandeler = async () => {
    const promt =
      product +" "+
      selectPlacement + " "+
      placementTest + " "+
      selectSurrounding + " "+
      surroundingTest + " "+
      selectBackground + " "+
      backgroundTest;

      console.log(promt)

    setGenerationLoader(true);
    try {

      // selectedImg // img url to generate images for the canvas

      // add thegenerated imag herar 
      await addimgToCanvas(
        "https://www.hindustantimes.com/ht-img/img/2023/09/01/550x309/Screenshot_2023-09-01_140200_1693557169316_1693557177265.png"
      );
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setGenerationLoader(false);
    }
  };

  const ProductSuggestionsFilter = productSuggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(product.toLowerCase())
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="accest"
    >
      <div className="gap">
        <div className="filde ">
          <Label>What's your Product</Label>
          <SuggetionInput
            value={product}
            setValue={setProduct}
            suggetion={ProductSuggestionsFilter}
          />
        </div>
        <Row>
          <PromtGeneratePreview className="generatePreview">
            {product !== null && product !== "" ? (
              <label
                htmlFor="prompt-editor-subject-0-input"
                className="promtText"
              >
                {product}{" "}
              </label>
            ) : null}
            {selectPlacement !== null && selectPlacement !== "" ? (
              <label
                htmlFor="prompt-editor-subject-1-input"
                className="promtText"
              >
                {selectPlacement}{" "}
              </label>
            ) : null}
            {placementTest !== null && placementTest !== "" ? (
              <label
                htmlFor="prompt-editor-subject-1-input"
                className="promtText"
              >
                {placementTest}{" "}
              </label>
            ) : null}
            {selectSurrounding !== null && selectSurrounding !== "" ? (
              <label
                htmlFor="prompt-editor-subject-1-input"
                className="promtText"
              >
                {selectSurrounding}{" "}
              </label>
            ) : null}
            {surroundingTest !== null && surroundingTest !== "" ? (
              <label
                htmlFor="prompt-editor-subject-2-input"
                className="promtText"
              >
                {surroundingTest}{" "}
              </label>
            ) : null}
            {selectBackground !== null && selectBackground !== "" ? (
              <label
                htmlFor="prompt-editor-subject-1-input"
                className="promtText"
              >
                {selectBackground}{" "}
              </label>
            ) : null}
            {backgroundTest !== null && backgroundTest !== "" ? (
              <label
                htmlFor="prompt-editor-subject-3-input"
                className="promtText"
              >
                {","} {backgroundTest}{" "}
              </label>
            ) : null}
          </PromtGeneratePreview>
        </Row>
        <Row>
          <Button
            onClick={() => generateImageHandeler()}
            disabled={product === "" ? true : false}
          >
            {generationLoader ? "Loading..." : "Generate"}
          </Button>
        </Row>
      </div>
      <div className="bigGap">
        {/* <Label>Edit the the prompt in the form below.</Label> */}
      </div>
      <div className="gap"></div>
      <SwchichBtn className="swich">
        <div
          className={changeTab ? "btnswitch " : "btnswitch activeSwitch"}
          onClick={() => setChangeTab(false)}
        >
          Templates
        </div>
        <div
          className={changeTab ? "btnswitch activeSwitch" : "btnswitch "}
          onClick={() => setChangeTab(true)}
        >
          Editor
        </div>
      </SwchichBtn>
      <Wrapper className="wrappper">
        {changeTab ? <EditorSection /> : <Tamplates />}
      </Wrapper>
    </motion.div>
  );
};

export default Generate;

export const PromtGeneratePreview = styled.div`
  border: 1px solid rgba(0, 0, 0, 1);
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  min-height: 40px;

  .promtText {
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    &:hover {
      color: rgba(249, 208, 13, 1);
    }
  }
`;

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

export const SwchichBtn = styled(Row)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  .btnswitch {
    width: 100%;
    text-align: center;
    cursor: pointer;
    /* transition: all 0.2s ease-in-out ; */
  }
  .activeSwitch {
    border-bottom: 5px solid rgba(249, 208, 13, 1);
  }
`;
export const Wrapper = styled.div`
  /* max-height: 600px;
  overflow-y: scroll; */
`;
