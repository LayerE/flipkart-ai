import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Sidebar from "@/components/Sidebar";
import { styled } from "styled-components";
import { useAppState } from "@/context/app.context";
import assets from "@/public/assets";

const inter = Inter({ subsets: ["latin"] });
const MainPage = styled.div`
  display: flex;

  .main-privier {
    padding: 2rem;
    padding-top: ${({ theme }) => theme.paddings.paddingTop};
  }
  .tgide {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    .preBox {
      font-size: 10px;
      font-weight: 500;
      border: 2px solid #f9d00d;
      padding: 1rem;
      height: 350px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .imgadd {
        margin: 10px 0;
        width: 100%;
        max-height: 250px;
      }
      .more {
        padding: 0 50px;
        width: 100%;
        height: 100%;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .center {
        text-align: center;
      }
    }
  }
`;

export default function Home() {
  const { selectedImage, setSelectedImage } = useAppState();

  return (
    <MainPage>
      <Sidebar />
      <div className="main-privier">
        <div className="tgide">
          <div className="preBox">
            <p>Place Your Product Here</p>
            <div className="imgadd">
              {selectedImage?.url ? (
                <img
                  src={
                    selectedImage?.url
                      ? selectedImage?.url
                      : assets.images.dotbox
                  }
                  alt=""
                />
              ) : (
                <div className="more">
                  <Image src={assets.images.dotbox} alt=""></Image>
                </div>
              )}
            </div>
            <p className="center">Step 1: Place your product inside here</p>
          </div>
          {selectedImage?.id > -1 ? (
            <div className="preBox">
              <p>Place Your Product Here</p>
              <div className="imgadd">
                {/* <img
                    src="data:image/jpeg;base64,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"
                    alt=""
                  /> */}
                <div className="more">
                  <Image src={assets.images.dotbox} alt=""></Image>
                </div>
              </div>
              <p className="center">Step 1: Place your product inside here</p>
            </div>
          ) : null}
        </div>
      </div>
    </MainPage>
  );
}
