import canvasTxt from 'canvas-txt';

import type { TextObject } from '~/config/types';
import hexToRgba from '~/utils/hexToRgba';

export default function renderText({
  context,
  x,
  y,
  width,
  height,
  opacity,
  text,
  textJustify,
  textAlignHorizontal,
  textAlignVertical,
  fontColorHex,
  fontSize,
  fontFamily,
  fontStyle,
  fontVariant,
  fontWeight,
  fontLineHeightRatio,
  rotation
}: {
  context: CanvasRenderingContext2D;
} & Omit<TextObject, 'type'>): void {

  context.save()
  context.translate(x + width / 2, y + height / 2);
  context.rotate(rotation);
  context.translate(-width / 2, -height / 2);
  context.beginPath();
  context.fillStyle = hexToRgba({ hex: fontColorHex, opacity });

  canvasTxt.debug = false;

  canvasTxt.justify = textJustify;
  canvasTxt.align = textAlignHorizontal;
  canvasTxt.vAlign = textAlignVertical;
  canvasTxt.fontSize = fontSize;
  canvasTxt.font = fontFamily;
  canvasTxt.fontStyle = fontStyle;
  canvasTxt.fontVariant = fontVariant;
  canvasTxt.fontWeight = fontWeight;
  canvasTxt.lineHeight = fontLineHeightRatio * fontSize;

  canvasTxt.drawText(context, text, 0, 0, width, height);

  context.closePath();
  context.restore()
}
