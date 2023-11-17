import { last } from 'lodash';
import type { FreeDrawObject } from '~/config/types';
import getPositionFromDrawingPoints from '~/utils/getPositionFromDrawingPoints';
import hexToRgba from '~/utils/hexToRgba';

export default function renderFreeDrawing({
  context,
  x,
  y,
  strokeColorHex,
  strokeWidth,
  opacity,
  freeDrawPoints,
  rotation
}: {
  context: CanvasRenderingContext2D;
} & Omit<FreeDrawObject, 'type'>): void {
  context.strokeStyle = hexToRgba({ hex: strokeColorHex, opacity });

  context.lineCap = 'round';
  context.lineWidth = strokeWidth || 1;
  const positionFromDrawingPoints = getPositionFromDrawingPoints({
    freeDrawPoints,
  });

  const lastPoint = freeDrawPoints[freeDrawPoints.length - 1];
  const centerX = x - positionFromDrawingPoints.x + ((freeDrawPoints[0].x+lastPoint.x)/2);
  const centerY = y - positionFromDrawingPoints.y + ((freeDrawPoints[0].y+lastPoint.y)/2);
  context.save();
  context.translate(centerX, centerY);
  context.rotate(rotation);
  context.translate(-centerX, -centerY);
  context.beginPath();

  freeDrawPoints.forEach((point, index) => {
    const realX = x - positionFromDrawingPoints.x + point.x;
    const realY = y - positionFromDrawingPoints.y + point.y;
    if (index === 0) {
      context.moveTo(realX, realY);
    } else {
      context.lineTo(realX, realY);
    }
  });
  context.stroke();
  context.closePath();
  context.restore()
}
