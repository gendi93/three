import {
  Scene,
  Group,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
  LoadingManager,
  NearestFilter
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
* Textures
*/
const loadingManager = new LoadingManager();
const textureLoader = new TextureLoader(loadingManager);
const colorTexture = textureLoader.load('/textures/minecraft.png');

colorTexture.generateMipmaps = false;
colorTexture.minFilter = NearestFilter;
colorTexture.magFilter = NearestFilter;

// GUI

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new Scene();

/**
* Objects
*/
const group = new Group();

const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshBasicMaterial({ map: colorTexture });
const mainCube = new Mesh( geometry, material);
scene.add(mainCube);

/**
* Sizes
*/
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
const aspectRatio = sizes.width / sizes.height;
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

/**
* Camera
*/
const camera = new PerspectiveCamera(50, aspectRatio, 0.01, 100);
camera.position.set(1.5, 1.5, 1.5);
camera.lookAt(group.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
* Renderer
*/
const renderer = new WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

/**
* Animate
*/
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
