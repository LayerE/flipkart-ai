import { useAppState } from "@/context/app.context";
import assets from "@/public/assets";
import Image from "next/image";
import React from "react";
import { styled } from "styled-components";

const HomeSidebar = () => {

    const {
        activeTabHome,
        setActiveTabHome
      } = useAppState();

   
  const TabData = [
    {
      id: 1,
      image: assets.icons.project_icon,
      tittle: "Projets",
    },
    {
      id: 2,

      image: assets.icons.project_icon,
      tittle: "Asset Directory",
    },
    {
      id: 3,

      image: assets.icons.project_icon,
      tittle: "Gellery",
    },
    {
      id: 4,

      image: assets.icons.user_icon,
      tittle: "Tools",
    },
  ];
  return (
    <HomSideWrapper className="sidebar">
      {TabData?.map((tab) => (
        <div className={ activeTabHome === tab.id ? "tab active-tab" :"tab" } onClick={()=> setActiveTabHome(tab.id)}>
          <Image src={tab.image} alt="" />
          {tab.tittle}
        </div>
      ))}
    </HomSideWrapper>
  );
};

const HomSideWrapper = styled.div`
  border-right: 1px solid rgba(238, 238, 238, 1);
  min-height: 100vh;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: ${({ theme }) => theme.paddings.paddingTop};
  gap: 10px;
  display: flex;
  flex-direction: column;

  .tab {
    display: flex;
    justify-items: start;
    align-items: center;
    gap: 10px;
    width: 183px;
    border-radius: 6px;
    background: #eee;
    padding: 8px 26px;
    font-size: 14px;
    cursor: pointer;
    font-weight: 600;

    transition: all 0.3s;
    &:hover{
    background-color: ${({ theme }) => theme.btnPrimaryHover};

    }
  }
  .active-tab {
    background: ${({ theme }) => theme.btnPrimary};
    &:hover {
      background: ${({ theme }) => theme.btnPrimary};
    }
  }
`;

export default HomeSidebar;
