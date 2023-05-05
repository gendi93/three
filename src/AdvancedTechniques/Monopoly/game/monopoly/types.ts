export enum PieceType {
  Iron = 'Iron',
  Boot = 'Boot',
  Battleship = 'Battleship',
  TopHat = 'Top hat',
  RaceCar = 'Race car',
  Thimble = 'Thimble',
}

export const PIECE_OPTIONS = [PieceType.Iron, PieceType.Boot, PieceType.Battleship, PieceType.TopHat, PieceType.RaceCar, PieceType.Thimble];

export type DiceRoll = {
  doubles: boolean,
  total: number,
  values: number[],
}
