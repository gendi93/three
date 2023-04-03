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
// const gui = new lil.GUI({ name: 'Controls' });

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

const cubeOptions = {
    folderName: 'Cube',
    target: mainCube,
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
        mainCube.material.color.set(mainColor);
    }
}

// debugBuilder(gui, cubeOptions);
// gui.add(colorOption, 'randomColor');

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
// debugBuilder(gui, cameraOptions);

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
