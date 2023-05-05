import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import * as dat from 'lil-gui';

import { Monopoly } from './game/monopoly/Monopoly';
import { tiles } from './config';

const game = new Monopoly();

import { tileMapGenerator, cardMapGenerator, diceMapsGenerator } from './helpers.js';

const gui = new dat.GUI();
let dice = [];
const removeDice = () => {
  for (const die of dice) {
    scene.remove(die.mesh);
    world.removeBody(die.body);
  }
  dice.splice(0, dice.length);
};

const diceMaps = diceMapsGenerator();
const diceGeometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
const diceMaterials = [
  new THREE.MeshBasicMaterial({ map: diceMaps[4] }),
  new THREE.MeshBasicMaterial({ map: diceMaps[2] }),
  new THREE.MeshBasicMaterial({ map: diceMaps[1] }),
  new THREE.MeshBasicMaterial({ map: diceMaps[3] }),
  new THREE.MeshBasicMaterial({ map: diceMaps[0] }),
  new THREE.MeshBasicMaterial({ map: diceMaps[5] })
];

const checkSide = (body) => {
  body.allowSleep = false;
  const euler = new CANNON.Vec3();
  body.quaternion.toEuler(euler);
      
  const eps = 0.1;
  let isZero = (angle) => Math.abs(angle) < eps;
  let isHalfPi = (angle) => Math.abs(angle - .5 * Math.PI) < eps;
  let isMinusHalfPi = (angle) => Math.abs(.5 * Math.PI + angle) < eps;
  let isPiOrMinusPi = (angle) => (Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps);

  if (isZero(euler.z)) {
    if (isZero(euler.x)) {
      return 2;
    } else if (isHalfPi(euler.x)) {
      return 6;
    } else if (isMinusHalfPi(euler.x)) {
      return 1;
    } else if (isPiOrMinusPi(euler.x)) {
      return 4;
    } else {
      // landed on edge => wait to fall on side and fire the event again
      body.allowSleep = true;
    }
  } else if (isHalfPi(euler.z)) {
    return 5;
  } else if (isMinusHalfPi(euler.z)) {
    return 3;
  } else {
    // landed on edge => wait to fall on side and fire the event again
    body.allowSleep = true;
  }
};

const debugOptions = {
  throwDice: () => {
    removeDice();
    const diceRoll = {
      doubles: false,
      total: 0,
      values: [0, 0],
    };
    const die1 = new THREE.Mesh(diceGeometry, diceMaterials);
    const die2 = new THREE.Mesh(diceGeometry, diceMaterials);

    die1.position.set(1.5, 2, 1);
    die1.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    die2.position.set(1, 2, 1.5);
    die2.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    const shape = new CANNON.Box(new CANNON.Vec3(0.25 / 2, 0.25 / 2, 0.25 / 2));
    const dieBody1 = new CANNON.Body({
      mass: 1,
      shape,
      sleepTimeLimit: 0.1
    });
    const dieBody2 = new CANNON.Body({
      mass: 1,
      shape,
      sleepTimeLimit: 0.1
    });
    dieBody1.position.copy(die1.position);
    dieBody1.quaternion.copy(die1.quaternion);
    dieBody2.position.copy(die2.position);
    dieBody2.quaternion.copy(die2.quaternion);

    const force1 = -Math.random() * 100;
    const force2 = -Math.random() * 100;
    dieBody1.applyForce(new CANNON.Vec3(force1, force1, force1), new CANNON.Vec3(0, 0, 0));
    dieBody2.applyForce(new CANNON.Vec3(force2, force2, force2), new CANNON.Vec3(0, 0, 0));

    let roll1, roll2;
    const player = game.getCurrentPlayer();

    dieBody1.addEventListener('sleep', () => {
      roll1 = checkSide(dieBody1);

      diceRoll.values[0] = roll1;
      diceRoll.total += roll1;
      if (diceRoll.values[1] === roll1) diceRoll.doubles = true;

      if (!!diceRoll.values[0] && !!diceRoll.values[1]) {
        player.takeTurn(diceRoll);
      }
    });

    dieBody2.addEventListener('sleep', () => {
      roll2 = checkSide(dieBody2);

      diceRoll.values[1] = roll2;
      diceRoll.total += roll2;
      if (diceRoll.values[0] === roll2) diceRoll.doubles = true;

      if (!!diceRoll.values[0] && !!diceRoll.values[1]) {
        player.takeTurn(diceRoll);
      }
    });

    world.addBody(dieBody1);
    world.addBody(dieBody2);
    dice.push({
      mesh: die1,
      body: dieBody1,
    }, {
      mesh: die2,
      body: dieBody2,
    });

    scene.add(die1, die2);
  },
  reset: removeDice,
  resolveTile: () => {
    const player = game.getCurrentPlayer();
    player.resolveTile(game.map[player.position]);
  }
};

