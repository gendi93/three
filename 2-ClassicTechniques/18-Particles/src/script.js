import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

const gui = new dat.GUI();
const phase = {
  angleX: 0,
  angleZ: 0,
  angleX2: 0,
  angleZ2: 0,
  amplitudeX: 1,
  amplitudeZ: 1,
  particleType: 3,
  particleCount: 20000,
  particleSize: 0.5
};
gui.add(phase, 'angleX', 0, (2 * Math.PI * 180/Math.PI), 0.1).name('Angle X').setValue(10);
gui.add(phase, 'angleZ', 0, (2 * Math.PI * 180/Math.PI), 0.1).name('Angle Z').setValue(20);
gui.add(phase, 'angleX2', 0, (2 * Math.PI * 180/Math.PI), 0.1).name('Angle X2').setValue(0);
gui.add(phase, 'angleZ2', 0, (2 * Math.PI * 180/Math.PI), 0.1).name('Angle Z2').setValue(0);
gui.add(phase, 'amplitudeX', 0, 10, 0.1).name('Amplitude X').setValue(1);
gui.add(phase, 'amplitudeZ', 0, 10, 0.1).name('Amplitude Z').setValue(1);
gui.add(phase, 'particleType', 0, 13, 1).name('Particle Type').setValue(3);
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
  color: 0xff33ff,
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

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime();

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions.slice(0, phase.particleCount * 3), 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors.slice(0, phase.particleCount * 3), 3));

  for (let i = 0; i < phase.particleCount; i++) {
    const i3 = i * 3;
    const x = particleGeometry.attributes.position.array[i3];
    const angleX = phase.angleX / (180/Math.PI);
    const angleX2 = phase.angleX2 / (180/Math.PI);
    const z = particleGeometry.attributes.position.array[i3 + 2];
    const angleZ = phase.angleZ / (180/Math.PI);
    const angleZ2 = phase.angleZ2 / (180/Math.PI);
    particleGeometry.attributes.position.array[i3 + 1] = phase.amplitudeX * (Math.sin(elapsedTime + x * angleX + angleX) + Math.sin(elapsedTime + x * angleX2 + angleX2)) + phase.amplitudeZ * (Math.cos(elapsedTime + z * angleZ + angleZ)  + Math.cos(elapsedTime + z * angleZ2 + angleZ2));
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
