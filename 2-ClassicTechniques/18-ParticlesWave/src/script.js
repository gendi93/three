import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

const gui = new dat.GUI();
const phase = {
  amplitude: 1,
  particleType: 7,
  particleCount: 20000,
  particleSize: 0.5
};
gui.add(phase, 'amplitude', 0, 10, 0.1).name('Amplitude').setValue(1);
gui.add(phase, 'particleType', 0, 13, 1).name('Particle Type').setValue(7);
gui.add(phase, 'particleCount', 0, 100000).name('Particle Count');
gui.add(phase, 'particleSize', 0, 1, 0.01).name('Particle Size');

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const textures = [];
for (let i = 1; i <= 13; i++) {
  textures.push(textureLoader.load(`/textures/particles/${i}.png`));
}

const particleGeometry = new THREE.BufferGeometry();

const count = 100000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 30;
  colors[i] = Math.random();
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions.slice(0, phase.particleCount * 3), 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors.slice(0, phase.particleCount * 3), 3));

const particleMaterial = new THREE.PointsMaterial({
  size: 0.5,
  sizeAttenuation: true,
  color: 0x55ffff,
  alphaMap: textures[phase.particleType],
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

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

canvas.addEventListener('click', projectMouseClick);

let point = {x: 0, y: 0, z: 0};
function projectMouseClick(event) {
  // Calculate the mouse position in normalized device coordinates
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Create a ray from the camera through the mouse position
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // Find the intersection point between the ray and the plane
  const intersects = raycaster.intersectObject(particles);
  if (intersects.length > 0) {
    point = intersects[0].point;
    startTime = clock.getElapsedTime();
  }
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 15;
camera.position.y = 7.5;
camera.position.x = 15;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let startTime = clock.getElapsedTime();

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime() - startTime;

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions.slice(0, phase.particleCount * 3), 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors.slice(0, phase.particleCount * 3), 3));

  for (let i = 0; i < phase.particleCount; i++) {
    const i3 = i * 3;
    const x = particleGeometry.attributes.position.array[i3];
    const z = particleGeometry.attributes.position.array[i3 + 2];
    if (Math.sqrt(Math.pow(point.x-x, 2) + Math.pow(point.z-z, 2), 2) > elapsedTime*8) {
      particleGeometry.attributes.position.array[i3 + 1] = Math.cos(clock.getElapsedTime() + x/4) + Math.sin(clock.getElapsedTime() + z/4);
    } else {
      particleGeometry.attributes.position.array[i3 + 1] = Math.cos(clock.getElapsedTime() + x/4) + Math.sin(clock.getElapsedTime() + z/4) + Math.pow(Math.E, 0.5 - elapsedTime) * ((phase.amplitude * (1/Math.cosh((x)/4))) * Math.cos(elapsedTime*4 + (Math.sqrt(Math.pow(point.x-x, 2) + Math.pow(point.z-z, 2), 2)) * 0.5) + (phase.amplitude * (1/Math.cosh((z)/4))) * Math.sin(elapsedTime*4 + (Math.sqrt(Math.pow(point.x-x, 2) + Math.pow(point.z-z, 2), 2)) * 0.5));
    }
  }

  particleGeometry.attributes.position.needsUpdate = true;

  particleMaterial.size = phase.particleSize;
  particleMaterial.alphaMap = textures[phase.particleType];

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
