import React, { useEffect, useState } from "react";
import { Row } from "../common/Row";
import Button from "../common/Button";
import { useAppState } from "@/context/app.context";
import { styled } from "styled-components";
import { useSession } from "@supabase/auth-helpers-react";
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
  const session = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    if (session) {
      setUserId(session.user.id);
    }
  }, [session]);
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
    category,
    setcategory,
    filteredArray,
    genrateeRef,
    TDMode,
    generate3dHandeler,
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

        <Box className="disBox">
          {loader ? <div className="dis"></div> : null}
          <DropdownInput
            data={{
              list: categoryList,
              action: setcategory,
              label: "placement",

              activeTab: category,
            }}
            style={{ width: "100%", pointerEvents: "none" }}
          ></DropdownInput>
        </Box>
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
            readonly={loader ? "readonly" : false}
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
              ref={genrateeRef}
              onClick={() =>
                TDMode
                  ? generate3dHandeler(userId, id)
                  : generateImageHandeler(userId, id)
              }
              disabled={promtFull === " " ? true : false}
            >
              {generationLoader ? "Loading..." : "Generate"}
            </Button>
          )}
        </Row>
      </div>

      {/* <div className="rowwothtwo" style={{ marginBottom: "0px" }}>
        <DisabledLabel>Number of results</DisabledLabel>
        <div className="two-side">
         
          <DropdownNOBorder
            data={{
              list: resultList,
              action: setSelectedresult,
              activeTab: selectResult,
            }}
          ></DropdownNOBorder>
        </div>
      </div> */}

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
          onClick={() => {
            setChangeTab(true);
          }}
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
export const Box = styled.div`
  position: relative;

  .dis {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: transparent;
    z-index: 100;
  }
`;

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

  .disavle {
    cursor: not-allowed;
  }
`;
export const Wrapper = styled.div`
  /* max-height: 600px;
  overflow-y: scroll; */
`;
export const BoxOff = styled.div`
  /* height: 100%; */
  /* overflow: hidden; */
  position: relative;
  .dis {
    background: transparent !important;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .gaps {
    margin-top: 20px;
  }
  .two {
    display: flex;
    justify-content: space-between;
  }
  .rangeValue {
    background: rgba(249, 208, 13, 1);
    padding: 5px 12px;
    border-radius: 5px;
  }
  .sixBox {
    border: 1px solid #d9d9d9;
    border-radius: 6px;

    .items {
      border-bottom: 1px solid #d9d9d9;
      padding: 10px;
      font-size: 16px;
      transition: all 0.3s ease-in-out;
      display: flex;
      justify-content: space-between;
      /* align-items: center; */
      .sub {
        opacity: 0;
        transition: all 0.5s ease-in-out;
        color: #7a7979;
      }

      &:hover {
        background-color: rgba(249, 208, 13, 0.23);

        .sub {
          opacity: 1;
        }
      }

      .tittl {
        font-weight: 500;
      }
      .input {
        display: flex;
        gap: 5px;

        input {
          width: 60px;
          background-color: #fff;
          color: #7a7979;
          padding: 0 5px;
          border: 1px solid #d9d9d9;
          &:hover {
            border: 1px solid #d9d9d9;
          }
          &:focus-visible {
            border: 1px solid #d9d9d9;
          }
        }
      }
    }
  }
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
  .actives {
    background-color: #f8d62bfe !important;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }

  input[type="range"] {
    height: 20px;
    -webkit-appearance: none;
    /* margin: 10px 0; */
    width: 100%;
    background: #fff;
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    /* box-shadow: 0px 0px 0px #000000; */
    background: rgba(249, 208, 13, 1);
    border-radius: 1px;
    border: 0px solid #000000;
  }
  input[type="range"]::-webkit-slider-thumb {
    /* box-shadow: 0px 0px 0px #000000; */
    border: 1px solid rgba(249, 208, 13, 1);
    height: 15px;
    width: 15px;
    border-radius: 25px;
    background: #dac149;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -4px;
  }
  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: rgba(249, 208, 13, 1);
  }
  input[type="range"]::-moz-range-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: rgba(249, 208, 13, 1);
    border-radius: 1px;
    border: 0px solid #000000;
  }
  input[type="range"]::-moz-range-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid #rgba(249, 208, 13, 1);
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: rgba(249, 208, 13, 1);
    cursor: pointer;
  }
  input[type="range"]::-ms-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type="range"]::-ms-fill-lower {
    background: rgba(249, 208, 13, 1);
    border: 0px solid #000000;
    border-radius: 2px;
    /* box-shadow: 0px 0px 0px #000000; */
  }
  input[type="range"]::-ms-fill-upper {
    background: rgba(249, 208, 13, 1);
    border: 0px solid #000000;
    border-radius: 2px;
    /* box-shadow: 0px 0px 0px #000000; */
  }
  input[type="range"]::-ms-thumb {
    margin-top: 1px;
    /* box-shadow: 0px 0px 0px #000000; */
    border: 1px solid rgba(249, 208, 13, 1);
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: rgba(249, 208, 13, 1);
    cursor: pointer;
  }
  input[type="range"]:focus::-ms-fill-lower {
    background: rgba(249, 208, 13, 1);
  }
  input[type="range"]:focus::-ms-fill-upper {
    background: rgba(249, 208, 13, 1);
  }
`;
