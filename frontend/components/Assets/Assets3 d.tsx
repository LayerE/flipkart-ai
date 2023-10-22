import React, { useRef, useState, useEffect } from "react";
import { Row } from "../common/Row";
import Label from "../common/Label";
import { FileUpload, FileUpload3D, Input } from "../common/Input";
import DropdownInput from "../common/Dropdown";
import { styled } from "styled-components";
// import { category, test } from "@/store/dropdown";
import { useAppState } from "@/context/app.context";
import { productList } from "@/store/listOfElement";
import { useRouter } from "next/router";
import Button from "../common/Button";
import { formate3d } from "@/store/format";
import { useSession } from "@supabase/auth-helpers-react";
// import { fabric } from "fabric";

const Assets3d: React.FC = () => {
  const session = useSession();
  const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
      if (session) {
        setUserId(session.user.id);
      }
    }, [session]);
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
    file3dUrl,
    setFile3dUrl,
    loader,
    setFile3d,
    file3dName,
    file3d,
    tdFormate,
    assetL3doader,
    setFile3dName,
    setTdFormate,
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
      console.log(file3dName, "dsfdccccccccccccccccccccccccccccccccccfdf");
    }
  }, [isReady, userId, re, file3dUrl, file3d]);

  // listofassets
  const [url, setUrl] = useState(null);
  function slideName(name: string) {
    const maxLength = 8;
    let displayedName;

    if (name.length <= maxLength) {
      displayedName = name;
    } else {
      const firstPart = name.slice(0, 15);
      const lastPart = name.slice(-15);
      displayedName = firstPart + "..." + lastPart;
    }

    return displayedName;
  }
  const addUrl = (e) => {
    setUrl(e.target.value);
  };
  const HandileUrl = () => {
    setUrl(null);
    setFile3d(null);
    setFile3dUrl(url);
    const name = slideName(url);
    setFile3dName({ name: name });
  };

  function truncateString(inputString:string) {
    // Check if the input string has at least 11 characters
    if (inputString.length >= 11) {
      // Extract the first 5 characters
      const firstPart = inputString.slice(0, 15);
      // Extract the last 5 characters
      const lastPart = inputString.slice(-15);
      // Create the truncated string with three dots in the middle
      const truncatedString = `${firstPart}...${lastPart}`;
      
      return truncatedString;
    } else {
      // If the input string has less than 11 characters, return it as is
      return inputString;
    }
  }
  
  return (
    <div className="accest">
      {file3dName?.name && !assetL3doader ? (
        <Selectd className="gap">
          <div className="boxFile">
            <div className="filenamer">{truncateString(file3dName?.name)}</div>
            <div
              className="colse"
              onClick={() => {
                setFile3d(null);
                setFile3dUrl(null);
                setFile3dName(null);
              }}
            >
              x
            </div>
          </div>
        </Selectd>
      ) : (
        <div className="gap">
          <Row>
            <Label>Select your file format</Label>
          </Row>
          <FormateBtnBox>
            <div className="formatfox">
              {formate3d.map((formate) => (
                <div
                  className={
                    tdFormate === formate.formate
                      ? "formatebtn activFormate"
                      : "formatebtn"
                  }
                  onClick={() => {
                    setTdFormate(formate.formate);
                    setFile3d(null);
                    setFile3dUrl(null);
                  }}
                >
                  {formate.tittle}
                </div>
              ))}
            </div>
          </FormateBtnBox>

          <Row>
            <FileUpload3D
              type={"product"}
              title={` Upload 3D Object (eg: tree${tdFormate})`}
              uerId={userId}
            />
          </Row>
          <div
            style={{
              textAlign: "center",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Label>Or</Label>
          </div>
          <Row>
            <Input
              type="text"
              value={url ? url : ""}
              onChange={(e) => addUrl(e)}
              placeholder={` 3D Object  URL (file type should be ${tdFormate})`}
            />
          </Row>
          <Row>
            <Button onClick={HandileUrl} disabled={url ? false : true}>
              Add 3D Object{" "}
            </Button>
          </Row>
        </div>
      )}
    </div>
  );
};

export const Selectd = styled.div`
  .boxFile {
    border-radius: 8px;
    padding: 8px 15px;
    border: 2px solid rgba(249, 208, 13, 1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .filenamer {
    }
    .colse {
      cursor: pointer;
    }
  }
`;
export const FormateBtnBox = styled.div`
  .formatfox {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .formatebtn {
    border: 2px solid rgba(249, 208, 13, 1);
    padding: 3px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3 ease;
    background: #ffffff !important;

    &:hover {
      background: rgba(249, 208, 13, 1) !important;
    }
  }
  .activFormate {
    background: rgba(249, 208, 13, 1) !important;
  }
`;

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
