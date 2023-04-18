import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

const fontLoader = new FontLoader();
// // let font;
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF);

const boardSize = 10;
const scale = 0.728;
const innerBoardSize = boardSize * scale;
const numRowTiles = 9;
const tiles = [
  {
    title: 'Old Kent Road',
    color: 0x946030,
    divider: true,
    header: true
  },
  {
    title: 'Community Chest',
    color: 0xD4FCDA,
    divider: true,
    header: false
  },
  {
    title: 'Whitechapel Road',
    color: 0x946030,
    divider: true,
    header: true
  },
  {
    title: 'Income Tax',
    color: 0xD4FCDA,
    divider: true,
    header: false
  },
  {
    title: 'Kings Cross Station',
    color: 'black',
    divider: true,
    header: true
  },
  {
    title: 'The Angel, Islington',
    color: 0xA6DCF6,
    divider: true,
    header: true
  },
  {
    title: 'Chance',
    color: 0xD4FCDA,
    divider: true,
    header: false
  },
  {
    title: 'Euston Road',
    color: 0xA6DCF6,
    divider: true,
    header: true
  },
  {
    title: 'Pentonville Road',
    color: 0xA6DCF6,
    divider: false,
    header: true
  },
  {
    title: 'Pall Mall',
    color: 0xDE4598,
    divider: true,
    header: true
  },
  {
    title: 'Electric Company',
    color: 'white',
    divider: true,
    header: true
  },
  {
    title: 'Whitehall',
    color: 0xDE4598,
    divider: true,
    header: true
  },
  {
    title: 'Northumberland Avenue',
    color: 0xDE4598,
    divider: true,
    header: true
  },
  {
    title: 'Marylebone Station',
    color: 'black',
    divider: true,
    header: true
  },
  {
    title: 'Bow Street',
    color: 0xEFAA1E,
    divider: true,
    header: true
  },
  {
    title: 'Community Chest',
    color: 0xD4FCDA,
    divider: true,
    header: false
  },
  {
    title: 'Marlborough Street',
    color: 0xEFAA1E,
    divider: true,
    header: true
  },
  {
    title: 'Vine Street',
    color: 0xEFAA1E,
    divider: false,
    header: true
  },
  {
    title: 'Strand',
    color: 0xE52233,
    divider: true,
    header: true
  },
  {
    title: 'Chance',
    color: 0xD4FCDA,
    divider: true,
    header: false
  },
  {
    title: 'Fleet Street',
    color: 0xE52233,
    divider: true,
    header: true
  },
  {
    title: 'Trafalgar Square',
    color: 0xE52233,
    divider: true,
    header: true
  },
  {
    title: 'Fenchurch St. Station',
    color: 'black',
    divider: true,
    header: true
  },
  {
    title: 'Leicester Square',
    color: 0xFFFF00,
    divider: true,
    header: true
  },
  {
    title: 'Coventry Street',
    color: 0xFFFF00,
    divider: true,
    header: true
  },
  {
    title: 'Water Works',
    color: 'white',
    divider: true,
    header: true
  },
  {
    title: 'Piccadilly',
    color: 0xFFFF00,
    divider: false,
    header: true
  },
  {
    title: 'Regent Street',
    color: 0x1FB26B,
    divider: true,
    header: true
  },
  {
    title: 'Oxford Street',
    color: 0x1FB26B,
    divider: true,
    header: true
  },
  {
    title: 'Community Chest',
    color: 0xD4FCDA,
    divider: true,
    header: false
  },
  {
    title: 'Bond Street',
    color: 0x1FB26B,
    divider: true,
    header: true
  },
  {
    title: 'Liverpool St. Station',
    color: 'black',
    divider: true,
    header: true
  },
  {
    title: 'Chance',
    color: 0xD4FCDA,
    divider: true,
    header: false
  },
  {
    title: 'Park Lane',
    color: 0x4D7ABD,
    divider: true,
    header: true
  },
  {
    title: 'Luxury Tax',
    color: 0xD4FCDA,
    divider: true,
    header: false
  },
  {
    title: 'Mayfair',
    color: 0x4D7ABD,
    divider: false,
    header: true
  }
];

