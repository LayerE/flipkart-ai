// @ts-nocheck

import styled from '@emotion/styled';
import React from 'react';

import type { ObjectDimensions, AssetImage } from '~/config/types';
import useCanvasContext from '~/context/useCanvasContext';
import getDimensionsFromImage from '~/utils/getDimensionsFromImage';
import getImageElementFromUrl from '~/utils/getImageElementFromUrl';
import notification from '~/utils/notification';

const ImageButton = styled('button')`
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

const Img = styled('img')`
  width: 100%;
  max-width: 100%;
  object-fit: cover;
  height: 120px;
  &:hover {
    opacity: 0.8;
  }
`;

export interface OptionItem {
  imageUrl: string;
  imageElement: HTMLImageElement;
  dimensions: ObjectDimensions;
}

interface Props {
  image: AssetImage;
  pushImageObject: (optionItem: OptionItem) => void;
}

export default function AssetImageButton({ image, pushImageObject }: Props) {
  const { contextRef } = useCanvasContext();

  return (
        <ImageButton
          key={image.id}
          onClick={async () => {
            try {
              const imageElement = await getImageElementFromUrl(image.unsplashUrl);
              const dimensions = await getDimensionsFromImage({
                context: contextRef?.current,
                imageObject: { x: 0, y: 0, imageElement },
              });
              pushImageObject({ imageUrl: image.unsplashUrl, imageElement, dimensions })
            } catch (error) {
              console.error(error);
              notification.error({
                message: (error as Error)?.message,
              });
            }
          }}
        >
          <Img src={image.unsplashUrl} />
        </ImageButton>
  );
}