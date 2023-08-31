import React, { useRef, useState, useEffect } from "react";
import { Row } from "../common/Row";
import Label from "../common/Label";
import { FileUpload, FileUpload1 } from "../common/Input";
import DropdownInput from "../common/Dropdown";
import { styled } from "styled-components";
import { category, test } from "@/store/dropdown";
import { useAppState } from "@/context/app.context";
import { productList } from "@/store/listOfElement";

const Assets: React.FC = () => {
  const {
    selectedImage,
    setSelectedImage,
    selectCategory,
    setSelectedCategory,
    imageArray,
    upladedArray,
    setModifidImageArray
  } = useAppState();

  return (
    <div className="accest">
      <div className="gap">
        <Row>
          <Label>Product</Label>
        </Row>
        <Row>
          <FileUpload1 />
        </Row>
        <ResponsiveRowWraptwo>
          {productList.map((test, i) => (
            <div
              key={i}
              className={
                selectedImage.id === i ? "imageBox ativeimg" : "imageBox"
              }
              onClick={() => {
                setSelectedImage({
                  id: i,
                  url: test,
                  baseUrl: test,
                  tools: {
                    bgRemove: false,
                    removeText: false,
                    replaceBg: false,
                    psn: false,
                    pde: false,
                    superResolution: false,
                    magic: false,
                  },
                });
                setModifidImageArray([]);
              }}
            >
              <picture>
                <img src={test} alt="" />
              </picture>
            </div>
          ))}
        </ResponsiveRowWraptwo>
      </div>
      <div className="gap">
        {
          upladedArray.length ? 
          <Row>
          <Label>Uploaded Assets</Label>
        </Row>
          :

          null
        }
      

        <ResponsiveRowWraptwo>
          {upladedArray.map((test, i) => (
            <div
              key={i}
              className={
                selectedImage.id === i ? "imageBox ativeimg" : "imageBox"
              }
              onClick={() => {
                setSelectedImage({
                  id: i,
                  url: test.url,
                  baseUrl: test.baseUrl,
                  tools: {
                    bgRemove: false,
                    removeText: false,
                    replaceBg: false,
                    psn: false,
                    pde: false,
                    superResolution: false,
                    magic: false,
                  },
                });
                setModifidImageArray([]);
              }}
            >
              <picture>
                <img src={test.url} alt="" />
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
  gap: 0.5rem;
  ${({ theme }) => theme.minMediaWidth.atleastSmall`
      grid-template-columns: repeat(3, 1fr);
  `}
  ${({ theme }) => theme.minMediaWidth.atleastLarge`
    grid-template-columns: repeat(3, 1fr);
   `}
`;

export default Assets;
