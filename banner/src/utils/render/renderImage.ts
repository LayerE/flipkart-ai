import type { ImageObject } from '~/config/types';

export default function renderImage({
  context,
  x,
  y,
  width,
  height,
  opacity,
  imageElement,
  rotation
}: {
  context: CanvasRenderingContext2D;
} & Omit<ImageObject, 'type'>): void {
  context.globalAlpha = opacity / 100;

  if (imageElement) {
    context.save()
    context.translate(x + width / 2, y + height / 2);
    context.rotate(rotation);
    context.translate(-width / 2, -height / 2);
    context.drawImage(imageElement, 0, 0, width, height);
    context.restore()
  }

  context.globalAlpha = 1;
}
