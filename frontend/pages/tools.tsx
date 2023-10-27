// @ts-nocheck

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

import { useEffect, useState } from "react";
import PopupCard from "@/components/Popup/PopupCard";
import axios from "axios";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import MainLoader from "@/components/Loader/main";
import PopupUpload from "@/components/Popup";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/utils/supabase";

export default function Home() {

  // const [userId, setUserID] = useState<string | null>(null);
  const [loadetool, setloadetool] = useState(false)

  const { query, isReady } = useRouter();
  // const { id } = query;
  const id = (query.id as string[]) || [];
  const {
    activeTabHome,

    activeTab,
    popupImage,
    setUserID,
    userId,
    projectlist,
    setMainLoader,
    setprojectlist,

    mainLoader,
    setFilteredArray,
    setActiveTab,
    setpromtFull,
    setActiveTemplet,
    setcategory,
    setDownloadeImgFormate,
    setProduct,
    setpromt,
    setLoader,
    fetchAssetsImages,
    popup,
    setSelectedImg,
    setActiveTabHome,
    setActiveSize,
  } = useAppState();
  const router = useRouter();



  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // router.push("/");
        setUserID(data.session.user.id);
      }
    };
    checkSession();
  }, []);
  // const [loadercarna, setloadercarna] = useState(true);
  // const [rerenter, setre] = useState(false);

  useEffect(() => {
    // if (rerenter <= 6) {
    //   setre(rerenter + 1);
    // }
   
    
    
    if (isReady && userId) {
      setloadetool(true)
      setActiveTab(1);
      setcategory(null);
      setpromtFull("");
      setActiveTemplet(null);
      setDownloadeImgFormate("png");
      setProduct("");
      setpromt("");
      setLoader(false);
      setActiveSize({
        id: 1,
        title: "Default",
        subTittle: "1024✕1024",
        h: 512,
        w: 512,
        l: 50,
        t: 160,
        gl: 592,
        gt: 160,
      });
      setSelectedImg(null);
      setMainLoader(false);
      setActiveTabHome(4);
  
  
      setTimeout(() => {
        setloadetool(false)
      }, 1000);
      // fetchAssetsImages(userId, null);

      //
      // setFilteredArray(null);
      // axios
      //   .get(`${process.env.NEXT_PUBLIC_API}/user?id=${userId}`)
      //   .then(async (response) => {

      //     const dataFecth = await fetchData(userId);
      //     console.log("dfd", await dataFecth);

      //     if (dataFecth.status === 200) {
      //       setprojectlist(await dataFecth.data);

      //       setMainLoader(false);
      //     }else{
      //       setMainLoader(false);

      //     }
      //   })
      //   .catch((error) => {
      //     setMainLoader(false);

      //     console.error(error);
      //   });
    }
  }, [isReady, userId]);


  return (
    <MainPage>
      {popup?.status ? <PopupUpload /> : null}

      {mainLoader ? <MainLoader  /> : null}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="new"
      >
   

        <HomeSidebar />

        <div className="dashbaord">
          <Tools loadetool={loadetool} />
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
    position: relative;
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
