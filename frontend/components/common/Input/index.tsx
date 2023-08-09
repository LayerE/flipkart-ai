import { useAppState } from "@/context/app.context";
import { BgRemover } from "@/store/api";
import React, { useState, useEffect,useRef } from "react";
import { styled } from "styled-components";
import { uid } from 'uid';
export const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${(props) => props.theme.stroke};
  outline: none;
  border-radius: 0.45rem;
  background-color: transparent;
  width:100%;
  font-size: 12px;

  &:disabled {
    color: #fff7f7 !important;
    &::placeholder {
      color: #fff7f7 !important;
    }
  }
`;
export const TestArea = styled.textarea`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${(props) => props.theme.stroke};
  outline: none;
  color: #000;
  border-radius: 0.5rem;
  height: 100px;
  background-color: transparent;
  width:100%;
  font-size: 12px;


  &:disabled {
    color: #fff7f7 !important;
    &::placeholder {
      color: #fff7f7 !important;
    }
  }
`;

export const Input2 = ({
  placeholders,
  interval,
}: {
  placeholders: string[];
  interval: number;
}) => {
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPlaceholderIndex((prevIndex) =>
        prevIndex === placeholders.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [placeholders, interval]);

  return <Input placeholder={placeholders[currentPlaceholderIndex]} />;
};

const InputFile = styled.div`
  border-radius: 6px;
  /* border: 1px solid #888; */
  /* background: #eee; */
  width: 100%;
  /* height: 250px; */
  /* text-align: center; */
  /* display: flex;
  justify-content: center;
  align-items:center; */
  font-size: 10px;
  color: #888;
  /* padding: 90px 10px; */

  label {
    display: flex;
justify-content    :center ;
align-items: center;
    gap: 12px;
    height: 250px;
    width: 100%;
  }
  .selected{
    display: flex;
    justify-content: space-between;
    align-items: center;
    button{
        border: none;
        font-size: 12px;
    }
  }
`;

export const FileUpload: React.FC = () => {
  const { file, setFile,  selectedImage, setSelectedImage,setImageArray, imageArray ,setModifidImageArray} = useAppState();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    const blobUrl = URL.createObjectURL(selectedFile);
    const idG = imageArray.length;
    setSelectedImage({url:blobUrl,id : idG,  tools: {bgRemove:false, removeText:false, replaceBg:false, psn:false, pde:false, superResolution:false}})
    setModifidImageArray([])
    setImageArray((prev) => [...prev, blobUrl]);

    // BgRemover(selectedFile, "nsdfsd.png")
  };

  const handleRemoveFile = () => {
    setFile(null);
  };
  function slideName(name: string) {
    const maxLength = 8; // 4 characters from the beginning and 4 characters from the end
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
  

  return (
    <InputFile>
      {file ? (
        <div className="selected">
          <p> {slideName(file.name)}</p>
          <button onClick={handleRemoveFile}>Replace</button>
        </div>
      ) : (
        <div>
          <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="Vector"
                d="M4.33791 10.3325C3.50597 10.3331 2.70384 10.0228 2.08892 9.4627C1.474 8.90257 1.09067 8.13295 1.01415 7.30486C0.937623 6.47677 1.17343 5.64998 1.67529 4.98672C2.17715 4.32346 2.90885 3.8716 3.72681 3.7198C3.87049 2.95535 4.2769 2.26511 4.87577 1.76847C5.47464 1.27183 6.22831 1 7.00644 1C7.78458 1 8.53825 1.27183 9.13712 1.76847C9.73599 2.26511 10.1424 2.95535 10.2861 3.7198C11.1013 3.87469 11.8296 4.32764 12.3287 4.99027C12.8279 5.65291 13.0622 6.47769 12.9858 7.30367C12.9095 8.12965 12.5281 8.89757 11.9159 9.45759C11.3037 10.0176 10.5048 10.3295 9.67498 10.3325M5.00504 6.99815L7.00644 4.99753M7.00644 4.99753L9.00784 6.99815M7.00644 4.99753V13"
                stroke="#888888"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Upload Product Photo /Generate Image
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      )}
    </InputFile>
  );
};


