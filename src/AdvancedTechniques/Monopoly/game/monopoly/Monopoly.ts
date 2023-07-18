import * as THREE from 'three';
import { gsap } from 'gsap';

import { Player, PlayerProps } from './Player';
import { TILE_MAP, PropertyTileData, TileData, BasicTileData, ActionTileData } from './assets/Map';
import { Bank } from './Bank';
import { Tile, BasicTile, PropertyTile, ActionTile } from './tiles';
import { ActionType, TileType } from './tiles/tiles.types';
import { rollDice } from './helpers';
import { PlayerPositions } from '../../config';
import { Card } from './assets/Cards';

export const BANK = new Bank();

const playerId: HTMLElement = document.querySelector('#playerId') || document.createElement('h1');
const money: Element = document.querySelector('#money') || document.createElement('h3');
const purchaseModal = document.querySelector('#purchaseModal') as HTMLDivElement;
const purchaseButton = document.querySelector('#purchase') as HTMLButtonElement;
const actionModal = document.querySelector('#actionModal') as HTMLDivElement;
const actionButton = document.querySelector('#action') as HTMLButtonElement;

export class Monopoly {
  // static players: Player[];
  // static properties: PropertyTile[];
  // static map: Tile[];
  // static turn: number;
  players: Player[];
  properties: PropertyTile[];
  map: Tile[];
  turn: number;
  communityCards: Card[];
  chanceCards: Card[];
  communityPile: number;
  scene: THREE.Scene;

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

  displayCard = (key: string, onClick: () => void): void => {
    const player = this.getCurrentPlayer();
    const tile = this.map[player.position];

    if (tile.type === TileType.Property) {
      purchaseModal.style.display = 'grid';
      purchaseButton.onclick = onClick;
    }
    if (tile.type === TileType.Action) {
      const actionType = (tile as ActionTile).actionType;
      actionModal.style.display = 'grid';
      actionButton.innerText =
        actionType === ActionType.Chance
          ? this.chanceCards[0].buttonText
          : this.communityCards[0].buttonText;
      actionButton.onclick = onClick;
    }

    const deedCard = this.scene.getObjectByName(key) as THREE.Mesh;
    const camera = this.scene.getObjectByName('camera') as THREE.Mesh;

    const oldDeedCardRotation = deedCard.rotation.clone();

    const quaternion = new THREE.Quaternion();
    const oldCameraPosition = camera.position.clone();
    const newCameraPosition = oldCameraPosition.clone().add(new THREE.Vector3(1, 1, 1));
    let cardToCameraVector = newCameraPosition.clone().sub(oldCameraPosition);

    if (tile.type === TileType.Property) {
      quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), cardToCameraVector.normalize());
    } else {
      if ((tile as ActionTile).actionType === ActionType.Community) {
        deedCard.rotation.z = Math.PI;
      }
      quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), cardToCameraVector.normalize());
      cardToCameraVector = oldCameraPosition.clone().sub(newCameraPosition);
    }

    deedCard.applyQuaternion(quaternion);
    const newDeedCardRotation = deedCard.rotation.clone();
    deedCard.rotation.copy(oldDeedCardRotation);

    gsap.to(camera.position, {
      x: camera.position.x + 1,
      y: camera.position.y + 1,
      z: camera.position.z + 1,
      duration: 0.5
    });
    gsap.to(deedCard.position, {
      x: player.piece.position.x + 1,
      y: player.piece.position.y + 1,
      z: player.piece.position.z + 1,
      duration: 0.5
    });
    gsap.to(deedCard.rotation, {
      x: newDeedCardRotation.x,
      y: newDeedCardRotation.y,
      z: newDeedCardRotation.z,
      duration: 0.5
    });
  };

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
    const directions = PlayerPositions[playerData.length];
    playerData.forEach((data: PlayerProps, index) => {
      const { name, piece } = data;
      const player = new Player(name, piece, directions[index], this);
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

  public initializeGame = (
    playerData: PlayerProps[],
    scene: THREE.Scene,
    cards: {
      community: Card[];
      chance: Card[];
    }
  ): void => {
    this.players = this.setPlayerOrder(playerData);
    this.map = this.tileGenerator(TILE_MAP);
    this.properties = this.map.filter((tile) => tile.type === TileType.Property) as PropertyTile[];
    this.turn = 0;
    this.scene = scene;
    this.communityCards = cards.community;
    this.chanceCards = cards.chance;

    const player = this.getCurrentPlayer();
    playerId.textContent = `Player: ${player.name}`;
    if (player.name === 'Red') playerId.style.color = 'red';
    else playerId.style.color = 'blue';
    money.textContent = `funds: £${player.money}`;
  };

  // public static getActivePlayers = (): Player[] => {
  //   return this.players.filter(player => player.isActive);
  // }

  getActivePlayers = (): Player[] => {
    return this.players.filter((player) => player.isActive);
  };
}
