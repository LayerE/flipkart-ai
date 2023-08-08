import React, { useState, useRef, useEffect } from "react";
import { styled } from "styled-components";
import { Row, RowBetween } from "../common/Row";
import Image from "next/image";
import assets from "@/public/assets";
import { theme } from "@/theme";
import Link from "next/link";
import { useRouter } from 'next/router';

const Header = () => {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const isGeneratorRoute = router.pathname === '/generate';
  const [projectName, setProjectName] = useState("Untitled");
  

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleButtonClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsPopupOpen((prevIsPopupOpen) => !prevIsPopupOpen);
  };

  const handleInsideButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    // Handle any action when the inside button is clicked
  };

  return (
    <Headers>
      <RowBetween>
        <Link href={"/"}>
          <Image src={assets.images.fa_logo} alt="logo" width={120} />
          
        </Link>

        {
          isGeneratorRoute? 
          <div className="pro-name">
          <div className="label">Projects/</div>
          <input type="text" value={projectName} onChange={(e)=> setProjectName(e.target.value)}/>
        </div>

          :null
        }

      

        <div className="profilbox">
          <div className="profilIcon" onClick={handleButtonClick}>
            <Image src={assets.images.profile} alt="logo" width={33} />
          </div>
          {isPopupOpen && (
            <div className="topSpacre" ref={popupRef}>
              <div className="profilcard">
                <div className="propilname">Siva Shankar</div>
                <div className="itemss">
                  <div className="items">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="15"
                      viewBox="0 0 19 15"
                      fill="none"
                    >
                      <path
                        d="M2.375 0C1.74511 0 1.14102 0.250222 0.695621 0.695621C0.250222 1.14102 0 1.74511 0 2.375V3.5625H19V2.375C19 1.74511 18.7498 1.14102 18.3044 0.695621C17.859 0.250222 17.2549 0 16.625 0H2.375Z"
                        fill="#585858"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19 5.9375H0V11.875C0 12.5049 0.250222 13.109 0.695621 13.5544C1.14102 13.9998 1.74511 14.25 2.375 14.25H16.625C17.2549 14.25 17.859 13.9998 18.3044 13.5544C18.7498 13.109 19 12.5049 19 11.875V5.9375ZM2.375 10.6875C2.375 10.3726 2.50011 10.0705 2.72281 9.84781C2.94551 9.62511 3.24756 9.5 3.5625 9.5H4.75C5.06494 9.5 5.36699 9.62511 5.58969 9.84781C5.81239 10.0705 5.9375 10.3726 5.9375 10.6875C5.9375 11.0024 5.81239 11.3045 5.58969 11.5272C5.36699 11.7499 5.06494 11.875 4.75 11.875H3.5625C3.24756 11.875 2.94551 11.7499 2.72281 11.5272C2.50011 11.3045 2.375 11.0024 2.375 10.6875ZM8.3125 9.5C7.99756 9.5 7.69551 9.62511 7.47281 9.84781C7.25011 10.0705 7.125 10.3726 7.125 10.6875C7.125 11.0024 7.25011 11.3045 7.47281 11.5272C7.69551 11.7499 7.99756 11.875 8.3125 11.875H9.5C9.81494 11.875 10.117 11.7499 10.3397 11.5272C10.5624 11.3045 10.6875 11.0024 10.6875 10.6875C10.6875 10.3726 10.5624 10.0705 10.3397 9.84781C10.117 9.62511 9.81494 9.5 9.5 9.5H8.3125Z"
                        fill="#585858"
                      />
                    </svg>

                    <span>Manage Subscription</span>
                  </div>
                  <div className="items">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="16"
                      viewBox="0 0 18 16"
                      fill="none"
                        stroke="#585858"
                        className="svg-s"


                    >
                      <path
                        d="M8.11111 11.5L4.55556 8M4.55556 8L8.11111 4.5M4.55556 8H17M12.5556 11.5V12.375C12.5556 13.0712 12.2746 13.7389 11.7745 14.2312C11.2744 14.7234 10.5961 15 9.88889 15H3.66667C2.95942 15 2.28115 14.7234 1.78105 14.2312C1.28095 13.7389 1 13.0712 1 12.375V3.625C1 2.92881 1.28095 2.26113 1.78105 1.76884C2.28115 1.27656 2.95942 1 3.66667 1H9.88889C10.5961 1 11.2744 1.27656 11.7745 1.76884C12.2746 2.26113 12.5556 2.92881 12.5556 3.625V4.5"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span>Logout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </RowBetween>
    </Headers>
  );
};

const Headers = styled.div`

.pro-name{
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(150, 150, 150, 1);
  font-size: 12px;
  font-weight: 500;


  input{
    color: rgba(0, 0, 0, 1);
    border: none;
    :active{
      border: none;
      outline: none;

    }
    :focus-visible{
      border: none;
      outline: 0 !important;


    }
    &:focus:not(:focus-visible) {
    outline: none;
    /* Add any other custom styles for the focus state */
  }
  }

}
  position: absolute;
  top: 0;
  z-index: 9999;
  background-color: #fff;
  padding: 0 50px;
  width: 100%;
  border: 2px solid ${({ theme }) => theme.bgBorder};
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 0 15px;


`}
  .profilbox {
    position: relative;
    font-size: 14px;

    .topSpacre {
      /* display: none; */
      margin-top: 12px;
      position: absolute;
      right: 0px;
      top: 40px;

     
    }
    .profilIcon{
      width:35px;
      height: 35px;
      border-radius: 50%;
      cursor: pointer;
    }
    .profilcard {
      border-radius: 19px;
      background: #fff;
      box-shadow: 0px 0px 30px 2px rgba(0, 0, 0, 0.04);
      border: 1px solid #858585;
      width: 280px;

      .propilname {
        padding: 12px 27px;
        border-bottom: 1px solid rgba(57, 57, 57, 1);
        font-weight: 500;
      }
      .itemss {
        padding: 20px 27px;
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .items {
        display: flex;
        gap: 0.5rem;
        justify-content: start;
        align-items: center;
        color: rgba(88, 88, 88, 1);
        cursor: pointer;
        transition: all 2s ;
        

        :hover{
          color: rgba(249, 208, 13, 1);
        transition: all 0.3s ;

        }
      }
    }
  }
`;

export default Header;
