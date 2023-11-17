import { WiDayCloudy } from 'react-icons/wi';
import { create } from 'zustand';

import type {
  CanvasObject,
  RectangleObject,
  EllipseObject,
  FreeDrawObject,
  TextObject,
  IconObject,
  ImageObject,
  ActionModeOption,
  CanvasWorkingSize,
} from '~/config/types';
import generateUniqueId from '~/utils/generateUniqueId';
import getPositionFromDrawingPoints from '~/utils/getPositionFromDrawingPoints';

function curateObjectModifications(newObject: CanvasObject, existing: CanvasObject) {
  const hasNegativeSize = newObject.width < 1 || newObject.height < 1;
  if (hasNegativeSize) {
    return existing;
  }
  const isTextWithLessThanThreshold = newObject.type === 'text' && newObject.width < newObject.fontSize;
  return isTextWithLessThanThreshold ? existing : newObject;
}

const DEFAULT_CANVAS_OBJECT: Omit<CanvasObject, 'id' | 'type'> = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  backgroundColorHex: '#000000',
  strokeColorHex: '#000000',
  strokeWidth: 1,
  opacity: 100,
  borderRadius: 0,
  freeDrawPoints: [],
  text: '',
  textJustify: false,
  textAlignHorizontal: 'center',
  textAlignVertical: 'middle',
  fontColorHex: '#000000',
  fontSize: 48,
  fontFamily: 'sans-serif',
  fontStyle: 'normal',
  fontVariant: 'normal',
  fontWeight: 'normal',
  fontLineHeightRatio: 1,
  svgPath: '',
  imageUrl: '',
  imageElement: null,
  rotation:0,
};

