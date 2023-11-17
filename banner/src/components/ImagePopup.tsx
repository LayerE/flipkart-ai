
import React, { useEffect, useRef, useState,useContext } from 'react';
import {useImage}  from '~/context/useImage'
import styled from '@emotion/styled';
import { Input, Button, Loader, Tooltip, Group, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { orderBy } from 'lodash';
import { BsImage, BsX } from 'react-icons/bs';
import { FaPlus, FaSearch, FaUnsplash, FaUpload } from 'react-icons/fa';
import { CANVAS_PREVIEW_UNIQUE_ID } from '~/config/globalElementIds';
import { UnderlineLink } from '~/components/Link';
import ControlHeader from '~/components/Overlay/OverlaySidebar/components/ControlHeader';
import useCanvasContext from '~/context/useCanvasContext';
import useActiveObjectId from '~/store/useActiveObjectId';
import useCanvasObjects from '~/store/useCanvasObjects';
import useDefaultParams from '~/store/useDefaultParams';
import useUnsplashImages from '~/store/useUnsplashImages';
import useUserMode from '~/store/useUserMode';
import fetchImages from '~/utils/api/fetchImages';
import fileToBase64 from '~/utils/fileToBase64';
import generateUniqueId from '~/utils/generateUniqueId';
import getDimensionsFromImage from '~/utils/getDimensionsFromImage';
import getImageElementFromUrl from '~/utils/getImageElementFromUrl';
import notification from '~/utils/notification';
import { usePopup } from '~/context/usePopupContext';
import { useUserId } from '~/context/userContext';
import { toast } from 'react-toastify';

const GridDiv = styled('div')`
  width: 100%;
  pointer-events: auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 10px;
  border: 0.0625rem solid var(--color-borderPrimary);
  border-radius: 0.25rem;
`;

const ImageUrlForm = styled('form')`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, auto);
  grid-gap: 5px;
`;

const SearchForm = styled('form')`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, auto);
  grid-gap: 5px;
`;

const PoweredByP = styled('p')`
  margin: 0;
  font-size: 0.7rem;
  margin-top: 0.5rem;

  & > svg {
    transform: translateY(1px);
    margin-right: 0.15rem;
  }
`;

const LoadingDiv = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
`;

interface Props {
  pageSize?: number;
}

interface ImageObject {
  id: number;
  modified_image_url: string;
}
interface Image {
  id: number;
  modified_image_url: string;
}


interface ImageObject {
    id: number;
    modified_image_url: string;
  }
  interface Image {
    id: number;
    modified_image_url: string;
  }
  
  interface ImagePopupProps {
    images: ImageObject[]; // Use the correct type here
    onClose: () => void;
    commonPushImageObject: (imageUrl: string) => void;
  }

  
 export default function ImagePopup() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>('');
    const { contextRef } = useCanvasContext();
    const [fetchedImages, setFetchedImages] = useState<ImageObject[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
  
    const defaultParams = useDefaultParams((state) => state.defaultParams);
    const setDefaultParams = useDefaultParams((state) => state.setDefaultParams);
  
    const imageUrlInputRef = useRef<HTMLInputElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
  
    const setActiveObjectId = useActiveObjectId((state) => state.setActiveObjectId);
  
    const setUserMode = useUserMode((state) => state.setUserMode);
  
    const unsplashImagesMap = useUnsplashImages((state) => state.unsplashImagesMap);
    const setUnsplashImages = useUnsplashImages((state) => state.setUnsplashImages);
  
    const appendImageObject = useCanvasObjects((state) => state.appendImageObject);
  
  
    const hasAlreadyFetched = Object.values(unsplashImagesMap).some((image) => image.query === defaultParams.searchQueryImages);

    interface ObjectDimensions {
        x: number;
        y: number;
        width: number;
        height: number;
      }
    interface OptionItem {
        imageUrl: string;
        imageElement: HTMLImageElement;
        dimensions: ObjectDimensions;
      }
  
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
  



    const { openPopup,closePopup } = usePopup();

    
    const { contextImages, setContextImages } = useImage();
    // console.log(contextImages)
    return (
        <div
          className="popup"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>
            Generated Image Gallery
          </h2>
          <button
            className="close-button"
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: 'gray',
            }}
            onClick={() => closePopup()}
          >
            &times;
          </button>
          <div
            style={{
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                padding: '0',
                margin: '0',
              }}
            >
              {contextImages.map((image) => (
                <li
                  key={image.id}
                  style={{
                    flex: '1 0 calc(25% - 16px)',
                    marginBottom: '16px',
                  }}
                >
                  <img
                    src={image.modified_image_url}
                    alt="Fetched Image"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                    onClick={() => {
                      commonPushImageObject(image.modified_image_url);
                      closePopup();
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
      
      
  }