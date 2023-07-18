const boardSize = 10;
const innerBoardScale = 0.728;
// const cardHeightScale = 0.168144;
// const cardWidthScale = 0.1;
const innerBoardSize = boardSize * innerBoardScale;
const numRowTiles = 9;

const widthScale = innerBoardScale / numRowTiles;
const heightScale = (1 - innerBoardScale) / 2;

const width = widthScale * boardSize;
const height = heightScale * boardSize;

const distanceToTile = boardSize / 2 - height / 2;
const distanceToEdge = innerBoardSize / 2 - width / 2;
const distanceToCorner = boardSize / 2 - (boardSize * (1 - innerBoardScale)) / 2 / 2;

export const PlayerPositions = {
  2: ['e', 'w'],
  3: ['n', 'e', 'w'],
  4: ['n', 'e', 's', 'w'],
  5: ['n', 'ne', 'e', 'nw', 'w'],
  6: ['n', 'ne', 'e', 'nw', 'w', 's'],
  7: ['n', 'ne', 'e', 'nw', 'w', 'sw', 's'],
  8: ['n', 'ne', 'e', 'nw', 'w', 'sw', 's', 'se']
};

export const tiles = [
  {
    name: 'go',
    position: [distanceToCorner, 0.02, distanceToCorner],
    scale: [(1 - innerBoardScale) / 2, 1, (1 - innerBoardScale) / 2],
    rotation: [0, Math.PI / 2, 0]
  },
  {
    name: 'oldKentRoad',
    position: [distanceToEdge, 0.02, distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, 0]
  },
  {
    name: 'communityChest',
    position: [distanceToEdge - width, 0.02, distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, 0]
  },
  {
    name: 'whitechapelRoad',
    position: [distanceToEdge - 2 * width, 0.02, distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, 0]
  },
  {
    name: 'incomeTax',
    position: [distanceToEdge - 3 * width, 0.02, distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, 0]
  },
  {
    name: 'kingsCross',
    position: [distanceToEdge - 4 * width, 0.02, distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, 0]
  },
  {
    name: 'islington',
    position: [distanceToEdge - 5 * width, 0.02, distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, 0]
  },
  {
    name: 'chanceOrange',
    position: [distanceToEdge - 6 * width, 0.02, distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, 0]
  },
  {
    name: 'eustonRoad',
    position: [distanceToEdge - 7 * width, 0.02, distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, 0]
  },
  {
    name: 'pentonvilleRoad',
    position: [distanceToEdge - 8 * width, 0.02, distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, 0]
  },
  {
    name: 'jail',
    position: [-distanceToCorner, 0.02, distanceToCorner],
    scale: [(1 - innerBoardScale) / 2, 1, (1 - innerBoardScale) / 2],
    rotation: [0, 0, 0]
  },
  {
    name: 'pallMall',
    position: [-distanceToTile, 0.02, distanceToEdge],
    scale: [widthScale, 1, heightScale],
    rotation: [0, (3 * Math.PI) / 2, 0]
  },
  {
    name: 'electricCompany',
    position: [-distanceToTile, 0.02, distanceToEdge - width],
    scale: [widthScale, 1, heightScale],
    rotation: [0, (3 * Math.PI) / 2, 0]
  },
  {
    name: 'whitehall',
    position: [-distanceToTile, 0.02, distanceToEdge - 2 * width],
    scale: [widthScale, 1, heightScale],
    rotation: [0, (3 * Math.PI) / 2, 0]
  },
  {
    name: 'northumberlandAvenue',
    position: [-distanceToTile, 0.02, distanceToEdge - 3 * width],
    scale: [widthScale, 1, heightScale],
    rotation: [0, (3 * Math.PI) / 2, 0]
  },
  {
    name: 'marylebone',
    position: [-distanceToTile, 0.02, distanceToEdge - 4 * width],
    scale: [widthScale, 1, heightScale],
    rotation: [0, (3 * Math.PI) / 2, 0]
  },
  {
    name: 'bowStreet',
    position: [-distanceToTile, 0.02, distanceToEdge - 5 * width],
    scale: [widthScale, 1, heightScale],
    rotation: [0, (3 * Math.PI) / 2, 0]
  },
  {
    name: 'chanceRed',
    position: [-distanceToTile, 0.02, distanceToEdge - 6 * width],
    scale: [widthScale, 1, heightScale],
    rotation: [0, (3 * Math.PI) / 2, 0]
  },
  {
    name: 'marlboroughStreet',
    position: [-distanceToTile, 0.02, distanceToEdge - 7 * width],
    scale: [widthScale, 1, heightScale],
    rotation: [0, (3 * Math.PI) / 2, 0]
  },
  {
    name: 'vineStreet',
    position: [-distanceToTile, 0.02, distanceToEdge - 8 * width],
    scale: [widthScale, 1, heightScale],
    rotation: [0, (3 * Math.PI) / 2, 0]
  },
  {
    name: 'parking',
    position: [-distanceToCorner, 0.02, -distanceToCorner],
    scale: [(1 - innerBoardScale) / 2, 1, (1 - innerBoardScale) / 2],
    rotation: [0, -Math.PI / 2, 0]
  },
  {
    name: 'strand',
    position: [-distanceToEdge, 0.02, -distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, Math.PI]
  },
  {
    name: 'chanceBlue',
    position: [-distanceToEdge + width, 0.02, -distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, Math.PI]
  },
  {
    name: 'fleetStreet',
    position: [-distanceToEdge + 2 * width, 0.02, -distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, Math.PI]
  },
  {
    name: 'trafalgarSquare',
    position: [-distanceToEdge + 3 * width, 0.02, -distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, Math.PI]
  },
  {
    name: 'fenchurchSt',
    position: [-distanceToEdge + 4 * width, 0.02, -distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, Math.PI]
  },
  {
    name: 'leicesterSquare',
    position: [-distanceToEdge + 5 * width, 0.02, -distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, Math.PI]
  },
  {
    name: 'coventryStreet',
    position: [-distanceToEdge + 6 * width, 0.02, -distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, Math.PI]
  },
  {
    name: 'waterWorks',
    position: [-distanceToEdge + 7 * width, 0.02, -distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, Math.PI]
  },
  {
    name: 'piccadilly',
    position: [-distanceToEdge + 8 * width, 0.02, -distanceToTile],
    scale: [widthScale, 1, heightScale],
    rotation: [0, 0, Math.PI]
  },
  {
    name: 'arrest',
    position: [distanceToCorner, 0.02, -distanceToCorner],
    scale: [(1 - innerBoardScale) / 2, 1, (1 - innerBoardScale) / 2],
    rotation: [0, Math.PI, 0]
  },
  {
    name: 'regentStreet',
    position: [distanceToTile, 0.02, -distanceToEdge],
    scale: [widthScale, 1, heightScale],
    rotation: [0, Math.PI / 2, 0]
  },
  {
    name: 'oxfordStreet',
    position: [distanceToTile, 0.02, -distanceToEdge + width],
    scale: [widthScale, 1, heightScale],
    rotation: [0, Math.PI / 2, 0]
  },
  {
    name: 'communityChest',
    position: [distanceToTile, 0.02, -distanceToEdge + 2 * width],
    scale: [widthScale, 1, heightScale],
    rotation: [0, Math.PI / 2, 0]
  },
  {
    name: 'bondStreet',
    position: [distanceToTile, 0.02, -distanceToEdge + 3 * width],
    scale: [widthScale, 1, heightScale],
    rotation: [0, Math.PI / 2, 0]
  },
  {
    name: 'liverpoolSt',
    position: [distanceToTile, 0.02, -distanceToEdge + 4 * width],
    scale: [widthScale, 1, heightScale],
    rotation: [0, Math.PI / 2, 0]
  },
  {
    name: 'chanceRed',
    position: [distanceToTile, 0.02, -distanceToEdge + 5 * width],
    scale: [widthScale, 1, heightScale],
    rotation: [0, Math.PI / 2, 0]
  },
  {
    name: 'parkLane',
    position: [distanceToTile, 0.02, -distanceToEdge + 6 * width],
    scale: [widthScale, 1, heightScale],
    rotation: [0, Math.PI / 2, 0]
  },
  {
    name: 'luxuryTax',
    position: [distanceToTile, 0.02, -distanceToEdge + 7 * width],
    scale: [widthScale, 1, heightScale],
    rotation: [0, Math.PI / 2, 0]
  },
  {
    name: 'mayfair',
    position: [distanceToTile, 0.02, -distanceToEdge + 8 * width],
    scale: [widthScale, 1, heightScale],
    rotation: [0, Math.PI / 2, 0]
  }
];

