// @ts-nocheck

import styled from '@emotion/styled';
import { Button } from '@mantine/core';
import React from 'react';
import { MdFlipToFront, MdFlipToBack, MdRotate90DegreesCcw, MdRotate90DegreesCw } from 'react-icons/md';

import useActiveObjectId from '~/store/useActiveObjectId';
import useCanvasObjects from '~/store/useCanvasObjects';
import getControlPoints from '~/utils/getControlPoints';
import ControlHeader from '../components/ControlHeader';
import useZoom from '~/store/useZoom';

const ActionsUl = styled('ul')`
  list-style: none;
  padding: 0;
  display: inline-grid;
  grid-template-columns: repeat(2, minmax(0, auto));
  grid-gap: 6px;
`;

export default function RotateControl() {
  const activeObjectId = useActiveObjectId((state) => state.activeObjectId);
  const setActiveObjectId=useActiveObjectId((state)=>state.setActiveObjectId)
  const canvasObjects = useCanvasObjects((state) => state.canvasObjects);
  const setCanvasObjectLayerIndex = useCanvasObjects((state) => state.setCanvasObjectLayerIndex);
  const updateCanvasObject = useCanvasObjects((state) => state.updateCanvasObject);
  const zoom = useZoom((state) => state.zoom);

  const activeObject = canvasObjects.find((object) => object.id === activeObjectId);

  if (!activeObject) {
    return null;
  }

  const activeObjectLayerIndex = canvasObjects.findIndex((object) => object.id === activeObject?.id);
  const totalLayers = canvasObjects.length;

  return (
    <>
      <ControlHeader title="Rotate" />
      <ActionsUl>
        <li>
          <Button
            title="CounterClockwise"
            leftIcon={<MdRotate90DegreesCcw />}
            variant="default"
            size="xs"
            onClick={() => {
                const value=(activeObject.rotation-0.174533)%6.28319;
            
                updateCanvasObject(activeObject.id, {
                    rotation: value
                  });
            }}
          >
            CounterClockwise
          </Button>
        </li>
        <li>
          <Button
            title="Clockwise"
            leftIcon={<MdRotate90DegreesCw />}
            variant="default"
            size="xs"
            onClick={() => {
                   
              let value;
              // if(activeObject.rotation>4.71238)
             //  {
             //    value=((activeObject.rotation)%4.71238-1.5708)%6.28319
               //}
              // else{
                 value=(activeObject.rotation+0.174533)%6.28319;
               //}
           
                const {topLeftBox}=getControlPoints({
                  canvasObject: activeObject,
                  zoom,
                })
                updateCanvasObject(activeObject.id, {
                    rotation: value,
                   // x:topLeftBox.x,
                   //y:topLeftBox.y,
                 });
            }}
          >
           Clockwise
          </Button>
        </li>
      </ActionsUl>
    </>
  );
}
