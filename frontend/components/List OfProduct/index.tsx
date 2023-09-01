import React from "react";
import { Row } from "../common/Row";
import Label from "../common/Label";
import { styled } from "styled-components";
import { useAppState } from "@/context/app.context";


const ListOf: React.FC = () => {
  const {
    viewMore,
    addimgToCanvas,
  } = useAppState();

  return (
    <div className="accest">
      <div className="gap">
        <Row>
          <Label>Select an element to add</Label>
        </Row>

        <ResponsiveRowWraptwo>
          {viewMore?.list?.map((test:string, i:number) => (
            <div
              key={i}
              className={"imageBox"}
              onClick={() => {
                addimgToCanvas(test);
              }}
            >
              <picture>
                <img src={test} alt="" />
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
  gap: 0.5rem;
  ${({ theme }) => theme.minMediaWidth.atleastSmall`
      grid-template-columns: repeat(3, 1fr);
  `}
  ${({ theme }) => theme.minMediaWidth.atleastLarge`
    grid-template-columns: repeat(3, 1fr);
   `}
`;

export default ListOf;
