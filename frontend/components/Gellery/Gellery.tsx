// @ts-nocheck

import { images } from "@/next.config";
import React, { useEffect, useState } from "react";
import { styled } from "styled-components";

import { motion } from "framer-motion";
import { useAppState } from "@/context/app.context";
import { useSession } from "@supabase/auth-helpers-react";
import PopupCard from "../Popup/PopupCard";
import axios from "axios";
import Loader from "../Loader";
import { supabase } from "@/utils/supabase";
import { IMG_TABLE } from "@/store/table";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const Gellery = () => {
  const session = useSession();
  // const [userId, setUserId] = useState<string | null>(null);

  const [gallery, setGallery] = useState();

  const {
    fetchGeneratedImages,
    generatedImgList,
    setPopupImage,
    setGeneratedImgList,
    galleryActivTab,
    setgalleryActiveTab,
    userId,
    setUserID,
    getSupabaseImage
  } = useAppState();

  const [laoder, setlaoder] = useState(true);

  // useEffect(() => {
  //   if (userId) {
  //     fetchGeneratedImages(userId);

  //     axios
  //     .get(`${process.env.NEXT_PUBLIC_API}/user?id=${userId}`)
  //     .then((response) => {
  //       console.log(response.data.jobIds);
  //       console.log(response, "adsfnbdhjskgvyuifdsgh");

  //       const  filteredResult = generatedImgList.filter((obj) =>
  //       response.data.jobIds?.includes(obj?.task_id)
  //       )
  //       // setGallery(filteredResult)

  //     })

  //     .catch((error) => {
  //       console.error(error);

  //       return error;
  //     });
  //   }
  // }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // router.push("/");
        setUserID(data.session.user.id);
      } else {
        // router.push("/sign-in");
      }
    };
    checkSession();
    if (userId) {
      fetchAssetsImages();
      getSupabaseImage()
    }
  }, [userId, galleryActivTab]);

  const fetchAssetsImages = async () => {
    setlaoder(true);

    try {
     
     
      if (galleryActivTab === "ai") {

        const datass = await  getSupabaseImage()
        if (datass){

          setGallery(datass);
        }

        // const response = await fetch(
        //   `${process.env.NEXT_PUBLIC_API}/generatedImg?userId=${userId}`,
        //   {
        //     method: "GET",
        //   }
        // );
        // const data = await response.json();
        // console.log(data, "dd");

        // if (data?.length) {
        //   if (galleryActivTab === "ai") {
        //     // setGallery(data);
        //     setlaoder(false);
        //   } else {
        //   }
        // }
        setlaoder(false);
      } else {
        // const response = await fetch(`/api/getbanner`, {
        //   method: "POST",
        //   body: JSON.stringify({
        //     user_id: userId,
        //   }),
        // });
        // const data = await response.json();
        // console.log(data, "gelery");

        // if (data?.length) {
        //     if (galleryActivTab === "ai") {
        //       console.log(data,"ssssssssssssssssss")
        //       setGallery(data);
        //       setlaoder(false);
        //     } else {
        //     }

          // setGallery(data);
        // }
        const { data, error } = await supabase
        .from("banner")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
        setlaoder(false);
        if(data){
          setGallery(data);

      }
      }
      
    } catch (error) {
      setlaoder(false);

      console.error("Error fetching images:", error);
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      <GelleryWrapper>
        <div className="hederbox">
          <div className="headerText">Gallery</div>
          <div className="small-tabs">
            <div
              className={galleryActivTab === "ai" ? "tab activeTAb" : "tab"}
              onClick={() => {
                setgalleryActiveTab("ai");
              }}
            >
              AI Generation{" "}
            </div>
            <div
              className={galleryActivTab === "banner" ? "tab activeTAb" : "tab"}
              onClick={() => {
                setgalleryActiveTab("banner");
              }}
            >
              Banner Generation{" "}
            </div>
          </div>
        </div>

        <div className="imageBox">
          {laoder ? (
            <Loader h={true}></Loader>
          ) : (
            <div className="grid-img">
              {galleryActivTab === "ai"
                ? gallery?.map((image, i) => (
                    <div
                      key={i}
                      className="img"
                      onClick={() =>
                        setPopupImage({
                          url: image?.modified_image_url,
                          status: true,
                          userId: userId,
                          btn: "Download ",
                          generat: false,
                          index: i,
                          list: gallery,
                        })
                      }
                    >
                      <picture>
                        <img src={image?.modified_image_url} alt="" />
                      </picture>
                    </div>
                  ))
                : gallery?.map((image, i) => (
                    <div
                      key={i}
                      className="img"
                      onClick={() =>
                        setPopupImage({
                          url: image?.image_url,
                          status: true,
                          userId: userId,
                          btn: "Download ",
                          generat: false,
                          index: i,
                          list: gallery,
                        })
                      }
                    >
                      <picture>
                        <img src={image?.image_url} alt="" />
                      </picture>
                    </div>
                  ))}
              {/* {} */}
            </div>
          )}
        </div>
      </GelleryWrapper>
    </motion.div>
  );
};

export default Gellery;

const GelleryWrapper = styled.div`
  height: 100%;
  .headerText {
    font-size: 32px;
    font-weight: 700;
  }
  .hederbox {
    display: flex;
    gap: 50px;

    .small-tabs {
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: start;
    }
    .tab {
      font-size: 16px;
      font-weight: 500;
      background: #ececec;
      height: max-content;
      padding: 4px 15px;
      cursor: pointer;
      border-radius: 7px;
    }
    .activeTAb {
      background-color: ${({ theme }) => theme.btnPrimary};
    }
  }
  .imageBox {
    margin-top: 20px;
    border-radius: 7px;
    border: 1px solid #d9d9d9;
    min-height: 75vh;

    position: relative;
    .grid-img {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      gap: 20px;
      padding: 20px;
      min-height: 100%;
    }
    .img {
      width: 100%;
      height: 180px;
      background-color: #d9d9d9;
      border-radius: 7px;
      overflow: hidden;
      border: 1px solid #d9d9d9;
      transition: all 0.3s ease-in-out;
      &:hover {
        border: 3px solid rgba(249, 208, 13, 1);
        transform: scale(1.1);
      }
    }
    img {
      width: 100%;
      height: 180px;
      object-fit: contain;
    }
  }
`;
