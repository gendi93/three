import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import * as dat from 'lil-gui';

import { tileMapGenerator, cornerMapGenerator } from './helpers.js';

const gui = new dat.GUI();
let dice = [];
const removeDice = () => {
  for (const die of dice) {
    scene.remove(die.mesh);
    world.removeBody(die.body);
  }
  dice.splice(0, dice.length);
};
const debugOptions = {
  throwDice: () => {
    removeDice();
    const die1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.25, 0.25),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    const die2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.25, 0.25),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    die1.position.set(1.5, 2, 1);
    die1.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    die2.position.set(1, 2, 1.5);
    die2.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    const shape = new CANNON.Box(new CANNON.Vec3(0.25/2, 0.25/2, 0.25/2));
    const body1 = new CANNON.Body({
      mass: 1,
      shape
    });
    const body2 = new CANNON.Body({
      mass: 1,
      shape
    });
    body1.position.copy(die1.position);
    body1.quaternion.copy(die1.quaternion);
    body2.position.copy(die2.position);
    body2.quaternion.copy(die2.quaternion);

    const force1 = -Math.random() * 100;
    const force2 = -Math.random() * 100;
    body1.applyForce(new CANNON.Vec3(force1, force1, force1), new CANNON.Vec3(0, 0, 0));
    body2.applyForce(new CANNON.Vec3(force2, force2, force2), new CANNON.Vec3(0, 0, 0));
    world.addBody(body1);
    world.addBody(body2);
    dice.push({
      mesh: die1,
      body: body1,
    }, {
      mesh: die2,
      body: body2,
    });

    scene.add(die1, die2);
  },
  reset: removeDice
};

gui.add(debugOptions, 'throwDice');
gui.add(debugOptions, 'reset');

const maps = tileMapGenerator();

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF);

const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

const boardSize = 10;
const scale = 0.728;
const innerBoardSize = boardSize * scale;
const numRowTiles = 9;
const defaultMaterial = new CANNON.Material('default');

const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.7,
    restitution: 0.3
  }
);
world.defaultContactMaterial = defaultContactMaterial;
world.addContactMaterial(defaultContactMaterial);

const boardMaterial = new THREE.MeshBasicMaterial({ color: 0xD4FCDA });
const boardGeometry = new THREE.BoxGeometry(boardSize, 0.02, boardSize);

const lineMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
const lineGeometry = new THREE.BoxGeometry(boardSize, 0.02, boardSize);

const boardGroup = new THREE.Group();
const board = new THREE.Mesh(
  boardGeometry,
  boardMaterial
);
boardGroup.add(board);
scene.add(boardGroup);

const innerBoard = new THREE.Mesh(
  new THREE.BoxGeometry(innerBoardSize, 0.02, innerBoardSize),
  boardMaterial
);
innerBoard.position.y = 0.02;
boardGroup.add(innerBoard);
const innerBoardShape = new CANNON.Plane();
const innerBoardBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(0, 0.02, 0),
  shape: innerBoardShape,
});
innerBoardBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(innerBoardBody);

const createTile = (i, j) => {
  const tile = new THREE.Group();
  let map;
  if (i === 0) {
    if (j < numRowTiles) {
      map = maps[j];
    } else {
      map = maps[j + numRowTiles];
    }
  } else {
    if (j < numRowTiles) {
      map = maps[j + numRowTiles];
    } else {
      map = maps[j + numRowTiles * 2];
    }
  }
  const bodyMaterial = new THREE.MeshBasicMaterial({ map });
  const body = new THREE.Mesh(boardGeometry, bodyMaterial);

  const widthScale = scale / numRowTiles;
  const heightScale = (1 - scale) / 2;

  const width = widthScale * boardSize;
  const height = heightScale * boardSize;

  const distanceToTile = boardSize / 2 - height / 2;
  const distanceToEdge = innerBoardSize / 2 - width / 2;

  const positiveHorizontalPosition = -distanceToEdge + width * j;
  const negativeHorizontalPosition = distanceToEdge - width * (j - numRowTiles);

  if (i === 0) {
    body.scale.set(widthScale, 1, heightScale);
    if (j < numRowTiles) {
      body.position.set(positiveHorizontalPosition, 0.02, -distanceToTile);
      body.rotation.set(0, 0, Math.PI);
    } else {
      body.position.set(negativeHorizontalPosition, 0.02, distanceToTile);
    }
  } else {
    body.scale.set(widthScale, 1, heightScale);
    if (j < numRowTiles) {
      body.rotation.set(0, Math.PI/2, 0);
      body.position.set(distanceToTile, 0.02, positiveHorizontalPosition);
    } else {
      body.rotation.set(0, 3*Math.PI/2, 0);
      body.position.set(-distanceToTile, 0.02, negativeHorizontalPosition);
    }
  }

  tile.add(body);

  return tile;
};

