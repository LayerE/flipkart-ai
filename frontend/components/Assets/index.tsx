import React, { useRef, useState, useEffect } from "react";
import { Row } from "../common/Row";
import Label from "../common/Label";
import { FileUpload } from "../common/Input";
import DropdownInput from "../common/Dropdown";
import { styled } from "styled-components";
// import { category, test } from "@/store/dropdown";
import { useAppState } from "@/context/app.context";
import { productList } from "@/store/listOfElement";
import { useRouter } from "next/router";
import { useSession } from "@supabase/auth-helpers-react";
// import { fabric } from "fabric";

const Assets: React.FC = () => {
  const session = useSession();
 
  const {
    setProduct,
    uploadedProductlist,

    setUploadedProductlist,
    // addimgToCanvas,
    listofassets,
    fetchAssetsImagesWithProjectId,
    listofassetsById,
    setListOfAssetsById,
    addimgToCanvasSubject,
    getBase64FromUrl,
    assetLoader,
    fetchAssetsImages,
    loader,
    userId
  } = useAppState();
  const { query, isReady } = useRouter();
  const { id } = query;
  // const id = (query.id as string[]) || [];

 
  const [re, setRe] = useState(1);
  useEffect(() => {
    if (re <= 10) {
      setRe(re + 1);
    }
    if (userId && isReady) {
      fetchAssetsImages(userId, id);

      // const filer = listofassetsById?.filter((item) => item.project_id === id);

    }
  }, [isReady, userId, re]);

  // listofassets

  return (
    <div className="accest">
      <AllWrapper>

      <div className="gap">
        <Row>
          <Label>Product</Label>
        </Row>

        <Row>
          <FileUpload
            type={"product"}
            title={"Upload Product Photo"}
            uerId={userId}
            
          />
        </Row>
        <Row>
          <Label>Or use sample products</Label>
        </Row>
        <ResponsiveRowWraptwo>
          {productList?.map((test, i) => (
            <div
              key={i}
              className={"imageBox"}
              onClick={() => {
                if (!assetLoader && !loader) {
                  addimgToCanvasSubject(test.img);
                  setProduct(test.title);
                }
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
        {listofassets?.length ? (
          <Row>
            <Label>Uploaded Products</Label>
          </Row>
        ) : null}

        <ResponsiveRowWraptwo>
          {listofassets?.length
            ? listofassets?.map((test: any, i:number) => (
                <div
                  key={i}
                  className={"imageBox"}
                  onClick={() => {
                    if (!assetLoader && !loader) {
                      addimgToCanvasSubject(test?.image_url);
                      setProduct(test?.caption);
                    }
                  }}
                >
                  <picture>
                    <img src={test?.image_url} alt="" />
                  </picture>
                </div>
              ))
            : null}
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

export default Assets;
