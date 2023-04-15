import * as THREE from 'three';
import { gsap } from 'gsap';
import * as dat from 'lil-gui';

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: '#00b3ff'
};

gui.addColor(parameters, 'materialColor').onChange(() => {
  material.color.set(parameters.materialColor);
  particlesMaterial.color.set(parameters.materialColor);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const TextureLoader = new THREE.TextureLoader();
const gradientTexture = TextureLoader.load('/textures/gradients/3.jpg');
gradientTexture.magFilter = THREE.NearestFilter;

const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture
});

const objectsDistance = 4;
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  material
);
torus.position.set(0, 0, 0);

const cone = new THREE.Mesh(
  new THREE.ConeGeometry(1, 2, 32),
  material
);
cone.position.set(-0, -objectsDistance * 1, 0);

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
torusKnot.position.set(0, -objectsDistance * 2, 0);

const meshes = [torus, cone, torusKnot];
scene.add(torus, cone, torusKnot);

/**
 * Particles
 */
const particlesCount = 1000;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positions[i*3 + 0] = (Math.random() - 0.5) * 10;
  positions[i*3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * meshes.length;
  positions[i*3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.01,
  sizeAttenuation: true,
  color: parameters.materialColor
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Lights
*/
const DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
DirectionalLight.position.set(1, 1, 0);

scene.add(DirectionalLight);

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

/**
 * Camera
 */

const cameraGroup = new THREE.Group();
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
cameraGroup.add(camera);
scene.add(cameraGroup);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let scroll = window.scrollY;
let currentSection = 0;

window.addEventListener('scroll', () => {
  scroll = window.scrollY;

  const newSection = Math.round(scrollY / sizes.height);

  if (newSection !== currentSection) {
    currentSection = newSection;

    gsap.to(
      meshes[currentSection].rotation,
      {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '+=6',
        y: '+=3',
        z: '+=1.5'
      }
    );
  }
});

const cursor = {
  x: 0,
  y: 0
};

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

window.addEventListener('touchmove', (event) => {
  cursor.x = event.touches[0].clientX / sizes.width - 0.5;
  cursor.y = event.touches[0].clientY / sizes.height - 0.5;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  for (const mesh of meshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.z += deltaTime * 0.2;
  }

  const parallaxX = cursor.x;
  const parallaxY = -cursor.y;

  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * deltaTime;
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * deltaTime;

  camera.position.y = -scroll / sizes.height * objectsDistance;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
