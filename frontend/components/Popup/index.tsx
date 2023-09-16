import React, { useState } from "react";
import { styled } from "styled-components";
import Label, { DisabledLabel } from "../common/Label";
import { Input } from "../common/Input";
import Button from "../common/Button";
import { useAppState } from "@/context/app.context";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";

const PopupUpload = () => {
  const {
    setPopup,
    popup,
    setUploadedProductlist,
    setProduct,
    addimgToCanvasSubject,
    fetchAssetsImagesWithProjectId,
  } = useAppState();
  const [productnew, setProductnew] = useState("");
  const { userId } = useAuth();
  const { query, isReady } = useRouter();
  const { id } = query;

  const HandileUpload = async () => {
    if (productnew !== "") {
      console.log(popup.dataArray);

      try {
        // const response = await axios.get(`/api/user?id=${"shdkjs"}`);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/assets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            projectId: id,
            asset: { url: popup.dataArray.imageUrl, product: productnew },
          }),
        });

        const datares = await response;
        console.log(datares);

        if (datares) {
          addimgToCanvasSubject(popup?.data);
          fetchAssetsImagesWithProjectId(userId, id);
          setUploadedProductlist((prev) => [
            ...prev,
            { url: popup?.data, tittle: productnew },
          ]);
          setProduct(productnew);
          setPopup({ status: false, data: null });
        }
      } catch (error) {
        // Handle error
        setPopup({ status: false, data: null });
      }
    }
  };

  return (
    <PopupWrapper>
      <div className="wrapper">
        <picture>
          <img src={popup?.data} alt="" />
        </picture>
        <div className="test">
          <div>
            <Label>{"What did you just upload?"}</Label>

            <Input
              type="text"
              onChange={(e) => setProductnew(e.target.value)}
              placeholder=" e.g. 'red sofa' or 'blue perfume bottle'"
            />
          </div>
          <Button onClick={HandileUpload}>Add image </Button>
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
