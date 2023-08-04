import React, { useState } from "react";
import { styled } from "styled-components";
import Column from "../common/Column";
import Image from "next/image";
import assets from "@/public/assets";
import { useAppState } from "@/context/app.context";
import { ResponsiveRowWrap, Row } from "../common/Row";
import Label, { DisabledLabel } from "../common/Label";
import { FileUpload, Input, Input2, TestArea } from "../common/Input";
import DropdownInput from "../common/Dropdown";
import Button from "../common/Button";
import Assets from "../Assets/index";
import Generate from "../Generate/index";
import Edit from "../Edit";

const TabData = [
  {
    id: 1,
    image: assets.icons.assets_icon,
    tittle: "Assets",
  },
  {
    id: 2,

    image: assets.icons.generate_icon,
    tittle: "Generate",
  },
  //   {
  //     id: 3,

  //     image: assets.icons.element_icon,
  //     tittle: "Elements",
  //   },
  //   {
  //     id: 4,

  //     image: assets.icons.user_icon,
  //     tittle: "Humans",
  //   },
  {
    id: 5,

    image: assets.icons.edit_icon,
    tittle: "Edit",
  },
];

const index: React.FC = () => {
  const { activeTab, setActiveTab } = useAppState();

  return (
    <SideBar>
      <div className="columWrapper">
        {TabData.map((elemenmt, i) => (
          // <Column>
          <div
          key={i}
            className={activeTab === elemenmt.id ? "active tabBox " : "tabBox"}
            onClick={() => setActiveTab(elemenmt.id)}
          >
            <Image src={elemenmt.image} alt="" width={16} />
            <span>{elemenmt.tittle}</span>
          </div>
          // </Column>
        ))}
      </div>
      <div className="tapExpanded">
        <div className="tittle">
          {activeTab === 1
            ? "Add assets"
            : activeTab === 2
            ? "Generate Photoshoot"
            : "Edit Image"}
        </div>
        {activeTab === 1 ? (
          <Assets />
        ) : activeTab === 2 ? (
          <Generate />
        ) : (
          <Edit />
        )}
      </div>
    </SideBar>
  );
};

const SideBar = styled.div`
  height: 100vh;
  .selectbox {
    display: flex;
    gap: 10px;

    
  }
  .selectone {
      border-radius: 4px;
      cursor: pointer;
      border: 1px solid #c7c3c3;
      padding: 8px 13px;

      font-size: 12px;
      font-weight: bold;
    }
  display: flex;

  .selectTool {
    cursor: pointer;
    border-radius: 7px;
    border: 1px solid #838383;
    padding: 1.3rem 1.2rem;

    p {
      margin-top: 16px;
      color: #b2a4a4;
      font-size: 12px;
      font-weight: 400;
      line-height: 13px;
    }
  }
  .rowwothtwo {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }
  .bigGap{
    margin-bottom: 25px;
  }
  .clolorpicker {
    display: flex;
    gap: 0.3rem;
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
    padding-left: 65px;
    padding-right: 30px;
    padding-top: 30px;
    border-right: 2px solid ${({ theme }) => theme.bgBorder};
    width: max-content;

    padding-top: ${({ theme }) => theme.paddings.paddingTop};
  }
  .active {
    background-color: ${({ theme }) => theme.btnPrimary};
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
    span {
      font-size: 10px;
      font-weight: 500;
    }
  }
  .tapExpanded {
    padding-left: 15px;
    padding-right: 30px;
    padding-top: 30px;
    padding-bottom: 70px;
    border-right: 2px solid ${({ theme }) => theme.bgBorder};
    width: 350px;
    padding-top: ${({ theme }) => theme.paddings.paddingTop};

    overflow: auto;
  }
 
  .imageBox {
    border-radius: 8px;
    border: 2px solid #b1b1b1;
    padding: 10px 10px;
    height: 120px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .ativeimg{
    border-color: ${({ theme }) => theme.btnPrimary};
  }
`;
export default index;
