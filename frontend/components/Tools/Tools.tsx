import React from "react";
import { styled } from "styled-components";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";

const Tools = () => {
  const { userId } = useAuth();
  const router = useRouter();

  const toolslist = [
    {
      name: "Banner Generator",
      route: false,

      discription: "create a banner ",
      url: "https://banner-production.up.railway.app/?userId=",
      img: "https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Fa4336ca6-f4ed-458c-b743-2a86cc9620a1%2Fb9317de9-c1b7-4f6e-b553-c2c44f2577f3%2FUntitled.png?table=block&id=1ce4a0a1-78eb-4cba-96c9-e971ae054f63&spaceId=a4336ca6-f4ed-458c-b743-2a86cc9620a1&width=860&userId=4a875d3f-c33d-4324-9807-2fb21ead789e&cache=v2",
    },
    {
      name: "3D Model",
      route: true,

      discription: "convert 3D model into generated image",
      url: "/generate-3d/",
      img: "https://media.sketchfab.com/models/724f69d360e24cda99ba84fead2bed88/thumbnails/3bc8180aab6148778a75cde61100e6d4/915356641a0547a6907f0b8c89383780.jpeg",
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

  const Redirect = (url, route) => {
    if (route) {
      router.push(url + userId);
    } else {
      window.location.href = url + userId;
    }
  };
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      <ToolsWrapper>
        <div className="headerText">Tools</div>

        <div className="gridbox">
          {toolslist?.map((tool: object[]) => (
            <div
              className="tool-cards"
              onClick={() => Redirect(tool.url, tool.route)}
            >
              <div className="imgeWrapper">
                <div className="imgbox">
                  <picture>
                    <img src={tool.img} alt="" />
                  </picture>
                </div>
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
      cursor: pointer;

      .imgeWrapper {
        height: 190px;
        /* padding: 5px; */
        width: 100%;
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;

        overflow: hidden;
        .imgbox {
          width: 100%;
          height: 100%;
          background-color: #d9d9d9;
          /* border-radius: 7px; */
          picture {
            width: 100%;
            height: 100%;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
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
