import type { CanvasObject } from '~/config/types';

interface Point {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function getControlPoints({ canvasObject, zoom }: { canvasObject: CanvasObject; zoom: number }): {
  position: Point;
  topLeftBox: Point;
  topCenterBox: Point;
  topRightBox: Point;
  middleLeftBox: Point;
  middleRightBox: Point;
  bottomLeftBox: Point;
  bottomCenterBox: Point;
  bottomRightBox: Point;
  position1: Point;
  topLeft1Box: Point;
  topCenter1Box: Point;
  topRight1Box: Point;
  middleLeft1Box: Point;
  middleRight1Box: Point;
  bottomLeft1Box: Point;
  bottomCenter1Box: Point;
  bottomRight1Box: Point;
} {
  const MAS_SIZE = 20 / (zoom / 100);
  const objectMinSize = Math.min(canvasObject.width, canvasObject.height);
  const SIZE = Math.min(objectMinSize / 4, MAS_SIZE);
  const HALF = SIZE / 2;

 

  const rotatePoint = (point: { x: any; y: any; }, center: { x: any; y: any; }, angle: number) => {
    const dx = point.x - center.x;
    const dy = point.y - center.y;

    return {
      x: dx * Math.cos(angle) - dy * Math.sin(angle) + center.x,
      y: dx * Math.sin(angle) + dy * Math.cos(angle) + center.y,
      width: SIZE,
      height: SIZE,
    };
  }

  let position = {
    x: canvasObject.x,
    y: canvasObject.y,
    width: canvasObject.width,
    height: canvasObject.height,
  };

  const center = {
    x: position.x + position.width / 2,
    y: position.y + position.height / 2
  };
  
  position=rotatePoint({
    x:position.x,
    y:position.y,
  },center,canvasObject.rotation)
  
  position.width=canvasObject.width
  position.height=canvasObject.height

  

 const   topLeftBox ={
      x: position.x - HALF,
      y: position.y - HALF,
      width: SIZE,
      height: SIZE,
    };
const topCenterBox= {
      x: position.x + (position.width / 2)*Math.cos(canvasObject.rotation) - HALF,
      y: position.y - HALF+(position.width / 2)*Math.sin(canvasObject.rotation),
      width: SIZE,
      height: SIZE,
    };
const topRightBox= {
      x: position.x + position.width*Math.cos(canvasObject.rotation) - HALF,
      y: position.y - HALF+ position.width*Math.sin(canvasObject.rotation),
      width: SIZE,
      height: SIZE,
    };
 const   middleLeftBox= {
      x: position.x - HALF-(position.height/2)*Math.sin(canvasObject.rotation),
      y: position.y + (position.height / 2)*Math.cos(canvasObject.rotation) - HALF,
      width: SIZE,
      height: SIZE,
    };
  const  middleRightBox={
      x: position.x + position.width*Math.cos(canvasObject.rotation)- HALF-(position.height/2)*Math.sin(canvasObject.rotation),
      y: position.y + (position.height / 2)*Math.cos(canvasObject.rotation) - HALF+ position.width*Math.sin(canvasObject.rotation),
      width: SIZE,
      height: SIZE,
    };
  const  bottomLeftBox= {
      x: position.x - HALF-(position.height)*Math.sin(canvasObject.rotation),
      y: position.y +(position.height)*Math.cos(canvasObject.rotation) - HALF,
      width: SIZE,
      height: SIZE,
    };
  const  bottomCenterBox= {
      x: position.x + (position.width / 2)*Math.cos(canvasObject.rotation) - HALF-position.height*Math.sin(canvasObject.rotation),
      y: position.y + (position.width / 2)*Math.sin(canvasObject.rotation) - HALF+position.height*Math.cos(canvasObject.rotation),
      width: SIZE,
      height: SIZE,
    };
 const   bottomRightBox= {
  x: position.x + position.width*Math.cos(canvasObject.rotation)- HALF-(position.height)*Math.sin(canvasObject.rotation),
  y: position.y + (position.height)*Math.cos(canvasObject.rotation) - HALF+ position.width*Math.sin(canvasObject.rotation),
      width: SIZE,
      height: SIZE,
    };

 /*const theta=Math.cos(canvasObject.rotation)-Math.sin(canvasObject.rotation);
 const theta1=Math.cos(canvasObject.rotation)+Math.sin(canvasObject.rotation);
 //const theta2=
  const topLeftBox = rotatePoint({
    x: position.x - HALF,
    y: position.y - HALF,
  }, center, canvasObject.rotation);
  
//  topLeftBox.x=topLeftBox.x-(50 * theta);
 //topLeftBox.y= topLeftBox.y-(50*theta1) ;

  const topCenterBox = rotatePoint({
    x: position.x + position.width / 2 - HALF,
    y: position.y - HALF,
  }, center, canvasObject.rotation);
 //topCenterBox.y= topCenterBox.y-(50*theta1);

  const topRightBox = rotatePoint({
    x: position.x + position.width - HALF,
    y: position.y - HALF,
  }, center, canvasObject.rotation);
 //topRightBox.x= topRightBox.x+(50*theta1) ;
 // topRightBox.y= topRightBox.y-(50*theta);

  const middleLeftBox = rotatePoint({
    x: position.x - HALF,
    y: position.y + position.height / 2 - HALF,
  }, center, canvasObject.rotation);
 // middleLeftBox.x= middleLeftBox.x-(50*theta);

  const middleRightBox = rotatePoint({
    x: position.x + position.width - HALF,
    y: position.y + position.height / 2 - HALF,
  }, center, canvasObject.rotation);
// middleRightBox.x= middleRightBox.x+(50*theta);

  const bottomLeftBox = rotatePoint({
    x: position.x - HALF,
    y: position.y + position.height - HALF,
  }, center, canvasObject.rotation);
  //bottomLeftBox.x=(bottomLeftBox.x-(75*theta1));
 // bottomLeftBox.y=( bottomLeftBox.y+(75*theta));

  const bottomCenterBox = rotatePoint({
    x: position.x + position.width / 2 - HALF,
    y: position.y + position.height - HALF,
  }, center, canvasObject.rotation);
 // bottomCenterBox.y= bottomCenterBox.y+(50*theta);
  

  const bottomRightBox = rotatePoint({
    x: position.x + position.width - HALF,
    y: position.y + position.height - HALF,
  }, center, canvasObject.rotation);
 // bottomRightBox.x= bottomRightBox.x+(75*theta);
 // bottomRightBox.y=bottomRightBox.y+(75*theta1);

  
*/








   const position1 = {
    x: canvasObject.x,
    y: canvasObject.y,
    width: canvasObject.width,
    height: canvasObject.height,
  };


 const   topLeft1Box ={
      x: position.x - HALF,
      y: position.y - HALF,
      width: SIZE,
      height: SIZE,
    };
const topCenter1Box= {
      x: position.x + position.width / 2 - HALF,
      y: position.y - HALF,
      width: SIZE,
      height: SIZE,
    };
const topRight1Box= {
      x: position.x + position.width - HALF,
      y: position.y - HALF,
      width: SIZE,
      height: SIZE,
    };
 const   middleLeft1Box= {
      x: position.x - HALF,
      y: position.y + position.height / 2 - HALF,
      width: SIZE,
      height: SIZE,
    };
  const  middleRight1Box={
      x: position.x + position.width - HALF,
      y: position.y + position.height / 2 - HALF,
      width: SIZE,
      height: SIZE,
    };
  const  bottomLeft1Box= {
      x: position.x - HALF,
      y: position.y + position.height - HALF,
      width: SIZE,
      height: SIZE,
    };
  const  bottomCenter1Box= {
      x: position.x + position.width / 2 - HALF,
      y: position.y + position.height - HALF,
      width: SIZE,
      height: SIZE,
    };
 const   bottomRight1Box= {
      x: position.x + position.width - HALF,
      y: position.y + position.height - HALF,
      width: SIZE,
      height: SIZE,
    };



  return {
    position,
    topLeftBox,
    topCenterBox,
    topRightBox,
    middleLeftBox,
    middleRightBox,
    bottomLeftBox,
    bottomCenterBox,
    bottomRightBox,
    position1,
    topLeft1Box,
    topCenter1Box,
    topRight1Box,
    middleLeft1Box,
    middleRight1Box,
    bottomLeft1Box,
    bottomCenter1Box,
    bottomRight1Box,
  };
}




/*let topLeftBox:Point;
  let topCenterBox:Point;
  let topRightBox:Point;
  let middleLeftBox:Point;
  let middleRightBox:Point;
  let bottomLeftBox:Point;
  let bottomCenterBox:Point;
  let bottomRightBox:Point;


if(getGlobalMatrix())
{
   topLeftBox = getWindowToCanvas(
    position.x - HALF,
    position.y - HALF,SIZE,SIZE,getGlobalMatrix()[0]
  );

   topCenterBox = getWindowToCanvas(
    position.x + position.width / 2 - HALF,
   position.y - HALF,SIZE,SIZE,getGlobalMatrix()[1]
  );

   topRightBox = getWindowToCanvas(
    position.x + position.width - HALF,
     position.y - HALF,SIZE,SIZE,getGlobalMatrix()[2]
  );

   middleLeftBox = getWindowToCanvas(
     position.x - HALF,
     position.y + position.height / 2 - HALF,SIZE,SIZE,getGlobalMatrix()[3]);


   middleRightBox = getWindowToCanvas(
     position.x + position.width - HALF,
     position.y + position.height / 2 - HALF,SIZE,SIZE,getGlobalMatrix()[4]
  );


   bottomLeftBox = getWindowToCanvas(
    position.x - HALF,
    position.y + position.height - HALF,SIZE,SIZE,getGlobalMatrix()[5]);

   bottomCenterBox = getWindowToCanvas(
    position.x + position.width / 2 - HALF,
    position.y + position.height - HALF,SIZE,SIZE,getGlobalMatrix()[6]);

   bottomRightBox = getWindowToCanvas(
    position.x + position.width - HALF,
    position.y + position.height - HALF,SIZE,SIZE,getGlobalMatrix()[7]);


}*/




  
 /* const position = {
    x: canvasObject.x,
    y: canvasObject.y,
    width: canvasObject.width,
    height: canvasObject.height,
  };

  return {
    position,
    topLeftBox: {
      x: position.x - HALF,
      y: position.y - HALF,
      width: SIZE,
      height: SIZE,
    },
    topCenterBox: {
      x: position.x + position.width / 2 - HALF,
      y: position.y - HALF,
      width: SIZE,
      height: SIZE,
    },
    topRightBox: {
      x: position.x + position.width - HALF,
      y: position.y - HALF,
      width: SIZE,
      height: SIZE,
    },
    middleLeftBox: {
      x: position.x - HALF,
      y: position.y + position.height / 2 - HALF,
      width: SIZE,
      height: SIZE,
    },
    middleRightBox: {
      x: position.x + position.width - HALF,
      y: position.y + position.height / 2 - HALF,
      width: SIZE,
      height: SIZE,
    },
    bottomLeftBox: {
      x: position.x - HALF,
      y: position.y + position.height - HALF,
      width: SIZE,
      height: SIZE,
    },
    bottomCenterBox: {
      x: position.x + position.width / 2 - HALF,
      y: position.y + position.height - HALF,
      width: SIZE,
      height: SIZE,
    },
    bottomRightBox: {
      x: position.x + position.width - HALF,
      y: position.y + position.height - HALF,
      width: SIZE,
      height: SIZE,
    },
  };*/