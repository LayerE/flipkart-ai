import React, { useState } from "react";
import { styled } from "styled-components";
import Label from "../common/Label";
import { Input } from "../common/Input";
import Button from "../common/Button";
import { useAppState } from "@/context/app.context";

const PopupUpload = () => {
  const { setPopup, popup, setUploadedProductlist } = useAppState();
  const [product, setProduct] = useState("");

  const HandileUpload = () => {
    if (product !== "") {
      setUploadedProductlist((prev) => [
        ...prev,
        { url: popup?.data, tittle: product },
      ]);
      setPopup({ status: false, data: null });
    }
  };

  return (
    <PopupWrapper>
      <div className="wrapper">
        <img src={popup?.data} alt="" />

        <div className="test">
          <div>
            <Label>What's your product</Label>
            <Input type="text" onChange={(e) => setProduct(e.target.value)} />
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
