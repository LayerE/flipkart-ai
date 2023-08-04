import React from "react";
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
} from "@/store/dropdown";
import { useAppState } from "@/context/app.context";

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
  } = useAppState();

  return (
    <div className="accest">
      <div className="gap">
        <Row>
          <TestArea />
        </Row>
        <Row>
          <Button>Generate</Button>
        </Row>
      </div>
      <div className="bigGap" >
        <Label>Edit the the prompt in the form below.</Label>
      </div>
      <div className="filde gap">
        <DisabledLabel>Product</DisabledLabel>
        <Input></Input>
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
          <Input></Input>
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
          <Input></Input>
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
          <Input></Input>
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
      </div>
    </div>
  );
};

export default Generate;
