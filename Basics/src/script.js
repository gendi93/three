import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Materials
const textureLoader = new THREE.TextureLoader();
const matCapTexture = textureLoader.load('/textures/matcap.png');
const material = new THREE.MeshMatcapMaterial({ matcap: matCapTexture });

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);

// Objects
const fontLoader = new FontLoader();
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

fontLoader.load('/fonts/Josefin Sans_Regular.json', (font) => {
    const textGeometry = new TextGeometry(
        'Solid metal donuts!',
        {
            font,
            size: 0.5,
            height: 0.2,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4
        }
    );
    textGeometry.center();

    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);

    for (let i = 0; i < 100; i++) {
        const donut = new THREE.Mesh(donutGeometry, material);
        donut.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
        donut.rotation.set((Math.random() - 0.5) * Math.PI, (Math.random() - 0.5) * Math.PI, (Math.random() - 0.5) * Math.PI);
        const scale = Math.random();
        donut.scale.set(scale, scale, scale);
        scene.add(donut);
    }
});

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
const aspectRatio = sizes.width / sizes.height;

// Camera
const camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.01, 100);
camera.position.set(0, 0, 10);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Scene
const scene = new THREE.Scene();
scene.add(camera, pointLight, ambientLight);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// Animate
const animate = () => {
    scene.children.slice(4).forEach((donut, index) => {;
        donut.rotation.x += index / 2000;
        donut.rotation.y += index / 2000;
        donut.rotation.z += index / 2000;
    });
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
