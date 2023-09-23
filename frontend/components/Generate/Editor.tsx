import React, { useEffect, useState, useRef } from "react";
import { Row } from "../common/Row";
import { Input, Suggestion1, TestArea } from "../common/Input";
import Button from "../common/Button";
import Label, { DisabledLabel } from "../common/Label";
import DropdownInput, { DropdownNOBorder } from "../common/Dropdown";
import {
  BackgroundList,
  BackgroundSuggestions,
  BackgrowundSuggestionsPrash,
  PlacementSuggestions,
  SurrontedSuggestionsPrash,
  SurroundedSuggestions,
  coloreStrength,
  outlineStrength,
  placementList,
  productSuggestions,
  productSuggestionsPrash,
  Loara,
  renderStrength,
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
import SuggetionInput from "./SuggetionInput";

const EditorSection = () => {
  const {
    selectPlacement,
    setSelectedPlacement,
    selectSurrounding,
    setSelectedSurrounding,
    selectBackground,
    setSelectedBackground,
    selectResult,
    setSelectedresult,
    selectRender,
    setSelectedRender,
    selectColoreStrength,
    setSelectedColoreStrength,
    selectOutLline,
    setSelectedOutline,
    loara,
    setLoara,
    activeSize,
    setActiveSize,
    customsize,
    setCustomsize,
    product,
    setProduct,
    placementTest,
    setPlacementTest,
    backgroundTest,
    setBackgrundTest,
    surroundingTest,
    setSurroundingTest,
    previewLoader,
    setPriviewLoader,
    generationLoader,
    changeRectangleSize,
    setGenerationLoader,
  } = useAppState();

  // const imageArrays = JSON.parse(localStorage.getItem("g-images")) || [];

  const ProductSuggestionsFilter = productSuggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(product.toLowerCase())
  );
  const PlacementSuggestionsFilter = PlacementSuggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(placementTest.toLowerCase())
  );
  const PlacementSuggesPrahtionsFilter = productSuggestionsPrash.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(placementTest.toLowerCase())
  );
  const SurrondingSuggesPrahtionsFilter = SurroundedSuggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(surroundingTest.toLowerCase())
  );
  const SurrontedSuggestionsPrashFilter = SurrontedSuggestionsPrash.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(placementTest.toLowerCase())
  );
  const BackgroundSuggestionsFilter = BackgroundSuggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(backgroundTest.toLowerCase())
  );
  const BackgrowundSuggestionsPrashFilter = BackgrowundSuggestionsPrash.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(placementTest.toLowerCase())
  );

  const sizeList = [
    {
      id: 1,
      title: "Default",
      subTittle: "1024✕1024",
      h: 1024,
      w: 1024,
      l: 100,
      t: 300,
      gl: 1224,
      gt: 300
    },
    {
      id: 2,
      title: "Instagram Post",
      subTittle: "1080✕1080",
      h: 1080,
      w: 1080,
      l: 100,
      t: 300,
      gl: 1280,
      gt: 300
    },
    {
      id: 3,
      title: "Instagram Story",
      subTittle: "1080✕1920",
      h: 1920,
      w: 1080,
      l: 100,
      t: 300,
      gl: 1280,
      gt: 300
    },
    {
      id: 4,
      title: "Facebook Post",
      subTittle: "940✕788",
      h: 788,
      w: 940,
      l: 100,
      t: 300,
      gl: 1140,
      gt: 300
    },
    {
      id: 5,
      title: "16:9",
      subTittle: "1920✕1080",
      h: 1080,
      w: 1920,
      l: 100,
      t: 300,
      gl: 2120,
      gt: 300
    },
    {
      id: 6,
      title: "9:16",
      subTittle: "1080✕1920",
      h: 1920,
      w: 1080,
      l: 100,
      t: 300,
      gl: 1280,
      gt: 300
    },
    {
      id: 7,
      title: "Custom",
      subTittle: "1024✕1024",
      h: 1024,
      w: 1024,
      l: 100,
      t: 300,
      gl: 1224,
      gt: 300,
      custom: true,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="accest"
    >
      <BoxOff className="boxof">
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
              onChange={(e) => setSelectedresult(parseInt(e.target.value, 10))}
            />
          </div>
        </div>
        <div className="gap">
          <Label>Canvas size</Label>

          <div className="sixBox">
            {sizeList?.map((item, i) => (
              <div
                key={i}
                className={`items ${
                  activeSize.id === item.id ? "actives" : ""
                }`}
                onClick={() => {
                  setActiveSize(item);
                  changeRectangleSize()
                }}
              >
                <div className="tittl">{item.title}</div>
                {item?.custom ? (
                  <div className="input">
                    <input
                      type="number"
                      readOnly={activeSize.id === item.id ? "" : "readOnly"}
                      value={customsize.w}
                      onChange={(e) =>
                        setCustomsize((pre) => ({ ...pre, w: e.target.value }))
                      }
                    />
                    X
                    <input
                      type="number"
                      value={customsize.h}
                      onChange={(e) =>
                        setCustomsize((pre) => ({ ...pre, h: e.target.value }))
                      }
                    />
                  </div>
                ) : (
                  <div className="sub">{item.subTittle}</div>
                )}
              </div>
            ))}
          </div>
        </div>

      

        {/* <div className="filde gap">
        <DisabledLabel>Product</DisabledLabel>
        <SuggetionInput
          value={product}
          setValue={setProduct}
          suggetion={ProductSuggestionsFilter}
        />
      </div> */}
        {/* <div className="gap">
        <DisabledLabel>Lora</DisabledLabel>
        <DropdownInput
            data={{
              list: Loara,
              action: setLoara,
              label: "placement",

              activeTab: loara,
            }}
            style={{width: "100%"}}
          ></DropdownInput>
        
      </div> */}
        {/* <div className="gap">
        <DisabledLabel>Placement</DisabledLabel>
        <div className="two-side">
          <DropdownInput
            data={{
              list: productSuggestionsPrash,
              action: setSelectedPlacement,
              label: "placement",

              activeTab: selectPlacement,
            }}
          ></DropdownInput>
          <SuggetionInput
            value={placementTest}
            setValue={setPlacementTest}
            suggetion={PlacementSuggestionsFilter}
          />
        </div>
      </div>
      <div className="gap">
        <DisabledLabel>Surrounding</DisabledLabel>
        <div className="two-side">
          <DropdownInput
            data={{
              list: SurrontedSuggestionsPrash,
              action: setSelectedSurrounding,
              label: "surrounding",

              activeTab: selectSurrounding,
            }}
          ></DropdownInput>
          <SuggetionInput
            value={surroundingTest}
            setValue={setSurroundingTest}
            suggetion={SurrondingSuggesPrahtionsFilter}
          />
        </div>
      </div>
      <div className="gap">
        <DisabledLabel>Background</DisabledLabel>
        <div className="two-side">
          <DropdownInput
            data={{
              list: BackgrowundSuggestionsPrash,
              label: "background",

              action: setSelectedBackground,
              activeTab: selectBackground,
            }}
          ></DropdownInput>
          <SuggetionInput
            value={backgroundTest}
            setValue={setBackgrundTest}
            suggetion={BackgroundSuggestionsFilter}
          />
        </div>
      </div> */}

        {/* <div className="rowwothtwo">
        <Label>Render strength</Label>
        <div className="dropdown-smaill">
          <DropdownNOBorder
            data={{
              list: renderStrength,
              action: setSelectedRender,
              activeTab: selectRender,
            }}
          ></DropdownNOBorder>
        </div>
      </div>
      <div className="rowwothtwo">
        <Label>Color strength</Label>
        <div className="dropdown-smaill">
          <DropdownNOBorder
            data={{
              list: coloreStrength,
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
              list: outlineStrength,
              action: setSelectedOutline,
              activeTab: selectOutLline,
            }}
          ></DropdownNOBorder>
        </div>
      </div> */}
      </BoxOff>
    </motion.div>
  );
};

export default EditorSection;
export const BoxOff = styled.div`
  /* height: 100%; */
  /* overflow: hidden; */
  .gaps{
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
