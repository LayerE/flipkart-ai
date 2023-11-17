
  
  function isPointInPolygon(polygon: Array<{ x: number, y: number }>, point: { x: number, y: number }): boolean {
    let isInside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
  
      const intersect = ((yi > point.y) !== (yj > point.y)) 
          && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      if (intersect) isInside = !isInside;
    }
    return isInside;
  }
  
  export default function isCursorWithinRotatedBox({
    x,
    y,
    width,
    height,
    relativeMouseX,
    relativeMouseY,
    rotationAngle,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    relativeMouseX: number;
    relativeMouseY: number;
    rotationAngle:number;
  }): boolean {
   
    const topLeft = { x: x - width / 2, y: y - height / 2 };
    const topRight = { x: x + width / 2, y: y - height / 2 };
    const bottomRight = { x: x + width / 2, y: y + height / 2 };
    const bottomLeft = { x: x - width / 2, y: y + height / 2 };
  
    const polygon = [topLeft, topRight, bottomRight, bottomLeft];
  
    return isPointInPolygon(polygon, { x: relativeMouseX, y: relativeMouseY });
  }
  