const useCanvasObjects = create<{
  canvasObjects: CanvasObject[];
  appendRectangleObject: (rectangle: Omit<RectangleObject, 'type'>) => void;
  appendEllipseObject: (ellipse: Omit<EllipseObject, 'type'>) => void;
  appendFreeDrawObject: (freeDraw: Omit<FreeDrawObject, 'type'>) => void;
  appendTextObject: (text: Omit<TextObject, 'type'>) => void;
  appendIconObject: (icon: Omit<IconObject, 'type'>) => void;
  appendImageObject: (icon: Omit<ImageObject, 'type'>) => void;
  updateCanvasObject: (id: string, object: Partial<CanvasObject>) => void;
  appendFreeDrawPointToCanvasObject: (id: string, point: { x: number; y: number }) => void;
  deleteCanvasObject: (id: string) => void;
  moveCanvasObject: (params: {
    id: string;
    deltaPosition: { deltaX: number; deltaY: number };
    canvasWorkingSize: CanvasWorkingSize;
  }) => void;
  resizeCanvasObject: (params: {
    id: string;
    actionModeOption: ActionModeOption;
    delta: { deltaX: number; deltaY: number };
    canvasWorkingSize: CanvasWorkingSize;
  }) => void;
  setCanvasObjectLayerIndex: (id: string, layerIndex: number) => void;
  resetCanvasObjects: () => void;
}>((set) => ({
  canvasObjects: [],
  
  appendRectangleObject: (rectangle) =>
    set((state) => ({
      canvasObjects: [
        ...state.canvasObjects,
        {
          ...DEFAULT_CANVAS_OBJECT,
          type: 'rectangle',
          id: generateUniqueId(),
          ...rectangle,
        },
      ],
    })),
  appendEllipseObject: (ellipse) =>
    set((state) => ({
      canvasObjects: [
        ...state.canvasObjects,
        {
          ...DEFAULT_CANVAS_OBJECT,
          type: 'ellipse',
          id: generateUniqueId(),
          ...ellipse,
        },
      ],
    })),
  appendFreeDrawObject: (freeDraw) =>
    set((state) => ({
      canvasObjects: [
        ...state.canvasObjects,
        {
          ...DEFAULT_CANVAS_OBJECT,
          type: 'free-draw',
          id: generateUniqueId(),
          ...freeDraw,
        },
      ],
    })),
  appendTextObject: (text) =>
    set((state) => ({
      canvasObjects: [
        ...state.canvasObjects,
        {
          ...DEFAULT_CANVAS_OBJECT,
          type: 'text',
          id: generateUniqueId(),
          ...text,
        },
      ],
    })),
  appendIconObject: (icon) =>
    set((state) => ({
      canvasObjects: [
        ...state.canvasObjects,
        {
          ...DEFAULT_CANVAS_OBJECT,
          type: 'icon',
          id: generateUniqueId(),
          ...icon,
        },
      ],
    })),
  appendImageObject: (icon) =>
    set((state) => ({
      canvasObjects: [
        ...state.canvasObjects,
        {
          ...DEFAULT_CANVAS_OBJECT,
          type: 'image',
          id: generateUniqueId(),
          ...icon,
        },
      ],
    })),
  updateCanvasObject: (id, partialObject) =>
    set((state) => ({
      canvasObjects: state.canvasObjects.map((existing) =>
        existing.id === id ? curateObjectModifications({ ...existing, ...partialObject }, existing) : existing
      ),
    })),
  appendFreeDrawPointToCanvasObject(id, point) {
    set((state) => {
      const { x, y } = getPositionFromDrawingPoints({
        freeDrawPoints: [...(state.canvasObjects.find((o) => o.id === id)?.freeDrawPoints || []), { x: point.x, y: point.y }],
      });

      return {
        canvasObjects: state.canvasObjects.map((existing) =>
          existing.id === id
            ? {
                ...existing,
                x,
                y,
                freeDrawPoints: [...existing.freeDrawPoints, point],
              }
            : existing
        ),
      };
    });
  },
  deleteCanvasObject: (id) => set((state) => ({ canvasObjects: state.canvasObjects.filter((existing) => existing.id !== id) })),
  moveCanvasObject: ({ id, deltaPosition }) =>
    set((state) => ({
      canvasObjects: state.canvasObjects.map((existing) =>
        existing.id === id
          ? {
              ...existing,
              x: existing.x + deltaPosition.deltaX,
              y: existing.y + deltaPosition.deltaY,
            }
          : existing
      ),
    })),
  resizeCanvasObject: ({ id, actionModeOption, delta }) =>
    set((state) => ({
      canvasObjects: state.canvasObjects.map((existing) => {
        if (existing.id !== id) {
          return existing;
        }
        let result: CanvasObject = existing;
       // delta.deltaX= delta.deltaX * Math.cos(existing.rotation) - delta.deltaY * Math.sin(existing.rotation);
        //delta.deltaX = delta.deltaX * Math.sin(existing.rotation) + delta.deltaY * Math.cos(existing.rotation);
       
        switch (actionModeOption) {
         
          case 'topLeft': {

            const del = Math.abs(delta.deltaX) > Math.abs(delta.deltaY) ? delta.deltaX : delta.deltaY
            delta.deltaX = del
            delta.deltaY = (existing.height/existing.width)*del

            result = {
              ...existing,
              x: existing.x + delta.deltaX,
              y: existing.y + delta.deltaY,
              width: existing.width - delta.deltaX,
              height: existing.height - delta.deltaY,
              freeDrawPoints: existing.freeDrawPoints.map((point) => {
                const growthRatioX = delta.deltaX / existing.width;
                const growthRatioY = delta.deltaY / existing.height;
                return {
                  x: point.x - (point.x - existing.x) * growthRatioX,
                  y: point.y - (point.y - existing.y) * growthRatioY,
                };
              }),
            };
            break;
          }
          case 'topCenter': {
            if((existing.rotation>=0.785398/*1.5706*/ && existing.rotation<2.35619/*3.14159*/) || (existing.rotation<=-3.92699/*-4.71238*/ && existing.rotation>-6.28318)||
            (existing.rotation>=3.92699/*4.71238*/ && existing.rotation<6.28318)||(existing.rotation<=-0.785398/*-1.5707*/ && existing.rotation>-2.35619/*-3.14159*/))
            {
              result = {
                ...existing,
                y: existing.y + delta.deltaY,
                width: existing.width - delta.deltaY,

                freeDrawPoints: existing.freeDrawPoints.map((point) => {
                  const growthRatioY = delta.deltaY / existing.height;
                  return {
                    x: point.x,
                    y: point.y - (point.y - existing.y) * growthRatioY,
                  };
                }),
              };

            }
            else{
              result = {
                ...existing,
                y: existing.y + delta.deltaY,
                height: existing.height - delta.deltaY,
                freeDrawPoints: existing.freeDrawPoints.map((point) => {
                  const growthRatioY = delta.deltaY / existing.height;
                  return {
                    x: point.x,
                    y: point.y - (point.y - existing.y) * growthRatioY,
                  };
                }),
              };
            }
           
            break;
          }
          case 'topRight': {
            const del = Math.abs(delta.deltaX) > Math.abs(delta.deltaY) ? delta.deltaX : -delta.deltaY
            delta.deltaX = del
            delta.deltaY = -((existing.height/existing.width)*del)
            result = {
              ...existing,
              width: existing.width + delta.deltaX,
              y: existing.y + delta.deltaY,
              height: existing.height - delta.deltaY,
              freeDrawPoints: existing.freeDrawPoints.map((point) => {
                const growthRatioX = delta.deltaX / existing.width;
                const growthRatioY = delta.deltaY / existing.height;
                return {
                  x: point.x + (point.x - existing.x) * growthRatioX,
                  y: point.y - (point.y - existing.y) * growthRatioY,
                };
              }),
            };
            break;
          }
          case 'middleLeft': {
            if((existing.rotation>=0.785398/*1.5706*/ && existing.rotation<2.35619/*3.14159*/) || (existing.rotation<=-3.92699/*-4.71238*/ && existing.rotation>-6.28318)||
            (existing.rotation>=3.92699/*4.71238*/ && existing.rotation<6.28318)||(existing.rotation<=-0.785398/*-1.5707*/ && existing.rotation>-2.35619/*-3.14159*/))
            {

              result = {
                ...existing,
                x: existing.x + delta.deltaX,
                height: existing.height - delta.deltaX,
                freeDrawPoints: existing.freeDrawPoints.map((point) => {
                  const growthRatioX = delta.deltaX / existing.width;
                  return {
                    x: point.x - (point.x - existing.x) * growthRatioX,
                    y: point.y,
                  };
                }),
              };

            }
            else{
              result = {
                ...existing,
                x: existing.x + delta.deltaX,
                width: existing.width - delta.deltaX,
                freeDrawPoints: existing.freeDrawPoints.map((point) => {
                  const growthRatioX = delta.deltaX / existing.width;
                  return {
                    x: point.x - (point.x - existing.x) * growthRatioX,
                    y: point.y,
                  };
                }),
              };
            }
            
            break;
          }
          case 'middleRight': {

            if((existing.rotation>=0.785398/*1.5706*/ && existing.rotation<2.35619/*3.14159*/) || (existing.rotation<=-3.92699/*-4.71238*/ && existing.rotation>-6.28318)||
            (existing.rotation>=3.92699/*4.71238*/ && existing.rotation<6.28318)||(existing.rotation<=-0.785398/*-1.5707*/ && existing.rotation>-2.35619/*-3.14159*/))
            {
              result = {
                ...existing,
                x: existing.x + delta.deltaX,
                height: existing.height + delta.deltaX,
                freeDrawPoints: existing.freeDrawPoints.map((point) => {
                  const growthRatioX = delta.deltaX / existing.width;
                  return {
                    x: point.x + (point.x - existing.x) * growthRatioX,
                    y: point.y,
                  };
                }),
              };

            }
            else
            {
              result = {
                ...existing,
                width: existing.width + delta.deltaX,
                freeDrawPoints: existing.freeDrawPoints.map((point) => {
                  const growthRatioX = delta.deltaX / existing.width;
                  return {
                    x: point.x + (point.x - existing.x) * growthRatioX,
                    y: point.y,
                  };
                }),
              };
            }
           
            break;
          }
          case 'bottomLeft': {
            const del = Math.abs(delta.deltaX) > Math.abs(delta.deltaY) ? delta.deltaX : -delta.deltaY
            delta.deltaX = del
            delta.deltaY = -((existing.height/existing.width)*del)
            result = {
              ...existing,
              x: existing.x + delta.deltaX,
              width: existing.width - delta.deltaX,
              height: existing.height + delta.deltaY,
              freeDrawPoints: existing.freeDrawPoints.map((point) => {
                const growthRatioX = delta.deltaX / existing.width;
                const growthRatioY = delta.deltaY / existing.height;
                return {
                  x: point.x - (point.x - existing.x) * growthRatioX,
                  y: point.y + (point.y - existing.y) * growthRatioY,
                };
              }),
            };
            break;
          }
          case 'bottomCenter': {
            if((existing.rotation>=0.785398/*1.5706*/ && existing.rotation<2.35619/*3.14159*/) || (existing.rotation<=-3.92699/*-4.71238*/ && existing.rotation>-6.28318)||
            (existing.rotation>=3.92699/*4.71238*/ && existing.rotation<6.28318)||(existing.rotation<=-0.785398/*-1.5707*/ && existing.rotation>-2.35619/*-3.14159*/))
            {

              result = {
                ...existing,
                y: existing.y + delta.deltaY,
                width: existing.width + delta.deltaY,
                freeDrawPoints: existing.freeDrawPoints.map((point) => {
                  const growthRatioY = delta.deltaY / existing.height;
                  return {
                    x: point.x,
                    y: point.y + (point.y - existing.y) * growthRatioY,
                  };
                }),
              };
            }
            else
            {

              result = {
                ...existing,
                height: existing.height + delta.deltaY,
                freeDrawPoints: existing.freeDrawPoints.map((point) => {
                  const growthRatioY = delta.deltaY / existing.height;
                  return {
                    x: point.x,
                    y: point.y + (point.y - existing.y) * growthRatioY,
                  };
                }),
              };
            }
          
            break;
          }
          case 'bottomRight':
           
          default: {
            const del = Math.abs(delta.deltaX) > Math.abs(delta.deltaY) ? delta.deltaX : delta.deltaY
            delta.deltaX = del
            delta.deltaY = (existing.height/existing.width)*del
            result = {
              ...existing,
              width: existing.width + delta.deltaX,
              height: existing.height + delta.deltaY,
              freeDrawPoints: existing.freeDrawPoints.map((point) => {
                const growthRatioX = delta.deltaX / existing.width;
                const growthRatioY = delta.deltaY / existing.height;
                return {
                  x: point.x + (point.x - existing.x) * growthRatioX,
                  y: point.y + (point.y - existing.y) * growthRatioY,
                };
              }),
            };
            break;
          }
        }
        return curateObjectModifications(result, existing);
      }),
    })),
  setCanvasObjectLayerIndex: (id, layerIndex) =>
    set((state) => {
      if (layerIndex < 0 || layerIndex >= state.canvasObjects.length) {
        return state;
      }
      return {
        canvasObjects: state.canvasObjects.map((existing, index) => {
          if (existing.id === id) {
            return state.canvasObjects[layerIndex];
          }
          if (index === layerIndex) {
            return state.canvasObjects.find((o) => o.id === id)!;
          }
          return existing;
        }),
      };
    }),
  resetCanvasObjects: () => set(() => ({ canvasObjects: [] })),
}));

export default useCanvasObjects;
