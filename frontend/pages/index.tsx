import Image from "next/image";
import { Inter } from "next/font/google";
import { styled } from "styled-components";
import assets from "@/public/assets";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

import { motion } from "framer-motion";
import HomeSidebar from "@/components/Sidebar/HomeSidebar";
import Projects from "@/components/Projets/Projects";
import { useAppState } from "@/context/app.context";
import Tools from "@/components/Tools/Tools";
import Gellery from "@/components/Gellery/Gellery";
import AssetsDir from "@/components/AssetsDirectory";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import PopupCard from "@/components/Popup/PopupCard";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { userId } = useAuth();

  const { activeTabHome, setActiveTabHome, activeTab, popupImage , projectlist, setprojectlist} =
    useAppState();



  useEffect(() => {
    const getUser = localStorage.getItem("userId");
    if (!getUser) {
      setTimeout(() => {}, 3000);
      if (userId) localStorage.setItem("userId", userId);
    }
    axios.get(  `${process.env.NEXT_PUBLIC_API}/user?id=${getUser}`)
      .then((response) => {
     
        console.log(response)
      })
      .catch((error) => {
        console.error(error);
      });

 

  }, []);
  useEffect(() => {
    const getUser = localStorage.getItem("userId");
    if (!getUser) {
      if (userId) localStorage.setItem("userId", userId);
    }
  

    fetchData(getUser)

  }, []);

  const fetchData = (getUser:string) => {
    axios.get(  `${process.env.NEXT_PUBLIC_API}/getprojects?id=${getUser}`)
    .then((response) => {
      setprojectlist(response.data)
      console.log(response.data)
    })
    .catch((error) => {
      console.error(error);
    });
  };

  const handleDelete = () => {
  

    // Update the list of items by fetching data again
    fetchData(userId);
    console.log("dsfs", userId)
  }


  return (
    <MainPage>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="new"
      >
        {popupImage.status ? <PopupCard /> : null}

        <HomeSidebar />

        <div className="dashbaord">
          {activeTabHome === 1 ? (
            <Projects onDelet={handleDelete}/>
          ) : activeTabHome === 2 ? (
            <AssetsDir />
          ) : activeTabHome === 3 ? (
            <Gellery />
          ) : (
            <Tools />
          )}
        </div>
      </motion.div>
    </MainPage>
  );
}

const MainPage = styled.div`
  .new {
    display: flex;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
.sidebar{
  display: none;;
}
`}

  .dashbaord {
    background: #f8f8f8;
    width: 100%;
    max-height: 100vh;
    padding: 40px 30px;
    padding-top: ${({ theme }) => theme.paddings.paddingTop};
    overflow: auto;

    ${({ theme }) => theme.mediaWidth.upToMedium`
.gridebox {
   
      grid-template-columns: 1fr 1fr ;
      gap: 12px;

      .createbox {
        cursor: pointer;
        width: 100%;
        height: 185px;
        border-radius: 16px;
        background: #f8f8f8;
        border-radius: 16px;
        border: 1px solid #585858;
        position: relative;
        display: flex;
        justify-content: center;
        /* align-items: center; */
        transition: all 0.3s;
        svg {
          margin: 60px;
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
     
  }
`}
  }
`;
