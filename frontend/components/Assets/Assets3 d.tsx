import React, { useRef, useState, useEffect } from "react";
import { Row } from "../common/Row";
import Label from "../common/Label";
import { FileUpload, FileUpload3D } from "../common/Input";
import DropdownInput from "../common/Dropdown";
import { styled } from "styled-components";
// import { category, test } from "@/store/dropdown";
import { useAppState } from "@/context/app.context";
import { productList } from "@/store/listOfElement";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
// import { fabric } from "fabric";

const Assets3d: React.FC = () => {
  const { userId } = useAuth();
  const {
    setProduct,
    uploadedProductlist,

    setUploadedProductlist,
    // addimgToCanvas,
    listofassets,
    setListOfAssets,
    fetchAssetsImages,
    fetchAssetsImagesWithProjectId,
    listofassetsById,
    setListOfAssetsById,
    addimgToCanvasSubject,
    getBase64FromUrl,
    assetLoader,
    loader,
  } = useAppState();
  const { query, isReady } = useRouter();
  // const { id } = query;
  const id = (query.id as string[]) || [];

  const [filter, setFilter] = useState();
  const [re, setRe] = useState(1);
  useEffect(() => {
    if (re <= 10) {
      setRe(re + 1);
    }
    if (userId && isReady) {
      fetchAssetsImagesWithProjectId(userId, id);

      const filer = listofassetsById?.filter((item) => item.project_id === id);
      setFilter(filer);
      console.log(listofassetsById, "dfdf");
    }
  }, [isReady, userId, re]);

  // listofassets

  return (
    <div className="accest">
      <div className="gap">
        <Row>
          <Label>Product</Label>
        </Row>

        <Row>
          <FileUpload3D
            type={"product"}
            title={"Upload 3D Object"}
            uerId={userId}
          />
        </Row>
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

export default Assets3d;
