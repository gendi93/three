
import { BOARD_LENGTH, JAIL_POSITION } from './assets/Map';
import { BANK, Monopoly } from './Monopoly';
import { PropertyTile } from './tiles/PropertyTile';
import { ActionTile } from './tiles/ActionTile';
import { ActionType, PropertyType, TileType } from './tiles/tiles.types';
import { Tile } from './tiles';
import { DiceRoll } from './types';

import { tiles } from '../../config';

export type PlayerProps = {
  name: string,
  piece: any,
};

export class Player {
  name: string;
  piece: any;
  game: Monopoly;
  money: number;
  position: number;
  properties: PropertyTile[];
  completedSets: string[];
  previousRoll: DiceRoll;
  jailTerm: number;
  doublesCounter: number;
  getOutOfJailFreeCardCount: number;
  isActive: boolean;

  constructor(name: string, piece: any, game: Monopoly) {
    this.name = name;
    this.piece = piece;
    this.game = game;

    this.isActive = true;
    this.money = 1500;
    this.position = 0;
    this.properties = [];
    this.completedSets = [];
    this.previousRoll = {
      doubles: false,
      total: 0,
      values: [0, 0]
    }
    this.jailTerm = 0;
    this.doublesCounter = 0;
    this.getOutOfJailFreeCardCount = 2;
  }

  gainGetOutOfJailFreeCard = () => {
    this.getOutOfJailFreeCardCount++;
  }
  
  useGetOutOfJailFreeCard = () => {
    this.getOutOfJailFreeCardCount--;
    this.resetJailTerm();
  }

  arrest = (): void => {
    this.jailTerm = 3;
    this.resetDoublesCounter();
    this.moveTo(JAIL_POSITION);
  }

  pay = (amount: number, recipient = BANK): void => {
    this.money -= amount;
    recipient.money += amount;
  }

  receive = (amount: number, sender = BANK): void => {
    this.money += amount;
    sender.money -= amount;
  }

  isJailed = (): boolean => {
    return this.jailTerm > 0;
  }

  reduceJailTerm = (): void => {
    if (this.jailTerm > 0) this.jailTerm--;
  }

  resetJailTerm = (): void => {
    this.jailTerm = 0;
  }

  incrementDoublesCounter = (): void => {
    this.doublesCounter++;
  }

  resetDoublesCounter = (): void => {
    this.doublesCounter = 0;
  }

  resolveTile = (tile: Tile): void => {
    const { type } = tile;
    switch(type) {
      case TileType.Basic:
        console.log(`${this.name} arrived at ${tile.name}, ${tile.description}`)
        break;
      case TileType.Action:
        const { actionType, action } = tile as ActionTile;
        if (
          actionType === ActionType.Go
          || actionType === ActionType.Arrest
          || actionType === ActionType.Tax
        ) {
          action(this);
        } else if (actionType === ActionType.Chance) {
          action(this);
        } else if (actionType === ActionType.Community) {
          action(this);
        }
        break;
      case TileType.Property:
        this.resolveProperty(tile as PropertyTile);
        break;
      default:
        break;
    }
    if (!this.doublesCounter) this.game.incrementTurn();
  }

  resolveProperty = (tile: PropertyTile, modifier = 1) => {
    const { name, owner } = tile;
    console.log(`${this.name} arrived at ${name} owned by ${owner?.name || 'nobody'}`);

    if (!owner) {
      this.resolvePurchase(tile);
    } else if (owner.name !== this.name) {
      this.resolvePayment(tile, modifier);
    }
  }

  resolvePurchase = (tile: PropertyTile): void => {
    tile.purchase(this);

    const tilesInSet = this.game.map
      .filter(tile => tile.type === TileType.Property)
      .filter(propertyTile => (propertyTile as PropertyTile).color === tile.color) as PropertyTile[];

    const setOwners = new Set([...tilesInSet.map(tile => tile.owner)]);

    if (setOwners.size === 1 && setOwners.has(this)) {
      console.log(`${this.name} has completed a set of properties!`);
      this.completedSets.push(tile.color);
    }
  }

  resolvePayment = (tile: PropertyTile, modifier: number): void => {
    tile.collectRent(this, modifier);
  }

  buyHouse = (property: PropertyTile) => {
    if (property.houses === 5) {
      console.log('Build capacity for this property has been reached');
      return;
    }
    const mortagagedPropertiesInSet = this.properties.filter(propertyTile => propertyTile.color === property.color && propertyTile.isMortgaged);
    if (mortagagedPropertiesInSet.length) {
      console.log('Cannot build on a mortgaged set');
      return;
    }
    console.log(`${this.name} built a ${property.houses === 4 ? 'hotel' : 'house'} at ${property.name}`);
    property.houses++;
    this.money -= property.houseCost;
  }

  placeBid = (highestBid: number, highestBidder: Player | null, originalCost: number) => {
    const response = window.confirm(`${this.name}, want to outbid ${highestBidder?.name}?\nHighest bid: £${highestBid}\nOriginal asking price: £${originalCost}`);
    if (response) {
      let bid = window.prompt(`${this.name}, enter your bid!\nHighest bid: £${highestBid}\nOriginal asking price: £${originalCost}`, (highestBid + 10).toString());
      while (parseInt(bid || '') <= highestBid) {
        bid = window.prompt(`${this.name}, enter your bid!\nHighest bid: £${highestBid}\nOriginal asking price: £${originalCost}`, (highestBid + 10).toString());
      }

      console.log(`${this.name} is now the highest bidder`);

      return parseInt(bid || '');
    }

    console.log(`${this.name} has quit the auction`);
    return null;
  }

  getTotalWorth = (): number => {
    let worth = this.money;

    this.properties.forEach(property => {
      worth += property.cost / 2;
      if (property.propertyType === PropertyType.Building) {
        const { houses, houseCost } = property;
        worth += houses * houseCost / 2;
      }
    });

    return worth;
  }

  takeTurn = (roll: DiceRoll): void => {
    const { doubles, total } = roll;

    this.previousRoll = roll;

    if (this.isJailed()) {
      if (doubles) {
        console.log(`${this.name} rolled a double and got out of jail!`)
        this.resetJailTerm();
        this.move(total);
      } else {
        console.log(`${this.name}'s jail term reduced`)
        this.reduceJailTerm();
      }
    } else {
      if (doubles) {
        console.log(`${this.name} rolled a double!`)
        this.incrementDoublesCounter();
        if (this.doublesCounter === 3) {
          console.log(`${this.name}'s speeding sends them to jail!`)
          this.arrest();
        }
      } else {
        this.resetDoublesCounter();
      }
    }

    if (!this.jailTerm) {
      console.log(`${this.name} advances ${total} steps`);
      this.move(total);
    }
  }

  move = (value: number): void => {
    const newPosition = (this.position + value) % BOARD_LENGTH;
    if (newPosition < this.position) {
      this.receive(200);
      console.log(this.name, 'receives £200 salary')
    }

    this.moveTo(newPosition);
  }

  moveTo = (position: number): void => {
    this.position = position;
    this.piece.position.set(...tiles[position].position);
  }
}
