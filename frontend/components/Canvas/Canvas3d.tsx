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
import assets from "@/public/assets";
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
    setFile3d,
    TdImage,
    loader,
    set3DImage,
    activeTab,
    genrateeRef,
    renderer,
    setRenderer,
    setSelectedImg,
    selectedImg,
    setasset3dLoader,
    file3dUrl,
    setFile3dUrl,
    tdFormate,
    setTdFormate,
    filsizeMorethan10,
    setfilsizeMorethan10,
    setActiveSize,
    isMagic,
    crop,
    activeSize,
    setDownloadImg,
    downloadImg,
    romovepopu3d,
    file3dName,
    setromovepopu3d,
    setFile3dName,
  } = useAppState();

  let camera, scene, object, controls, renderNew;
  const [showText, setshowText] = useState(false);
  // const [tdFormate, setTdFormate] = useState("tds");

  const [re, setRe] = useState(1);
  useEffect(() => {
    containerRef.current.style.width = `${activeSize.w}px`;
    containerRef.current.style.height = `${activeSize.h}px`;
    let renderer;
    const init = () => {
      camera = new THREE.PerspectiveCamera(
        75,
        activeSize.w / activeSize.h,
        0.1,
        1000
      );
      // camera.position.set(-1.8, 0.6, 2.7);
      // camera.position.z = 5;
      // camera.position.x = 10;

      // camera.position.set(-20.5, 0.5, 8.0);
      // camera.lookAt(new THREE.Vector3(0, 0, 0));
      scene = new THREE.Scene();
      // const axesHelper = new THREE.AxesHelper(5)
      // scene.add(axesHelper)

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true,
      });
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(
        new RoomEnvironment(renderer),
        0.04
      ).texture;
      // renderer.useLegacyLights = false;
      // renderer.shadowMap.enabled = true;
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xff0000, 100);
      // pointLight.position.set(50, 50, 50);
      pointLight.position.set(2.5, 4.5, 15);
      // scene.add(pointLight);
      // scene.add(camera);
      const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
      light.position.set(2.5, 7.5, 15);
      scene.add(light);

      controls = new OrbitControls(camera, renderer.domElement);
      // controls.target.set( 0, .5, 2 );
      controls.update();
      function loadModel() {
        object.traverse(function (child) {
          if (child.isMesh) {
            // child.material.map = texture;
            // child.material.color.setrgb(191, 14, 14)
            if (filsizeMorethan10) {
              // child.material.color.set(0xc8c8c8);
              // child.material = new THREE.MeshBasicMaterial({ color: 0xc8c8c8 });
            } else {
              child.material = child.material.clone();
            }
            // child.material = child.material.clone();
          } else {
            if (filsizeMorethan10) {
              // child.material = new THREE.MeshBasicMaterial({ color: 0xc8c8c8 });
            }
          }
        });
        // object.position.y = -0.5;
        // object.scale.setScalar(0.07);
        container.add(object);
        scene.add(container);
        // scene.add(object);

        console.log("11sssssssssssss11");

        // Adjust the camera position and rotation to focus on the loaded object
        const boundingBox = new THREE.Box3().setFromObject(object);
        const center = boundingBox.getCenter(new THREE.Vector3());

        const size = boundingBox.getSize(new THREE.Vector3());

        // Calculate the distance to fit the object in the view
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const distance = Math.abs(maxDim / Math.sin(fov / 2));

        // Set the camera position and look at the object
        // camera.position.copy(center);

        camera.position.z += distance;
        // camera.lookAt(center);
        controls.target = center;
        setasset3dLoader(false);
      }

      const postingCenter = (object) => {
        const boundingBox = new THREE.Box3().setFromObject(object);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());

        // Calculate the distance to fit the object in the view
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const distance = Math.abs(maxDim / Math.sin(fov / 2));
        console.log("1ssssssssssssssssssss111");

        // Set the camera position and look at the object
        camera.position.copy(center);
        // camera.position.y += distance;
        // object.position.set(0, 1, 0);

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
        // if(e.message === `Unexpected token 'P', \"PK\u0003\u0004\u0014\u0000\u0000\u0000\u0000\u0000\"... is not valid JSON`){
        //   toast.error("Invalide formate");

        // }else{

        toast.error(e.message);
        // }
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

      if (file3dUrl != null) {
        setshowText(true);

        if (tdFormate === ".obj") {
          setasset3dLoader(true);

          loader3d.load(
            file3dUrl,
            (obj) => {
              object = obj;
              loadModel();

              // scene.add( obj );
            },
            onProgress,
            onError
          );
        } else if (tdFormate === ".3ds") {
          setasset3dLoader(true);

          loader3d.load(
            file3dUrl,
            // "https://ik.imagekit.io/7urmiszfde/Bottle%20Coca-Cola%20N080710.3ds?updatedAt=1696856138699",
            (object) => {
              container.add(object);
              scene.add(container);
              postingCenter(object);
              const boundingBox = new THREE.Box3().setFromObject(object);
              const center = boundingBox.getCenter(new THREE.Vector3());

              const size = boundingBox.getSize(new THREE.Vector3());

              // Calculate the distance to fit the object in the view
              const maxDim = Math.max(size.x, size.y, size.z);
              const fov = camera.fov * (Math.PI / 180);
              const distance = Math.abs(maxDim / Math.sin(fov / 2));

              // Set the camera position and look at the object
              // camera.position.copy(center);

              camera.position.z += distance;
              // camera.lookAt(center);
              controls.target = center;
              setasset3dLoader(false);
            },
            onProgress,
            onError
          );
        } else if (tdFormate === ".gltf" || tdFormate === ".gltf") {
          setasset3dLoader(true);

          loader3d.load(
            file3dUrl,
            // "https://ik.imagekit.io/7urmiszfde/Barrett%20XM109%20AMPR.gltf?updatedAt=1696853193793",
            (object) => {
              // object.scene.traverse(function (child) {
              //   if (child.type === "Mesh") {
              //     let m = child;
              //     m.receiveShadow = true;
              //     m.castShadow = true;
              //   }
              //   if (child.type === "SpotLight") {
              //     let l = child;
              //     l.castShadow = true;
              //     l.shadow.bias = -0.003;
              //     l.shadow.mapSize.width = 2048;
              //     l.shadow.mapSize.height = 2048;
              //   }
              // });
              // // progressBar.style.display = 'none'
              // scene.add(object.scene);
              // // gltf.animations; // Array<THREE.AnimationClip>
              // // gltf.scene; // THREE.Group
              // // gltf.scenes; // Array<THREE.Group>
              // // gltf.cameras; // Array<THREE.Camera>
              // // gltf.asset; // Object

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
              const distances = center.distanceTo(controls.object.position);

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
            file3dUrl,
            // "https://ik.imagekit.io/7urmiszfde/indoor%20plant_02_+2.fbx?updatedAt=1696879483866",
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
              // container.add(object);
              // scene.add(container);

              const boundingBox = new THREE.Box3().setFromObject(object);
              const center = boundingBox.getCenter(new THREE.Vector3());

              const size = boundingBox.getSize(new THREE.Vector3());

              // Calculate the distance to fit the object in the view
              const maxDim = Math.max(size.x, size.y, size.z);
              const fov = camera.fov * (Math.PI / 180);
              const distance = Math.abs(maxDim / Math.sin(fov / 2));

              // Set the camera position and look at the object
              // camera.position.copy(center);

              camera.position.z += distance;
              // camera.lookAt(center);
              controls.target = center;
              setasset3dLoader(false);
            },
            onProgress,
            onError
          );
        } else if (tdFormate === ".mtl") {
          setasset3dLoader(true);

          loader3d.load(
            file3dUrl,
            // "https://ik.imagekit.io/7urmiszfde/Barrett%20XM109%20AMPR.gltf?updatedAt=1696853193793",
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
            file3dUrl,
            // "https://ik.imagekit.io/7urmiszfde/Barrett%20XM109%20AMPR.gltf?updatedAt=1696853193793",
            (geometry) => {
              const material = new THREE.MeshPhysicalMaterial({
                color: 0xb2ffc8,
                // envMap: envTexture,
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
              // camera.lookAt(200);
              console.log(geometry, "fgdgfd");

              // postingCenter(geometry);

              setasset3dLoader(false);
            },
            onProgress,
            onError
          );
        } else if (tdFormate === ".ply") {
          loader3d.load(
            file3dUrl,
            // "https://ik.imagekit.io/7urmiszfde/Barrett%20XM109%20AMPR.gltf?updatedAt=1696853193793",
            (geometry) => {
              const material = new THREE.MeshPhysicalMaterial({
                color: 0xb2ffc8,
                // envMap: envTexture,
                metalness: 0,
                roughness: 0,
                transparent: true,
                transmission: 1.0,
                side: THREE.DoubleSide,
                clearcoat: 1.0,
                clearcoatRoughness: 0.25,
              });

              // geometry.computeVertexNormals()
              const mesh = new THREE.Mesh(geometry, material);
              mesh.rotateX(-Math.PI / 2);
              scene.add(mesh);
              camera.position.z += 150;

              // postingCenter(geometry);

              setasset3dLoader(false);
            },
            onProgress,
            onError
          );
        }
      } else if (file3d) {
        if (file3d) {
          setshowText(true);
        }

        if (tdFormate === ".obj") {
          setasset3dLoader(true);

          loader3d.load(
            file3d,
            (obj) => {
              object = obj;
              loadModel();
              // scene.add( obj );
            },
            onProgress,
            onError
          );
        } else if (tdFormate === ".3ds") {
          setasset3dLoader(true);

          loader3d.load(
            // "https://ik.imagekit.io/7urmiszfde/Bottle%20Coca-Cola%20N080710.3ds?updatedAt=1696856138699",
            file3d,
            (object) => {
              container.add(object);
              scene.add(container);
              postingCenter(object);
              const boundingBox = new THREE.Box3().setFromObject(object);
              const center = boundingBox.getCenter(new THREE.Vector3());

              const size = boundingBox.getSize(new THREE.Vector3());

              // Calculate the distance to fit the object in the view
              const maxDim = Math.max(size.x, size.y, size.z);
              const fov = camera.fov * (Math.PI / 180);
              const distance = Math.abs(maxDim / Math.sin(fov / 2));

              // Set the camera position and look at the object
              // camera.position.copy(center);

              camera.position.z += distance;
              // camera.lookAt(center);
              controls.target = center;
              setasset3dLoader(false);
            },
            onProgress,
            onError
          );
        } else if (tdFormate === ".gltf" || tdFormate === ".glb") {
          setasset3dLoader(true);

          loader3d.load(
            file3d,
            // "https://ik.imagekit.io/7urmiszfde/Barrett%20XM109%20AMPR.gltf?updatedAt=1696853193793",
            (object) => {
              object.scene.traverse(function (child) {
                if (child.type === "Mesh") {
                  // let m = child;
                  // m.receiveShadow = true;
                  // m.castShadow = true;
                }
                if (child.type === "SpotLight") {
                  // let l = child;
                  // l.castShadow = true;
                  // l.shadow.bias = -0.003;
                  // l.shadow.mapSize.width = 2048;
                  // l.shadow.mapSize.height = 2048;
                }
              });
              // After loading the model, calculate the center
              const boundingBox = new THREE.Box3().setFromObject(object.scene);
              const center = boundingBox.getCenter(new THREE.Vector3());

              const size = boundingBox.getSize(new THREE.Vector3());

              // Calculate the distance to fit the object in the view
              const maxDim = Math.max(size.x, size.y, size.z);
              const fov = camera.fov * (Math.PI / 180);
              const distance = Math.abs(maxDim / Math.sin(fov / 2));

              camera.position.z += distance;

              controls.target = center;
              const distances = center.distanceTo(controls.object.position);

              // const cameraPosition = camera.position;
              // const objectPosition = object.scene.position;
              // const distance = cameraPosition.distanceTo(objectPosition);
              // progressBar.style.display = 'none'
              scene.add(object.scene);

              // gltf.animations; // Array<THREE.AnimationClip>
              // gltf.scene; // THREE.Group
              // gltf.scenes; // Array<THREE.Group>
              // gltf.cameras; // Array<THREE.Camera>
              // gltf.asset; // Object

              setasset3dLoader(false);
            },
            onProgress,
            onError
          );
        } else if (tdFormate === ".mtl") {
          setasset3dLoader(true);

          loader3d.load(
            file3d,
            // "https://ik.imagekit.io/7urmiszfde/Barrett%20XM109%20AMPR.gltf?updatedAt=1696853193793",
            (object) => {
              const model = object.scene;
              scene.add(model);
              object.preload();

              setasset3dLoader(false);
            },
            onProgress,
            onError
          );
        } else if (tdFormate === ".fbx") {
          setasset3dLoader(true);

          const material = new THREE.MeshNormalMaterial();
          loader3d.load(
            file3d,
            // "https://ik.imagekit.io/7urmiszfde/rp_nathan_animated_003_walking.fbx?updatedAt=1696878521110",
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
              // container.add(object);
              // scene.add(container);

              const boundingBox = new THREE.Box3().setFromObject(object);
              const center = boundingBox.getCenter(new THREE.Vector3());

              const size = boundingBox.getSize(new THREE.Vector3());

              // Calculate the distance to fit the object in the view
              const maxDim = Math.max(size.x, size.y, size.z);
              const fov = camera.fov * (Math.PI / 180);
              const distance = Math.abs(maxDim / Math.sin(fov / 2));

              // Set the camera position and look at the object
              // camera.position.copy(center);

              camera.position.z += distance;
              // camera.lookAt(center);
              controls.target = center;
              setasset3dLoader(false);
            },
            onProgress,
            onError
          );
        } else if (tdFormate === ".stl") {
          setasset3dLoader(true);

          loader3d.load(
            file3d,
            // "https://ik.imagekit.io/7urmiszfde/Barrett%20XM109%20AMPR.gltf?updatedAt=1696853193793",
            (geometry) => {
              const material = new THREE.MeshPhysicalMaterial({
                color: 0xb2ffc8,
                // envMap: envTexture,
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
              // camera.lookAt(200);
              console.log(geometry, "fgdgfd");

              // postingCenter(geometry);

              setasset3dLoader(false);
            },
            onProgress,
            onError
          );
        } else if (tdFormate === ".ply") {
          setasset3dLoader(true);

          loader3d.load(
            file3d,
            // "https://ik.imagekit.io/7urmiszfde/Barrett%20XM109%20AMPR.gltf?updatedAt=1696853193793",
            (geometry) => {
              const material = new THREE.MeshPhysicalMaterial({
                color: 0xb2ffc8,
                // envMap: envTexture,
                metalness: 0,
                roughness: 0,
                transparent: true,
                transmission: 1.0,
                side: THREE.DoubleSide,
                clearcoat: 1.0,
                clearcoatRoughness: 0.25,
              });

              // geometry.computeVertexNormals()
              const mesh = new THREE.Mesh(geometry, material);
              mesh.rotateX(-Math.PI / 2);
              scene.add(mesh);
              camera.position.z += 150;

              // postingCenter(geometry);

              setasset3dLoader(false);
            },
            onProgress,
            onError
          );
        }
      }

      // loader3d.load(
      //   "https://ik.imagekit.io/7urmiszfde/Barrett%20XM109%20AMPR.gltf?updatedAt=1696853193793",
      //   (obj) => {
      //     object = obj;
      //     const model = obj.scene;

      //     // loadModel();
      //     scene.add(model);
      //   },
      //   onProgress,
      //   onError
      // );

      // renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(activeSize.w, activeSize.h);
      // renderer.setS(activeSize.w, activeSize.h);

      // renderer.setPixelRatio(window.devicePixelRatio);
      // renderer.setSize(window.innerWidth, window.innerHeight);
      // renderer.toneMapping = THREE.ACESFilmicToneMapping; //added contrast for filmic look
      // renderer.toneMappingExposure = 1;
      // renderer.outputEncoding = THREE.sRGBEncoding;

      containerRef.current.appendChild(renderer.domElement);

      // controls.enablePan = false;
      // controls.enableDamping = true;

      // controls.target.set(0, 0, -0.2);
      // controls.minDistance = 2;
      // controls.update();
      // controls.enableDamping = true;
      // controls.maxDistance = 150;
      // controls.enableDamping = false;

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
      // camera.lookAt(scene.position);

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
  }, [file3d, file3dUrl, tdFormate, activeSize]);

  // useEffect(() => {
  //   console.log(!loader,"ssssssssssssssssssssssss");

  //   if(controls){

  //     controls.enableRotate = !loader; // Disable rotation
  //     controls.enableZoom = !loader;   // Disable zooming
  //     controls.enablePan = !loader;    // Disable panning
  //   }
  //   // return () => {
  //   //   if (renderer) {
  //   //     renderer.dispose(); // Dispose of the renderer
  //   //   }
  //   //   // Remove the renderer's canvas from the DOM
  //   //   if (containerRef.current) {
  //   //     containerRef.current.removeChild(renderer.domElement);
  //   //   }

  //   // }
  // }, [loader])

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
    setDownloadImg(null);
  };

  return (
    <Cnavas3d canvasDisable={loader}>
      {isMagic ? <PopupCanvas /> : null}
      {crop ? <CropperBox /> : null}

      {romovepopu3d.status ? <RemoveBox type={"bgRevcbvmove"} /> : null}
      {
        loader ?

        <div className="divovelay"></div>

        : null
      }

      <div className="boxs3d">
        <div ref={containerRef} className="boxs">
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
      </div>

      {/* <button onClick={() => captureScreenshot()} ref={downloadRef}>
        Capture Screenshot
      </button> */}
    </Cnavas3d>
  );
};

export default Canvas3d;

const Cnavas3d = styled.div`
  /* margin-top: 100px; */
  padding: 0 30px;
  /* padding-top: 100px; */
  min-width: 100%;

  height: 100%;
  /* overflow-y: auto; */
  /* overflow-x: scroll; */
  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  .boxs3d {
    display: flex;
    transform: scale(0.4) translateX(-75%) translateY(-50%);
    gap: 30px;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
    height: 7px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
  }
  .divovelay{
    /* display: ${(props) => (props.canvasDisable ? "none" : "block")}; */
    z-index: 10;
    position:absolute;
    width: 100%;
    height: 100%;
    /* background-color: #000; */
  }

  .boxs {
   

/* pointer-events:${(props) => (props.canvasDisable ? "none" : "auto")} */


    border: 2px solid rgba(249, 208, 13, 1);
    .tesxt {
      color: #000;
      margin: 10px;
      font-size: 42px;
      font-size: 500;
    }
  }
  .outboxs {
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
    width: 20px;
    height: 20px;
  }
`;
