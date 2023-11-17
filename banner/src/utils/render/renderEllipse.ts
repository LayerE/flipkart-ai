import type { EllipseObject } from '~/config/types';
import hexToRgba from '~/utils/hexToRgba';

export default function renderEllipse({
  context,
  x,
  y,
  width,
  height,
  backgroundColorHex,
  strokeColorHex,
  strokeWidth,
  opacity,
  rotation
}: {
  context: CanvasRenderingContext2D;
} & Omit<EllipseObject, 'type'>): void {
  context.save();
  context.fillStyle = hexToRgba({ hex: backgroundColorHex, opacity });
  context.strokeStyle = hexToRgba({ hex: strokeColorHex, opacity: strokeWidth ? opacity : 0 });
  context.lineWidth = strokeWidth;
  context.save()
  context.translate(x + width / 2, y + height / 2);
  context.rotate(rotation);
  context.translate(-width / 2, -height / 2);
  context.beginPath();
  context.ellipse(0 + width / 2, 0 + height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
  context.fill();
  context.stroke();
  context.restore();
}
