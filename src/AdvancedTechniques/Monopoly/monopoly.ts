import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import * as dat from 'lil-gui';
import { gsap } from 'gsap';

import { Dice } from './types';

import { Monopoly } from './game/monopoly/Monopoly';
import { tiles } from './config';
import { tileMapGenerator, cardMapGenerator, diceMapsGenerator, CardData } from './helpers';
import { CHANCE_CARDS, COMMUNITY_CARDS, Card } from './game/monopoly/assets/Cards';

const game = new Monopoly();
const playerId: HTMLElement = document.querySelector('#playerId') || document.createElement('h1');
const money: Element = document.querySelector('#money') || document.createElement('h3');
const properties: Element =
  document.querySelector('#propertyList') || document.createElement('div');

const gui = new dat.GUI();
const dice: Dice = [];
const removeDice: () => void = () => {
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

const checkSide: (body: CANNON.Body) => number = (body: CANNON.Body) => {
  body.allowSleep = false;
  const euler = new CANNON.Vec3();
  body.quaternion.toEuler(euler);

  const eps = 0.1;
  const isZero = (angle: number) => Math.abs(angle) < eps;
  const isHalfPi = (angle: number) => Math.abs(angle - 0.5 * Math.PI) < eps;
  const isMinusHalfPi = (angle: number) => Math.abs(0.5 * Math.PI + angle) < eps;
  const isPiOrMinusPi = (angle: number) =>
    Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps;

  let value: number;

  if (isZero(euler.z)) {
    if (isZero(euler.x)) {
      value = 2;
    } else if (isHalfPi(euler.x)) {
      value = 6;
    } else if (isMinusHalfPi(euler.x)) {
      value = 1;
    } else if (isPiOrMinusPi(euler.x)) {
      value = 4;
    } else {
      // landed on edge => wait to fall on side and fire the event again
      body.allowSleep = true;
      value = -1;
    }
  } else if (isHalfPi(euler.z)) {
    value = 5;
  } else if (isMinusHalfPi(euler.z)) {
    value = 3;
  } else {
    // landed on edge => wait to fall on side and fire the event again
    body.allowSleep = true;
    value = -1;
  }

  return value;
};

let thrownDice = false;
const debugOptions = {
  throwDice: () => {
    const player = game.getCurrentPlayer();
    playerId.textContent = `Player: ${player.name}`;
    if (player.name === 'Red') playerId.style.color = 'red';
    else playerId.style.color = 'blue';
    money.textContent = `funds: £${player.money}`;
    properties.innerHTML = '';
    player.properties.map((property) => {
      const span = document.createElement('span');
      span.style.background = property.color;
      span.style.color =
        property.color !== 'white' && property.color !== 'yellow' ? 'white' : 'black';
      span.style.border = '1px solid black';
      span.style.borderRadius = '20px';
      span.style.padding = '5px 10px';
      span.style.marginRight = '5px';
      span.style.marginTop = '5px';
      span.textContent = property.name;
      properties.appendChild(span);
    });

    if (thrownDice || player.isMoving) return;
    thrownDice = true;

    gsap.to(camera.position, {
      x: -1,
      y: 5,
      z: -1,
      duration: 1
    });
    controls.target.copy(board.position);
    removeDice();
    const diceRoll = {
      doubles: false,
      total: 0,
      values: [0, 0]
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
    dieBody1.position.copy(new CANNON.Vec3(...die1.position.toArray()));
    dieBody1.quaternion.copy(new CANNON.Quaternion(...die1.quaternion.toArray()));
    dieBody2.position.copy(new CANNON.Vec3(...die2.position.toArray()));
    dieBody2.quaternion.copy(new CANNON.Quaternion(...die2.quaternion.toArray()));

    const force1 = -Math.random() * 100;
    const force2 = -Math.random() * 100;
    dieBody1.applyForce(new CANNON.Vec3(force1, force1, force1), new CANNON.Vec3(0, 0, 0));
    dieBody2.applyForce(new CANNON.Vec3(force2, force2, force2), new CANNON.Vec3(0, 0, 0));

    let roll1: number;
    let roll2: number;

    dieBody1.addEventListener('sleep', () => {
      roll1 = checkSide(dieBody1);
      if (roll1 < 0) {
        dieBody1.applyForce(new CANNON.Vec3(force1, force1, force1), new CANNON.Vec3(0, 0, 0));
        return;
      }

      diceRoll.values[0] = roll1;
      diceRoll.total += roll1;
      if (diceRoll.values[1] === roll1) diceRoll.doubles = true;

      if (!!diceRoll.values[0] && !!diceRoll.values[1]) {
        setTimeout(() => {
          controls.target.copy(player.piece.position);
          gsap.to(camera.position, {
            x: player.piece.position.x + 1,
            y: player.piece.position.y + 1,
            z: player.piece.position.z + 1,
            duration: 0.5
          });
          setTimeout(() => {
            player.takeTurn(diceRoll);
            thrownDice = false;
          }, 1000);
        }, 1000);
      }
    });

    dieBody2.addEventListener('sleep', () => {
      roll2 = checkSide(dieBody2);
      if (roll2 < 0) {
        dieBody2.applyForce(new CANNON.Vec3(force2, force2, force2), new CANNON.Vec3(0, 0, 0));
        return;
      }

      diceRoll.values[1] = roll2;
      diceRoll.total += roll2;
      if (diceRoll.values[0] === roll2) diceRoll.doubles = true;

      if (!!diceRoll.values[0] && !!diceRoll.values[1]) {
        setTimeout(() => {
          controls.target.copy(player.piece.position);
          gsap.to(camera.position, {
            x: player.piece.position.x + 1,
            y: player.piece.position.y + 1,
            z: player.piece.position.z + 1,
            duration: 0.5
          });
          setTimeout(() => {
            player.takeTurn(diceRoll);
            thrownDice = false;
          }, 1000);
        }, 1000);
      }
    });

    world.addBody(dieBody1);
    world.addBody(dieBody2);
    dice.push(
      {
        mesh: die1,
        body: dieBody1
      },
      {
        mesh: die2,
        body: dieBody2
      }
    );

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

const canvas: Element = document.querySelector('canvas.webgl') || document.createElement('canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

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

const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
  friction: 0.7,
  restitution: 0.3
});
world.defaultContactMaterial = defaultContactMaterial;
world.addContactMaterial(defaultContactMaterial);

const cardMaterial = new THREE.MeshBasicMaterial({ color: 'white' });

const boardMaterial = new THREE.MeshBasicMaterial({ color: 0xd4fcda });
const boardGeometry = new THREE.BoxGeometry(boardSize, 0.02, boardSize);

const lineMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
const lineGeometry = new THREE.BoxGeometry(boardSize, 0.02, boardSize);

const boardGroup = new THREE.Group();
const board = new THREE.Mesh(boardGeometry, boardMaterial);
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
  shape: innerBoardShape
});
innerBoardBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(innerBoardBody);

const createTile = (config, index) => {
  const map = maps[index];
  const bodyMaterial = new THREE.MeshBasicMaterial({ map });
  const tile = new THREE.Mesh(boardGeometry, bodyMaterial);

  tile.position.set(config.position[0], config.position[1], config.position[2]);
  tile.scale.set(config.scale[0], config.scale[1], config.scale[2]);
  tile.rotation.set(config.rotation[0], config.rotation[1], config.rotation[2]);

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
  card.rotation.y = (-3 * Math.PI) / 4;
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

const players = [
  { name: 'Red', piece: redPiece },
  { name: 'Blue', piece: bluePiece }
];
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

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.name = 'camera';
camera.position.set(-5, 5, 0);
scene.add(camera);

const controls = new OrbitControls(camera, canvas as HTMLElement);
controls.target.set(0, -3, 0);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update physics
  world.step(1 / 60, deltaTime, 3);

  for (const die of dice) {
    die.mesh.position.copy(new THREE.Vector3(...die.body.position.toArray()));
    die.mesh.quaternion.copy(new THREE.Quaternion(...die.body.quaternion.toArray()));
  }

  const player = game.getCurrentPlayer();
  if (player.isMoving) {
    const piece = player.piece;
    controls.target.copy(piece.position);
    camera.position.set(piece.position.x + 1, piece.position.y + 1, piece.position.z + 1);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
