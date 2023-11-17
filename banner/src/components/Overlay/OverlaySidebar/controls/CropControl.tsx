import styled from '@emotion/styled';
import { Button } from '@mantine/core';
import React from 'react';
import { MdFlipToFront, MdFlipToBack } from 'react-icons/md';

import useActiveObjectId from '~/store/useActiveObjectId';
import useCanvasObjects from '~/store/useCanvasObjects';

import ControlHeader from '../components/ControlHeader';
import { useCropPopup } from '~/context/useCropPopupContext';
import useUserMode from '~/store/useUserMode';

const ActionsUl = styled('ul')`
  list-style: none;
  padding: 0;
  display: inline-grid;
  grid-template-columns: repeat(2, minmax(0, auto));
  grid-gap: 6px;
`;

export default function CropControl() {
  

    const { openCropPopup } = useCropPopup();
    const setUserMode = useUserMode((state) => state.setUserMode);

    const handleViewAllClick = () => {
      setUserMode('select');
      openCropPopup();
    };
  return (
    <>
      <ControlHeader title="Crop" />
      <ActionsUl>
        <li>
          <Button
            title="Crop"
            variant="default"
            size="xs"
            onClick={() => {
             handleViewAllClick();
            }}
          >
            Crop
          </Button>
        </li>
        
      </ActionsUl>
    </>
  );
}
