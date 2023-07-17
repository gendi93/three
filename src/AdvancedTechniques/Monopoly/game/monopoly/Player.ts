import { Mesh, Vector3 } from 'three';
import { gsap } from 'gsap';
import { BOARD_LENGTH, JAIL_POSITION } from './assets/Map';
import { BANK, Monopoly } from './Monopoly';
import { PropertyTile } from './tiles/PropertyTile';
import { ActionTile } from './tiles/ActionTile';
import { ActionType, BasicType, PropertyType, TileType } from './tiles/tiles.types';
import { BasicTile, Tile } from './tiles';
import { DiceRoll, ResolutionOptions, IntermediatePosition } from './types';

import { tiles } from '../../config';

const SECONDS_PER_TILE = 0.2;

export type PlayerProps = {
  name: string;
  piece: Mesh;
};

export class Player {
  name: string;
  piece: Mesh;
  direction: string;
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
  isMoving: boolean;

  constructor(name: string, piece: Mesh, direction: string, game: Monopoly) {
    this.name = name;
    this.piece = piece;
    this.direction = direction;
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
    };
    this.jailTerm = 0;
    this.doublesCounter = 0;
    this.getOutOfJailFreeCardCount = 2;
    this.isMoving = false;
  }

  gainGetOutOfJailFreeCard = () => {
    this.getOutOfJailFreeCardCount++;
  };

  useGetOutOfJailFreeCard = () => {
    this.getOutOfJailFreeCardCount--;
    this.resetJailTerm();
  };

  arrest = (): void => {
    this.jailTerm = 3;
    this.resetDoublesCounter();
    this.moveTo(JAIL_POSITION);
  };

  pay = (amount: number, recipient = BANK): void => {
    this.money -= amount;
    recipient.money += amount;
  };

  receive = (amount: number, sender = BANK): void => {
    this.money += amount;
    sender.money -= amount;
  };

  isJailed = (): boolean => {
    return this.jailTerm > 0;
  };

  reduceJailTerm = (): void => {
    if (this.jailTerm > 0) this.jailTerm--;
  };

  resetJailTerm = (): void => {
    this.jailTerm = 0;
  };

  incrementDoublesCounter = (): void => {
    this.doublesCounter++;
  };

  resetDoublesCounter = (): void => {
    this.doublesCounter = 0;
  };

  resolveTile = (tile: Tile, options?: ResolutionOptions): void => {
    const { type } = tile;
    switch (type) {
      case TileType.Basic:
        if (
          (tile as BasicTile).basicType === BasicType.Parking ||
          (!this.isJailed() && (tile as BasicTile).basicType === BasicType.Jail)
        ) {
          console.log(`${this.name} arrived at ${tile.name}, ${tile.description}`);
        }
        if (!this.doublesCounter) this.game.incrementTurn();
        break;
      case TileType.Action: {
        const { actionType, action } = tile as ActionTile;
        if (
          actionType === ActionType.Go ||
          actionType === ActionType.Arrest ||
          actionType === ActionType.Tax
        ) {
          action(this);
        } else if (actionType === ActionType.Chance) {
          action(this);
        } else if (actionType === ActionType.Community) {
          action(this);
        }
        break;
      }
      case TileType.Property:
        this.resolveProperty(tile as PropertyTile, options);
        break;
      default:
        break;
    }
  };

  resolveProperty = (tile: PropertyTile, options?: ResolutionOptions) => {
    const { name, owner } = tile;
    const { modifier = 1 } = options || {};
    console.log(`${this.name} arrived at ${name} owned by ${owner?.name || 'nobody'}`);

    if (!owner) {
      this.resolvePurchase(tile);
    } else if (owner.name !== this.name) {
      this.resolvePayment(tile, modifier);
    }
    if (!this.doublesCounter) this.game.incrementTurn();
  };

  resolvePurchase = (tile: PropertyTile): void => {
    tile.purchase(this);
    console.log(`${this.name} purchased ${tile.name}!`);

    const tilesInSet = this.game.map
      .filter((tile) => tile.type === TileType.Property)
      .filter(
        (propertyTile) => (propertyTile as PropertyTile).color === tile.color
      ) as PropertyTile[];

    const setOwners = new Set([...tilesInSet.map((tile) => tile.owner)]);

    if (setOwners.size === 1 && setOwners.has(this)) {
      console.log(`${this.name} has completed a set of properties!`);
      this.completedSets.push(tile.color);
    }

  moveCardToPlayerSection = (deedCard: THREE.Mesh) => {
    const position = { x: 0, y: 0, z: 0 };
    const rotation = { x: 0, y: 0, z: 0 };
    switch (this.direction) {
      case 'n':
        position.z = -6;
        rotation.z = -Math.PI / 2;
        break;
      case 'ne':
        position.x = -Math.sqrt(2 * Math.pow(5, 2)) + 1;
        position.z = -Math.sqrt(2 * Math.pow(5, 2)) + 1;
        rotation.z = (3 * Math.PI) / 4;
        break;
      case 'e':
        position.x = -6;
        break;
      case 'se':
        position.x = Math.sqrt(2 * Math.pow(5, 2)) - 1;
        position.z = -Math.sqrt(2 * Math.pow(5, 2)) + 1;
        rotation.z = (-3 * Math.PI) / 4;
        break;
      case 's':
        position.z = 6;
        rotation.z = Math.PI / 2;
        break;
      case 'sw':
        position.x = Math.sqrt(2 * Math.pow(5, 2)) - 1;
        position.z = Math.sqrt(2 * Math.pow(5, 2)) - 1;
        rotation.z = (3 * Math.PI) / 4;
        break;
      case 'w':
        position.x = 6;
        rotation.z = Math.PI;
        break;
      case 'nw':
        position.x = -Math.sqrt(2 * Math.pow(5, 2)) + 1;
        position.z = Math.sqrt(2 * Math.pow(5, 2)) - 1;
        rotation.z = Math.PI / 4;
        break;
    }

    gsap.to(deedCard.position, {
      ...position,
      duration: 0.5
    });
    gsap.to(deedCard.rotation, {
      ...rotation,
      x: -Math.PI / 2,
      duration: 0.5
    });
  };

  resolvePayment = (tile: PropertyTile, modifier: number): void => {
    tile.collectRent(this, modifier);
  };

  buyHouse = (property: PropertyTile) => {
    if (property.houses === 5) {
      console.log('Build capacity for this property has been reached');
      return;
    }
    const mortagagedPropertiesInSet = this.properties.filter(
      (propertyTile) => propertyTile.color === property.color && propertyTile.isMortgaged
    );
    if (mortagagedPropertiesInSet.length) {
      console.log('Cannot build on a mortgaged set');
      return;
    }
    console.log(
      `${this.name} built a ${property.houses === 4 ? 'hotel' : 'house'} at ${property.name}`
    );
    property.houses++;
    this.money -= property.houseCost;
  };

  placeBid = (highestBid: number, highestBidder: Player | null, originalCost: number) => {
    const response = window.confirm(
      `${this.name}, want to outbid ${highestBidder?.name}?\nHighest bid: £${highestBid}\nOriginal asking price: £${originalCost}`
    );
    if (response) {
      let bid = window.prompt(
        `${this.name}, enter your bid!\nHighest bid: £${highestBid}\nOriginal asking price: £${originalCost}`,
        (highestBid + 10).toString()
      );
      while (parseInt(bid || '') <= highestBid) {
        bid = window.prompt(
          `${this.name}, enter your bid!\nHighest bid: £${highestBid}\nOriginal asking price: £${originalCost}`,
          (highestBid + 10).toString()
        );
      }

      console.log(`${this.name} is now the highest bidder`);

      return parseInt(bid || '');
    }

    console.log(`${this.name} has quit the auction`);
    return null;
  };

  getTotalWorth = (): number => {
    let worth = this.money;

    this.properties.forEach((property) => {
      worth += property.cost / 2;
      if (property.propertyType === PropertyType.Building) {
        const { houses, houseCost } = property;
        worth += (houses * houseCost) / 2;
      }
    });

    return worth;
  };

  takeTurn = (roll: DiceRoll): void => {
    const { doubles, total } = roll;

    this.previousRoll = roll;

    if (this.isJailed()) {
      if (doubles) {
        console.log(`${this.name} rolled a double and got out of jail!`);
        this.resetJailTerm();
      } else {
        console.log(`${this.name}'s jail term reduced`);
        this.reduceJailTerm();
      }
    } else {
      if (doubles) {
        console.log(`${this.name} rolled a double!`);
        this.incrementDoublesCounter();
        if (this.doublesCounter === 3) {
          console.log(`${this.name}'s speeding sends them to jail!`);
          this.arrest();
        }
      } else {
        this.resetDoublesCounter();
      }
    }

    if (!this.jailTerm) {
      console.log(`${this.name} advances ${total} steps`);
      this.move(total);
    } else {
      this.game.incrementTurn();
    }
  };

  move = (value: number, options?: ResolutionOptions): void => {
    const newPosition = (this.position + value) % BOARD_LENGTH;
    if (newPosition < this.position) {
      this.receive(200);
      console.log(this.name, 'receives £200 salary');
    }

    this.moveTo(newPosition, options);
  };

  moveTo = (position: number, options?: ResolutionOptions): void => {
    const newCoordinates = new Vector3(...tiles[position].position);
    this.isMoving = true;
    const { endTurn = false, modifier = 1, direction = 'forward' } = options || {};

    const positions: IntermediatePosition[] = [];

    const tween = (positions: IntermediatePosition[], index = 0) => {
      const { intermediatePosition, intermediateCoordinates } = positions[
        index
      ] as IntermediatePosition;
      const temporaryPosition = position < this.position ? position + BOARD_LENGTH : position;
      const intermediateDuration =
        positions.length === 1
          ? SECONDS_PER_TILE * (temporaryPosition - this.position)
          : SECONDS_PER_TILE *
            Math.abs(
              (intermediatePosition === 0 ? BOARD_LENGTH : intermediatePosition) - this.position
            );
      console.log(
        'tween from',
        this.position,
        'to',
        intermediatePosition,
        'in',
        intermediateDuration,
        'seconds'
      );
      gsap
        .to(this.piece.position, {
          x: intermediateCoordinates.x,
          y: intermediateCoordinates.y + 0.15 - 0.02,
          z: intermediateCoordinates.z,
          duration: intermediateDuration,
          ease: 'none'
        })
        .then(() => {
          this.position = intermediatePosition;
          if (index < positions.length - 1) {
            console.log('moving from intermediate position to next position');
            tween(positions, index + 1);
          } else {
            console.log('completed movement');
            this.isMoving = false;
            this.resolveTile(this.game.map[position], { modifier });
            if (endTurn && !this.doublesCounter) this.game.incrementTurn();
          }
        });
    };

    console.log('pushing final position');
    positions.push({
      intermediatePosition: position,
      intermediateCoordinates: newCoordinates
    });

    if (position < this.position || Math.floor(position / 10) !== Math.floor(this.position / 10)) {
      if (direction === 'forward') {
        let temporaryPosition = position < this.position ? position + BOARD_LENGTH : position;
        console.log(
          temporaryPosition,
          Math.floor(temporaryPosition / 10),
          Math.floor(this.position / 10)
        );
        while (Math.floor(temporaryPosition / 10) !== Math.floor(this.position / 10)) {
          const intermediatePosition = (Math.floor(temporaryPosition / 10) * 10) % BOARD_LENGTH;
          const intermediateCoordinates = new Vector3(...tiles[intermediatePosition].position);
          if (intermediatePosition !== position) {
            console.log('pushing intermediate position', intermediatePosition);
            positions.push({
              intermediatePosition,
              intermediateCoordinates
            });
          }
          temporaryPosition -= 10;
        }
      }
    }
    positions.reverse();

    console.log(positions);
    tween(positions);
  };
}
