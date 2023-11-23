// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { TDSLoader } from "three/addons/loaders/TDSLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { PLYLoader } from "three/addons/loaders/PLYLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useAppState } from "@/context/app.context";
import styled from "styled-components";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import PopupCanvas from "./popupCanvas";
import CropperBox from "./Cropper";
import RemoveBox from "./RomovePopu";

const Canvas3d = () => {
  const containerRef = useRef();
  const outputBox = useRef();

  const {
    file3d,
    loader,
    renderer,
    setRenderer,
    setSelectedImg,
    selectedImg,
    setasset3dLoader,
    file3dUrl,
    tdFormate,
    filsizeMorethan10,
    isMagic,
    crop,
    activeSize,
    setDownloadImg,
    romovepopu3d,
    setFile3dName,
  } = useAppState();

  let camera, scene, object, controls;
  const [showText, setshowText] = useState(false);
  const addH = 100;
  const addW = 100;

  useEffect(() => {
    containerRef.current.style.width = `${activeSize.w}px`;
    containerRef.current.style.height = `${activeSize.h}px`;
    let renderer;
    const init = () => {
      camera = new THREE.PerspectiveCamera(
        45,
        activeSize.w / activeSize.h,
        0.01,
        1000
      );
      // camera.position.set( 1.5, 4, 9 );

      scene = new THREE.Scene();
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true,
      });
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(activeSize.w, activeSize.h);

      containerRef.current.appendChild(renderer.domElement);

      // to get the colore and ligtin of the object
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();
      scene.environment = pmremGenerator.fromScene(
        new RoomEnvironment(renderer)
      ).texture;

      // // ligting
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xff0000, 100);
      pointLight.position.set(2.5, 4.5, 15);
      const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
      light.position.set(2.5, 7.5, 15);
      scene.add(light);

      controls = new OrbitControls(camera, renderer.domElement);
      // controls.enableDamping = true;
      controls.screenSpacePanning = true;

      controls.update();

      function loadModel() {
        object.traverse(function (child) {
          if (child.isMesh) {
            if (filsizeMorethan10) {
              // child.material.color.set(0xc8c8c8);
              // child.material = new THREE.MeshBasicMaterial({ color: 0xc8c8c8 });
            } else {
              child.material = child.material.clone();
            }
          } else {
            if (filsizeMorethan10) {
            }
          }
        });

        scene.add(object);

        // Adjust the camera position and rotation to focus on the loaded object
        const boundingBox = new THREE.Box3().setFromObject(object);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());

        // Calculate the distance to fit the object in the view
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const distance = Math.abs(maxDim / Math.sin(fov / 2));
        camera.position.z += distance;
        controls.target = center;
        setasset3dLoader(false);
      }

      const postingCenter = (object) => {
        const boundingBox = new THREE.Box3().setFromObject(object);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const distance = Math.abs(maxDim / Math.sin(fov / 2));
        camera.position.copy(center);
        camera.position.z += distance;
        camera.lookAt(center);
        setasset3dLoader(false);
      };

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

      function onError(e) {
        console.log({ error: e });
        toast.error(e.message);
        setFile3dName(null);
        setasset3dLoader(false);
      }
      const container = new THREE.Group();

      let loader3d;
      if (tdFormate === ".obj") {
        loader3d = new OBJLoader();
      } else if (tdFormate === ".3ds") {
        loader3d = new TDSLoader();
      } else if (tdFormate === ".gltf" || tdFormate === ".glb") {
        loader3d = new GLTFLoader();
      } else if (tdFormate === ".fbx") {
        loader3d = new FBXLoader();
      } else if (tdFormate === ".mtl") {
        loader3d = new MTLLoader();
      } else if (tdFormate === ".stl") {
        loader3d = new STLLoader();
      } else if (tdFormate === ".ply") {
        loader3d = new PLYLoader();
      }

      if (file3dUrl != null || file3d != null) {
        setshowText(true);
        if (tdFormate === ".obj") {
          setasset3dLoader(true);
          loader3d.load(
            file3dUrl != null ? file3dUrl : file3d,
            (obj) => {
              object = obj;
              loadModel();
            },
            onProgress,
            onError
          );
        } else if (tdFormate === ".3ds") {
          setasset3dLoader(true);
          loader3d.load(
            file3dUrl != null ? file3dUrl : file3d,
            (object) => {
              container.add(object);
              scene.add(container);
              postingCenter(object);
              const boundingBox = new THREE.Box3().setFromObject(object);
              const center = boundingBox.getCenter(new THREE.Vector3());
              const size = boundingBox.getSize(new THREE.Vector3());
              const maxDim = Math.max(size.x, size.y, size.z);
              const fov = camera.fov * (Math.PI / 180);
              const distance = Math.abs(maxDim / Math.sin(fov / 2));
              camera.position.z += distance;
              controls.target = center;
              setasset3dLoader(false);
            },
            onProgress,
            onError
          );
        } else if (tdFormate === ".gltf" || tdFormate === ".glb") {
          setasset3dLoader(true);

          loader3d.load(
            file3dUrl ? file3dUrl : file3d,

            (object) => {
              // After loading the model, calculate the center
              const boundingBox = new THREE.Box3().setFromObject(object.scene);
              const center = boundingBox.getCenter(new THREE.Vector3());
              // controls.target = center;
              const size = boundingBox.getSize(new THREE.Vector3());
              // Calculate the distance to fit the object in the view
              const maxDim = Math.max(size.x, size.y, size.z);
              const fov = camera.fov * (Math.PI / 180);
              const distance = Math.abs(maxDim / Math.sin(fov / 2));
              camera.position.z += distance;
              controls.target = center;
              scene.add(object.scene);
              setasset3dLoader(false);
            },
            onProgress,
            onError
          );
        } else if (tdFormate === ".fbx") {
          setasset3dLoader(true);
          const material = new THREE.MeshNormalMaterial();

          loader3d.load(
            file3dUrl != null ? file3dUrl : file3d,

            (object) => {
              object.traverse(function (child) {
                if (child.isMesh) {
                  child.material = material;
                  if (child.material) {
                    child.material.transparent = false;
                  }
                }
              });
              object.scale.set(0.01, 0.01, 0.01);
              postingCenter(object);
              scene.add(object);
              const boundingBox = new THREE.Box3().setFromObject(object);
              const center = boundingBox.getCenter(new THREE.Vector3());
              const size = boundingBox.getSize(new THREE.Vector3());
              const maxDim = Math.max(size.x, size.y, size.z);
              const fov = camera.fov * (Math.PI / 180);
              const distance = Math.abs(maxDim / Math.sin(fov / 2));
              camera.position.z += distance;
              controls.target = center;
              setasset3dLoader(false);
            },
            onProgress,
            onError
          );
        } else if (tdFormate === ".mtl") {
          setasset3dLoader(true);

          loader3d.load(
            file3dUrl != null ? file3dUrl : file3d,

            (gltf) => {
              const model = gltf.scene;
              scene.add(model);
              postingCenter(gltf);

              setasset3dLoader(false);
            },
            onProgress,
            onError
          );
        } else if (tdFormate === ".stl") {
          setasset3dLoader(true);

          loader3d.load(
            file3dUrl != null ? file3dUrl : file3d,

            (geometry) => {
              const material = new THREE.MeshPhysicalMaterial({
                color: 0xb2ffc8,
                metalness: 0.25,
                roughness: 0.1,
                opacity: 1.0,
                transparent: true,
                transmission: 0.99,
                clearcoat: 1.0,
                clearcoatRoughness: 0.25,
              });
              const mesh = new THREE.Mesh(geometry, material);
              scene.add(mesh);
              mesh.rotateX(-Math.PI / 2);

              camera.position.z += 200;

              setasset3dLoader(false);
            },
            onProgress,
            onError
          );
        } else if (tdFormate === ".ply") {
          loader3d.load(
            file3dUrl != null ? file3dUrl : file3d,

            (geometry) => {
              const material = new THREE.MeshPhysicalMaterial({
                color: 0xb2ffc8,
                metalness: 0,
                roughness: 0,
                transparent: true,
                transmission: 1.0,
                side: THREE.DoubleSide,
                clearcoat: 1.0,
                clearcoatRoughness: 0.25,
              });

              const mesh = new THREE.Mesh(geometry, material);
              mesh.rotateX(-Math.PI / 2);
              scene.add(mesh);
              camera.position.z += 150;

              setasset3dLoader(false);
            },
            onProgress,
            onError
          );
        }
      }

      containerRef.current.appendChild(renderer.domElement);

      // controls.enableDamping = true;
      controls.update();
      controls.addEventListener("change", render);

      /* The above code is updating the controls and then rendering after a delay of 1 second. */

      setTimeout(() => {
        render();
      }, 1000);
      setRenderer(renderer);
    };

    const render = () => {
      setRenderer(renderer);
      renderer.render(scene, camera);
    };

    init();

    return () => {
      if (renderer) {
        renderer.dispose(); // Dispose of the renderer
      }
      // Remove the renderer's canvas from the DOM
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [file3d, file3dUrl, tdFormate, activeSize]);

  const downlaedImf = () => {
    if (selectedImg?.image) {
      const url = selectedImg?.image;
      saveAs(url, `image${Date.now()}.png`);
    }
  };

  const DeletIrem = () => {
    setSelectedImg(null);
    setDownloadImg(null);
  };

  return (
    <Cnavas3d canvasDisable={loader}>
      {isMagic ? <PopupCanvas /> : null}
      {crop ? <CropperBox /> : null}

      {romovepopu3d.status ? <RemoveBox /> : null}
      {loader ? <div className="divovelay"></div> : null}

      <div className="boxs3d">
        <div
          ref={containerRef}
          className="boxs"
          style={{ minWidth: activeSize.w, height: activeSize.h }}
        >
          {!showText ? <div className="tesxt">3D model viewer</div> : null}
        </div>
        <div
          ref={outputBox}
          className="outboxs"
          style={{ minWidth: activeSize.w, height: activeSize.h }}
        >
          {selectedImg?.image ? (
            <>
              <div className="btn">
                <button className="selectone" onClick={() => DeletIrem()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="delet"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                      fillRule="evenodd"
                      d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                      clipRule="evenodd"
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
      </div>
    </Cnavas3d>
  );
};

export default Canvas3d;

const Cnavas3d = styled.div`
  padding: 0 30px;
  min-width: 100%;
  height: 100%;
  overflow: scroll;

  margin-top: 100px;
  margin-bottom: 20px;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    display: none;
  }
  .boxs3d {
    display: flex;
    /* transform: scale(0.8) translateX(-15%) translateY(13%); */
    gap: 30px;
    width: 100%;
    height: 100%;
    /* overflow: auto; */
    overflow-y: hidden;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
    height: 7px;
    height: 100%;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
  }
  .divovelay {
    z-index: 10;
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .boxs {
    width: 100%;
    overflow: hidden;
    border: 2px solid rgba(249, 208, 13, 1);
    .tesxt {
      color: #000;
      margin: 10px;
      font-size: 24px;
      font-size: 500;
    }
  }
  .outboxs {
    width: 100%;
    position: relative;
    background-color: rgb(254, 244, 199);
    overflow: hidden;

    picture {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: fill;
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
    width: 30px;
    height: 30px;
  }
`;
