// @ts-nocheck

import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { motion } from "framer-motion";
import { useAppState } from "@/context/app.context";
import Loader from "../Loader";
import { supabase } from "@/utils/supabase";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const Gellery = () => {
  const [gallery, setGallery] = useState([]);
  const [laoder, setlaoder] = useState(true);

  const {
    setPopupImage,
    galleryActivTab,
    setgalleryActiveTab,
    userId,
    setUserID,
    getSupabaseImage,
  } = useAppState();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUserID(data.session.user.id);
      }
    };
    checkSession();
    if (userId) {
      // Perform the initial fetch
      fetchAssetsImages();
    }

    // Set up Supabase Realtime subscription
    const subscription = supabase
      .channel("public_gallery")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
        },
        (payload) => {
          // Handle real-time updates or inserts
          console.log("Change received!", payload);
          updateStateWithPayload(payload);
        }
      )
      .subscribe();

    // Clean up the subscription when the component is unmounted
    return () => {
      subscription.unsubscribe();
    };
  }, [userId, galleryActivTab]);

  const updateStateWithPayload = (payload) => {
    setGallery((prevData) => {
      const newData = [...prevData];
      const index = newData.findIndex((item) => item.id === payload.new.id);

      if (index !== -1) {
        // Update existing record
        newData[index] = payload.new;
      } else {
        // Insert new record
        newData.push(payload.new);
      }

      return newData;
    });
  };

  const fetchAssetsImages = async () => {
    setlaoder(true);

    try {
      let newData;

      if (galleryActivTab === "ai") {
        const datass = await getSupabaseImage();
        if (datass) {
          const filteredResultss = datass?.filter(
            (obj) => obj?.is_regenerated === false
          );
          newData = filteredResultss;
        }
      } else {
        const { data, error } = await supabase
          .from("banner")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (data) {
          newData = data;
        }
      }

      // Update the state with the new data
      setGallery(newData || []);

      setlaoder(false);
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