gui.add(debugOptions, 'throwDice');
gui.add(debugOptions, 'reset');
gui.add(debugOptions, 'resolveTile');

const maps = tileMapGenerator();
const cards = cardMapGenerator();

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF);

const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

const boardSize = 10;
const innerBoardScale = 0.728;
const cardHeightScale = 0.168144;
const cardWidthScale = 0.1;
const innerBoardSize = boardSize * innerBoardScale;
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

const cardMaterial = new THREE.MeshBasicMaterial({ color: 'white' });

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

const createTile = (config, index) => {
  const map = maps[index];
  const bodyMaterial = new THREE.MeshBasicMaterial({ map });
  const tile = new THREE.Mesh(boardGeometry, bodyMaterial);

  tile.position.set(...config.position);
  tile.scale.set(...config.scale);
  tile.rotation.set(...config.rotation);

  return tile;
};

const createCard = (type, index) => {
  const cardMap = cards[type][index];
  const cardMaterials = [
    cardMaterial,
    cardMaterial,
    new THREE.MeshBasicMaterial({ map: cardMap[1] }),
    new THREE.MeshBasicMaterial({ map: cardMap[0] }),
    cardMaterial,
    cardMaterial
  ];
  return new THREE.Mesh(boardGeometry, cardMaterials);
};

const border1 = new THREE.Mesh(lineGeometry, lineMaterial);
const border2 = new THREE.Mesh(lineGeometry, lineMaterial);
const border3 = new THREE.Mesh(lineGeometry, lineMaterial);
const border4 = new THREE.Mesh(lineGeometry, lineMaterial);

border1.scale.set(0.002, 3, 1);
border2.scale.set(1.004, 3, 0.002);
border3.scale.set(0.002, 3, 1);
border4.scale.set(1.004, 3, 0.002);
border1.position.set(-boardSize / 2 - 0.01, 0.02, 0);
border2.position.set(0, 0.02, -boardSize / 2 - 0.01);
border3.position.set(boardSize / 2 + 0.01, 0.02, 0);
border4.position.set(0, 0.02, boardSize / 2 + 0.01);

boardGroup.add(border1, border2, border3, border4);

tiles.forEach((config, index) => {
  const tile = createTile(config, index);
      
  boardGroup.add(tile);
});
scene.add(boardGroup);

for (let i = 0; i < 16; i++) {
  const card = createCard('chance', i);
  card.scale.set(cardHeightScale, 0.1, cardWidthScale);
  card.rotation.y = Math.PI / 4;
  card.position.set(1.5, 0.002 * i + 0.02, 1.5);
  scene.add(card);
}

for (let i = 0; i < 16; i++) {
  const card = createCard('community', i);
  card.scale.set(cardHeightScale, 0.1, cardWidthScale);
  card.rotation.y = -3 * Math.PI / 4;
  card.position.set(-1.5, 0.002 * i + 0.02, -1.5);
  scene.add(card);
}

for (let i = 0; i < 28; i++) {
  const card = createCard('deed', i);
  card.scale.set(cardHeightScale, 0.1, cardWidthScale);
  card.rotation.y = Math.PI / 2;
  card.position.set(0, 0.002 * i + 0.02, 0);
  scene.add(card);
}

const pieceGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16);
const redMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
const blueMaterial = new THREE.MeshBasicMaterial({ color: 'blue' });
// const greenMaterial = new THREE.MeshBasicMaterial({ color: 'green' });
// const yellowMaterial = new THREE.MeshBasicMaterial({ color: 'yellow' });
const redPiece = new THREE.Mesh(pieceGeometry, redMaterial);
const bluePiece = new THREE.Mesh(pieceGeometry, blueMaterial);
// const cylinder3 = new THREE.Mesh(pieceGeometry, greenMaterial);
// const cylinder4 = new THREE.Mesh(pieceGeometry, yellowMaterial);

const players = [{name: 'Player 1', piece: redPiece}, {name: 'Player 2', piece: bluePiece}];
game.initializeGame(players);

redPiece.position.set(boardSize / 2 - 0.5, 0.2, boardSize / 2 - 0.5);
bluePiece.position.set(boardSize / 2 - 0.8, 0.2, boardSize / 2 - 0.5);
// cylinder3.position.set(boardSize / 2 - 0.5, 0.2, boardSize / 2 - 0.8);
// cylinder4.position.set(boardSize / 2 - 0.8, 0.2, boardSize / 2 - 0.8);
scene.add(redPiece, bluePiece);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

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
