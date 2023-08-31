import React, { useEffect, useRef } from "react";
import { styled } from "styled-components";
import { fabric } from "fabric"; // this also installed on your project

// import './App.css';

const sampleImages = [
  "https://placekitten.com/100/100",
  "https://placekitten.com/150/150",
  "https://placekitten.com/200/200",
];

const App: React.FC = () => {
  const canvasRef = useRef(null);

  //   useEffect(() => {
  //     const canvas = new fabric.Canvas(canvasRef.current);
  //     const box = new fabric.Rect({
  //       left: 50,
  //       top: 50,
  //       width: 400,
  //       height: 400,
  //       fill: "transparent",
  //       stroke: "black",
  //       strokeWidth: 2,
  //       selectable: false,
  //     });
  //     canvas.add(box);

  //     // Attach event to handle image upload
  //     const handleImageUpload = (event: any) => {
  //       const file = event.target.files[0];
  //       const reader = new FileReader();

  //       reader.onload = (f) => {
  //         const imgObj = new Image();
  //         imgObj.src = f.target.result as string;

  //         imgObj.onload = () => {
  //           const image = new fabric.Image(imgObj, {
  //             left: 50,
  //             top: 50,
  //             angle: 0,
  //             opacity: 1,
  //           });
  //           canvas.add(image);
  //         };
  //       };
  //       reader.readAsDataURL(file);
  //     };

  //     document
  //       .getElementById("upload")
  //       .addEventListener("change", handleImageUpload);
  //   }, []);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current);
    

    canvas.setWidth(500);
    canvas.setHeight(500);

    // const box = new fabric.Rect({
    //   left: 50,
    //   top: 50,
    //   width: 400,
    //   height: 400,
    //   fill: "transparent",
    //   stroke: "black",
    //   strokeWidth: 2,
    //   selectable: false,
    // });
    // canvas.add(box);
    // canvas.renderAll();

    // Attach the canvas reference
    // canvasRef.current = canvas;
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const imgUrl = e.dataTransfer.getData("text");

    fabric.Image.fromURL(imgUrl, (img) => {
      img.set({
        left: e.clientX - 50, // Adjust these values for better placement
        top: e.clientY - 50, // Adjust these values for better placement
      });
      canvasRef.current?.add(img);
    });
  };
  const handleDownload = () => {};

  return (
    <SS>
      <div
        style={{
          display: "flex",
          height: "500px",
          width: "1000px",
          position: "relative",
        }}
      >
        <div
          style={{ flex: "1" }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <canvas ref={canvasRef as any}></canvas>
        </div>

        <div style={{ flex: "1" }}>
          {sampleImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Sample ${index}`}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text", src)}
              style={{ width: "100px", height: "100px", marginBottom: "10px" }}
            />
          ))}
        </div>
      </div>
    </SS>
  );
};

export default App;

const SS = styled.div`
  /* .App {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f4;
    overflow: hidden;
  }

  .images-list {
    position: absolute;
    bottom: 10px;
    display: flex;
    gap: 15px;
  }

  .images-list img {
    max-width: 100px;
    cursor: pointer;
  } */
`;
