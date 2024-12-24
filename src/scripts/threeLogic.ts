import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import Stats from "three/addons/libs/stats.module.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  100
);
const renderer = new THREE.WebGLRenderer();

const stats = new Stats();
stats.dom.style.padding = "0.5rem";
document.body.appendChild(stats.dom);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 15;
controls.maxDistance = 50;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);

const threeContainer = document.getElementById("threeContainer");
if (threeContainer) {
  threeContainer.appendChild(renderer.domElement);
}

window.addEventListener("resize", onWindowResize, false);
window.addEventListener("load", () => {
  const modelsElement = document.getElementById("models");
  if (modelsElement) {
    modelsElement.addEventListener("change", (e) => {
      const target = e.target;
      if (target) {
        const path = (target as HTMLSelectElement).value;
        Load(path);
      }
    });
  }
});

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.castShadow = false;
ambientLight.intensity = 2.5;
scene.add(ambientLight);

camera.position.x = -15;
camera.position.y = 30;
camera.position.z = 0;

controls.update();

const manager = new THREE.LoadingManager();
manager.onStart = function (url, itemsLoaded, itemsTotal) {
  progressElement.style.display = "block";
  progressElement.style.width = "5%";
};
manager.onLoad = function () {
  progressElement.style.display = "none";
};

const progressElement = document.getElementById("loadingBar") as HTMLElement;
if (!progressElement) {
  throw new Error("Loading bar element not found");
}

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
  progressElement.style.width = (itemsLoaded / itemsTotal) * 100 + "%";
};
manager.onError = function (url) {
  console.log("There was an error loading " + url);
};

const loader = new GLTFLoader(manager);
let root: any;

function Load(path: string) {
  loader.load("https://files.moonded.com/Web3D/" + path, function (gltf) {
    if (root && root.parent) {
      root.parent.remove(root);
    }

    root = gltf.scene;
    scene.add(root);

    root.rotation.x = -1.5;
  });
}

function animate() {
  renderer.render(scene, camera);
  stats.update();
  controls.update();
}
