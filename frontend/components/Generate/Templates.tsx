import React from "react";
import { Row } from "../common/Row";

import { templets } from "@/store/dropdown";
import { useAppState } from "@/context/app.context";
import { styled } from "styled-components";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

import { motion } from "framer-motion";

const Tamplates = () => {
  const {
    setProduct,
    setPlacementTest,
    setBackgrundTest,
    setSurroundingTest,
    setSelectedPlacement,
    setSelectedSurrounding,
    setSelectedBackground,
  } = useAppState();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="accest"
    >
      <ResponsiveRowWraptwo>
        {templets.map((test, i) => (
          <div
            key={i}
            className={"imageBox"}
            onClick={() => {
              setProduct(test.product);
              setPlacementTest(test.placement);
              setSurroundingTest(test.surrounding);
              setBackgrundTest(test.background);
              setSelectedPlacement(test.placementType);
              setSelectedSurrounding(test.surroundingType);
              setSelectedBackground(test.backgroundType);
            }}
          >
            <picture>
              <img src={test.image} alt="" />
            </picture>
          </div>
        ))}
      </ResponsiveRowWraptwo>
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
