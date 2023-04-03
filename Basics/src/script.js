import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as lil from 'lil-gui';

const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load('/textures/door/color.jpg');
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Material
const material = new THREE.MeshStandardMaterial();

material.metalness = 0.7;
material.roughness = 0.2;
material.map = colorTexture;
material.aoMap = ambientOcclusionTexture;
material.aoMapIntensity = 1;
material.displacementMap = heightTexture;
material.displacementScale = 0.05;
material.normalMap = normalTexture;
material.normalScale.set(0.5, 0.5);
material.metalnessMap = metalnessTexture;
material.roughnessMap = roughnessTexture;
material.alphaMap = alphaTexture;
material.transparent = true;
material.side = THREE.DoubleSide;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);

// Objects
const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100);
const plane = new THREE.Mesh(planeGeometry, material);
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2));

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
const aspectRatio = sizes.width / sizes.height;

// Camera
const camera = new THREE.PerspectiveCamera(70, aspectRatio, 0.01, 100);
camera.position.set(3, 0, 3);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Scene
const scene = new THREE.Scene();
scene.add(plane, camera, pointLight, ambientLight);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// Debugger
const gui = new lil.GUI('Material Options');
gui.add(material, 'aoMapIntensity', 0, 10, 0.01);
gui.add(material, 'displacementScale', 0, 1, 0.01);
gui.add(material, 'metalness', 0, 1, 0.01);
gui.add(material, 'roughness', 0, 1, 0.01);

// Animate
const clock = new THREE.Clock();
const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    plane.rotation.y = 0.1 * elapsedTime;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// Event Listeners
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
