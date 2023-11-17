import styled from '@emotion/styled';
import { Button, NumberInput } from '@mantine/core';
import React, { useRef } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import useActiveObjectId from '~/store/useActiveObjectId';
import useCanvasObjects from '~/store/useCanvasObjects';
import theme from '~/theme';
import ControlHeader from './Overlay/OverlaySidebar/components/ControlHeader';
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
// import ReactCrop, { type Crop } from 'react-image-crop'
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import useCanvasContext from '~/context/useCanvasContext';
import { ImageObject } from '~/config/types';
import { useImage } from '~/context/useImage';
import useDefaultParams from '~/store/useDefaultParams';
import useUserMode from '~/store/useUserMode';
import orderBy from 'lodash/orderBy';
import { OptionItem } from './Overlay/OverlaySidebar/controls/ImageControl/AssetImageButton';
import generateUniqueId from '~/utils/generateUniqueId';
import getImageElementFromUrl from '~/utils/getImageElementFromUrl';
import getDimensionsFromImage from '~/utils/getDimensionsFromImage';
import { useCropPopup } from '~/context/useCropPopupContext';



const FrameGridDiv = styled('div')`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-gap: ${theme.variables.sidebarGutter};
`;



const CropperBox = () => {
  //const { addimgToCanvasCropped, crop, setCrop, downloadImg ,addimgToCanvasGen} = useAppState();

  // const [cropSize, setCropSize] = useState({ x: 0, y: 0 })

  
  const [crop, setCrop] = useState(false);

  //const [cropSize,setCropSize] = useState({ x: 0, y: 0, width: 100, height: 100 }); 
  const [cropSize, setCropSize] = useState<Crop>({
    x: 0, // Set the initial X coordinate
    y: 0, // Set the initial Y coordinate
    width: 100, // Set the initial width
    height: 100, // Set the initial height
    unit: 'px', // Specify the unit as 'px' or '%' based on your needs
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(1);
  const activeObjectId = useActiveObjectId((state) => state.activeObjectId);

  const canvasObjects = useCanvasObjects((state) => state.canvasObjects);

  const updateCanvasObject = useCanvasObjects((state) => state.updateCanvasObject);
  const deleteCanvasObject = useCanvasObjects((state) => state.deleteCanvasObject);
  const appendImageObject = useCanvasObjects((state) => state.appendImageObject);
  const activeObject = canvasObjects.find((object) => object.id === activeObjectId);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const { contextRef } = useCanvasContext();
  const [fetchedImages, setFetchedImages] = useState<ImageObject[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { contextImages, setContextImages } = useImage();


  const setActiveObjectId = useActiveObjectId((state) => state.setActiveObjectId);

  const setUserMode = useUserMode((state) => state.setUserMode);




  const pushImageObject = async ({ imageUrl, imageElement, dimensions }: OptionItem) => {
    setImageUrl(imageUrl);
    const createdObjectId = generateUniqueId();
    appendImageObject({
      id: createdObjectId,
      x: 0,
      y: 0,
      width: dimensions.width,
      height: dimensions.height,
      opacity: 100,
      imageUrl,
      imageElement,
      rotation:0
    });
    setActiveObjectId(createdObjectId);
    setUserMode('select');
  };


  const commonPushImageObject = async (url: string) => {
    const imageElement = await getImageElementFromUrl(url);
    const dimensions = await getDimensionsFromImage({
      context: contextRef?.current,
      imageObject: { x: 0, y: 0, imageElement },
    });
    pushImageObject({ imageUrl: url, imageElement, dimensions });
  };



  const { openCropPopup,closeCropPopup } = useCropPopup();

  

  let downloadImg: HTMLImageElement | undefined;

  if (activeObject?.imageElement instanceof HTMLImageElement) {
    downloadImg = activeObject?.imageElement;
  }
  const HandleCrop =async ()=>{


    if (cropSize.width && cropSize.height) {
      

        const canvas = document.createElement('canvas');
        const image = document.getElementById('img') as HTMLImageElement | null;
        if (image) {
           
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            canvas.width = cropSize.width;
            canvas.height = cropSize.height;
        
            const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    
            if (ctx) {
                ctx.drawImage(
                    image,
                    cropSize.x * scaleX,
                    cropSize.y * scaleY,
                    cropSize.width * scaleX,
                    cropSize.height * scaleY,
                    0,
                    0,
                    cropSize.width,
                    cropSize.height
                  );
              }
    
          
        
              const blob: Blob | null = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob((blob) => {
                  resolve(blob);
                }, 'image/png');
              });
              
              if (blob) {
                const url = URL.createObjectURL(blob);

                commonPushImageObject(url)
                if(activeObject)
                {
                  deleteCanvasObject(activeObject.id);
                }
                
                closeCropPopup();
                setCrop(false)
                // Rest of your code
              }
    
             
            setCrop(false)
          
          } 
    
       
    }



  }


  
  return (
    <Wrapper>
      <h2>Crop Tool</h2>
      <div className="cropperbox">
        <ReactCrop
          crop={cropSize}
          onChange={(c) => setCropSize(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
          minWidth={50}
          minHeight={50}
        >
          <img crossOrigin="anonymous"
            className="cropped-image"
            src={downloadImg?.src}
            id="img"
            alt="Cropped Image"
          />
        </ReactCrop>

        <div className="flex">
          <Button   variant="default"
            size="xs" onClick={() => HandleCrop()}>Done</Button>
          <Button   variant="default"
            size="xs" onClick={() => { setCrop(false); closeCropPopup(); }}>Close</Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default CropperBox;
const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100vh;
  transform: translate(-50%, -50%);
  z-index: 9999;
  background: #FCEDDA;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center; /* Center vertically */
  text-align: center;
  overflow: auto; /* Add overflow to enable scrolling if content exceeds viewport */

  h2 {
    font-size: 24px;
    margin-bottom: 16px; /* Add some spacing below the title */
    color: #333; /* Set the text color */
   
    font-weight: bold; /* Make the title bold */
  }

  .cropped-image {
    max-width: 100%; /* Ensure the image fits within the container */
    max-height: 100%; /* Ensure the image fits within the container */
    width: 700px;
    height: 700px;
    display: block;
    margin: 0 auto; /* Center the image horizontally */
    object-fit: contain;
  }

  .flex {
    display: flex;
    justify-content: flex-end; /* Adjust this to control the alignment of buttons */
    margin-top: 20px;
  }
  
  /* Add margin-right to the first button */
  .flex button:first-child {
    margin-right: 10px; /* Adjust this value to control the spacing between buttons */
  }

  .ReactCrop {
    width: auto;
    height: auto;
    max-width: 100%; /* Let the ReactCrop occupy the entire width of the wrapper */
    max-height: 100%; /* Let the ReactCrop occupy the entire height of the wrapper */
    position: relative;
  }

  .reactEasyCrop_Container {
    width: 100%;
    max-width: 100%; /* Let the container occupy the entire width of the wrapper */
    background-color: #ffffff;
  }
`;
