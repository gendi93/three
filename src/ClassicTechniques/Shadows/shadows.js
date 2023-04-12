import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import * as dat from 'lil-gui';

// Debug
const gui = new dat.GUI({ title: 'Lights', closeFolders: true });

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Lights
const ambientColor = {
  string: '#0000ff',
  object: { r: 0, g: 1, b: 1 },
};
const directionalColor = {
  string: '#ff00ff',
  object: { r: 1, g: 0, b: 1 },
};
const hemisphereColor = {
  string: '#ff00ff',
  object: { r: 1, g: 0, b: 1 },
};
const hemisphereGroundColor = {
  string: '#0000ff',
  object: { r: 0, g: 0, b: 1 },
};
const pointColor = {
  string: '#ff0000',
  object: { r: 1, g: 0, b: 1 },
};
const rectColor = {
  string: '#00ffff',
  object: { r: 1, g: 0, b: 1 },
};
const spotColor = {
  string: '#ff00ff',
  object: { r: 1, g: 0, b: 1 },
};

// Ambient Light
const ambientLight = new THREE.AmbientLight(0x00ffff, 0.1);
const ambientFolder = gui.addFolder('Ambient Light');
ambientFolder.addColor(ambientColor, 'string').name('Ambient Color');
ambientFolder.add(ambientLight, 'intensity').name('Ambient Intensity').min(0).max(1).step(0.001);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xff00ff, 0.35);
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
const directionalFolder = gui.addFolder('Directional Light');
directionalFolder.add(directionalLightHelper, 'visible').name('Directional Helper').setValue(false);
directionalFolder.addColor(directionalColor, 'string').name('Directional Color');
directionalFolder.add(directionalLight, 'intensity').name('Directional Intensity').min(0).max(1).step(0.001);
directionalFolder.add(directionalLight.position, 'x').name('Directional x').min(-5).max(5).step(0.001);
directionalFolder.add(directionalLight.position, 'y').name('Directional y').min(-5).max(5).step(0.001);
directionalFolder.add(directionalLight.position, 'z').name('Directional z').min(-5).max(5).step(0.001);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 1.7;
directionalLight.shadow.camera.top = 0.7;
directionalLight.shadow.camera.bottom = -0.7;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.right = 2;

// Hemisphere Light
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x00ff00, 0);
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
const hemisphereFolder = gui.addFolder('Hemisphere Light');
hemisphereFolder.add(hemisphereLightHelper, 'visible').name('Hemisphere Helper').setValue(false);
hemisphereFolder.addColor(hemisphereColor, 'string').name('Hemisphere Color');
hemisphereFolder.addColor(hemisphereGroundColor, 'string').name('Ground Color');
hemisphereFolder.add(hemisphereLight, 'intensity').name('Hemisphere Intensity').min(0).max(1).step(0.001);
hemisphereFolder.add(hemisphereLight.position, 'x').name('Hemisphere x').min(-5).max(5).step(0.001);
hemisphereFolder.add(hemisphereLight.position, 'y').name('Hemisphere y').min(-5).max(5).step(0.001);
hemisphereFolder.add(hemisphereLight.position, 'z').name('Hemisphere z').min(-5).max(5).step(0.001);

// Point Light
const pointLight = new THREE.PointLight(0xff0000, 0, 5, 1);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
const pointFolder = gui.addFolder('Point Light');
pointFolder.add(pointLightHelper, 'visible').name('Point Helper').setValue(false);
pointFolder.addColor(pointColor, 'string').name('Point Color');
pointFolder.add(pointLight, 'intensity').name('Point Intensity').min(0).max(1).step(0.001);
pointFolder.add(pointLight.position, 'x').name('Point x').min(-5).max(5).step(0.001);
pointFolder.add(pointLight.position, 'y').name('Point y').min(-5).max(5).step(0.001).setValue(-2);
pointFolder.add(pointLight.position, 'z').name('Point z').min(-5).max(5).step(0.001);

