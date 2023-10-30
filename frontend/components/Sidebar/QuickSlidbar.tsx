// @ts-nocheck


import React, { useState } from "react";
import { styled } from "styled-components";
import Column from "../common/Column";
import Image from "next/image";
import assets from "@/public/assets";
import { useAppState } from "@/context/app.context";
import { ResponsiveRowWrap, Row } from "../common/Row";
import Label, { DisabledLabel } from "../common/Label";
import { FileUpload, FileUploadQuick, Input, Input2, TestArea } from "../common/Input";
import DropdownInput from "../common/Dropdown";
import Button from "../common/Button";
import Assets from "../Assets/index";
import Generate from "../Generate/index";
import Edit from "../Edit";

import { motion } from "framer-motion";
import Humans from "../Humans";
import Element from "../Element";
import ListOf from "../List OfProduct";
import MagicEraser from "../MagicErase";
import RegenratTab from "../RegenrateTab";
import Assets3d from "../Assets/Assets3 d";
import Edit3d from "../Edit/Edite3d";
import TextLoader from "../Loader/text";
import { useRouter } from "next/router";
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const TabData = [
  {
    id: 1,
    image: assets.icons.assets_icon,

    tittle: "3D Assets",
  },
  {
    id: 2,

    image: assets.icons.generate_icon,
    tittle: "Generate",
  },

  {
    id: 3,

    image: assets.icons.edit_icon,
    tittle: "Edit",
    disable: assets.icons.edit_icon_diable,
  },
];

const QuickBar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    viewMore,
    setViewMore,
    downloadImg,
    isMagic,
    setIsMagic,
    elevatedSurface, seTelevatedSurface,

    generationLoader,
    setGenerationLoader,
    selectPlacement,
    selectSurrounding,
    selectBackground,
    getBase64FromUrl,
    addimgToCanvasGen,
    generateQuikcHandeler,
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
    generateImageHandeler,
    genrateeRef,
    promtFull,
    setpromtFull,
    userId,
    setSelectedresult,
    setPlacementTest,
  
  } = useAppState();
  const { query, isReady } = useRouter();
  const id = (query.id as string[]) || [];

  const handelPromt = (e) => {
    setpromtFull(e.target.value);
  };
  return (
    <SideBar>
      <motion.div className="new">
        <div className="larfer">
          <motion.div
            className={
              activeTab != null ? "tapExpanded dispaySlid" : "tapExpanded"
            }
          >
            <div className="tittle">Quick Generate</div>
            <div className="gap">
            <Row>
          <Label>Product</Label>
        </Row>

        <Row>
          <FileUploadQuick
            type={"product"}
            title={"Upload Product Photo"}
            uerId={userId}
          />
        </Row>
            </div>
            <div className="gap">
              <DisabledLabel>Describe your photo </DisabledLabel>

              <Row>
                <TestArea
                  value={promtFull}
                  onChange={(e) => handelPromt(e)}
                  readonly={loader ? "readonly" : false}
                  // value={placementTest}
                  // setValue={setPlacementTest}
                  // suggetion={PlacementSuggestionsFilter}
                />
              </Row>
              <Row>
          <DATA>
          <div>
              <DisabledLabel>
              Is model on elevated surface
              </DisabledLabel>
            </div>
          <div
              className={`toggle-switch ${elevatedSurface ? "on" : "off"}`}
              onClick={() => seTelevatedSurface(!elevatedSurface)}
            >
              <div className="circle"></div>
            </div>
           
          </DATA>
        </Row>
              <Row>
                {loader ? (
                  <TextLoader />
                ) : (
                  <Button
                    ref={genrateeRef}
                    onClick={() => generateQuikcHandeler(userId, id)}
                    disabled={promtFull === "" ? true : false}
                  >
                    {generationLoader ? "Loading..." : "Generate"}
                  </Button>
                )}
              </Row>
            </div>

            <div className="gaps">
              <div className="two">
                <Label>No. of images to generate</Label>
                <div className="rangeValue">
                  <Label> {selectResult}</Label>
                </div>
              </div>
              <div className="rangebox">
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={selectResult}
                  disabled={loader}
                  onChange={(e) =>
                    setSelectedresult(parseInt(e.target.value, 10))
                  }
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </SideBar>
  );
};

export const DATA = styled.div`
width: 100%;
display: flex; 
justify-content: space-between;
  .toggle-switch {
    width: 46px;
    height: 22px;
    border: 1px solid ${(props) => props.theme.btnPrimary};
    background-color: #e0e0e0;
    border-radius: 15px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .toggle-switch .circle {
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    transition: left 0.3s;
  }

  .toggle-switch.on {
    background-color: ${(props) => props.theme.btnPrimary}; /* Based on the image you provided */
  }

  .toggle-switch.on .circle {
    left: 25px;
  }
`;

