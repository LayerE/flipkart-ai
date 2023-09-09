import React, { useState } from "react";
import { styled } from "styled-components";
import Label from "../common/Label";
import { Input } from "../common/Input";
import Button from "../common/Button";
import { useAppState } from "@/context/app.context";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";

const PopupUpload = () => {
  const { setPopup, popup, setUploadedProductlist, setProduct } = useAppState();
  const [productnew, setProductnew] = useState("");
  const { userId } = useAuth();
  const { query, isReady } = useRouter();
  const { id } = query;

  const HandileUpload = async () => {
    if (productnew !== "") {
      try {
        // const response = await axios.get(`/api/user?id=${"shdkjs"}`);
        const getUser = localStorage.getItem("userId");
        console.log(
          `${process.env.NEXT_PUBLIC_API}/upload/asset`,
          popup?.data,
          id,
          userId
        );
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/upload/asset`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId,
              projectId: id,
              url: popup?.data,
            }),
          }
        );
        // console.log(await response.json(), "dfvcvdfvdvcdsd");
        const datares = await response.json();
        console.log(datares);

        setUploadedProductlist((prev) => [
          ...prev,
          { url: popup?.data, tittle: productnew },
        ]);
        setProduct(productnew);
        setPopup({ status: false, data: null });
      } catch (error) {
        // Handle error
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
            <Label>{"What's your product"}</Label>
            <Input
              type="text"
              onChange={(e) => setProductnew(e.target.value)}
            />
          </div>
          <Button onClick={HandileUpload}>Add image </Button>
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
  z-index: 10000;
  background-color: #c9c5c59f;

  .wrapper {
    max-width: 500px !important;
    width: 500px !important;
    border: 1px solid #555;
    border-radius: 24px !important;
    padding: 40px;
    background-color: #fff;

    img {
      width: 250px;
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
