import { Player } from '../Player';
import { TileType, ActionType, PropertyType, BasicType } from '../tiles/tiles.types';
import { CHANCE_CARDS, COMMUNITY_CARDS } from './Cards';

export const BOARD_LENGTH = 40;

export const GO_POSITION = 0;
export const KINGS_CROSS_STATION_POSITION = 5;
export const JAIL_POSITION = 10;
export const PALL_MALL_POSITION = 11;
export const ELECTRICITY_COMPANY_POSITION = 12;
export const TRAFALGAR_SQUARE_POSITION = 24;
export const WATER_WORKS_POSITION = 28;
export const MAYFAIR_POSITION = 39;

const GO_DESCRIPTION = 'Collect £200 salary as you pass';
const COMMUNITY_DESCRIPTION = 'Do your part for your community!';
const CHANCE_DESCRIPTION = 'Take a chance on me!';
const INCOME_TAX_DESCRIPTION = 'Pay £200';
const LUXURY_TAX_DESCRIPTION = 'Pay £100';
const ARREST_DESCRIPTION = 'Go to jail!';
const JAIL_DESCRIPTION = 'Just visiting!';
const PARKING_DESCRIPTION = 'Smell the flowers!';

const NUM_CARDS = 16;

const chanceAction = (player: Player) => {
  const card = CHANCE_CARDS[Math.floor(Math.random() * NUM_CARDS)];
  console.log(`${player.name} picked up a chance card: ${card.description}`);
  card.action(player);
}

const communityAction = (player: Player) => {
  const card = COMMUNITY_CARDS[Math.floor(Math.random() * NUM_CARDS)];
  console.log(`${player.name} picked up a community card: ${card.description}`);
  card.action(player);
}

const goAction = (player: Player) => {
  console.log(player.name, 'receives £200 salary');
  player.receive(200);
}
const incomeTaxAction = (player: Player) => {
  console.log(player.name, 'pays £200 income tax');
  player.pay(200);
}
const luxuryTaxAction = (player: Player) => {
  console.log(player.name, 'pays £100 luxury tax');
  player.pay(100);
}
const arrestAction = (player: Player) => {
  console.log(player.name, 'has been arrested')
  player.arrest();
  player.moveTo(JAIL_POSITION);
};

export type DefaultTileData = {
  name: string,
  description: string,
}

export type BasicTileData = DefaultTileData & {
  type: BasicType,
}

export type PropertyTileData = DefaultTileData & {
  type: PropertyType,
  cost: number,
  color: string,
  rentalValues: number[],
};

export type BuildingTileData = PropertyTileData & {
  houseCost: number | null,
};

export type ActionTileData = DefaultTileData & {
  type: ActionType,
  action: (player: Player) => void,
}

export type TileData = {
  type: TileType,
  data: BasicTileData | ActionTileData | PropertyTileData | BuildingTileData,
};

