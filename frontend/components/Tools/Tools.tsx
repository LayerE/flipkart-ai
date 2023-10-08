import React from "react";
import { styled } from "styled-components";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";

const Tools = () => {
  const { userId } = useAuth();

  const toolslist = [
    {
      name: "Banner Generator",
      discription: "create a banner ",
      url: "https://banner-production.up.railway.app/?userId="
    },
    // {
    //   name: "Tool Name",
    //   discription: "Discription about this tool",
    // },
    // {
    //   name: "Tool Name",
    //   discription: "Discription about this tool",
    // },
    // {
    //   name: "Tool Name",
    //   discription: "Discription about this tool",
    // },
    // {
    //   name: "Tool Name",
    //   discription: "Discription about this tool",
    // },
  ];

  const Redirect = (url)=>{
    window.location.href = url + userId;
  }
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      <ToolsWrapper>
        <div className="headerText">Tools</div>

        <div className="gridbox">
          {toolslist?.map((tool: object[]) => (
            <div className="tool-cards" onClick={()=> Redirect(tool.url)} >
              <div className="imgeWrapper">
                <div className="imgbox"></div>
              </div>
              <div className="tool-details">
                <div className="name">{tool.name}</div>
                <div className="discription">{tool.discription}</div>
              </div>
            </div>
          ))}
        </div>
      </ToolsWrapper>
    </motion.div>
  );
};

export default Tools;

const ToolsWrapper = styled.div`
  .headerText {
    font-size: 32px;
    font-weight: 700;
  }
  .gridbox {
    margin-top: 40px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    .tool-cards {
      border-radius: 7px;
      border: 1px solid #d9d9d9;

      .imgeWrapper {
        height: 150px;
        padding: 5px;
        width: 100%;
        border-radius: 7px;
        overflow: hidden;
        .imgbox {
          width: 100%;
          height: 100%;
          background-color: #d9d9d9;
          border-radius: 7px;
        }
      }

      .tool-details {
        padding: 10px;
        border-top: 1px solid #d9d9d9;

        .name {
          font-size: 18px;
          font-weight: 700;
        }
        .discription {
          color: #b1b1b1;
        }
      }
    }
  }
`;
