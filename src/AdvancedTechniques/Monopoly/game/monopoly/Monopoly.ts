import { Player, PlayerProps } from './Player';
import { TILE_MAP, PropertyTileData, TileData, BasicTileData, ActionTileData } from './assets/Map';
import { Bank } from './Bank';
import { Tile, BasicTile, PropertyTile, ActionTile } from './tiles';
import { TileType } from './tiles/tiles.types';
import { rollDice } from './helpers';

export const BANK = new Bank();

export class Monopoly {
  // static players: Player[];
  // static properties: PropertyTile[];
  // static map: Tile[];
  // static turn: number;
  players: Player[];
  properties: PropertyTile[];
  map: Tile[];
  turn: number;
  communityCards: ActionTile[];
  chanceCards: ActionTile[];
  communityPile: number;

  constructor() {
    // Monopoly.players = [];
    // Monopoly.properties = [];
    // Monopoly.map = [];
    // Monopoly.turn = 0;
    this.players = [];
    this.properties = [];
    this.map = [];
    this.turn = 0;
    this.communityCards = [];
    this.chanceCards = [];
    this.communityPile = 0;
  }

  // static getCurrentPlayer = () => {
  //   return Monopoly.players[Monopoly.turn % Monopoly.players.length];
  // }

  getCurrentPlayer = () => {
    // return Monopoly.players[Monopoly.turn % Monopoly.players.length];
    return this.players[this.turn % this.players.length];
  };

  // static incrementTurn = (): void => {
  //   Monopoly.turn++;
  // }

  incrementTurn = (): void => {
    const currentPlayer = this.getCurrentPlayer();
    console.log(`${currentPlayer.name} ended their turn.`);
    this.turn++;
  };

  // static setPlayerOrder = (playerData: PlayerProps[]): Player[] => {
  //   const players = [] as Player[];
  //   const playerRolls = [] as {player: Player, value: number}[];

  //   playerData.forEach((data: PlayerProps) => {
  //     const { name, piece } = data;
  //     const player = new Player(name, piece);
  //     players.push(player);
  //   });

  //   // TODO: Redo if rolls are equal
  //   players.forEach(player => {
  //     playerRolls.push({player, value: rollDice().total});
  //   })

  //   const playersInOrder = playerRolls
  //     .sort((prevRoll, curRoll) => curRoll.value - prevRoll.value)
  //     .map(roll => roll.player);

  //   return playersInOrder;
  // }

  setPlayerOrder = (playerData: PlayerProps[]): Player[] => {
    const players = [] as Player[];
    const playerRolls = [] as { player: Player; value: number }[];

    playerData.forEach((data: PlayerProps) => {
      const { name, piece } = data;
      const player = new Player(name, piece, this);
      players.push(player);
    });

    // TODO: Redo if rolls are equal
    players.forEach((player) => {
      playerRolls.push({ player, value: rollDice().total });
    });

    const playersInOrder = playerRolls
      .sort((prevRoll, curRoll) => curRoll.value - prevRoll.value)
      .map((roll) => roll.player);

    return playersInOrder;
  };

  // static tileGenerator = (tileMap: TileData[]): Tile[] => {
  //   const map = tileMap.map(tileData => {
  //     const { type, data } = tileData;

  //     if (type === TileType.Action) return new ActionTile(data as ActionTileData);
  //     if (type === TileType.Property) return new PropertyTile(data as PropertyTileData);

  //     return new BasicTile(data as BasicTileData);
  //   });

  //   return map;
  // }

  tileGenerator = (tileMap: TileData[]): Tile[] => {
    const map = tileMap.map((tileData) => {
      const { type, data } = tileData;

      if (type === TileType.Action) return new ActionTile(data as ActionTileData);
      if (type === TileType.Property) return new PropertyTile(data as PropertyTileData);

      return new BasicTile(data as BasicTileData);
    });

    return map;
  };

  // public static initializeGame = (playerData: PlayerProps[]): void => {
  //   this.players = this.setPlayerOrder(playerData);
  //   this.map = this.tileGenerator(TILE_MAP);
  //   this.properties = this.map.filter(tile => tile.type === TileType.Property) as PropertyTile[];
  //   this.turn = 0;
  // }

  public initializeGame = (playerData: PlayerProps[]): void => {
    this.players = this.setPlayerOrder(playerData);
    this.map = this.tileGenerator(TILE_MAP);
    this.properties = this.map.filter((tile) => tile.type === TileType.Property) as PropertyTile[];
    this.turn = 0;
  };

  // public static getActivePlayers = (): Player[] => {
  //   return this.players.filter(player => player.isActive);
  // }

  getActivePlayers = (): Player[] => {
    return this.players.filter((player) => player.isActive);
  };
}
