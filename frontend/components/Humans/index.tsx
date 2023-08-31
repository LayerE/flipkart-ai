import React, { useRef, useState, useEffect } from "react";
import { Row } from "../common/Row";
import Label, { DisabledLabel } from "../common/Label";
import { FileUpload, FileUpload1 } from "../common/Input";
import DropdownInput from "../common/Dropdown";
import { styled } from "styled-components";
import { category, test } from "@/store/dropdown";
import { useAppState } from "@/context/app.context";
import { HumansList } from "@/store/listOfElement";



const Humans: React.FC = () => {
  const {
    selectedImage,
    setSelectedImage,
    selectCategory,
    setSelectedCategory,
    imageArray,
    setModifidImageArray 
  } = useAppState();
  

  return (
    <div className="accest">
      <div className="gap">
        <Row>
          <DisabledLabel>Select a human model to add</DisabledLabel>
        </Row>
       
      </div>
      <div className="gap">
        <ResponsiveRowWraptwo>
          {HumansList.map((test, i) => (
            <div
              key={i}
              className={
                selectedImage.id === i ? "imageBox ativeimg" : "imageBox"
              }
              onClick={() =>{ setSelectedImage({ id: i, url: test ,baseUrl: test, tools: {bgRemove:false, removeText:false, replaceBg:false, psn:false, pde:false, superResolution:false,magic:false} }); setModifidImageArray([])}}
            >
              <picture>
                <img src={test}  alt=""     id="some-image-id"
                  draggable="true" 
                  onDragStart={e => e.dataTransfer.setData('text', e.target.src)}
                />
              </picture>
            </div>
          ))}
        </ResponsiveRowWraptwo>
      </div>
      {/* <div className="gap">
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
      </div> */}
     
    </div>
  );
};

export const ResponsiveRowWraptwo = styled(Row)`
  display: grid !important;
  gap: 1rem;
  ${({ theme }) => theme.minMediaWidth.atleastSmall`
      grid-template-columns: repeat(3, 1fr);
  `}
  ${({ theme }) => theme.minMediaWidth.atleastLarge`
    grid-template-columns: repeat(3, 1fr);
   `}
`;

export default Humans;
