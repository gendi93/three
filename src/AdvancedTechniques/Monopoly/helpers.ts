import * as THREE from 'three';
import { tiles, chanceNames, communityNames, deedNames } from './config';

const textureLoader = new THREE.TextureLoader();
type Map = THREE.Texture;
type Maps = Map[];
export type CardData = { name: string; maps: Maps };
type CardMaps = { chance: CardData[]; community: CardData[]; deed: CardData[] };

export const tileMapGenerator: () => Maps = () => {
  const maps: Maps = [];

  tiles.forEach((config) => {
    const map = textureLoader.load(`/textures/monopoly/tiles/${config.name}.png`);

    map.generateMipmaps = false;
    map.minFilter = THREE.NearestFilter;
    map.magFilter = THREE.NearestFilter;

    maps.push(map);
  });

  return maps;
};

export const cornerMapGenerator = () => {
  const goTexture = textureLoader.load('/textures/monopoly/tiles/go.png');
  const jailTexture = textureLoader.load('/textures/monopoly/tiles/jail.png');
  const parkingTexture = textureLoader.load('/textures/monopoly/tiles/parking.png');
  const arrestTexture = textureLoader.load('/textures/monopoly/tiles/arrest.png');

  goTexture.center = new THREE.Vector2(0.5, 0.5);
  goTexture.rotation = -Math.PI / 2;
  goTexture.generateMipmaps = false;
  goTexture.minFilter = THREE.NearestFilter;
  goTexture.magFilter = THREE.NearestFilter;
  jailTexture.center = new THREE.Vector2(0.5, 0.5);
  jailTexture.rotation = Math.PI;
  jailTexture.generateMipmaps = false;
  jailTexture.minFilter = THREE.NearestFilter;
  jailTexture.magFilter = THREE.NearestFilter;
  parkingTexture.center = new THREE.Vector2(0.5, 0.5);
  parkingTexture.rotation = Math.PI / 2;
  parkingTexture.generateMipmaps = false;
  parkingTexture.minFilter = THREE.NearestFilter;
  parkingTexture.magFilter = THREE.NearestFilter;

  return { goTexture, jailTexture, parkingTexture, arrestTexture };
};

export const cardMapGenerator: () => CardMaps = () => {
  const maps: CardMaps = {
    chance: [],
    community: [],
    deed: []
  };

  chanceNames.forEach((name) => {
    const map1 = textureLoader.load(`/textures/monopoly/cards/chance/${name}.png`);
    const map2 = textureLoader.load('/textures/monopoly/cards/chance/chance.png');

    map1.generateMipmaps = false;
    map2.generateMipmaps = false;
    map1.minFilter = THREE.NearestFilter;
    map1.magFilter = THREE.NearestFilter;
    map2.minFilter = THREE.NearestFilter;
    map2.magFilter = THREE.NearestFilter;

    maps.chance.push({ name, maps: [map1, map2] });
  });

  communityNames.forEach((name) => {
    const map1 = textureLoader.load(`/textures/monopoly/cards/community/${name}.png`);
    const map2 = textureLoader.load('/textures/monopoly/cards/community/community.png');

    map1.generateMipmaps = false;
    map2.generateMipmaps = false;
    map1.minFilter = THREE.NearestFilter;
    map1.magFilter = THREE.NearestFilter;
    map2.minFilter = THREE.NearestFilter;
    map2.magFilter = THREE.NearestFilter;

    maps.community.push({ name, maps: [map1, map2] });
  });

  deedNames.forEach((name) => {
    const map1 = textureLoader.load(`/textures/monopoly/cards/deed/${name}Mortgage.png`);
    const map2 = textureLoader.load(`/textures/monopoly/cards/deed/${name}.png`);

    map1.center = new THREE.Vector2(0.5, 0.5);
    map1.rotation = Math.PI / 2;
    map2.center = new THREE.Vector2(0.5, 0.5);
    map2.rotation = -Math.PI / 2;
    map1.generateMipmaps = false;
    map2.generateMipmaps = false;
    map1.minFilter = THREE.NearestFilter;
    map1.magFilter = THREE.NearestFilter;
    map2.minFilter = THREE.NearestFilter;
    map2.magFilter = THREE.NearestFilter;

    maps.deed.push({ name, maps: [map1, map2] });
  });

  maps.chance = shuffle(maps.chance);
  maps.community = shuffle(maps.community);

  return maps;
};

export const diceMapsGenerator: () => Map[] = () => {
  const maps: Map[] = [];

  [1, 2, 3, 4, 5, 6].forEach((num) => {
    const map = textureLoader.load(`/textures/monopoly/dice/${num}.png`);

    map.generateMipmaps = false;
    map.minFilter = THREE.NearestFilter;
    map.magFilter = THREE.NearestFilter;

    maps.push(map);
  });

  return maps;
};

export const shuffle = (array: any) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};
