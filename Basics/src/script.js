import {
    Scene,
    Group,
    Mesh,
    BoxGeometry,
    MeshBasicMaterial,
    PerspectiveCamera,
    WebGLRenderer,
    Clock,
    AxesHelper
} from 'three';
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new Scene();

/**
 * Objects
 */
const group = new Group();

const cube1 = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0xff0000 })
);
const cube2 = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0x00ff00 })
);
const cube3 = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0x0000ff })
);
cube1.position.set(-1.5, 0, 0);
cube3.position.set(1.5, 0, 0);

group.add(cube1);
group.add(cube2);
group.add(cube3);

scene.add(group);

const axesHelper = new AxesHelper(0.2);
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
};

/**
 * Camera
 */
const camera = new PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

/**
 * Animate
 */

gsap.to(group.rotation, { duration: 1, delay: 1, x: 2 });
gsap.to(group.rotation, { duration: 1, delay: 2, x: 0 });


// const clock = new Clock();

const animate = () => {
    // const elapsedTime = clock.getElapsedTime();

    // group.position.x = -Math.sin(elapsedTime);
    // camera.position.x = Math.sin(elapsedTime);
    // camera.lookAt(group.position)

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

animate();
