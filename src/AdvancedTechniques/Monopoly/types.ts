import * as CANNON from 'cannon-es';

type Die = {
  mesh: THREE.Mesh;
  body: CANNON.Body;
};

export type Dice = Die[];