const { goTexture, jailTexture, parkingTexture, arrestTexture } = cornerMapGenerator();

const goMaterial = new THREE.MeshBasicMaterial({ map: goTexture });
const jailMaterial = new THREE.MeshBasicMaterial({ map: jailTexture });
const parkingMaterial = new THREE.MeshBasicMaterial({ map: parkingTexture });
const arrestMaterial = new THREE.MeshBasicMaterial({ map: arrestTexture });
const border1 = new THREE.Mesh(lineGeometry, lineMaterial);
const border2 = new THREE.Mesh(lineGeometry, lineMaterial);
const border3 = new THREE.Mesh(lineGeometry, lineMaterial);
const border4 = new THREE.Mesh(lineGeometry, lineMaterial);
const goCorner = new THREE.Mesh(boardGeometry, goMaterial);
const jailCorner = new THREE.Mesh(boardGeometry, jailMaterial);
const parkingCorner = new THREE.Mesh(boardGeometry, parkingMaterial);
const arrestCorner = new THREE.Mesh(boardGeometry, arrestMaterial);

border1.scale.set(0.002, 3, 1);
border2.scale.set(1.004, 3, 0.002);
border3.scale.set(0.002, 3, 1);
border4.scale.set(1.004, 3, 0.002);
goCorner.scale.set((1 - scale) / 2, 1, (1 - scale) / 2);
jailCorner.scale.set((1 - scale) / 2, 1, (1 - scale) / 2);
parkingCorner.scale.set((1 - scale) / 2, 1, (1 - scale) / 2);
arrestCorner.scale.set((1 - scale) / 2, 1, (1 - scale) / 2);
border1.position.set(-boardSize / 2 - 0.01, 0.02, 0);
border2.position.set(0, 0.02, -boardSize / 2 - 0.01);
border3.position.set(boardSize / 2 + 0.01, 0.02, 0);
border4.position.set(0, 0.02, boardSize / 2 + 0.01);
goCorner.position.set(-boardSize / 2 + (boardSize * (1 - scale) / 2) / 2, 0.02, -boardSize / 2 + (boardSize * (1 - scale) / 2) / 2);
jailCorner.position.set(boardSize / 2 - (boardSize * (1 - scale) / 2) / 2, 0.02, -boardSize / 2 + (boardSize * (1 - scale) / 2) / 2);
parkingCorner.position.set(boardSize / 2 - (boardSize * (1 - scale) / 2) / 2, 0.02, boardSize / 2 - (boardSize * (1 - scale) / 2) / 2);
arrestCorner.position.set(-boardSize / 2 + (boardSize * (1 - scale) / 2) / 2, 0.02, boardSize / 2 - (boardSize * (1 - scale) / 2) / 2);

boardGroup.add(border1, border2, border3, border4, goCorner, jailCorner, parkingCorner, arrestCorner);
boardGroup.rotation.y = Math.PI;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.position.set(0, 5, 0);
scene.add(directionalLight);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

for (let i = 0; i < 2; i++) {
  for (let j = 0; j < numRowTiles * 2; j++) {
    const tile = createTile(i, j);
    
    boardGroup.add(tile);
  }
}

window.addEventListener('resize', () =>
{
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 8, 0);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update physics
  world.step(1 / 60, deltaTime, 3);

  for (const die of dice) {
    die.mesh.position.copy(die.body.position);
    die.mesh.quaternion.copy(die.body.quaternion);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
