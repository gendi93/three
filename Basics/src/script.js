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
import * as lil from 'lil-gui';
import { debugBuilder } from './debugger.js';

// GUI
const gui = new lil.GUI({ name: 'Controls' });

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
        
        const cube = new Mesh(
            new BoxGeometry(...dimension),
            new MeshBasicMaterial({ color })
        );
        group.add(cube);
    }
}
scene.add(group);

const cubeOptions = {
    folderName: 'Cube',
    target: group,
    controls: {
        position: {
            x: {},
            y: {},
            z: {}
        },
        rotation: {
            x: {step: 1},
            y: {step: 1},
            z: {step: 1}
        },
        scale: {
            x: {min: 0.01},
            y: {min: 0.01},
            z: {min: 0.01}
        },
        visible: {},
    }
};

const colorOption = {
    randomColor: () => {
        const mainColor = new Color( 0xffffff );
        mainColor.setHex( Math.random() * 0xffffff );
        group.children[0].material.color.set(mainColor);
        
        for (let i = 0; i < 5; i++) {
            const color = new Color( 0xffffff );
            color.setHex( Math.random() * 0xffffff );
            for (let j = 0; j < 3; j++) {
                group.children[i * 3 + j + 1].material.color.set(color);
            }
        }
    }
}

debugBuilder(gui, cubeOptions);
gui.add(colorOption, 'randomColor');

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
const camera = new PerspectiveCamera(50, aspectRatio, 0.5, 10);
camera.position.set(1.5, 1.5, 1.5);
camera.lookAt(group.position);
scene.add(camera);
const cameraOptions = {
    folderName: 'Camera',
    target: camera,
    controls: {
        position: {
            x: {label: 'positionX'},
            y: {label: 'positionY'},
            z: {label: 'positionZ'}
        },
        rotation: {
            x: {step: 1},
            y: {step: 1},
            z: {step: 1}
        },
    }
};
debugBuilder(gui, cameraOptions);

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
