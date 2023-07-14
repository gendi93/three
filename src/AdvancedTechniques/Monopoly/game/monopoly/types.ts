import { Vector3 } from 'three';

export enum PieceType {
  Iron = 'Iron',
  Boot = 'Boot',
  Battleship = 'Battleship',
  TopHat = 'Top hat',
  RaceCar = 'Race car',
  Thimble = 'Thimble'
}

export enum Direction {
  Forward = 'forward',
  Backward = 'backward'
}

export const PIECE_OPTIONS = [
  PieceType.Iron,
  PieceType.Boot,
  PieceType.Battleship,
  PieceType.TopHat,
  PieceType.RaceCar,
  PieceType.Thimble
];

export type DiceRoll = {
  doubles: boolean;
  total: number;
  values: number[];
};

export type ResolutionOptions = {
  modifier?: number;
  endTurn?: boolean;
  direction?: Direction;
};

export type IntermediatePosition = {
  intermediatePosition: number;
  intermediateCoordinates: Vector3;
};
