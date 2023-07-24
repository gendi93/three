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
const auctionButton = document.querySelector('#auction') as HTMLButtonElement;

const actionModal = document.querySelector('#actionModal') as HTMLDivElement;
const actionButton = document.querySelector('#action') as HTMLButtonElement;

const biddingModal = document.querySelector('#biddingModal') as HTMLDivElement;
const auctionDescription = document.querySelector('#auctionDescription') as HTMLDivElement;
const highestBidElement = document.querySelector('#highestBid') as HTMLInputElement;
const currentBidElement = document.querySelector('#currentBid') as HTMLInputElement;
const bid1Button = document.querySelector('#bid1') as HTMLButtonElement;
const bid10Button = document.querySelector('#bid10') as HTMLButtonElement;
const bid100Button = document.querySelector('#bid100') as HTMLButtonElement;
const withdrawButton = document.querySelector('#withdraw') as HTMLButtonElement;

export class Monopoly {
  players: Player[];
  properties: PropertyTile[];
  map: Tile[];
  turn: number;
  communityCards: Card[];
  chanceCards: Card[];
  communityPile: number;
  scene: THREE.Scene;
  playerBids: { player: Player; bid: number; isWithdrawn: boolean }[];
  bidderIndex: number;

  constructor() {
    this.players = [];
    this.properties = [];
    this.map = [];
    this.turn = 0;
    this.communityCards = [];
    this.chanceCards = [];
    this.communityPile = 0;
    this.bidderIndex = 0;
  }

  awaitBid = () => {
    const currentBidder = this.playerBids[this.bidderIndex % this.playerBids.length];

    if (currentBidder.isWithdrawn) return;

    const { player, bid } = currentBidder;

    currentBidElement.innerText = `${player.name}'s bid: £${bid}`;

    return new Promise((resolve) => {
      bid1Button.onclick = () => this.placeBid(1, resolve);
      bid10Button.onclick = () => this.placeBid(10, resolve);
      bid100Button.onclick = () => this.placeBid(100, resolve);
      withdrawButton.onclick = () => this.withdraw(resolve);
    });
  };

  placeBid = (amount: number, resolve: any) => {
    let highestBid = this.playerBids
      .map((bidder) => bidder.bid)
      .reduce((prev, cur) => Math.max(prev, cur));

    if (highestBid === 0) highestBid = 10;

    this.playerBids[this.bidderIndex % this.playerBids.length].bid = highestBid + amount;
    this.bidderIndex++;

    highestBidElement.textContent = `Highest bid: £${highestBid + amount}`;

    resolve();
  };

  withdraw = (resolve: any) => {
    this.playerBids[this.bidderIndex % this.playerBids.length].isWithdrawn = true;
    this.bidderIndex++;
    resolve();
  };

  initiateAuction = async () => {
    biddingModal.style.display = 'grid';

    const currentPlayer = this.getCurrentPlayer();
    const tile = this.map[currentPlayer.position] as PropertyTile;
    const { name, cost } = tile;

    auctionDescription.textContent = `Auction for ${name}. Original price: £${cost}`;

    const startingBid = 10;

    highestBidElement.textContent = `Starting bid: £${startingBid}`;

    this.playerBids = this.players.map((player) => ({ player, bid: 0, isWithdrawn: false }));

    while (this.playerBids.filter((bidder) => !bidder.isWithdrawn).length > 1) {
      await this.awaitBid();
    }

    biddingModal.style.display = 'none';
    const winner = this.playerBids.find((bidder) => !bidder.isWithdrawn) as {
      player: Player;
      bid: number;
      isWithdrawn: boolean;
    };

    winner.player.resolvePurchase(tile, winner.bid);
    if (!currentPlayer.doublesCounter) this.incrementTurn();
  };

  displayCard = (key: string, onClick: () => void): void => {
    const player = this.getCurrentPlayer();
    const tile = this.map[player.position];

    if (tile.type === TileType.Property) {
      purchaseModal.style.display = 'grid';
      purchaseButton.onclick = onClick;
      auctionButton.onclick = this.initiateAuction;
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
      if ((tile as ActionTile).actionType === ActionType.Community)
        deedCard.rotation.z = (-3 * Math.PI) / 4;
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

  getCurrentPlayer = () => {
    return this.players[this.turn % this.players.length];
  };

  incrementTurn = (): void => {
    const currentPlayer = this.getCurrentPlayer();
    console.log(`${currentPlayer.name} ended their turn.`);
    this.turn++;
  };

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

  tileGenerator = (tileMap: TileData[]): Tile[] => {
    const map = tileMap.map((tileData) => {
      const { type, data } = tileData;

      if (type === TileType.Action) return new ActionTile(data as ActionTileData);
      if (type === TileType.Property) return new PropertyTile(data as PropertyTileData);

      return new BasicTile(data as BasicTileData);
    });

    return map;
  };

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
    this.playerBids = this.players.map((player) => ({ player, bid: 0, isWithdrawn: false }));

    const player = this.getCurrentPlayer();
    playerId.textContent = `Player: ${player.name}`;
    if (player.name === 'Red') playerId.style.color = 'red';
    else playerId.style.color = 'blue';
    money.textContent = `funds: £${player.money}`;
  };

  getActivePlayers = (): Player[] => {
    return this.players.filter((player) => player.isActive);
  };
}
