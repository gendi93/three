import { Monopoly } from './Monopoly';
import { Tile } from './tiles';
import { DiceRoll } from './types';

export const generateDiceRoll = (): number => {
  return Math.ceil(Math.random() * 6);
};

export const rollDice = (): DiceRoll => {
  const diceOneRoll = generateDiceRoll();
  const diceTwoRoll = generateDiceRoll();
  const doubles = diceOneRoll === diceTwoRoll;

  return {
    doubles,
    total: diceOneRoll + diceTwoRoll,
    values: [diceOneRoll, diceTwoRoll]
  };
};

export const getTile = (game: Monopoly, position: number): Tile => {
  return game.map[position];
};
