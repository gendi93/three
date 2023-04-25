import * as THREE from 'three';
import { mapNames } from './config';

const textureLoader = new THREE.TextureLoader();

export const tileMapGenerator = () => {
  const maps = [];

  mapNames.forEach((name) => {
    const map = textureLoader.load(`/textures/monopoly/${name}.png`);
    maps.push(map);
    maps.minFilter = THREE.NearestFilter;
    maps.magFilter = THREE.NearestFilter;
  });

  return maps;
};

export const cornerMapGenerator = () => {
  const goTexture = textureLoader.load('/textures/monopoly/go.png');
  const jailTexture = textureLoader.load('/textures/monopoly/go.png');
  const parkingTexture = textureLoader.load('/textures/monopoly/go.png');
  const arrestTexture = textureLoader.load('/textures/monopoly/go.png');

  goTexture.center = new THREE.Vector2(0.5, 0.5);
  goTexture.rotation = -Math.PI / 2;
  jailTexture.center = new THREE.Vector2(0.5, 0.5);
  jailTexture.rotation = Math.PI;
  parkingTexture.center = new THREE.Vector2(0.5, 0.5);
  parkingTexture.rotation = Math.PI / 2;

  return { goTexture, jailTexture, parkingTexture, arrestTexture };
};
