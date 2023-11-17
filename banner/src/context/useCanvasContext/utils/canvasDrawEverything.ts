import { CANVAS_CONTROLS_OVERLAY } from '~/config/globalElementIds';
import type { ActionMode, CanvasObject, CanvasWorkingSize, ScrollPosition } from '~/config/types';
import getControlPoints from '~/utils/getControlPoints';
import renderEllipse from '~/utils/render/renderEllipse';
import renderFreeDrawing from '~/utils/render/renderFreeDrawing';
import renderImage from '~/utils/render/renderImage';
import renderRectangle from '~/utils/render/renderRectangle';
import renderSVGIcon from '~/utils/render/renderSVGIcon';
import renderText from '~/utils/render/renderText';

export default function canvasDrawEverything({
  canvas,
  context,
  canvasWorkingSize,
  canvasBackgroundColor,
  canvasObjects,
  activeObjectId,
  actionMode,
  zoom,
  scrollPosition,
  windowSize,
}: {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
  canvasWorkingSize: CanvasWorkingSize;
  canvasBackgroundColor: string;
  canvasObjects: CanvasObject[];
  activeObjectId: string | null;
  actionMode: ActionMode;
  zoom: number;
  scrollPosition: ScrollPosition;
  windowSize: { width: number; height: number };
}) {
  if (!canvas || !context) return;
  let  activeObject = canvasObjects.find((object) => object.id === activeObjectId);
  
  
  
  // Draw background
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = canvasBackgroundColor;
  context.fillRect(0, 0, canvasWorkingSize.width, canvasWorkingSize.height);
  
 
  // Draw objects
  canvasObjects.forEach((object) => {
    switch (object.type) {
      case 'rectangle': {
     
        renderRectangle({ context, ...object });
       
        break;
      }
      case 'ellipse': {
        renderEllipse({ context, ...object });
        break;
      }
      case 'free-draw': {
        renderFreeDrawing({ context, ...object });
        break;
      }
      case 'text': {
        renderText({ context, ...object });
        break;
      }
      case 'icon': {
        renderSVGIcon({ context, ...object });
        break;
      }
      case 'image': {
        renderImage({ context, ...object });
        break;
      }
      default:
        break;
    }
  });

  
  
   activeObject = canvasObjects.find((object) => object.id === activeObjectId);

  const overlayContext = (document.getElementById(CANVAS_CONTROLS_OVERLAY) as HTMLCanvasElement)?.getContext('2d');

  if (overlayContext) {
    overlayContext.clearRect(0, 0, windowSize.width, windowSize.height);

    if (activeObject && actionMode?.type !== 'isDrawing') {
      const zoomRatio = zoom / 100;

      // We adjust here and then multiply by zoomRatio to make the controls go outside the canvas
      const positionAdjustment = {
        x: scrollPosition.x + (canvasWorkingSize.width - canvasWorkingSize.width * zoomRatio) / 2,
        y: scrollPosition.y + (canvasWorkingSize.height - canvasWorkingSize.height * zoomRatio) / 2,
      };

  

      // Draw controls
     
    
      overlayContext.save();
      var {
        position1,
        topLeft1Box,
    topCenter1Box,
    topRight1Box,
    middleLeft1Box,
    middleRight1Box,
    bottomLeft1Box,
    bottomCenter1Box,
    bottomRight1Box,
        position,
        topLeftBox,
        topCenterBox,
        topRightBox,
        middleLeftBox,
        middleRightBox,
        bottomLeftBox,
        bottomCenterBox,
        bottomRightBox,
      } = getControlPoints({
        canvasObject: activeObject,
        zoom,
      });
  
      // Translate to center of the object
      let centerX = position1.x * zoomRatio + positionAdjustment.x + position1.width * zoomRatio / 2;
      let centerY = position1.y * zoomRatio + positionAdjustment.y + position1.height * zoomRatio / 2;
     overlayContext.translate(centerX, centerY);
      
      // Then do the actual rotation
     overlayContext.rotate(activeObject.rotation);
      
      // Then translate the context back
      overlayContext.translate(-centerX, -centerY);

      overlayContext.lineWidth = 5;
      overlayContext.strokeStyle = '#ff0000'; // red
      overlayContext.strokeRect(
       position1.x * zoomRatio + positionAdjustment.x,
        position1.y * zoomRatio + positionAdjustment.y,
        position1.width * zoomRatio,
        position1.height * zoomRatio
      );
      overlayContext.restore();
      overlayContext.setLineDash([0, 0]);
      overlayContext.fillStyle = '#ff0000';

      

     [
       topLeftBox,
        topCenterBox,
        topRightBox,
        middleLeftBox,
        middleRightBox,
        bottomLeftBox,
        bottomCenterBox,
        bottomRightBox,
        
      ].forEach((box) => {
        box.x = Math.round(box.x);
        box.y = Math.round(box.y);
        overlayContext.fillRect(
          (box.x) * zoomRatio + positionAdjustment.x,
          box.y * zoomRatio + positionAdjustment.y,
          (box.width-10)* zoomRatio,
          (box.height-10) * zoomRatio
        );
      });

      /*overlayContext.fillRect(
        (topLeftBox.x-50) * zoomRatio + positionAdjustment.x,
        (topLeftBox.y-50) * zoomRatio + positionAdjustment.y,
        topLeftBox.width * zoomRatio,
        topLeftBox.height * zoomRatio
      );
      overlayContext.fillRect(
        (topCenterBox.x) * zoomRatio + positionAdjustment.x,
        (topCenterBox.y-50) * zoomRatio + positionAdjustment.y,
        topCenterBox.width * zoomRatio,
        topCenterBox.height * zoomRatio
      ); overlayContext.fillRect(
        (topRightBox.x+50) * zoomRatio + positionAdjustment.x,
       ( topRightBox.y-50) * zoomRatio + positionAdjustment.y,
        topRightBox.width * zoomRatio,
        topRightBox.height * zoomRatio
      ); overlayContext.fillRect(
       ( middleLeftBox.x-50) * zoomRatio + positionAdjustment.x,
        middleLeftBox.y * zoomRatio + positionAdjustment.y,
        middleLeftBox.width * zoomRatio,
        middleLeftBox.height * zoomRatio
      ); overlayContext.fillRect(
        (middleRightBox.x+50) * zoomRatio + positionAdjustment.x,
        middleRightBox.y * zoomRatio + positionAdjustment.y,
        middleRightBox.width * zoomRatio,
        middleRightBox.height * zoomRatio
      ); overlayContext.fillRect(
        (bottomLeftBox.x-50) * zoomRatio + positionAdjustment.x,
       ( bottomLeftBox.y+50) * zoomRatio + positionAdjustment.y,
        bottomLeftBox.width * zoomRatio,
        bottomLeftBox.height * zoomRatio
      ); overlayContext.fillRect(
       ( bottomCenterBox.x) * zoomRatio + positionAdjustment.x,
        (bottomCenterBox.y+50) * zoomRatio + positionAdjustment.y,
        bottomCenterBox.width * zoomRatio,
        bottomCenterBox.height * zoomRatio
      ); overlayContext.fillRect(
       ( bottomRightBox.x+50) * zoomRatio + positionAdjustment.x,
       ( bottomRightBox.y+50 )* zoomRatio + positionAdjustment.y,
        bottomRightBox.width * zoomRatio,
        bottomRightBox.height * zoomRatio
      );*/


    

  
    }
  }
}
