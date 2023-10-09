import { useAppState } from "@/context/app.context";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { TDSLoader } from "three/addons/loaders/TDSLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const TDS = () => {
  const containerRef = useRef();

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
    file3dUrl,
    setFile3dUrl,
  } = useAppState();
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // const loader = new GLTFLoader();

    // Set up your camera, renderer, and scene as needed.

    // loader.load(
    //   "https://ik.imagekit.io/7urmiszfde/Barrett%20XM109%20AMPR.gltf?updatedAt=1696853193793",
    //   (gltf) => {
    //     const model = gltf.scene;
    //     scene.add(model);
    //   }
    // );
    const loader = new TDSLoader();
    loader.load(
      "https://ik.imagekit.io/7urmiszfde/Bottle%20Coca-Cola%20N080710.3ds?updatedAt=1696856138699",
      (object) => {
        scene.add(object);
      }
    );
    camera.position.z = 5;
    const animate = () => {
      // Perform your animation updates here.
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(400, 400);
    // containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.minDistance = 2;
    // controls.maxDistance = 17;
    //     controls.addEventListener("change", render);
    animate();

    // const render = () => {
    //     // setRenderer(renderer);
    //     camera.lookAt(scene.position);

    //     renderer.render(scene, camera);
    //   };

    containerRef.current.appendChild(renderer.domElement);
  }, []);

  return <div ref={containerRef}></div>;
};

export default TDS;
