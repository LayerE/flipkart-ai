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
  visible: { opacity: 1, transition: { duration: 1 } },
};

import { motion } from "framer-motion";
import EditorSection from "./Editor";
import Tamplates from "./Templates";

const Generate = () => {
  const {
    product,
    placementTest,
    backgroundTest,
    surroundingTest,
    promt,
    setpromt,
    imageArray,
    setImageArray,
    generationLoader,
    setGenerationLoader,
    setModifidImageArray,
  } = useAppState();

  const [changeTab, setChangeTab] = useState(false);
  // const imageArrays = JSON.parse(localStorage.getItem("g-images")) || [];

  console.log(imageArray);
  const generateImageHandeler = async () => {
    setGenerationLoader(true);
    try {
      const data = await generateimge(promt);
      console.log(data, "dff");
      if (data) {
        setImageArray((prev) => [
          ...prev,
          { url: data.url, baseUrl: data.baseUrl },
        ]);
      }
      console.log(data, "dff", imageArray);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setGenerationLoader(false);
    }
  };
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="accest"
    >
      <div className="gap">
        <Row>
          {/* <TestArea value={promt} onChange={(e) => setpromt(e.target.value)} /> */}
          <PromtGeneratePreview className="generatePreview">
            {product !== null && product !== "" ? (
              <label
                htmlFor="prompt-editor-subject-0-input"
                className="promtText"
              >
                {product}{" "}
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
            {surroundingTest !== null && surroundingTest !== "" ? (
              <label
                htmlFor="prompt-editor-subject-2-input"
                className="promtText"
              >
                {surroundingTest}{" "}
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
