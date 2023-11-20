// @ts-nocheck

import styled from '@emotion/styled';
import { Input, Button, Loader, Tooltip, Group, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { orderBy } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
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
import {useImage} from '~/context/useImage'
import * as aiIcons from 'react-icons/ai';
import { type OptionItem } from './AssetImageButton';
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


export default function ImageControl({ pageSize = 10 }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [visibleImages, setVisibleImages] = useState<number>(pageSize);
  const { contextRef } = useCanvasContext();
  const [fetchedImages, setFetchedImages] = useState<ImageObject[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { contextImages, setContextImages } = useImage();

  const defaultParams = useDefaultParams((state) => state.defaultParams);
  const setDefaultParams = useDefaultParams((state) => state.setDefaultParams);

  const imageUrlInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const setActiveObjectId = useActiveObjectId((state) => state.setActiveObjectId);

  const setUserMode = useUserMode((state) => state.setUserMode);

  const unsplashImagesMap = useUnsplashImages((state) => state.unsplashImagesMap);
  const setUnsplashImages = useUnsplashImages((state) => state.setUnsplashImages);

  const appendImageObject = useCanvasObjects((state) => state.appendImageObject);

  const imagesToRender = orderBy(Object.values(unsplashImagesMap), ['fetchedAt'], ['desc'])
    //.filter(([slug]) => slug.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, visibleImages);

  const hasAlreadyFetched = Object.values(unsplashImagesMap).some((image) => image.query === defaultParams.searchQueryImages);

  useEffect(() => {
    setVisibleImages(pageSize);
  }, [pageSize, defaultParams.searchQueryImages]);

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
      rotation:0,
    });
    setActiveObjectId(createdObjectId);
    setUserMode('select');
  };

  const hasImages = imagesToRender.length > 0;

  const commonPushImageObject = async (url: string) => {
    const imageElement = await getImageElementFromUrl(url);
    const dimensions = await getDimensionsFromImage({
      context: contextRef?.current,
      imageObject: { x: 0, y: 0, imageElement },
    });
    pushImageObject({ imageUrl: url, imageElement, dimensions });
  };


  const userId = useUserId().userId;
  const generatedImage = async (userid:string) => {

    var requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "user_id": userid })
    };
   
    try{
      const response = await fetch("/api/getimages", requestOptions)
      if(response.status === 200){
        const imagesArray = await response.json();
        imagesArray.reverse()
        return imagesArray
      }else{
        toast.error('Something went wrong', { hideProgressBar: true, autoClose: 2000, type: 'error' ,position:'bottom-right' })
      }
    }catch(e){
      toast.error('something went wrong', { hideProgressBar: true, autoClose: 2000, type: 'error' ,position:'bottom-right' })
    }
  }
  useEffect(() => {
    // Check if userId is not null before making the API call
    if (userId !== null) {
      generatedImage(userId)
        .then((images) => {
          // Update the state with the fetched images
          setFetchedImages(images);
          setContextImages(images);
        })
        .catch((error) => {
          console.error('Error fetching images:', error);
        });
    } else {
      // Handle the case when userId is null (if needed)
    }
  }, []);

  const { openPopup } = usePopup();

  const handleViewAllClick = () => {
    setUserMode('select');
    openPopup();
  };

  return (
    <>
      <Dropzone
        sx={{ marginBottom: '1rem' }}
        accept={IMAGE_MIME_TYPE}
        maxSize={50000000} // 5 mb?
        maxFiles={1}
        multiple={false}
        loading={isLoading}
        onDrop={async (files) => {
          setIsLoading(true);
          try {
            const base64 = await fileToBase64(files[0]);
            if (base64) {
              commonPushImageObject(base64);
            }
          } catch (error) {
            console.error(error);
            notification.error({
              message: (error as Error)?.message,
            });
          }
          setIsLoading(false);
        }}
        onReject={(files) => {
          const message = `Rejected ${files.length} files.`;
          console.error(message, { files });
          notification.error({
            message,
          });
        }}
      >
        <Group position="center" spacing="xs" style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <FaUpload size="3.2rem" style={{ opacity: 0.35 }} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <BsX size="3.2rem" style={{ opacity: 0.35 }} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <BsImage size="3.2rem" style={{ opacity: 0.35 }} />
          </Dropzone.Idle>

          <div>
            <Text size="lg" inline align="center" style={{ opacity: 0.8 }}>
              Drag an image here or click to select a file
            </Text>
          </div>
        </Group>
      </Dropzone>
      <ControlHeader title="Image URL" />
      <ImageUrlForm
        onSubmit={async (event) => {
          event.preventDefault();
          if (imageUrl) {
            setIsLoading(true);
            commonPushImageObject(imageUrl);
            setIsLoading(false);
          } else {
            imageUrlInputRef.current?.focus();
          }
        }}
      >
        <Input
          ref={imageUrlInputRef}
          size="xs"
          placeholder="URL"
          value={imageUrl}
          onChange={(event) => {
            setImageUrl(event.currentTarget.value);
          }}
          sx={{ marginBottom: 10 }}
          disabled={isLoading}
        />
        <Tooltip label="Add">
          <Button type="submit" size="xs" variant="default" disabled={isLoading}>
            <FaPlus />
          </Button>
        </Tooltip>
      </ImageUrlForm>
      {fetchedImages?.length > 0 && (
        <div>
          <ControlHeader title="Recently Generated" />
          <ul>
            {fetchedImages.slice(0, 10).map((image) => (
             <li key={image.id} style={{ marginBottom: '16px',display: 'inline-block', width: 'calc(50% - 8px)', marginRight: '8px',}}>
             <img
               src={image.modified_image_url}
               alt="Fetched Image"
               style={{ width: '100%', maxWidth: '300px', height: 'auto' }}
               onClick={() => commonPushImageObject(image.modified_image_url)} // Adjust the width and max-width as needed
             />
           </li>
            ))}
          </ul>
          {fetchedImages?.length > pageSize && (
         
          <Button
          leftIcon={<aiIcons.AiOutlineDown style={{ transform: 'translateY(1px)' }} />}
          variant="default"
          size="xs"
          onClick={handleViewAllClick}
        >
          View all
        </Button>
       
        )}
        </div>
      )}
     
    </>
  );
}
