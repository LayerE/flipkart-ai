// @ts-nocheck

import React from "react";
import { Row } from "../common/Row";
import { DisabledLabel } from "../common/Label";
import { styled } from "styled-components";
import { useAppState } from "@/context/app.context";
import { HumansList } from "@/store/listOfElement";

const Humans: React.FC = () => {
  const { addimgToCanvas } = useAppState();

  return (
    <div className="accest">
      <div className="gap">
        <Row>
          <DisabledLabel>Select a human model to add</DisabledLabel>
        </Row>
      </div>
      <div className="gap">
        <ResponsiveRowWraptwo>
          {HumansList.map((test, i) => (
            <div
              key={i}
              className={"imageBox"}
              onClick={() => addimgToCanvas(test)}
            >
              <picture>
                <img
                  src={test}
                  alt=""
                  id="some-image-id"
                  draggable="true"
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text", e.target.src)
                  }
                />
              </picture>
            </div>
          ))}
        </ResponsiveRowWraptwo>
      </div>
    </div>
  );
};

export const ResponsiveRowWraptwo = styled(Row)`
  display: grid !important;
  gap: 1rem;
  ${({ theme }) => theme.minMediaWidth.atleastSmall`
      grid-template-columns: repeat(3, 1fr);
  `}
  ${({ theme }) => theme.minMediaWidth.atleastLarge`
    grid-template-columns: repeat(3, 1fr);
   `}
`;

export default Humans;
