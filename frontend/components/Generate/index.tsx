import React, { useEffect, useState } from "react";
import { Row } from "../common/Row";
import Button from "../common/Button";
import { useAppState } from "@/context/app.context";
import { styled } from "styled-components";
import { useAuth } from "@clerk/nextjs";
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

import { motion } from "framer-motion";
import EditorSection from "./Editor";
import Tamplates from "./Templates";
import { fabric } from "fabric";
import Label, { DisabledLabel } from "../common/Label";
import SuggetionInput from "./SuggetionInput";
import {
  Loara,
  PlacementSuggestions,
  categoryList,
  productSuggestions,
  resultList,
} from "@/store/dropdown";
import TextLoader from "../Loader/text";
import { useRouter } from "next/router";
import DropdownInput, { DropdownNOBorder } from "../common/Dropdown";
import { Input, TestArea } from "../common/Input";

const Generate = () => {
  const { userId } = useAuth();
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
    addimgToCanvasGen,
    canvasInstance,
    setGeneratedImgList,
    generatedImgList,
    setSelectedImg,
    setLoader,
    selectedImg,
    undoArray,
    setModifidImageArray,
    selectResult,
    editorBox,
    loader,
    jobId,
    setJobId,
    setSelectedresult,
    setPlacementTest,
    generateImageHandeler,
    promt,
    setpromt,
    promtFull,
    setpromtFull,
    category, setcategory
  } = useAppState();

  const { query, isReady } = useRouter();
  const id = (query.id as string[]) || [];

  const [changeTab, setChangeTab] = useState(false);

  // const [promtFull, setpromtFull] = useState();

  // const promt =
  //   product +
  //   " " +
  //   selectPlacement +
  //   " " +
  //   placementTest +
  //   " " +
  //   selectSurrounding +
  //   " " +
  //   surroundingTest +
  //   " " +
  //   selectBackground +
  //   " " +
  //   backgroundTest;

  useEffect(() => {
    const promts = product + " " + promt;
    setpromtFull(promts);
  }, [product, promt]);

  const handelPromt = (e) => {
    setpromtFull(e.target.value);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="accest"
    >
       <div className="gap">
        <DisabledLabel> Select your product category </DisabledLabel>
        <DropdownInput
            data={{
              list: categoryList,
              action: setcategory,
              label: "placement",

              activeTab: category,
            }}
            style={{width: "100%"}}
          ></DropdownInput>
        
      </div>
      <div className="gap">
      <DisabledLabel>Describe your photo </DisabledLabel>

        
        <Row>
          {/* <PromtGeneratePreview className="generatePreview">
            {product !== null && product !== "" ? (
              <label
                htmlFor="prompt-editor-subject-0-input"
                className="promtText"
              >
                {product}
                {", "}
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
          </PromtGeneratePreview> */}
          <TestArea
            value={promtFull}
            onChange={(e) => handelPromt(e)}
            readonly={loader? "readonly": false}
            // value={placementTest}
            // setValue={setPlacementTest}
            // suggetion={PlacementSuggestionsFilter}
          />
          {/* <input type="text" className="generatePreview" /> */}
        </Row>
        <Row>
          {loader ? (
            <TextLoader />
          ) : (
            <Button
              onClick={() => generateImageHandeler(userId, id)}
              disabled={promtFull === " " ? true : false}
            >
              {generationLoader ? "Loading..." : "Generate"}
            </Button>
          )}
        </Row>
      </div>
     
      <div className="rowwothtwo" style={{ marginBottom: "0px" }}>
        <DisabledLabel>Number of results</DisabledLabel>
        <div className="two-side">
          {/* <DropdownInput
        style ={{minWidth: "500px"}}
            data={{
              list: resultList,
              // label: "background",

              action: setSelectedresult,
              activeTab: selectResult,
            }}
          ></DropdownInput> */}
          <DropdownNOBorder
            data={{
              list: resultList,
              action: setSelectedresult,
              activeTab: selectResult,
            }}
          ></DropdownNOBorder>
        </div>
      </div>
      

      <div className="bigGap">
        {/* <Label>Edit the the prompt in the form below.</Label> */}
      </div>
      {/* <div className="gap"></div> */}
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
          Settings
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
  border: 2px solid #d9d9d9;
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