const SideBar = styled.div`
  position: relative;
  z-index: 200;
  background-color: #fff;
  .new {
    height: 100vh;
    display: flex;
  }
  .selectbox {
    display: flex;
    gap: 10px;
  }
  .closs {
    display: none;
  }
  .selectone {
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid #d9d9d9;
    padding: 8px 13px;

    font-size: 12px;
    font-weight: bold;
    transition: all 0.3 ease;

    &:hover {
      border: 2px solid rgba(249, 208, 13, 1);
    }
  }

  .selectTool {
    cursor: pointer;
    border-radius: 7px;
    border: 2px solid #d9d9d9;
    padding: 0.8rem 1.2rem;
    position: relative;
    transition: all 0.3 ease;
    margin-top: 5px;

    &:hover {
      border: 2px solid rgba(249, 208, 13, 1);
    }
    .cardClose {
      position: absolute;
      right: 15px;
      top: 15px;
      z-index: 50;
    }
    p {
      margin-top: 8px;
      color: #b2a4a4;
      font-size: 12px;
      font-weight: 400;
      line-height: 13px;
    }
  }

  .activeTool {
    border: 2px solid rgba(249, 208, 13, 1);
  }
  .rowwothtwo {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }
  .bigGap {
    margin-bottom: 25px;
  }
  .clolorpicker {
    display: flex;
    gap: 0.3rem;
    position: relative;
  }
  .pikkeropen {
    position: absolute;
    z-index: 10;
    top: 50px;
    right: 0;
  }
  .colorBox {
    background: #000;
    width: 65px;
    height: 100%;
    border-radius: 7px;
  }
  .columWrapper {
    gap: 28px;
    display: flex;
    flex-direction: column;
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 30px;
    border-right: 2px solid ${({ theme }) => theme.bgBorder};
    width: max-content;

    padding-top: ${({ theme }) => theme.paddings.paddingTop};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  .columWrapper{
       padding-left: 10px;
    padding-right: 10px;

  }
  .closs{
    display: block;
    position: absolute;
    right:20px;
    top:100px;
    cursor: pointer;

    .x{
      cursor: pointer;
    //   width:30px;
    // height:30px;
    // border-radius:50%;
    // border-top: 2px solid black;
    // z-index:30;

    }
  }


   `}
  .active {
    background-color: ${({ theme }) => theme.btnPrimary};
  }
  .blure {
    pointer-events: none;

    filter: blur(2px); /* adjust px value to increase or decrease the blur */
    opacity: 0.9;
  }
  .gen {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .two-side {
    display: flex;
    gap: 0.3rem;
  }
  .tabBox {
    /* padding: 13px 15px; */
    /* background-color: ${({ theme }) => theme.btnPrimary}; */
    width: 58px;
    height: 54px;
    display: flex;
    border-radius: 11px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    span {
      font-size: 10px;
      font-weight: 500;
    }
    &:hover {
      background-color: ${({ theme }) => theme.btnPrimaryHover};
    }
  }
  .disable {
    color: #d1c8c8;
    cursor: not-allowed;
    &:hover {
      background-color: transparent;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
.tabBox{
  span{
    font-size: 8px;
  }
}
  `}
  .larfer {
    width: 380px;
  }
  .tapExpanded {
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 30px;
    /* padding-bottom: 70px; */
    border-right: 2px solid ${({ theme }) => theme.bgBorder};
    padding-top: ${({ theme }) => theme.paddings.paddingTop};
    width: 100% !important;
    height: 100%;
    overflow: auto;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  .tapExpanded{
  display: none;
    position:absolute;
    left: 90px;
    background:#fff;
    z-index:5;
    height:100%;
    width: calc(100% - 90px);
    padding-left: 15px;


  }
  .dispaySlid{
    display: block;
  }
`}

  .imageBox {
    border-radius: 8px;
    border: 2px solid #d9d9d9;
    padding: 10px 10px;
    height: 120px;
    picture {
      width: 100%;
      height: 100%;
    }
    transition: all 0.3s ease-in-out;

    &:hover {
      border: 2px solid rgba(249, 208, 13, 1);
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: all 0.3s ease-in-out;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
  .ativeimg {
    border-color: ${({ theme }) => theme.btnPrimary};
  }
  .two {
    display: flex;
    justify-content: space-between;
  }
  .rangeValue {
    background: rgba(249, 208, 13, 1);
    padding: 5px 12px;
    border-radius: 5px;
    max-width: max-content;
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
    border: 1px solid rgba(249, 208, 13, 1);
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
export default QuickBar;
