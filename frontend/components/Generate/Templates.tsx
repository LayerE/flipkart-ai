import React, { useEffect, useState } from "react";
import { Row } from "../common/Row";

import { useAppState } from "@/context/app.context";
import { styled } from "styled-components";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

import { motion } from "framer-motion";
// import { Label } from "react-konva";
import { TempletList, templets } from "@/store/dropdown";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Label from "../common/Label";

const Tamplates = () => {
  const {
    setProduct,
    setPlacementTest,
    setBackgrundTest,
    setSurroundingTest,
    setSelectedPlacement,
    setSelectedSurrounding,
    setSelectedBackground,
    placementTest,
    surroundingTest,
    project,
    setTemplet,
    setViewMore,
    loara,
    setLoara,
    promt, setpromt,

    backgroundTest,
    GetProjextById,
  } = useAppState();
  const { userId } = useAuth();
  const { query, isReady } = useRouter();
  // const { id } = query;
  const id = (query.id as string[]) || [];
  const addtoRecntly = async (obj) => {
    if (isReady) {
      try {
        // const response = await axios.get(`/api/user?id=${"shdkjs"}`);
     
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/recently`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId,
              projectId: id,
              recently: obj,
            }),
          }
        );
        // console.log(await response.json(), "dfvcvdfvdvcdsd");
        const datares = await response;

        if (datares.ok) {
          GetProjextById(id);
          // setfilterRecently(project?.recently.reverse())
        }
        // window.open(`/generate/${datares?._id}`, "_self");
      } catch (error) {
        // Handle error
      }
    }
  };
  const [filterRecently, setfilterRecently] = useState();

  useEffect(() => {
    GetProjextById(id);
    // console.log(data, "dfvcvdf")

    setfilterRecently(project?.recently?.reverse());
  }, [isReady]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="accest"
    >
      <RecentWrapper>
        {filterRecently?.length ? (
          <>
            <div className=" rows">
              <div className="left">
                <Label>Recently Used</Label>
              </div>
              <div className="right">
                <div
                  className="viewBtn"
                  onClick={() =>
                    setViewMore({
                      status: true,
                      title: "Recently Used",
                      index: 1,
                      list: project?.recently,
                    })
                  }
                >
                  View all
                </div>
              </div>
            </div>
            <div className="horizontaScrollBox">
              {filterRecently?.slice(0, 5).map((test, i) => (
                <div
                  key={i}
                  className={"imageBoxs"}
                  onClick={() => {
                    setPlacementTest(test.placement);
                    setSurroundingTest(test.surrounding);
                    setBackgrundTest(test.background);
                    setSelectedPlacement(test.placementType);
                    setSelectedSurrounding(test.surroundingType);
                    setSelectedBackground(test.backgroundType);
                    setLoara(test.lora);
                    setpromt(test.promt);
                  }}
                >
                  <picture>
                    <img src={test?.image} alt="" />
                  </picture>
                  <div className="head">{test?.title}</div>
                </div>
              ))}
            </div>
          </>
        ) : null}

        <div className=" rowsnew">
          <div className="left">
            <Label>Select a template below.</Label>
          </div>
        </div>
          {TempletList.map((testd, i) => (
<>
            <div className="sub-title">
              <Label>{testd.title}</Label>
            </div>
        <ResponsiveRowWraptwo>

          
              { testd.list.map((test, i) =>(
                <div
                key={i}
                className={"imageBoxs"}
                onClick={() => {
                  // addtoRecntly(test);
                  setTemplet(test)
                  // setProduct(test.product);
                  setPlacementTest(test.placement);
                  setSurroundingTest(test.surrounding);
                  setBackgrundTest(test.background);
                  setSelectedPlacement(test.placementType);
                  setSelectedSurrounding(test.surroundingType);
                  setSelectedBackground(test.backgroundType);
                  setLoara(test.lora);
                  setpromt(test.promt);
  
                }}
              >
                <picture>
                  <img src={test.image} alt="" />
                </picture>
                <div className="head">{test?.title}</div>
  
              </div>


                ))
              }
        




            
            
        </ResponsiveRowWraptwo>
            </>
          ))}
      </RecentWrapper>
    </motion.div>
  );
};

export default Tamplates;
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

export const RecentWrapper = styled(Row)`

.sub-title{
  text-align: left;
  width: 100%;
  padding: 15px 0;
}
  margin-bottom: 50px;
  .rowsnew {
    margin-top: 30px !important;
    margin-bottom: 10px !important;

    width: 100%;
  }
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  .accest {
    width: 100%;
  }

  .rows {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    width: 100%;

    .left {
    }

    .viewBtn {
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
    }
    .viewBtn:hover {
      color: rgba(249, 208, 13, 1);
    }
  }
  .horizontaScrollBox {
    display: flex;
    gap: 10px;
    overflow-x: scroll;
    width: 100%;

    -ms-overflow-style: none !important; /* IE and Edge */
    scrollbar-width: none !important; /* Firefox */
  }
  .horizontaScrollBox::-webkit-scrollbar {
    display: none !important;
  }
  .imageBoxs {
    border-radius: 8px;
    border: 2px solid #d9d9d9;
    padding: 10px 10px !important;
    /* height: 120px; */

    min-width: 150px !important;
    height: 180px;
    overflow: hidden;
    /* display: flex;
    align-items: center;
    justify-content: center; */
    picture {
      width: 100%;
      height: 80%;
      /* object-fit: cover; */
    }
    .head {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
      font-weight: 500;
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;

      /* height: 130px; */

      object-fit: cover;
      transition: all 0.3s ease-in-out;

      /* object-fit: contain; */
      &:hover {
        transform: scale(1.1);
      }
    }
    transition: all 0.3s ease-in-out;

    &:hover {
      border: 2px solid rgba(249, 208, 13, 1);
    }
  }
`;
