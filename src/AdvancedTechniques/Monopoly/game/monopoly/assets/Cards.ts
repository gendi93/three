import { rollDice } from '../helpers';
import { Player } from '../Player';
import { PropertyType } from '../tiles/tiles.types';
import { Direction } from '../types';
import {
  ELECTRICITY_COMPANY_POSITION,
  GO_POSITION,
  KINGS_CROSS_STATION_POSITION,
  MAYFAIR_POSITION,
  PALL_MALL_POSITION,
  TRAFALGAR_SQUARE_POSITION,
  WATER_WORKS_POSITION
} from './Map';

export type Card = {
  key: string;
  description: string;
  action: (player: Player) => void;
  buttonText: string;
};

export const CHANCE_CARDS: Card[] = [
  {
    key: 'advanceGoChance',
    description: 'Advance to GO (Collect £200).',
    action: (player: Player) => {
      player.moveTo(GO_POSITION);
      console.log(`${player.name} receives £200 salary`);
    },
    buttonText: 'Advance!'
  },
  {
    key: 'advanceTrafalgar',
    description: 'Advance to Trafalgar Square. If you pass Go, collect £200.',
    action: (player: Player) => {
      if (player.position > TRAFALGAR_SQUARE_POSITION) {
        player.receive(200);
        console.log(`${player.name} receives £200 salary`);
      }
      player.moveTo(TRAFALGAR_SQUARE_POSITION);
    },
    buttonText: 'Advance!'
  },
  {
    key: 'advanceMayfair',
    description: 'Advance to Mayfair.',
    action: (player: Player) => {
      player.moveTo(MAYFAIR_POSITION);
    },
    buttonText: 'Advance!'
  },
  {
    key: 'advancePallMall',
    description: 'Advance to Pall Mall. If you pass Go, collect £200.',
    action: (player: Player) => {
      if (player.position > PALL_MALL_POSITION) {
        player.receive(200);
        console.log(`${player.name} receives £200 salary`);
      }
      player.moveTo(PALL_MALL_POSITION);
    },
    buttonText: 'Advance!'
  },
  {
    key: 'advanceStation1',
    description:
      'Advance to the nearest Station. If unowned, you may buy it from the Bank. If owned, pay owner twice the rental to which they are otherwise entitled.',
    action: (player: Player) => {
      let stepsToAdvance = 5 - (player.position % 10);
      if (stepsToAdvance <= 0) stepsToAdvance += 10;

      const options = {
        modifier: 2
      };
      player.move(stepsToAdvance, options);
    },
    buttonText: 'Advance!'
  },
  {
    key: 'advanceStation2',
    description:
      'Advance to the nearest Station. If unowned, you may buy it from the Bank. If owned, pay owner twice the rental to which they are otherwise entitled.',
    action: (player: Player) => {
      let stepsToAdvance = 5 - (player.position % 10);
      if (stepsToAdvance <= 0) stepsToAdvance += 10;

      const options = {
        modifier: 2
      };
      player.move(stepsToAdvance, options);
    },
    buttonText: 'Advance!'
  },
  {
    key: 'advanceUtility',
    description:
      'Advance to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times amount thrown.',
    action: (player: Player) => {
      player.previousRoll = rollDice();
      const options = {
        modifier: 10
      };

      if (player.position >= WATER_WORKS_POSITION) {
        player.receive(200);
        console.log(`${player.name} receives £200 salary`);
        player.moveTo(ELECTRICITY_COMPANY_POSITION, options);
      } else if (player.position >= ELECTRICITY_COMPANY_POSITION) {
        player.moveTo(WATER_WORKS_POSITION, options);
      } else {
        player.moveTo(ELECTRICITY_COMPANY_POSITION, options);
      }
    },
    buttonText: 'Advance!'
  },
  {
    key: 'bank',
    description: 'Bank pays you dividend of £50.',
    action: (player: Player) => {
      player.receive(50);
      console.log(`${player.name} receives £50 dividend`);
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'Congratulations!'
  },
  {
    key: 'outOfJailChance',
    description: 'Get Out of Jail Free.',
    action: (player: Player) => {
      player.gainGetOutOfJailFreeCard();
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'Lucky you!'
  },
  {
    key: 'back3',
    description: 'Go back 3 spaces.',
    action: (player: Player) => {
      const options = {
        direction: Direction.Backward
      };

      player.move(-3, options);
    },
    buttonText: 'Go back!'
  },
  {
    key: 'jailChance',
    description: 'Go to Jail. Go directly to Jail, do not pass Go, do not collect £200.',
    action: (player: Player) => {
      player.arrest();
      console.log(`${player.name} has been arrested`);
    },
    buttonText: 'Tsk tsk tsk...'
  },
  {
    key: 'repairsChance',
    description:
      'Make general repairs on all your property. For each house pay £25. For each hotel pay £100.',
    action: (player: Player) => {
      const ownedBuildings = player.properties.filter(
        (property) => property.propertyType === PropertyType.Building
      );
      const ownedHotels = ownedBuildings
        .filter((property) => property.houses === 5)
        .map((property) => property.houses);
      const numHotels = ownedHotels.length;
      const ownedHouses = ownedBuildings
        .filter((property) => property.houses !== 5)
        .map((property) => property.houses);
      const numHouses = (ownedHouses.length && ownedHouses.reduce((prev, cur) => prev + cur)) || 0;
      const repairCost = numHouses * 25 + numHotels * 100;
      // TODO: fuck player up if they cant pay
      console.log(`${player.name} pays £${repairCost} in repairs`);
      player.pay(repairCost);
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'Ouch, Pay up!'
  },
  {
    key: 'fine',
    description: 'Speeding fine £15.',
    action: (player: Player) => {
      player.pay(15);
      console.log(`${player.name} pays £15 fine`);
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'You put others at risk, pay up!'
  },
  {
    key: 'trip',
    description: 'Take a trip to Kings Cross Station. If you pass Go, collect £200.',
    action: (player: Player) => {
      if (player.position > KINGS_CROSS_STATION_POSITION) {
        player.receive(200);
        console.log(`${player.name} receives £200 salary`);
      }
      player.moveTo(KINGS_CROSS_STATION_POSITION);
    },
    buttonText: 'Take a trip!'
  },
  {
    key: 'chairman',
    description: 'You have been elected Chairman of the Board. Pay each player £50',
    action: (player: Player) => {
      const otherPlayers = player.game
        .getActivePlayers()
        .filter((activePlayer) => activePlayer !== player);
      otherPlayers.forEach((otherPlayer) => {
        player.pay(50, otherPlayer);
        console.log(`${player.name} pays ${otherPlayer.name} £50`);
      });
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'Congratulations, pay up!'
  },
  {
    key: 'collectChance',
    description: 'Your building loan matures. Collect £150',
    action: (player: Player) => {
      player.receive(150);
      console.log(`${player.name} receives £150 from matured loan`);
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'Congratulations!'
  }
];

export const COMMUNITY_CARDS: Card[] = [
  {
    key: 'advanceGoCommunity',
    description: 'Advance to GO (Collect £200).',
    action: (player: Player) => {
      player.moveTo(GO_POSITION);
      console.log(`${player.name} receives £200 salary`);
    },
    buttonText: 'Advance!'
  },
  {
    key: 'collectCommunity',
    description: 'Bank error in your favour. Collect £200.',
    action: (player: Player) => {
      player.receive(200);
      console.log(`${player.name} receives £200 from bank error`);
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'Good catch!'
  },
  {
    key: 'doctor',
    description: 'Doctor’s fee. Pay £50.',
    action: (player: Player) => {
      player.pay(50);
      console.log(`${player.name} pays £50 doctor fee`);
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'An apple a day!'
  },
  {
    key: 'stock',
    description: 'From sale of stock you get £50.',
    action: (player: Player) => {
      player.receive(50);
      console.log(`${player.name} receives £50 from stock sales`);
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: "Sell it while it's hot!"
  },
  {
    key: 'outOfJailCommunity',
    description: 'Get Out of Jail Free.',
    action: (player: Player) => {
      player.gainGetOutOfJailFreeCard();
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'Lucky you!'
  },
  {
    key: 'jailCommunity',
    description: 'Go to Jail. Go directly to Jail, do not pass Go, do not collect £200.',
    action: (player: Player) => {
      player.arrest();
      console.log(`${player.name} has been arrested`);
    },
    buttonText: 'Tsk tsk tsk...'
  },
  {
    key: 'holiday',
    description: 'Holiday fund matures. Receive £100.',
    action: (player: Player) => {
      player.receive(100);
      console.log(`${player.name} receives £100 from matured holiday fund`);
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'Woo, well deserved!'
  },
  {
    key: 'refund',
    description: 'Income tax refund. Collect £20.',
    action: (player: Player) => {
      player.receive(20);
      console.log(`${player.name} receives £20 from income tax refund`);
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'Feels good!'
  },
  {
    key: 'birthday',
    description: 'It is your birthday. Collect £10 from every player.',
    action: (player: Player) => {
      const otherPlayers = player.game
        .getActivePlayers()
        .filter((activePlayer) => activePlayer !== player);
      otherPlayers.forEach((otherPlayer) => {
        player.receive(10, otherPlayer);
        console.log(`${player.name} receives £10 from ${otherPlayer.name} as a birthday gift`);
      });
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'Happy birthday!'
  },
  {
    key: 'insurance',
    description: 'Life insurance matures. Collect £100',
    action: (player: Player) => {
      player.receive(100);
      console.log(`${player.name} receives £100 from matured life insurance`);
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'Another day another dollar!'
  },
  {
    key: 'hospital',
    description: 'Pay hospital fees of £100',
    action: (player: Player) => {
      player.pay(100);
      console.log(`${player.name} pays £100 in hospital fees`);
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'Get well!'
  },
  {
    key: 'school',
    description: 'Pay school fees of £50',
    action: (player: Player) => {
      player.pay(50);
      console.log(`${player.name} pays £50 in school fees`);
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: "They're an investment!"
  },
  {
    key: 'receive',
    description: 'Receive £25 consultancy fee',
    action: (player: Player) => {
      player.receive(25);
      console.log(`${player.name} receives £25 for consulting`);
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'Gotta hustle!'
  },
  {
    key: 'repairsCommunity',
    description: 'You are assessed for street repairs. £40 per house. £115 per hotel',
    action: (player: Player) => {
      const ownedBuildings = player.properties.filter(
        (property) => property.propertyType === PropertyType.Building
      );
      const ownedHotels = ownedBuildings
        .filter((property) => property.houses === 5)
        .map((property) => property.houses);
      const numHotels = ownedHotels.length;
      const ownedHouses = ownedBuildings
        .filter((property) => property.houses !== 5)
        .map((property) => property.houses);
      const numHouses = (ownedHouses.length && ownedHouses.reduce((prev, cur) => prev + cur)) || 0;
      const repairCost = numHouses * 40 + numHotels * 115;
      // TODO: fuck player up if they cant pay
      player.pay(repairCost);
      console.log(`${player.name} pays £${repairCost} in repairs`);
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'Ouch, pay up!'
  },
  {
    key: 'contest',
    description: 'You have won second prize in a beauty contest. Collect £10',
    action: (player: Player) => {
      player.receive(10);
      console.log(`${player.name} receives £10 for beauty contest`);
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'Wow look at you!'
  },
  {
    key: 'inheritance',
    description: 'You inherit £100',
    action: (player: Player) => {
      player.receive(100);
      console.log(`${player.name} receives £100 from inheritance`);
      if (!player.doublesCounter) player.game.incrementTurn();
    },
    buttonText: 'You were their favourite!'
  }
];
