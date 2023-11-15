// @ts-nocheck

import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import Label, { DisabledLabel } from "../common/Label";
import { Input } from "../common/Input";
import Button from "../common/Button";
import { useAppState } from "@/context/app.context";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const PopupUpload = () => {
  const {
    setPopup,
    popup,
    setProduct,
    addimgToCanvasSubject,
    fetchAssetsImagesWithProjectId,
    fetchAssetsImages,
  } = useAppState();
  const [productnew, setProductnew] = useState("");
  const [btnisable, setbtnisable] = useState(false);

  const session = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    if (session) {
      setUserId(session.user.id);
    }
  }, [session]);
  const { query, isReady } = useRouter();
  const { id } = query;

  const HandileUpload = async () => {
    if (productnew !== "") {
      console.log(popup.dataArray);
      setbtnisable(true)
      try {
        const response =  await fetch(`/api/addcaption`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_url: popup.dataArray.imageUrl,
            caption: productnew,

          }),
        });

        const datares = await response;
        if (datares) {
          fetchAssetsImages(userId, null);
          addimgToCanvasSubject(popup?.dataArray?.imageUrl);
          fetchAssetsImagesWithProjectId(userId, id);
          setProduct(productnew);
          setPopup({ status: false, data: null });
        }
      } catch (error) {
        

        setbtnisable(false)
        setPopup({ status: false, data: null });
      }
    }
  };
  useEffect(() => {
   if(popup?.dataArray?.caption && popup?.dataArray?.caption  !== null){
    setProductnew(popup?.dataArray?.caption);
   }
  }, [])
  

  return (
    <PopupWrapper>
      <div className="wrapper">
        <picture>
          <img src={popup?.dataArray?.imageUrl} alt="" />
        </picture>
        <div className="test">
          <div>
            <Label>{"What did you just upload?"}</Label>

            <Input
              type="text"
              value={productnew}
              onChange={(e) => setProductnew(e.target.value)}
              placeholder=" e.g. 'red sofa' or 'blue perfume bottle'"
            />
          </div>
          {
            btnisable ?
            <Button disabled onClick={""}>Adding... </Button>

            :

          <Button onClick={HandileUpload}>Add image </Button>
          }
          <Button
            onClick={() => setPopup({ status: false, data: null })}
            style={{ backgroundColor: "rgba(249, 208, 13, 0.23)" }}
          >
            Close{" "}
          </Button>
        </div>
      </div>
    </PopupWrapper>
  );
};

export default PopupUpload;

const PopupWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  background-color: #c9c5c59f;

  .wrapper {
    max-width: 60vw !important;
    min-width: 50vw !important;
    min-height: 70vh;
    border: 1px solid #555;
    border-radius: 24px !important;
    padding: 40px;
    background-color: #fff;

    img {
      width: 200px;
      margin: auto;
      margin-bottom: 30px;
    }
    .test {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
  }
`;
