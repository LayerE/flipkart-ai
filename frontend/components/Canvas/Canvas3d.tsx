import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import assets from "@/public/assets";
import { useAppState } from "@/context/app.context";
import styled from "styled-components";
import { saveAs } from "file-saver";

const Canvas3d = () => {
  const containerRef = useRef();
  const outputBox = useRef();

  const {
    file3d,
    setFile3d,
    TdImage,
    set3DImage,
    activeTab,
    genrateeRef,
    renderer,
    setRenderer,
    setSelectedImg,
    selectedImg,
    setasset3dLoader,
  } = useAppState();

  let camera, scene, object, controls, renderNew;

  const [re, setRe] = useState(1);
  useEffect(() => {
    containerRef.current.style.width = "400px";
    containerRef.current.style.height = "400px";
    let renderer;
    const init = () => {
      camera = new THREE.PerspectiveCamera(60, 400 / 400, 1, 2000);
      camera.position.z = 0;
      //   camera.position.z = 250;

      scene = new THREE.Scene();

      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xff0000, 1, 100);
      pointLight.position.set(50, 50, 50);
      //   pointLight.position.set(2, 2, 2); // Adjust the position according to your scene
      camera.add(pointLight);
      //   scene.add(camera);
      const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
      scene.add(light);

      function loadModel() {
        object.traverse(function (child) {
          if (child.isMesh) {
            // child.material.map = texture;
            // child.material.color.setrgb(191, 14, 14)
            // child.material = new THREE.MeshBasicMaterial({ color: 0xc8c8c8 });
            child.material = child.material.clone();
          }
        });

        object.position.y = -0.5;
        //   object.position.x = 1;

        object.scale.setScalar(0.07);
        scene.add(object);
        // render();
        // Adjust the camera position and rotation to focus on the loaded object
        // const boundingBox = new THREE.Box3().setFromObject(object);
        // const center = boundingBox.getCenter(new THREE.Vector3());
        // const size = boundingBox.getSize(new THREE.Vector3());

        // Calculate the distance to fit the object in the view
        // const maxDim = Math.max(size.x, size.y, size.z);
        // const fov = camera.fov * (Math.PI / 180);
        // const distance = Math.abs(maxDim / Math.sin(fov / 2));

        // Set the camera position and look at the object
        // camera.position.copy(center);
        // camera.position.z += distance;
        // camera.lookAt(center);
        setasset3dLoader(false);

        //   renderer.render(scene, camera);
      }

      //   const manager = new THREE.LoadingManager(loadModel);

      //   const textureLoader = new THREE.TextureLoader(manager);
      //   const texture = textureLoader.load(
      //     "https://threejs.org/examples/textures/uv_grid_opengl.jpg"
      //   );
      //   texture.colorSpace = THREE.SRGBColorSpace;
      function onProgress(xhr) {
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total) * 100;
          console.log(
            "model " + Math.round(percentComplete, 2) + "% downloaded"
          );
          if (percentComplete === 100) {
            render();
          }
        }
      }

      function onError() {}

      renderer = new THREE.WebGLRenderer({
        // antialias: true,
        preserveDrawingBuffer: true,
      });

      const loader = new OBJLoader();
      //   const loader =   new GLTFLoader()

      console.log(file3d);
      loader.load(
        file3d,
        (obj) => {
          object = obj;
          loadModel();
          // scene.add( obj );
        },
        onProgress,
        onError
      );

      console.log(renderer, "sfdedf");

      // renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(400, 400);
      containerRef.current.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.minDistance = 2;
      controls.maxDistance = 7;
      controls.addEventListener("change", render);

      //   renderNew = renderer;

      //   const genBox = downloadRef.current;

      //   genBox.addEventListener("click", (e) => {
      //     const screenshot = renderer.domElement.toDataURL("image/png");
      //     set3DImage(screenshot);
      //     console.log("Screenshot:", screenshot);
      //     const link = document.createElement("a");
      //     link.href = screenshot;
      //     link.download = "threejs_canvas.png";

      //     link.click();
      //   });
      setTimeout(() => {
        render();
      }, 1000);
      setRenderer(renderer);

      // window.addEventListener('resize', onWindowResize);
    };

    const render = () => {
      setRenderer(renderer);
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    init();

    return () => {
      // Cleanup logic
      //   if (controls) {
      //     controls.dispose(); // Dispose of the controls to prevent memory leaks
      //   }
      if (renderer) {
        renderer.dispose(); // Dispose of the renderer
      }
      // Remove the renderer's canvas from the DOM
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [file3d]);

  const captureScreenshot = () => {
    console.log(renderer, "dsedfdegfdjjh");
    if (renderer) {
      //   render(); // Make sure the scene is up-to-date
      const screenshot = renderer.domElement.toDataURL("image/png");
      console.log("Screenshot:", screenshot);

      const link = document.createElement("a");
      link.href = screenshot;
      link.download = "threejs_canvas.png";

      // Trigger a click event to download the image
      link.click();
    }
  };

  const downlaedImf = () => {
    if (selectedImg?.image) {
      // const url = modifidImageArray[modifidImageArray.length - 1]?.url;
      const url = selectedImg?.image;

      console.log(url);

      saveAs(url, `image${Date.now()}.png`);
    } else {
    }
  };

  const DeletIrem = () => {
    setSelectedImg(null);
  };

  return (
    <Cnavas3d>
      <div ref={containerRef} className="boxs">
        {!file3d ? <div className="tesxt">3D model viewer</div> : null}
      </div>
      <div ref={outputBox} className="outboxs">
        {selectedImg?.image ? (
          <>
            <div className="btn">
              <button className="selectone" onClick={() => DeletIrem()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="delet"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  ></path>
                </svg>
              </button>
              <button className="selectone" onClick={() => downlaedImf()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="delet"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            <picture>
              <img src={selectedImg?.image} />
            </picture>
          </>
        ) : null}
      </div>

      {/* <button onClick={() => captureScreenshot()} ref={downloadRef}>
        Capture Screenshot
      </button> */}
    </Cnavas3d>
  );
};

export default Canvas3d;

const Cnavas3d = styled.div`
  margin-top: 100px;
  margin-left: 30px;
  display: flex;
  gap: 30px;
  .boxs {
    border: 1px solid rgba(249, 208, 13, 1);
    .tesxt {
      color: #000;
      margin: 10px;
      font-size: 18px;
      font-size: 500;
    }
  }
  .outboxs {
    position: relative;
    border: 1px solid rgba(249, 208, 13, 1);
    width: 400px;
    height: 400px;
    picture {
      width: 100%;
      height: 100%;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .btn {
    position: absolute;
    z-index: 100;
    right: 10px;
    top: 10px;
  }
  .selectone {
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid rgba(249, 208, 13, 1);
    padding: 5px 8px;
    background: rgba(249, 208, 13, 1) !important;

    color: #000;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.3 ease;
    margin-right: 3px;

    &:hover {
      border: 2px solid rgba(249, 208, 13, 1);
    }
  }
  .delet {
    width: 20px;
    height: 20px;
  }
`;
