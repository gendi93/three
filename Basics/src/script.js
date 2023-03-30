import {
    Scene,
    Group,
    Mesh,
    BoxGeometry,
    MeshBasicMaterial,
    PerspectiveCamera,
    WebGLRenderer,
    Color
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new Scene();

/**
 * Objects
 */
const group = new Group();

const mainCube = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0xff0000 })
);
group.add(mainCube);
for (let i = 0; i < 5; i++) {
    const color = new Color( 0xffffff );
    color.setHex( Math.random() * 0xffffff );
    for (let j = 0; j < 3; j++) {
        const dimension = [1 - 0.1 * i, 1 - 0.1 * i, 1 - 0.1 * i];
        dimension[j] = [1 + 0.1 * i];
        const color = new Color( 0xffffff );
        color.setHex( Math.random() * 0xffffff );
        
        const cube = new Mesh(
            new BoxGeometry(...dimension),
            new MeshBasicMaterial({ color })
        );
        group.add(cube);
    }
}

scene.add(group);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
const aspectRatio = sizes.width / sizes.height;

/**
 * Camera
 */
const camera = new PerspectiveCamera(50, aspectRatio, 0.5, 10);
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
}

animate();
