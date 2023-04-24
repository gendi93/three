import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

const fontLoader = new FontLoader();
const textureLoader = new THREE.TextureLoader();
const textures = [];

const goTexture = textureLoader.load('/textures/monopoly/go.png');
textures.push(goTexture);
goTexture.center = new THREE.Vector2(0.5, 0.5);
goTexture.rotation = -Math.PI / 2;

const oldKentRoadTexture = textureLoader.load('/textures/monopoly/oldKentRoad.png');
textures.push(oldKentRoadTexture);
const communityChestTexture = textureLoader.load('/textures/monopoly/communityChest.png');
textures.push(communityChestTexture);
const whitechapelRoadTexture = textureLoader.load('/textures/monopoly/whitechapelRoad.png');
textures.push(whitechapelRoadTexture);
const incomeTaxTexture = textureLoader.load('/textures/monopoly/incomeTax.png');
textures.push(incomeTaxTexture);

const kingsCrossTexture = textureLoader.load('/textures/monopoly/kingsCross.png');
textures.push(kingsCrossTexture);

const islingtonTexture = textureLoader.load('/textures/monopoly/islington.png');
textures.push(islingtonTexture);
const chanceRedTexture = textureLoader.load('/textures/monopoly/chanceRed.png');
textures.push(chanceRedTexture);
const eustonRoadTexture = textureLoader.load('/textures/monopoly/eustonRoad.png');
textures.push(eustonRoadTexture);
const pentonvilleRoadTexture = textureLoader.load('/textures/monopoly/pentonvilleRoad.png');
textures.push(pentonvilleRoadTexture);

const jailTexture = textureLoader.load('/textures/monopoly/jail.png');
textures.push(jailTexture);
jailTexture.center = new THREE.Vector2(0.5, 0.5);
jailTexture.rotation = Math.PI;

const pallMallTexture = textureLoader.load('/textures/monopoly/pallMall.png');
textures.push(pallMallTexture);
const electricCompanyTexture = textureLoader.load('/textures/monopoly/electricCompany.png');
textures.push(electricCompanyTexture);
const whiteHallTexture = textureLoader.load('/textures/monopoly/whiteHall.png');
textures.push(whiteHallTexture);
const northumberlandAvenueTexture = textureLoader.load('/textures/monopoly/northumberlandAvenue.png');
textures.push(northumberlandAvenueTexture);

const maryleboneTexture = textureLoader.load('/textures/monopoly/marylebone.png');
textures.push(maryleboneTexture);

const bowStreetTexture = textureLoader.load('/textures/monopoly/bowStreet.png');
textures.push(bowStreetTexture);
const marlboroughStreetTexture = textureLoader.load('/textures/monopoly/marlboroughStreet.png');
textures.push(marlboroughStreetTexture);
const vineStreetTexture = textureLoader.load('/textures/monopoly/vineStreet.png');
textures.push(vineStreetTexture);

const parkingTexture = textureLoader.load('/textures/monopoly/parking.png');
textures.push(parkingTexture);
parkingTexture.center = new THREE.Vector2(0.5, 0.5);
parkingTexture.rotation = Math.PI / 2;

const strandTexture = textureLoader.load('/textures/monopoly/strand.png');
textures.push(strandTexture);
const chanceBlueTexture = textureLoader.load('/textures/monopoly/chanceBlue.png');
textures.push(chanceBlueTexture);
const fleetStreetTexture = textureLoader.load('/textures/monopoly/fleetStreet.png');
textures.push(fleetStreetTexture);
const trafalgarSquareTexture = textureLoader.load('/textures/monopoly/trafalgarSquare.png');
textures.push(trafalgarSquareTexture);

const fenchurchStTexture = textureLoader.load('/textures/monopoly/fenchurchSt.png');
textures.push(fenchurchStTexture);

const leicesterSquareTexture = textureLoader.load('/textures/monopoly/leicesterSquare.png');
textures.push(leicesterSquareTexture);
const coventryStreetTexture = textureLoader.load('/textures/monopoly/coventryStreet.png');
textures.push(coventryStreetTexture);
const waterWorksTexture = textureLoader.load('/textures/monopoly/waterWorks.png');
textures.push(waterWorksTexture);
const piccadillyTexture = textureLoader.load('/textures/monopoly/piccadilly.png');
textures.push(piccadillyTexture);

const arrestTexture = textureLoader.load('/textures/monopoly/arrest.png');
textures.push(arrestTexture);

const regentStreetTexture = textureLoader.load('/textures/monopoly/regentStreet.png');
textures.push(regentStreetTexture);
const oxfordStreetTexture = textureLoader.load('/textures/monopoly/oxfordStreet.png');
textures.push(oxfordStreetTexture);
const bondStreetTexture = textureLoader.load('/textures/monopoly/bondStreet.png');
textures.push(bondStreetTexture);

const liverpoolStTexture = textureLoader.load('/textures/monopoly/liverpoolSt.png');
textures.push(liverpoolStTexture);

const chanceOrangeTexture = textureLoader.load('/textures/monopoly/chanceOrange.png');
textures.push(chanceOrangeTexture);
const parkLaneTexture = textureLoader.load('/textures/monopoly/parkLane.png');
textures.push(parkLaneTexture);
const luxuryTaxTexture = textureLoader.load('/textures/monopoly/luxuryTax.png');
textures.push(luxuryTaxTexture);
const mayfairTexture = textureLoader.load('/textures/monopoly/mayfair.png');
textures.push(mayfairTexture);


textures.forEach((texture) => {
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
});

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
const tiles = [
  oldKentRoadTexture,
  communityChestTexture,
  whitechapelRoadTexture,
  incomeTaxTexture,
  kingsCrossTexture,
  islingtonTexture,
  chanceRedTexture,
  eustonRoadTexture,
  pentonvilleRoadTexture,
  pallMallTexture,
  electricCompanyTexture,
  whiteHallTexture,
  northumberlandAvenueTexture,
  maryleboneTexture,
  bowStreetTexture,
  communityChestTexture,
  marlboroughStreetTexture,
  vineStreetTexture,
  strandTexture,
  chanceBlueTexture,
  fleetStreetTexture,
  trafalgarSquareTexture,
  fenchurchStTexture,
  leicesterSquareTexture,
  coventryStreetTexture,
  waterWorksTexture,
  piccadillyTexture,
  regentStreetTexture,
  oxfordStreetTexture,
  communityChestTexture,
  bondStreetTexture,
  liverpoolStTexture,
  chanceOrangeTexture,
  parkLaneTexture,
  luxuryTaxTexture,
  mayfairTexture
];
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
      map = tiles[j];
    } else {
      map = tiles[j + numRowTiles];
    }
  } else {
    if (j < numRowTiles) {
      map = tiles[j + numRowTiles];
    } else {
      map = tiles[j + numRowTiles * 2];
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
// controls.target;

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
