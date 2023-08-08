import React, { useRef, useState, useEffect } from "react";
import { Row } from "../common/Row";
import Label from "../common/Label";
import { FileUpload } from "../common/Input";
import DropdownInput from "../common/Dropdown";
import { styled } from "styled-components";
import { category, test } from "@/store/dropdown";
import { useAppState } from "@/context/app.context";



const Assets: React.FC = () => {
  const {
    selectedImage,
    setSelectedImage,
    selectCategory,
    setSelectedCategory,
  } = useAppState();
  

  return (
    <div className="accest">
      <div className="gap">
        <Row>
          <Label>Product</Label>
        </Row>
        <Row>
          <FileUpload></FileUpload>
        </Row>
      </div>
      <div className="gap">
        <Row>
          <Label>Select product category</Label>
        </Row>
        <Row>
          <DropdownInput
            data={{
              list: category,
              action: setSelectedCategory,
              label: "category",
              activeTab: selectCategory,
            }}
          ></DropdownInput>
        </Row>
      </div>
     
    </div>
  );
};

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

export default Assets;
