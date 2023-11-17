import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { Loader } from '@mantine/core';
import axios from 'axios'

import useActiveObjectId from '~/store/useActiveObjectId';
import useCanvasObjects from '~/store/useCanvasObjects';
import useUserMode from '~/store/useUserMode';
import generateUniqueId from '~/utils/generateUniqueId';
import AssetImageButton, { type OptionItem } from './ImageControl/AssetImageButton';
import ControlHeader from '../components/ControlHeader';
import { useUserId } from '~/context/userContext';

const GridDiv = styled('div')`
  width: 100%;
  pointer-events: auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 10px 0;
  border: 0.0625rem solid var(--color-borderPrimary);
  border-radius: 0.25rem;
  
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

export default function AssetsControl({ pageSize = 60 }: Props) {
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const [assets,setAssets] = useState<any[]>([]);
    const userId = useUserId().userId;
    const setActiveObjectId = useActiveObjectId((state) => state.setActiveObjectId);

    const setUserMode = useUserMode((state) => state.setUserMode);

    const appendImageObject = useCanvasObjects((state) => state.appendImageObject);

    const fetchAssetsForUser = async(userId:string) => {

        let FetchedAssets = []

        try {
            const response = await fetch("/api/getassets", {
                method: 'POST',
                body: JSON.stringify({
                    "user_id": userId,
                })
            })
            FetchedAssets = await response.json();
            console.log(FetchedAssets)
        } catch (error) {
            console.error(error);
        }

        let FinalAssets = [];
         if(!FetchedAssets.error)
            for(let x of FetchedAssets){
                FinalAssets.push({
                    id: x.id,
                    unsplashUrl: x.image_url
                })
        
        }

        return FinalAssets
    }

    useEffect(()=>{
        fetchAssetsForUser(userId as string).then((assets)=>{
            setIsLoading(false)
            setAssets(assets)
        });
    },[])


    const pushImageObject = async ({ imageUrl, imageElement, dimensions }: OptionItem) => {
        const createdObjectId = generateUniqueId();
        appendImageObject({
          id: createdObjectId,
          x: 0,
          y: 0,
          width: 200,
          height: (dimensions.height/dimensions.width)*200,
          opacity: 100,
          imageUrl,
          imageElement,
          rotation:0
        });
        setActiveObjectId(createdObjectId);
        setUserMode('select');
      };

    return (
      <>
        <ControlHeader title="Brand Assets" />
        {isLoading ? (
            <LoadingDiv>
            <Loader />
            </LoadingDiv>
        ):
        (
            <GridDiv>
            {assets.map((image) => (
                <AssetImageButton  key={image.id} image={image} pushImageObject={pushImageObject} />
            ))}
            </GridDiv>
        )}
      </>
    );
  }
