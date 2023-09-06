import React, { useEffect, useState } from "react";
import { Row } from "../common/Row";
import Button from "../common/Button";
import { useAppState } from "@/context/app.context";
import { styled } from "styled-components";
import { useAuth } from "@clerk/nextjs";
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

import { motion } from "framer-motion";
import EditorSection from "./Editor";
import Tamplates from "./Templates";
import { fabric } from "fabric";
import Label, { DisabledLabel } from "../common/Label";
import SuggetionInput from "./SuggetionInput";
import { PlacementSuggestions, productSuggestions } from "@/store/dropdown";
import TextLoader from "../Loader/text";

const Generate = () => {
  const { userId } = useAuth();
  const {
    product,
    placementTest,
    backgroundTest,
    surroundingTest,
    generationLoader,
    setGenerationLoader,
    selectPlacement,
    selectSurrounding,
    selectBackground,
    getBase64FromUrl,
    addimgToCanvasGen,
    canvasInstance,
    setGeneratedImgList,
    generatedImgList,
    setSelectedImg,
    setLoader,
    selectedImg,
    undoArray,
    setModifidImageArray,
    selectResult,
    editorBox,
    loader,
    jobId,
    setJobId,
    setSelectedresult,
  } = useAppState();

  const [changeTab, setChangeTab] = useState(false);

  const promt =
    product +
    ", " +
    selectPlacement +
    " " +
    placementTest +
    ", " +
    selectSurrounding +
    " " +
    surroundingTest +
    ", " +
    selectBackground +
    " " +
    backgroundTest;

  const fetchImages = async () => {
    try {
      // &user_id=eq.${userId}
      const response = await fetch(
        `https://tvjjvhjhvxwpkohjqxld.supabase.co/rest/v1/public_images?select=*&order=created_at.desc&user_id=eq.${userId}`,
        {
          method: "GET",
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2amp2aGpodnh3cGtvaGpxeGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI4Njg5NDQsImV4cCI6MjAwODQ0NDk0NH0.dwKxNDrr7Jw5OjeHgIbk8RLyvJuQVwZ_48Bv71P1n3Y", // Replace with your actual API key
          },
        }
      );
      const data = await response.json();
      // setImages(data); // Update the state with the fetched images
      // setGeneratedImgList(data)

      // if(data[0]?.prompt === prompt){

      // }

      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const generateImageHandeler = async () => {
    console.log(promt);
    setLoader(true);
    setGenerationLoader(true);
    try {
      const canvas1 = canvasInstance.current;

      // selectedImg // img url to generate images for the canvas
      canvas1.renderAll();
      const objects = canvas1.getObjects();
      const maskObjects = [];
      const subjectObjects = [];
      objects.forEach((object) => {
        // If the object is a mask, add it to the mask objects array
        if (object.category === "mask") {
          maskObjects.push(object);
        }
        // If the object is a subject, add it to the subject objects array
        if (object.category === "subject") {
          subjectObjects.push(object);
        }
      });

      // Make image with only the mask objects
      const maskCanvas = new fabric.StaticCanvas(null, {
        width: 410,
        height: 480,
        top: 120,
        left: 30,
      });
      maskObjects.forEach((object) => {
        maskCanvas.add(object);
      });
      const maskDataUrl = maskCanvas.toDataURL("image/png");

      // Make image with only the subject objects
      const subjectCanvas = new fabric.StaticCanvas(null, {
        // width: canvas1.getWidth(),
        // height: canvas1.getHeight(),
        width: 410,
        height: 480,
        top: 120,
        left: 30,
      });
      subjectObjects.forEach((object) => {
        subjectCanvas.add(object);
      });

      const subjectDataUrl = subjectCanvas.toDataURL("image/png");
    
      const promtText =
        product +
        ", " +
        selectPlacement +
        " " +
        placementTest +
        ", " +
        selectSurrounding +
        " " +
        surroundingTest +
        ", " +
        selectBackground +
        " " +
        backgroundTest;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataUrl: subjectDataUrl,
          maskDataUrl: maskDataUrl,
          prompt: promtText.trim(),
          user_id: userId,
        }),
      });

      const generate_response = await response.json();

      if (generate_response?.error) {
        alert(generate_response?.error);
        setLoader(false);

        return false;
      } else {
        setJobId((pre) => [...pre, generate_response?.job_id]);
        localStorage.setItem("jobId", jobId);
      }

      setTimeout(async function () {
        const loadeImge = await fetchImages();

       
        setSelectedImg({
          status: true,
          image: loadeImge[0]?.modified_image_url,
          modifiedImage: loadeImge[0]?.modified_image_url,
        });

        setModifidImageArray((pre) => [
          ...pre,
          { url: loadeImge[0]?.modified_image_url, tool: "generated" },
        ]);

        addimgToCanvasGen(loadeImge[0]?.modified_image_url);
        // canvas1.remove(editorBox).renderAll();

        setGeneratedImgList(loadeImge.slice(0, 20));

        setSelectedresult(1);

        setLoader(false);
      }, 30000);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setGenerationLoader(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="accest"
    >
      <div className="gap">
        <Row>
          <PromtGeneratePreview className="generatePreview">
            {product !== null && product !== "" ? (
              <label
                htmlFor="prompt-editor-subject-0-input"
                className="promtText"
              >
                {product}
                {", "}
              </label>
            ) : null}
            {selectPlacement !== null && selectPlacement !== "" ? (
              <label
                htmlFor="prompt-editor-subject-1-input"
                className="promtText"
              >
                {selectPlacement}{" "}
              </label>
            ) : null}
            {placementTest !== null && placementTest !== "" ? (
              <label
                htmlFor="prompt-editor-subject-1-input"
                className="promtText"
              >
                {placementTest}{" "}
              </label>
            ) : null}
            {selectSurrounding !== null && selectSurrounding !== "" ? (
              <label
                htmlFor="prompt-editor-subject-1-input"
                className="promtText"
              >
                {selectSurrounding}{" "}
              </label>
            ) : null}
            {surroundingTest !== null && surroundingTest !== "" ? (
              <label
                htmlFor="prompt-editor-subject-2-input"
                className="promtText"
              >
                {surroundingTest}{" "}
              </label>
            ) : null}
            {selectBackground !== null && selectBackground !== "" ? (
              <label
                htmlFor="prompt-editor-subject-1-input"
                className="promtText"
              >
                {selectBackground}{" "}
              </label>
            ) : null}
            {backgroundTest !== null && backgroundTest !== "" ? (
              <label
                htmlFor="prompt-editor-subject-3-input"
                className="promtText"
              >
                {","} {backgroundTest}{" "}
              </label>
            ) : null}
          </PromtGeneratePreview>
        </Row>
        <Row>
          {
            loader?
        <TextLoader/>
        :

          <Button
            onClick={() => generateImageHandeler()}
            disabled={product === "" ? true : false}
          >
            {generationLoader ? "Loading..." : "Generate"}
          </Button>
          }
        </Row>
      </div>
      <div className="bigGap">
        {/* <Label>Edit the the prompt in the form below.</Label> */}
      </div>
      <div className="gap"></div>
      <SwchichBtn className="swich">
        <div
          className={changeTab ? "btnswitch " : "btnswitch activeSwitch"}
          onClick={() => setChangeTab(false)}
        >
          Templates
        </div>
        <div
          className={changeTab ? "btnswitch activeSwitch" : "btnswitch "}
          onClick={() => setChangeTab(true)}
        >
          Editor
        </div>
      </SwchichBtn>
      <Wrapper className="wrappper">
        {changeTab ? <EditorSection /> : <Tamplates />}
      </Wrapper>
    </motion.div>
  );
};

export default Generate;

export const PromtGeneratePreview = styled.div`
  border: 2px solid #d9d9d9;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  min-height: 40px;

  .promtText {
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    &:hover {
      color: rgba(249, 208, 13, 1);
    }
  }
`;

export const ResponsiveRowWraptwo = styled(Row)`
  display: grid !important;
  gap: 1rem;
  ${({ theme }) => theme.minMediaWidth.atleastSmall`
      grid-template-columns: repeat(2, 1fr);
  `}
  ${({ theme }) => theme.minMediaWidth.atleastLarge`
    grid-template-columns: repeat(2, 1fr);
   `}
`;

export const SwchichBtn = styled(Row)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  .btnswitch {
    width: 100%;
    text-align: center;
    cursor: pointer;
    /* transition: all 0.2s ease-in-out ; */
  }
  .activeSwitch {
    border-bottom: 5px solid rgba(249, 208, 13, 1);
  }
`;
export const Wrapper = styled.div`
  /* max-height: 600px;
  overflow-y: scroll; */
`;
