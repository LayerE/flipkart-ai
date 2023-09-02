import Image from "next/image";
import { Inter } from "next/font/google";
import { styled } from "styled-components";
import assets from "@/public/assets";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

import { motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <MainPage>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="new"
      >
        <div className="sidebar">
          <div className="tab  active-tab">
            <Image src={assets.icons.project_icon} alt="" />
            Projets
          </div>
        </div>
        <div className="dashbaord">
          <div className="gridebox">
            <Link href={"/generate"}>
              <div className="createbox">
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

                <div className="testcreat">Create new project</div>
              </div>
            </Link>
            <Link href={"/"}>
              <div className="projectfile">
                <div className="testcreat">Untitled Project</div>
              </div>
            </Link>
          
          </div>
        </div>
      </motion.div>
    </MainPage>
  );
}

const MainPage = styled.div`
  .new {
    display: flex;
  }
  .sidebar {
    border-right: 1px solid rgba(238, 238, 238, 1);
    min-height: 100vh;
    padding-left: 70px;
    padding-right: 24px;
    padding-top: ${({ theme }) => theme.paddings.paddingTop};

    .tab {
      display: flex;
      justify-items: start;
      align-items: center;
      gap: 10px;
      width: 183px;
      border-radius: 6px;
      background: #eee;
      padding: 8px 26px;
      font-size: 14px;
      cursor: pointer;
      font-weight: 600;

      transition: all 0.3s;
      &:hover {
        background: rgba(249, 208, 13, 0.23);
      }
    }
    .active-tab {
      background: ${({ theme }) => theme.btnPrimary};
      &:hover {
        background: ${({ theme }) => theme.btnPrimary};
      }
    }
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
.sidebar{
  display: none;;
}
`}

  .dashbaord {
    background: #f8f8f8;
    width: 100%;
    min-height: 100vh;
    padding: 40px 30px;
    padding-top: ${({ theme }) => theme.paddings.paddingTop};
    overflow: auto;

    .gridebox {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr ;
      gap: 12px;
      .projectfile {
        width: 100%;
        height: 100%;
        border-radius: 16px;
        border: 1px solid #585858;
        position: relative;
        transition: all 0.3s;

        &:hover {
          border: 1px solid #f9d00d;
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

      .createbox {
        cursor: pointer;
        width: 100%;
        height: 215px;
        border-radius: 16px;
        background: #f8f8f8;
        border-radius: 16px;
        border: 1px solid #585858;
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
    }
    ${({ theme }) => theme.mediaWidth.upToMedium`
.gridebox {
   
      grid-template-columns: 1fr 1fr ;
      gap: 12px;

      .createbox {
        cursor: pointer;
        width: 100%;
        height: 185px;
        border-radius: 16px;
        background: #f8f8f8;
        border-radius: 16px;
        border: 1px solid #585858;
        position: relative;
        display: flex;
        justify-content: center;
        /* align-items: center; */
        transition: all 0.3s;
        svg {
          margin: 60px;
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
     
  }
`}
  }
`;
