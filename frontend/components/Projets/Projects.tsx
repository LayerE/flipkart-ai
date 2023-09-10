import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { motion } from "framer-motion";
import Link from "next/link";
import assets from "@/public/assets";
import ProjectCard from "./ProjectCard";
import { useAppState } from "@/context/app.context";
import { useAuth } from "@clerk/nextjs";
import { setTimeout } from "timers";
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const Projects = ({ onDelet }) => {
  const [projects, setProjects] = useState([]);
  const { userId } = useAuth();
  const { activeTab, setprojectlist, projectlist, GetProjexts,renameProject } = useAppState();

  const handleCreate = async () => {
    try {
      // const response = await axios.get(`/api/user?id=${"shdkjs"}`);
      const getUser = localStorage.getItem("userId");
      console.log(getUser);
      if(userId){
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/project?id=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Untitle",
            id: getUser,
          }),
        }
      );
      // console.log(await response.json(), "dfvcvdfvdvcdsd");
      const datares = await response.json();
      if(datares?._id){
        console.log(datares,"sdcdrfc")
        GetProjexts(getUser);
        setTimeout(() => {
          
          window.open(`/generate/${datares?._id}`, "_self");
        }, 1000);
  

      }
     
      }
    } catch (error) {
      // Handle error
    }
  };
  const handleEdite= async (id: string,name:string) => {
    try {
      // const response = await axios.get(`/api/user?id=${"shdkjs"}`);
      renameProject(userId, id, name)

      GetProjexts(userId);
    } catch (error) {
      // Handle error
    }
  };

  const handleDelet = async (id: string) => {
    try {
      // const response = await axios.get(`/api/user?id=${"shdkjs"}`);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/project?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const getUser = localStorage.getItem("userId");

      GetProjexts(getUser);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="new"
    >
      <ProjectWrapper className="gridebox">
        <div className="createbox" onClick={handleCreate}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7 0C7.26522 0 7.51957 0.105357 7.70711 0.292893C7.89464 0.48043 8 0.734784 8 1V6H13C13.2652 6 13.5196 6.10536 13.7071 6.29289C13.8946 6.48043 14 6.73478 14 7C14 7.26522 13.8946 7.51957 13.7071 7.70711C13.5196 7.89464 13.2652 8 13 8H8V13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13V8H1C0.734784 8 0.48043 7.89464 0.292893 7.70711C0.105357 7.51957 0 7.26522 0 7C0 6.73478 0.105357 6.48043 0.292893 6.29289C0.48043 6.10536 0.734784 6 1 6H6V1C6 0.734784 6.10536 0.48043 6.29289 0.292893C6.48043 0.105357 6.73478 0 7 0Z"
              fill="#585858"
            />
          </svg>

          <div className="testcreat">Create new project</div>
        </div>

        {/* <Link href={"/"}> */}
        {projectlist?.map((item: any, i: number) => (
          <ProjectCard
            key={item._id}
            data={item}
            setProjects={setProjects}
            handleDelet={handleDelet}
            handleEdite={handleEdite}
          />
        ))}
        {/* </Link> */}
      </ProjectWrapper>
    </motion.div>
  );
};

export default Projects;

const ProjectWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  /* grid-template-columns: 1fr 1fr 1fr 1fr; */
  grid-template-rows: 1fr 1fr 1fr 1fr;
  /* grid-template-rows: repeat(auto-fill, minmax(100px, 1fr)); */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;

  .createbox {
    cursor: pointer;
    width: 100%;
    height: 215px;
    border-radius: 16px;
    background: #f8f8f8;
    border-radius: 16px;
    border: 1px solid #d9d9d9;
    position: relative;
    display: flex;
    justify-content: center;
    /* align-items: center; */
    transition: all 0.3s;
    svg {
      margin: 80px;
    }
    &:hover {
      border: 1px solid #f9d00d;
    }

    &:hover .testcreat {
      background: rgba(249, 208, 13, 0.08);
    }

    .testcreat {
      border-radius: 0px 0px 16px 16px;
      background: #e3e3e3;
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      padding: 16px;
      font-size: 14px;
      transition: all 0.3s;
    }
  }
`;