const boardMaterial = new THREE.MeshStandardMaterial({ color: 0xD4FCDA });
const boardGeometry = new THREE.BoxGeometry(boardSize, 0.02, boardSize);

const lineMaterial = new THREE.MeshStandardMaterial({ color: 'black' });
const lineGeometry = new THREE.BoxGeometry(boardSize, 0.02, boardSize);

const board = new THREE.Mesh(
  boardGeometry,
  boardMaterial
);
scene.add(board);

const innerBoard = new THREE.Mesh(
  new THREE.BoxGeometry(innerBoardSize, innerBoardSize, 0.02),
  boardMaterial
);
innerBoard.rotation.x = - Math.PI * 0.5;
innerBoard.position.y = 0.02;
scene.add(innerBoard);

const createTile = (i, j) => {
  const tile = new THREE.Group();
  let tileData;
  if (i === 0) {
    if (j < numRowTiles) {
      tileData = tiles[j];
    } else {
      tileData = tiles[j + numRowTiles];
    }
  } else {
    if (j < numRowTiles) {
      tileData = tiles[j + numRowTiles];
    } else {
      tileData = tiles[j + numRowTiles * 2];
    }
  }
  const material = new THREE.MeshStandardMaterial({
    color: tileData.color,
  });
  const header = new THREE.Mesh(boardGeometry, material);
  const body = new THREE.Mesh(boardGeometry, boardMaterial);

  const widthScale = scale / numRowTiles;
  const heightScale = (1 - scale) / 2;
  const headerRatio = 0.2;
  const headerHeightScale = heightScale * headerRatio;
  const bodyHeightScale = heightScale * (1 -  headerRatio);

  const width = widthScale * boardSize;
  const height = heightScale * boardSize;
  const headerHeight = headerHeightScale * boardSize;
  const bodyHeight = bodyHeightScale * boardSize;

  const distanceToTile = boardSize / 2 - height / 2;
  const distanceToHeader = boardSize / 2 - bodyHeight - headerHeight / 2;
  const distanceToBody = boardSize / 2 - bodyHeight / 2;
  const distanceToEdge = innerBoardSize / 2 - width / 2;

  const positiveHorizontalPosition = -distanceToEdge + width * j;
  const negativeHorizontalPosition = distanceToEdge - width * (j - numRowTiles);

  if (i === 0) {
    if (tileData.divider) {
      const tileDivider = new THREE.Mesh(lineGeometry, lineMaterial);
      tileDivider.scale.set(0.002, 1, heightScale);
      if (j < numRowTiles) {
        tileDivider.position.set(positiveHorizontalPosition + width / 2, 0.04, -distanceToTile);
      } else {
        tileDivider.position.set(negativeHorizontalPosition - width / 2, 0.04, distanceToTile);
      }
      tile.add(tileDivider);
    }
    if (tileData.header) {
      const headerDivider = new THREE.Mesh(lineGeometry, lineMaterial);
      headerDivider.scale.set(widthScale, 1, 0.002);
      if (j < numRowTiles) {
        headerDivider.position.set(positiveHorizontalPosition, 0.04, -distanceToHeader - headerHeight / 2);
      } else {
        headerDivider.position.set(negativeHorizontalPosition, 0.04, distanceToHeader + headerHeight / 2);
      }
      tile.add(headerDivider);
    }
    header.scale.set(widthScale, 1, headerHeightScale);
    body.scale.set(widthScale, 1, bodyHeightScale);
    if (j < numRowTiles) {
      header.position.set(positiveHorizontalPosition, 0.02, -distanceToHeader);
      body.position.set(positiveHorizontalPosition, 0.02, -distanceToBody);
    } else {
      material.color.set(tiles[j + numRowTiles].color);
      header.position.set(negativeHorizontalPosition, 0.02, distanceToHeader);
      body.position.set(negativeHorizontalPosition, 0.02, distanceToBody);
    }
  } else {
    if (tileData.divider) {
      const tileDivider = new THREE.Mesh(lineGeometry, lineMaterial);
      tileDivider.scale.set(heightScale, 1, 0.002);
      if (j < numRowTiles) {
        tileDivider.position.set(distanceToTile, 0.04, positiveHorizontalPosition + width / 2);
      } else {
        tileDivider.position.set(-distanceToTile, 0.04, negativeHorizontalPosition - width / 2);
      }
      tile.add(tileDivider);
    }
    if (tileData.header) {
      const headerDivider = new THREE.Mesh(lineGeometry, lineMaterial);
      headerDivider.scale.set(0.002, 1, widthScale);
      if (j < numRowTiles) {
        headerDivider.position.set(distanceToHeader + headerHeight / 2, 0.04, positiveHorizontalPosition);
      } else {
        headerDivider.position.set(-distanceToHeader - headerHeight / 2, 0.04, negativeHorizontalPosition);
      }
      tile.add(headerDivider);
    }
    header.scale.set(headerHeightScale,  1, widthScale);
    body.scale.set(bodyHeightScale,  1, widthScale);
    if (j < numRowTiles) {
      material.color.set(tiles[j + numRowTiles].color);
      header.position.set(distanceToHeader, 0.02, positiveHorizontalPosition);
      body.position.set(distanceToBody, 0.02, positiveHorizontalPosition);
    } else {
      material.color.set(tiles[j + numRowTiles * 2].color);
      header.position.set(-distanceToHeader, 0.02, negativeHorizontalPosition);
      body.position.set(-distanceToBody, 0.02, negativeHorizontalPosition);
    }
  }

  tile.add(header, body);

  return tile;
};