// Rect Area Light
const rectAreaLight = new THREE.RectAreaLight(0x00ffff, 1, 5, 5);
rectAreaLight.rotateY(Math.PI);
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
const rectFolder = gui.addFolder('Rect Area Light');
rectFolder.add(rectAreaLightHelper, 'visible').name('Rect Area Helper').setValue(false);
rectFolder.addColor(rectColor, 'string').name('Rect Area Color');
rectFolder.add(rectAreaLight, 'intensity').name('Rect Intensity').min(0).max(10).step(0.001);
rectFolder.add(rectAreaLight, 'width').name('Rect Width').min(0).max(5).step(0.001);
rectFolder.add(rectAreaLight, 'height').name('Rect Height').min(0).max(5).step(0.001);
rectFolder.add(rectAreaLight.position, 'x').name('Rect x').min(-5).max(5).step(0.001);
rectFolder.add(rectAreaLight.position, 'y').name('Rect y').min(-5).max(5).step(0.001);
rectFolder.add(rectAreaLight.position, 'z').name('Rect z').min(-5).max(5).step(0.001).setValue(-2.5);

// Spot Light
const spotLight = new THREE.SpotLight(0xff00ff, 1, 10, 1, 0.25, 1);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
const spotFolder = gui.addFolder('Spot Light');
spotFolder.add(spotLightHelper, 'visible').name('Spot Helper').setValue(false);
spotFolder.addColor(spotColor, 'string').name('Spot Color');
spotFolder.add(spotLight, 'intensity').name('Spot Intensity').min(0).max(10).step(0.001);
spotFolder.add(spotLight, 'distance').name('Spot Distance').min(0).max(10).step(0.001);
spotFolder.add(spotLight, 'angle').name('Spot Angle').min(0).max(Math.PI).step(0.001);
spotFolder.add(spotLight, 'penumbra').name('Spot Penumbra').min(0).max(5).step(0.001);
spotFolder.add(spotLight, 'decay').name('Spot Decay').min(0).max(5).step(0.001);
spotFolder.add(spotLight.position, 'x').name('Spot x').min(-5).max(5).step(0.001).setValue(3.3);
spotFolder.add(spotLight.position, 'y').name('Spot y').min(-5).max(5).step(0.001).setValue(1.4);
spotFolder.add(spotLight.position, 'z').name('Spot z').min(-5).max(5).step(0.001).setValue(-2.6);
spotFolder.add(spotLight.target.position, 'x').name('Target x').min(-5).max(5).step(0.001).setValue(0.5);
spotFolder.add(spotLight.target.position, 'y').name('Target y').min(-5).max(5).step(0.001);
spotFolder.add(spotLight.target.position, 'z').name('Target z').min(-5).max(5).step(0.001);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 2.85;
spotLight.shadow.camera.far = 6;
spotLight.shadow.camera.fov = 30;

// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material
);
sphere.position.x = - 1.5;
sphere.receiveShadow = true;
sphere.castShadow = true;

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.75, 0.75),
  material
);
cube.receiveShadow = true;
cube.castShadow = true;

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;
torus.receiveShadow = true;
torus.castShadow = true;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  material
);
plane.rotation.x = - Math.PI * 0.5;
plane.position.y = - 0.65;
plane.receiveShadow = true;

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener('resize', () =>
{
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
scene.add(ambientLight, directionalLight, directionalLightHelper, hemisphereLight, hemisphereLightHelper, pointLight, pointLightHelper, rectAreaLight, rectAreaLightHelper, spotLight, spotLightHelper, spotLight.target, sphere, cube, torus, plane, camera);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Animate
const clock = new THREE.Clock();

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();
  ambientLight.color.set(ambientColor.string);
  directionalLight.color.set(directionalColor.string);
  hemisphereLight.color.set(hemisphereColor.string);
  hemisphereLight.groundColor.set(hemisphereGroundColor.string);
  pointLight.color.set(pointColor.string);
  rectAreaLight.color.set(rectColor.string);
  spotLight.color.set(spotColor.string);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