export const TILE_MAP: TileData[] = [
  {
    type: TileType.Action,
    data: {
      type: ActionType.Go,
      name: 'Go!',
      description: GO_DESCRIPTION,
      action: goAction,
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Old Kent Road',
      description: '',
      color: 'saddlebrown',
      cost: 60,
      houseCost: 50,
      rentalValues: [2, 10, 30, 90, 160, 250],
    },
  },
  {
    type: TileType.Action,
    data: {
      type: ActionType.Community,
      name: 'Community Chest',
      description: COMMUNITY_DESCRIPTION,
      action: communityAction,
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Whitechapel Road',
      description: '',
      color: 'saddlebrown',
      cost: 60,
      houseCost: 50,
      rentalValues: [4, 20, 60, 180, 320, 450],
    },
  },
  {
    type: TileType.Action,
    data: {
      type: ActionType.Tax,
      name: 'Income Tax',
      description: INCOME_TAX_DESCRIPTION,
      action: incomeTaxAction,
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Station,
      name: 'Kings Cross Station',
      description: '',
      cost: 200,
      color: 'black',
      rentalValues: [50, 100, 150, 200],
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'The Angel, Islington',
      description: '',
      color: 'cyan',
      cost: 100,
      houseCost: 50,
      rentalValues: [6, 30, 90, 270, 400, 550],
    },
  },
  {
    type: TileType.Action,
    data: {
      type: ActionType.Chance,
      name: 'Chance',
      description: CHANCE_DESCRIPTION,
      action: chanceAction
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Euston Road',
      description: '',
      color: 'cyan',
      cost: 100,
      houseCost: 50,
      rentalValues: [6, 30, 90, 270, 400, 550],
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Pentonville Road',
      description: '',
      color: 'cyan',
      cost: 120,
      houseCost: 50,
      rentalValues: [8, 40, 100, 300, 450, 600],
    },
  },
  {
    type: TileType.Basic,
    data: {
      type: BasicType.Jail,
      name: 'Jail',
      description: JAIL_DESCRIPTION,
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Pall Mall',
      description: '',
      color: 'magenta',
      cost: 140,
      houseCost: 100,
      rentalValues: [10, 50, 150, 450, 625, 750],
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Utility,
      name: 'Electric Company',
      description: '',
      cost: 150,
      color: 'white',
      rentalValues: [4, 10],
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Whitehall',
      description: '',
      color: 'magenta',
      cost: 140,
      houseCost: 100,
      rentalValues: [10, 50, 150, 450, 625, 750],
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Northumberland Avenue',
      description: '',
      color: 'magenta',
      cost: 160,
      houseCost: 100,
      rentalValues: [12, 60, 180, 500, 700, 900],
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Station,
      name: 'Marylebone Station',
      description: '',
      cost: 200,
      color: 'black',
      rentalValues: [50, 100, 150, 200],
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Bow Street',
      description: '',
      color: 'orange',
      cost: 180,
      houseCost: 100,
      rentalValues: [14, 70, 200, 550, 750, 950],
    },
  },
  {
    type: TileType.Action,
    data: {
      type: ActionType.Community,
      name: 'Community Chest',
      description: COMMUNITY_DESCRIPTION,
      action: communityAction,
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Marlborough Street',
      description: '',
      color: 'orange',
      cost: 180,
      houseCost: 100,
      rentalValues: [14, 70, 200, 550, 750, 950],
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Vine Street',
      description: '',
      color: 'orange',
      cost: 200,
      houseCost: 100,
      rentalValues: [16, 80, 220, 600, 800, 1000],
    },
  },
  {
    type: TileType.Basic,
    data: {
      type: BasicType.Parking,
      name: 'Free Parking',
      description: PARKING_DESCRIPTION,
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Strand',
      description: '',
      color: 'red',
      cost: 220,
      houseCost: 150,
      rentalValues: [18, 90, 250, 700, 875, 1050],
    },
  },
  {
    type: TileType.Action,
    data: {
      type: ActionType.Chance,
      name: 'Chance',
      description: CHANCE_DESCRIPTION,
      action: chanceAction,
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Fleet Street',
      description: '',
      color: 'red',
      cost: 220,
      houseCost: 150,
      rentalValues: [18, 90, 250, 700, 875, 1050],
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Trafalgar Square',
      description: '',
      color: 'red',
      cost: 240,
      houseCost: 150,
      rentalValues: [20, 100, 300, 750, 925, 1100],
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Station,
      name: 'Fenchurch St. Station',
      description: '',
      cost: 200,
      color: 'black',
      rentalValues: [50, 100, 150, 200],
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Leicester Square',
      description: '',
      color: 'yellow',
      cost: 260,
      houseCost: 150,
      rentalValues: [22, 110, 330, 800, 975, 1150],
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Coventry Street',
      description: '',
      color: 'yellow',
      cost: 260,
      houseCost: 150,
      rentalValues: [22, 110, 330, 800, 975, 1150],
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Utility,
      name: 'Water Works',
      description: '',
      cost: 150,
      color: 'white',
      rentalValues: [4, 10],
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Piccadilly',
      description: '',
      color: 'yellow',
      cost: 280,
      houseCost: 150,
      rentalValues: [24, 120, 360, 850, 1025, 1200],
    },
  },
  {
    type: TileType.Action,
    data: {
      type: ActionType.Arrest,
      name: 'Arrest',
      description: ARREST_DESCRIPTION,
      action: arrestAction,
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Regent Street',
      description: '',
      color: 'green',
      cost: 300,
      houseCost: 200,
      rentalValues: [26, 130, 390, 900, 1100, 1275],
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Oxford Street',
      description: '',
      color: 'green',
      cost: 300,
      houseCost: 200,
      rentalValues: [26, 130, 390, 900, 1100, 1275],
    },
  },
  {
    type: TileType.Action,
    data: {
      type: ActionType.Community,
      name: 'Community Chest',
      description: COMMUNITY_DESCRIPTION,
      action: communityAction,
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Bond Street',
      description: '',
      color: 'green',
      cost: 320,
      houseCost: 200,
      rentalValues: [28, 150, 450, 1000, 1200, 1400],
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Station,
      name: 'Liverpool St. Station',
      description: '',
      cost: 200,
      color: 'black',
      rentalValues: [50, 100, 150, 200],
    },
  },
  {
    type: TileType.Action,
    data: {
      type: ActionType.Chance,
      name: 'Chance',
      description: CHANCE_DESCRIPTION,
      action: chanceAction,
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Park Lane',
      description: '',
      color: 'navy',
      cost: 350,
      houseCost: 200,
      rentalValues: [35, 175, 500, 1100, 1300, 1500],
    },
  },
  {
    type: TileType.Action,
    data: {
      type: ActionType.Tax,
      name: 'Luxury Tax',
      description: LUXURY_TAX_DESCRIPTION,
      action: luxuryTaxAction,
    },
  },
  {
    type: TileType.Property,
    data: {
      type: PropertyType.Building,
      name: 'Mayfair',
      description: '',
      color: 'navy',
      cost: 400,
      houseCost: 200,
      rentalValues: [50, 200, 600, 1400, 1700, 2000],
    },
  },
]