fontLoader.load('../../fonts/Josefin Sans_Regular.json', (font) => {
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < numRowTiles * 2; j++) {
      const tile = createTile(i, j, font);
      
      scene.add(tile);
    }
  }
});

const line1 = new THREE.Mesh(lineGeometry, lineMaterial);
const line2 = new THREE.Mesh(lineGeometry, lineMaterial);
const line3 = new THREE.Mesh(lineGeometry, lineMaterial);
const line4 = new THREE.Mesh(lineGeometry, lineMaterial);
const border1 = new THREE.Mesh(lineGeometry, lineMaterial);
const border2 = new THREE.Mesh(lineGeometry, lineMaterial);
const border3 = new THREE.Mesh(lineGeometry, lineMaterial);
const border4 = new THREE.Mesh(lineGeometry, lineMaterial);

line1.scale.set(0.002, 1, 1);
line2.scale.set(1, 1, 0.002);
line3.scale.set(0.002, 1, 1);
line4.scale.set(1, 1, 0.002);
border1.scale.set(0.002, 3, 1);
border2.scale.set(1.004, 3, 0.002);
border3.scale.set(0.002, 3, 1);
border4.scale.set(1.004, 3, 0.002);
line1.position.set(-innerBoardSize / 2, 0.04, 0);
line2.position.set(0, 0.04, -innerBoardSize / 2);
line3.position.set(innerBoardSize / 2, 0.04, 0);
line4.position.set(0, 0.04, innerBoardSize / 2);
border1.position.set(-boardSize / 2 - 0.01, 0.02, 0);
border2.position.set(0, 0.02, -boardSize / 2 - 0.01);
border3.position.set(boardSize / 2 + 0.01, 0.02, 0);
border4.position.set(0, 0.02, boardSize / 2 + 0.01);

scene.add(line1, line2, line3, line4, border1, border2, border3, border4);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.position.set(0, 5, 0);
scene.add(directionalLight);

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
// controls.target;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () =>
{

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
