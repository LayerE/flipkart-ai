import React, { useRef, useState, useEffect } from "react";
import { Row } from "../common/Row";
import Label from "../common/Label";
import { FileUpload, FileUpload1 } from "../common/Input";
import DropdownInput from "../common/Dropdown";
import { styled } from "styled-components";
import { category, test } from "@/store/dropdown";
import { useAppState } from "@/context/app.context";
import { elemest, platformEelement } from "@/store/listOfElement";
import { fabric } from "fabric";


const Element: React.FC = () => {
  const {
    selectedImage,
    setSelectedImage,
    selectCategory,
    setSelectedCategory,
    imageArray,
    viewMore,
    setViewMore,
  } = useAppState();

  const getBase64FromUrl = async (url: string) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };

  // useEffect(() => {
  //   const add = document.getElementById("add");

  //   add.addEventListener("click", async () => {
  //     fabric.Image.fromURL(
  //       await getBase64FromUrl(
  //         "https://image.imgcreator.ai/ImgCreator/c3b7fbf516f74638820f53c25f40c744/hq/ae988912-f0b0-11ed-988f-0242ac110002_0.webp"
  //       ),
  //       function (img) {
  //         // Set the image's dimensions
  //         img.scaleToWidth(300);
  //         // img.scaleToHeight(150);
  //         // Scale the image to have the same width and height as the rectangle
  //         // const scaleX = downloadRect.width / img.width;
  //         // const scaleY = downloadRect.height / img.height;

  //         // Position the image to be in the center of the rectangle
  //         img.set({
  //           left: 100,
  //           top: 100,
  //           // scaleX: scaleX,
  //           // scaleY: scaleY,
  //         });

  //         // canvasInstanceRef.add(img);
  //         // canvasInstanceRef.renderAll();
  //       }
  //     );
  //   });

   
  // }, [])
  

  return (
    <ElemtWraspper>
      <div className="accest">
        <div className="gap">
          <Row>
            <Label>Product</Label>
          </Row>
          <Row>
            <FileUpload1 />
            {/* <button id="add">dsfgsd</button> */}
          </Row>
        </div>
        <div className="gap">
          {elemest.map((item, i) => (
            <div key={i}>
              <div className=" rows">
                <div className="left">
                  <Label>{item?.title}</Label>
                </div>
                <div className="right">
                  <div
                    className="viewBtn"
                    onClick={() =>
                      setViewMore({
                        status: true,
                        title: item.title,
                        index: item,
                        list: item.list,
                      })
                    }
                  >
                    View all
                  </div>
                </div>
              </div>
              <div className="horizontaScrollBox">
                {item?.list.map((test, i) => (
                  <div
                    key={i}
                    className={
                      selectedImage.id === i
                        ? "imageBoxs ativeimg"
                        : "imageBoxs"
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
              </div>
            </div>
          ))}
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
    </ElemtWraspper>
  );
};

export const ElemtWraspper = styled(Row)`
  overflow: hidden;
  width: 100%;
  .accest {
    width: 100%;
  }

  .rows {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .left {
    }

    .viewBtn {
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
    }
    .viewBtn:hover {
      color: rgba(249, 208, 13, 1);
    }
  }
  .horizontaScrollBox {
    display: flex;
    gap: 10px;
    overflow-x: scroll;
    width: 100%;

    -ms-overflow-style: none !important; /* IE and Edge */
    scrollbar-width: none !important; /* Firefox */
  }
  .horizontaScrollBox::-webkit-scrollbar {
    display: none !important;
  }
  .imageBoxs {
    border-radius: 8px;
    border: 2px solid #b1b1b1;
    padding: 10px 10px;
    /* height: 120px; */

    min-width: 100px !important;
    height: 100px;
    overflow: hidden;
    img{
      object-fit: contain;
    }
    
  }
`;

export default Element;
