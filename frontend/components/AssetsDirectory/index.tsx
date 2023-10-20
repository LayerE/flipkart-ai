import { images } from "@/next.config";
import React, { useEffect, useState } from "react";
import { styled } from "styled-components";

import { motion } from "framer-motion";
import { useAppState } from "@/context/app.context";
import { toast } from "react-toastify";
import PopupUpload from "../Popup";
import { useRouter } from "next/router";
import { AssetsLoader } from "../Loader/AssetsLoader";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/utils/supabase";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const AssetsDir = () => {
  const session = useSession();
 
  

  const {
    fetchGeneratedImages,
    generatedImgList,
    setPopupImage,
    setGeneratedImgList,
    listofassets,
    setListOfAssets,
    fetchAssetsImages,
    AssetsActivTab,
    setassetsActiveTab,
    popup,
    uploadedProductlist,
    brandassetLoader,
    setbrandassetLoader,
    fetchAssetsImagesWithProjectId,

    setPopup,
    fetchAssetsImagesBrant,
    setUploadedProductlist,
    setProduct,
    addimgToCanvasSubject,
    listofassetsBarand,
    setListOfAssetsBrand,
    userId, setUserId,
    // re, setRe,
  } = useAppState();

  // useEffect(() => {
  //   const checkSession = async () => {
  //     const { data } = await supabase.auth.getSession();
  //     if (data.session) {
  //       // router.push("/");
  //       setUserId(data.session.user.id);
      
  //     }else{
  //       // router.push("/sign-in");

  //     }
  //   };
  //   checkSession();
  // }, [session]);
  const [assers, setAssets] = useState();
  // const [re, setRe] = useState(1);

  const { query, isReady } = useRouter();
  const { id } = query;

  useEffect(() => {
    if (userId) {
      fetchAssetsImagess(userId, null);
      // setAssets(listofassets)

      const filterData = listofassets?.filter((item) => {
        if (AssetsActivTab === "product") {
          return (
            item.AssetType === undefined || item.AssetType === AssetsActivTab
          );
        } else {
          return item.AssetType === AssetsActivTab;
        }
      });
      // setAssets(filterData);

      // }
    }
  }, [isReady, userId, AssetsActivTab, listofassets, listofassetsBarand]);

  const fetchAssetsImagess = async () => {
    // setlaoder(true);

    try {
      if (AssetsActivTab === "product") {
        fetchAssetsImages(userId, null);

        setAssets(listofassets);

        // if (data?.length) {
        //   if (galleryActivTab === "ai") {
        //     setGallery(data);
        //     setlaoder(false);
        //   } else {
        //   }
        // }
        // setlaoder(false);
      } else {
        fetchAssetsImagesBrant(userId, null);

        setAssets(listofassetsBarand);

        // setlaoder(false);
      }
    } catch (error) {
      // setlaoder(false);

      console.error("Error fetching images:", error);
    }
  };

  const handleFileChange = (event) => {
    const fileSize = event.target.files[0].size;
    const maxSize = 25 * 1024 * 1024; // 1MB
    const filename = event.target.files[0].name;
    const format = filename.split(".").pop();

    if (fileSize > maxSize) {
      toast.error("File size must be less than 25MB");

      return false;
    } else if (format !== "png" && format !== "webp" && format !== "jpg") {
      toast.error("Format not supported");
    } else {
      // Upload the file

      // setassetLoader(true);
      setbrandassetLoader(true);

      const selectedFile = event.target.files?.[0] || null;

      try {
        if (selectedFile) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            // const filename = `img${Date.now()}`;
            // setLoader(true);
            console.log(reader.result, "imge");

            const response = await fetch("/api/upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                dataUrl: reader.result,
                user_id: userId,
                project_id: null,
                type: "brand",
              }),
            });

            if (response?.status === 413) {
              toast.error("Image exceeded 4mb limit");

              setbrandassetLoader(false);
            } else if (response?.status === 400) {
              toast.error("Image is corrupted or unsupported dimensions");

              setbrandassetLoader(false);
            } else if (
              response?.status !== 200 &&
              response?.status !== 413 &&
              response?.status !== 201
            ) {
              toast.error(response?.statusText);

              setbrandassetLoader(false);
            }
            const data = await response.json();
            console.log(data.data.data, "ddsfvd");

            if (data?.data) {
              // setPopup({
              //   status: true,
              //   data: data?.data.data[0],
              //   dataArray: data,
              // });

              // const response = await fetch(
              //   `${process.env.NEXT_PUBLIC_API}/assets`,
              //   {
              //     method: "POST",
              //     headers: {
              //       "Content-Type": "application/json",
              //     },
              //     body: JSON.stringify({
              //       userId: userId,
              //       projectId: id,
              //       assetType: AssetsActivTab,

              //       asset: { url: data.data.data[0], product: null },
              //     }),
              //   }
              // );

              // const datares = await response;
              // console.log(datares,"ddfd");

              // if (datares) {
              fetchAssetsImages(userId, null);
              // addimgToCanvasSubject(data?.data.data[0]);
              fetchAssetsImagesWithProjectId(userId, id);
              // setTimeout(() => {

              // }, 500);

              // setUploadedProductlist((prev) => [
              //   ...prev,
              //   { url: popup?.data, tittle: productnew },
              // ]);
              // setProduct(productnew);
              // setPopup({ status: false, data: null });
              setbrandassetLoader(false);
              // }
            } else {
              console.log("bg not removed");

              // setbrandassetLoader(false);
            }
          };
          reader.readAsDataURL(selectedFile);
        }
      } catch (e) {
        console.log("cvff", e);
        setbrandassetLoader(false);
      }
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      <GelleryWrapper>
        <div className="hederbox">
          <div className="headerText">Assets</div>
          <div className="small-tabs">
            <div
              className={AssetsActivTab === "product" ? "tab activeTAb" : "tab"}
              onClick={() => {
                setassetsActiveTab("product");
              }}
            >
              Product Assets{" "}
            </div>
            <div
              className={AssetsActivTab === "brand" ? "tab activeTAb" : "tab"}
              onClick={() => {
                setassetsActiveTab("brand");
              }}
            >
              Brand Assets{" "}
            </div>
          </div>
        </div>

        <div className="imageBox">
          <div className="grid-img">
            {AssetsActivTab === "brand" ? (
              <>
                {brandassetLoader ? (
                  <AssetsLoader />
                ) : (
                  <>
                    <label
                      className="createbox"
                      onClick={"handleCreate"}
                      htmlFor="fileInputAssets"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7 0C7.26522 0 7.51957 0.105357 7.70711 0.292893C7.89464 0.48043 8 0.734784 8 1V6H13C13.2652 6 13.5196 6.10536 13.7071 6.29289C13.8946 6.48043 14 6.73478 14 7C14 7.26522 13.8946 7.51957 13.7071 7.70711C13.5196 7.89464 13.2652 8 13 8H8V13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13V8H1C0.734784 8 0.48043 7.89464 0.292893 7.70711C0.105357 7.51957 0 7.26522 0 7C0 6.73478 0.105357 6.48043 0.292893 6.29289C0.48043 6.10536 0.734784 6 1 6H6V1C6 0.734784 6.10536 0.48043 6.29289 0.292893C6.48043 0.105357 6.73478 0 7 0Z"
                          fill="#585858"
                        />
                      </svg>
                      <div className="testcreat">Upload New Photo</div>
                    </label>
                    <input
                      type="file"
                      id="fileInputAssets"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                      accept=".webp, .png, .jpg"
                    />
                  </>
                )}
              </>
            ) : null}

            {assers?.map((image, i) => (
              <div className="We" key={i}>
                {/* <div className="btns">
                  <button className="selectone" onClick={() => DeletIrem()}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="delet"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      ></path>
                    </svg>
                  </button>
                  <button className="selectone" onClick={() => downlaedImf()}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="delet"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div> */}
                <div
                  className="img"
                  onClick={() =>
                    setPopupImage({
                      id: i,
                      url: image?.image_url,
                      status: true,
                      userId: userId,
                      btn: "Use to generate",
                      generat: true,
                      index: i,
                      list: assers,
                      type: AssetsActivTab,
                    })
                  }
                >
                  <picture>
                    <img src={image?.image_url} alt="" />
                  </picture>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GelleryWrapper>
    </motion.div>
  );
};

export default AssetsDir;

const GelleryWrapper = styled.div`
  .We {
    position: relative;
  }
  .btns {
    position: absolute;
    right: -3px;
    z-index: 10;
  }

  .delet {
    width: 15px !important;
    height: 15px;
  }
  .selectone {
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid rgba(249, 208, 13, 1);
    padding: 5px 8px;
    background: rgba(249, 208, 13, 1) !important;

    color: #000;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.3 ease;
    margin-right: 3px;

    &:hover {
      border: 2px solid rgba(249, 208, 13, 1);
    }
  }

  height: 100%;
  .headerText {
    font-size: 32px;
    font-weight: 700;
  }
  .hederbox {
    display: flex;
    gap: 50px;

    .small-tabs {
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: start;
    }
    .tab {
      font-size: 16px;
      font-weight: 500;
      background: #ececec;
      height: max-content;
      padding: 4px 15px;
      border-radius: 7px;
      cursor: pointer;
    }
    .activeTAb {
      background-color: ${({ theme }) => theme.btnPrimary};
    }
  }
  .imageBox {
    margin-top: 20px;
    border-radius: 7px;
    border: 1px solid #d9d9d9;
    min-height: 75vh;

    .grid-img {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      gap: 20px;
      padding: 20px;
      min-height: 100%;
    }
    .img {
      width: 100%;
      height: 180px;
      background-color: #d9d9d9;
      border-radius: 7px;
      overflow: hidden;
      border: 1px solid #d9d9d9;
      transition: all 0.3s ease-in-out;
      &:hover {
        border: 3px solid rgba(249, 208, 13, 1);
        transform: scale(1.1);
      }
    }
    img {
      width: 100%;
      height: 180px;
      object-fit: contain;
    }
  }
  .createbox {
    cursor: pointer;
    width: 100%;
    min-height: 180px;
    border-radius: 16px;
    background: #f8f8f8;
    border-radius: 16px;
    border: 1px solid #d9d9d9;
    position: relative;
    display: flex;
    justify-content: center;
    /* align-items: center; */
    transition: all 0.3s;
    svg {
      margin: 80px;
    }
    &:hover {
      border: 1px solid #f9d00d;
    }

    &:hover .testcreat {
      background: rgba(249, 208, 13, 0.08);
    }

    .testcreat {
      border-radius: 0px 0px 16px 16px;
      background: #e3e3e3;
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      padding: 16px;
      font-size: 14px;
      transition: all 0.3s;
    }
  }
`;
