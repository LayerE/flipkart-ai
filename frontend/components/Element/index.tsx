import React from "react";
import { Row } from "../common/Row";
import Label from "../common/Label";
import { FileUpload, FileUpload1 } from "../common/Input";
import { styled } from "styled-components";
import { useAppState } from "@/context/app.context";
import { elemest } from "@/store/listOfElement";

const Element: React.FC = () => {
  const { setViewMore, addimgToCanvas } = useAppState();

  return (
    <ElemtWraspper>
      <div className="accest">
        <div className="gap">
          <Row>
            <Label>Product</Label>
          </Row>
          <Row>
            <FileUpload type={"element"}   title={"Upload Element"}/>
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
                    className={"imageBoxs"}
                    onClick={() => {
                      addimgToCanvas(test);
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
    img {
      object-fit: contain;
    }
  }
`;

export default Element;
