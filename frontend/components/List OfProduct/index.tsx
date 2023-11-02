// @ts-nocheck


import React from "react";
import { Row } from "../common/Row";
import Label from "../common/Label";
import { styled } from "styled-components";
import { useAppState } from "@/context/app.context";


const ListOf: React.FC = () => {
  const {
    viewMore,
    addimgToCanvas,
    activeTab,
    setPlacementTest,
    setSurroundingTest,
    setBackgrundTest,
    setSelectedPlacement,
    setSelectedSurrounding,
    setSelectedBackground





  } = useAppState();

  return (
    <div className="accest">
      <AllWrapper>

      <div className="gap">
        {/* <Row>
          <Label>Select an element to add</Label>
        </Row> */}

        <ResponsiveRowWraptwo>
          {viewMore?.list?.map((test:string, i:number) => (
            <div
              key={i}
              className={"imageBox"}
              onClick={() => {
                if(activeTab=== 2){
                  setPlacementTest(test?.placement);
                  setSurroundingTest(test?.surrounding);
                  setBackgrundTest(test?.background);
                  setSelectedPlacement(test?.placementType);
                  setSelectedSurrounding(test?.surroundingType);
                  setSelectedBackground(test?.backgroundType);

                }else
                addimgToCanvas(test);
              }}
            >
              <picture>
                {
                  activeTab=== 2 ?
                  <img src={test?.image} alt="" />

                  :
                  <img src={test} alt="" />

                }
              </picture>
            </div>
          ))}
        </ResponsiveRowWraptwo>
      </div>
      </AllWrapper>
    </div>

  );
};
export const AllWrapper = styled.div`


    padding-left: 15px;
    padding-right: 15px;


 `

export const ResponsiveRowWraptwo = styled(Row)`
  display: grid !important;
  gap: 0.5rem;
  ${({ theme }) => theme.minMediaWidth.atleastSmall`
      grid-template-columns: repeat(3, 1fr);
  `}
  ${({ theme }) => theme.minMediaWidth.atleastLarge`
    grid-template-columns: repeat(3, 1fr);
   `}
`;

export default ListOf;
