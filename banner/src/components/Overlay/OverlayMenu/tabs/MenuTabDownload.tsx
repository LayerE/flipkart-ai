// @ts-nocheck

import styled from '@emotion/styled';
import { Button, Checkbox } from '@mantine/core';
import React,{useState} from 'react';
import { FaDownload, FaSave } from 'react-icons/fa';
import { Loader } from '@mantine/core';

import CanvasPreview from '~/components/CanvasPreview';
import { CANVAS_PREVIEW_UNIQUE_ID } from '~/config/globalElementIds';
import useCanvasBackgroundColor from '~/store/useCanvasBackgroundColor';
import useCanvasWorkingSize from '~/store/useCanvasWorkingSize';
import useDefaultParams from '~/store/useDefaultParams';
import generateUniqueId from '~/utils/generateUniqueId';
import { toast } from 'react-toastify';

import { H4 } from '../commonTabComponents';
import { useUserId } from '~/context/userContext';

const DownloadButtonsGridDiv = styled('div')`
  display: inline-grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  grid-gap: 0.5rem;
  margin-bottom: 1rem;
`;

export default function MenuTabDownload() {
  const defaultParams = useDefaultParams((state) => state.defaultParams);
  const [isLoading, setIsLoading] = useState(false);

  const canvasWorkingSize = useCanvasWorkingSize((state) => state.canvasWorkingSize);

  const canvasBackgroundColor = useCanvasBackgroundColor((state) => state.canvasBackgroundColor);
  const setCanvasBackgroundColor = useCanvasBackgroundColor((state) => state.setCanvasBackgroundColor);

  const downloadCanvas = (type: 'png' | 'jpg' | 'webp' | 'avif') => {
    const canvas = document.getElementById(CANVAS_PREVIEW_UNIQUE_ID) as HTMLCanvasElement;
    const image = canvas.toDataURL();
    const a = document.createElement('a');
    a.download = `${generateUniqueId()}.${type}`;
    a.href = image;
    a.click();
    a.remove();
  };

  
  const userId = useUserId().userId;
  const saveCanvas = async (userid:string) => {
    setIsLoading(true)
    const canvas = document.getElementById(CANVAS_PREVIEW_UNIQUE_ID) as HTMLCanvasElement;
    const image = canvas.toDataURL();

    var raw = JSON.stringify({
      "user_id": userid,
      "image_url": image
    });
  

    var requestOptions = {
      method: 'POST',
      body: raw
    };
  
   
    try{
      const response = await fetch("/api/savecanvas", requestOptions)
      setIsLoading(false)
      if(response.status === 201){
        toast.success('Banner has been saved Successfully!', { hideProgressBar: true, autoClose: 2000, type: 'success' ,position:'bottom-right' })
      }else{
        toast.error('Something went wrong', { hideProgressBar: true, autoClose: 2000, type: 'error' ,position:'bottom-right' })
      }
    }catch(e){
      toast.error('something went wrong', { hideProgressBar: true, autoClose: 2000, type: 'error' ,position:'bottom-right' })
    }
  }

  return (
    <>
      {' '}
      <H4>Download/Save</H4>
      <DownloadButtonsGridDiv>
        <Button
          size="xs"
          variant="default"
          onClick={() => {
            downloadCanvas('png');
          }}
          leftIcon={<FaDownload />}
        >
          PNG
        </Button>
        <Button
          size="xs"
          variant="default"
          onClick={() => {
            downloadCanvas('avif');
          }}
          leftIcon={<FaDownload />}
        >
          AVIF
        </Button>
        <Button
          size="xs"
          variant="default"
          onClick={() => {
            downloadCanvas('webp');
          }}
          leftIcon={<FaDownload />}
        >
          WEBP
        </Button>
        <Button
          size="xs"
          variant="default"
          onClick={() => {
            downloadCanvas('jpg');
          }}
          leftIcon={<FaDownload />}
        >
          JPG
        </Button>
        <Button
          size="xs"
          variant="default"
          onClick={() => {
            saveCanvas(userId as string);
          }}
          leftIcon={isLoading ? <Loader size={15}/> : <FaSave />}
        >
          SAVE
        </Button>
      </DownloadButtonsGridDiv>
      <H4>
        Preview<span>{`${canvasWorkingSize.width} x ${canvasWorkingSize.height} px`}</span>
      </H4>
      <CanvasPreview />
      <Checkbox
        sx={{ marginTop: '1rem' }}
        size="sm"
        label="Transparent Background"
        checked={canvasBackgroundColor === 'transparent'}
        onChange={(event) => {
          if (event.target.checked) {
            setCanvasBackgroundColor('transparent');
          } else {
            setCanvasBackgroundColor(defaultParams.canvasBackgroundColor);
          }
        }}
      />
    </>
  );
}