export const chanceNames = [
  'advanceGoChance',
  'advanceTrafalgar',
  'advanceMayfair',
  'advancePallMall',
  'advanceStation1',
  'advanceStation2',
  'advanceUtility',
  'bank',
  'outOfJailChance',
  'back3',
  'jailChance',
  'repairsChance',
  'fine',
  'trip',
  'chairman',
  'collectChance'
];

export const communityNames = [
  'advanceGoCommunity',
  'collectCommunity',
  'doctor',
  'stock',
  'outOfJailCommunity',
  'jailCommunity',
  'holiday',
  'refund',
  'birthday',
  'insurance',
  'hospital',
  'school',
  'receive',
  'repairsCommunity',
  'contest',
  'inheritance'
];

export const deedNames = [
  'oldKentRoad',
  'whitechapelRoad',
  'kingsCrossStation',
  'islington',
  'eustonRoad',
  'pentonvilleRoad',
  'pallMall',
  'electricCompany',
  'whitehall',
  'northumberlandAvenue',
  'maryleboneStation',
  'bowStreet',
  'marlboroughStreet',
  'vineStreet',
  'strand',
  'fleetStreet',
  'trafalgarSquare',
  'fenchurchStreetStation',
  'leicesterSquare',
  'coventryStreet',
  'waterWorks',
  'piccadilly',
  'regentStreet',
  'oxfordStreet',
  'bondStreet',
  'liverpoolStreetStation',
  'parkLane',
  'mayfair'
];
