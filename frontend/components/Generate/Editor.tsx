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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="accest"
    >
      <div className="filde gap">
        <DisabledLabel>Product</DisabledLabel>
        <SuggetionInput
          value={product}
          setValue={setProduct}
          suggetion={ProductSuggestionsFilter}
        />
      </div>
      <div className="gap">
        <DisabledLabel>Placement</DisabledLabel>
        <div className="two-side">
          <DropdownInput
            data={{
              list: PlacementSuggesPrahtionsFilter,
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
      </div>
      <div className="rowwothtwo">
        <Label>Number of results</Label>
        <div className="dropdown-smaill">
          <DropdownNOBorder
            data={{
              list: resultList,
              action: setSelectedresult,
              activeTab: selectResult,
            }}
          ></DropdownNOBorder>
        </div>
      </div>
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
    </motion.div>
  );
};

export default EditorSection;
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
