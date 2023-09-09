import React, { useRef, useState, useEffect } from "react";
import { Row } from "../common/Row";
import Label from "../common/Label";
import { FileUpload } from "../common/Input";
import DropdownInput from "../common/Dropdown";
import { styled } from "styled-components";
// import { category, test } from "@/store/dropdown";
import { useAppState } from "@/context/app.context";
import { productList } from "@/store/listOfElement";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
// import { fabric } from "fabric";

const Assets: React.FC = () => {
  const { userId } = useAuth();
  const {
    setProduct,
    uploadedProductlist,

    setUploadedProductlist,
    // addimgToCanvas,
    listofassets,
    setListOfAssets,
    fetchAssetsImages,
    addimgToCanvasSubject
  } = useAppState();
  const { query, isReady } = useRouter();
  // const { id } = query;
  const id = (query.id as string[]) || [];

  const [filter, setFilter] = useState()
  useEffect(() => {
    if (userId && isReady) {
      fetchAssetsImages(userId);
    
      const filer = listofassets?.filter((item)=> item.project_id === id )
      setFilter(filer)
    }
  }, [listofassets,isReady,userId]);



  return (
    <div className="accest">
      <div className="gap">
        <Row>
          <Label>Product</Label>
        </Row>

        <Row>
          <FileUpload  type={"product"}  title={"Upload Product Photo"} />
        </Row>
        <ResponsiveRowWraptwo>
          {productList?.map((test, i) => (
            <div
              key={i}
              className={"imageBox"}
              onClick={() => {
                addimgToCanvasSubject(test.img);
                setProduct(test.title)
                
               
              }}
            >
              <picture>
                <img src={test.img} alt="" />
              </picture>
            </div>
          ))}
        </ResponsiveRowWraptwo>
      </div>
      <div className="gap">
        {filter?.length ? (
          <Row>
            <Label>Uploaded Assets</Label>
          </Row>
        ) : null}

        <ResponsiveRowWraptwo>
          {filter?.map((test, i) => (
            <div
              key={i}
              className={
                "imageBox"
              }
              onClick={() => {
                addimgToCanvasSubject(test?.image_url);

               
              }}
            >
              <picture>
                <img src={test.image_url} alt="" />
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

export default Assets;
