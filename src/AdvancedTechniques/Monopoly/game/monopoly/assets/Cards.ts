import { getTile, rollDice } from '../helpers';
import { Player } from '../Player';
import { PropertyTile } from '../tiles';
import { PropertyType } from '../tiles/tiles.types';
import { ELECTRICITY_COMPANY_POSITION, GO_POSITION, JAIL_POSITION, KINGS_CROSS_STATION_POSITION, MAYFAIR_POSITION, PALL_MALL_POSITION, TRAFALGAR_SQUARE_POSITION, WATER_WORKS_POSITION } from './Map';

export const CHANCE_CARDS = [
  {
    description: 'Advance to GO (Collect £200).',
    action: (player: Player) => {
      player.moveTo(GO_POSITION);
      player.receive(200);
      console.log(`${player.name} receives £200 salary`);
    }
  },
  {
    description: 'Advance to Trafalgar Square. If you pass Go, collect £200.',
    action: (player: Player) => {
      if (player.position > TRAFALGAR_SQUARE_POSITION) {
        player.receive(200);
        console.log(`${player.name} receives £200 salary`);
      }
      player.moveTo(TRAFALGAR_SQUARE_POSITION);
      player.resolveProperty(getTile(player.game, TRAFALGAR_SQUARE_POSITION) as PropertyTile);
    }
  },
  {
    description: 'Advance to Mayfair.',
    action: (player: Player) => {
      player.moveTo(MAYFAIR_POSITION);
      player.resolveProperty(getTile(player.game, MAYFAIR_POSITION) as PropertyTile);
    }
  },
  {
    description: 'Advance to Pall Mall. If you pass Go, collect £200.',
    action: (player: Player) => {
      if (player.position > PALL_MALL_POSITION) {
        player.receive(200);
        console.log(`${player.name} receives £200 salary`);
      }
      player.moveTo(PALL_MALL_POSITION);
      player.resolveProperty(getTile(player.game, PALL_MALL_POSITION) as PropertyTile);
    }
  },
  {
    description: 'Advance to the nearest Station. If unowned, you may buy it from the Bank. If owned, pay owner twice the rental to which they are otherwise entitled.',
    action: (player: Player) => {
      let stepsToAdvance = 5 - player.position % 10;
      if (stepsToAdvance <= 0) stepsToAdvance += 10;

      player.move(stepsToAdvance);
      player.resolveProperty(getTile(player.game, player.position) as PropertyTile, 2);
    }
  },
  {
    description: 'Advance to the nearest Station. If unowned, you may buy it from the Bank. If owned, pay owner twice the rental to which they are otherwise entitled.',
    action: (player: Player) => {
      let stepsToAdvance = 5 - player.position % 10;
      if (stepsToAdvance <= 0) stepsToAdvance += 10;

      player.move(stepsToAdvance);
      player.resolveProperty(getTile(player.game, player.position) as PropertyTile, 2);
    }
  },
  {
    description: 'Advance to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times amount thrown.',
    action: (player: Player) => {
      player.previousRoll = rollDice();
      if (player.position >= WATER_WORKS_POSITION) {
        player.receive(200);
        console.log(`${player.name} receives £200 salary`);
        player.moveTo(ELECTRICITY_COMPANY_POSITION);
        player.resolveProperty(getTile(player.game, player.position) as PropertyTile, 10);
      } else if (player.position >= ELECTRICITY_COMPANY_POSITION) {
        player.moveTo(WATER_WORKS_POSITION);
        player.resolveProperty(getTile(player.game, player.position) as PropertyTile, 10);
      } else {
        player.moveTo(ELECTRICITY_COMPANY_POSITION);
        player.resolveProperty(getTile(player.game, player.position) as PropertyTile, 10);
      }
    }
  },
  {
    description: 'Bank pays you dividend of £50.',
    action: (player: Player) => {
      player.receive(50);
      console.log(`${player.name} receives £50 dividend`);
    }
  },
  {
    description: 'Get Out of Jail Free.',
    action: (player: Player) => {
      player.gainGetOutOfJailFreeCard();
    }
  },
  {
    description: 'Go back 3 spaces.',
    action: (player: Player) => {
      player.move(-3);
      const tile = getTile(player.game, player.position);
      player.resolveTile(tile);
    }
  },
  {
    description: 'Go to Jail. Go directly to Jail, do not pass Go, do not collect £200.',
    action: (player: Player) => {
      player.arrest();
      player.moveTo(JAIL_POSITION);
      console.log(`${player.name} has been arrested`);
    }
  },
  {
    description: 'Make general repairs on all your property. For each house pay £25. For each hotel pay £100.',
    action: (player: Player) => {
      const ownedBuildings = player.properties.filter(property => property.propertyType === PropertyType.Building);
      const ownedHotels = ownedBuildings.filter(property => property.houses === 5).map(property => property.houses)
      const numHotels = ownedHotels.length;
      const ownedHouses = ownedBuildings.filter(property => property.houses !== 5).map(property => property.houses);
      const numHouses = (ownedHouses.length && ownedHouses.reduce((prev, cur) => prev + cur)) || 0;
      const repairCost = numHouses * 25 + numHotels * 100;
      // TODO: fuck player up if they cant pay
      console.log(`${player.name} pays £${repairCost} in repairs`);
      player.pay(repairCost);
    }
  },
  {
    description: 'Speeding fine £15.',
    action: (player: Player) => {
      player.pay(15);
      console.log(`${player.name} pays £15 fine`);
    }
  },
  {
    description: 'Take a trip to Kings Cross Station. If you pass Go, collect £200.',
    action: (player: Player) => {
      if (player.position > KINGS_CROSS_STATION_POSITION) {
        player.receive(200);
        console.log(`${player.name} receives £200 salary`);
      }
      player.moveTo(KINGS_CROSS_STATION_POSITION);
      player.resolveProperty(getTile(player.game, KINGS_CROSS_STATION_POSITION) as PropertyTile);
    }
  },
  {
    description: 'You have been elected Chairman of the Board. Pay each player £50',
    action: (player: Player) => {
      const otherPlayers = player.game.getActivePlayers().filter(activePlayer => activePlayer !== player);
      otherPlayers.forEach(otherPlayer => {
        player.pay(50, otherPlayer);
        console.log(`${player.name} pays ${otherPlayer.name} £50`);
      })
    }
  },
  {
    description: 'Your building loan matures. Collect £150',
    action: (player: Player) => {
      player.receive(150);
      console.log(`${player.name} receives £150 from matured loan`);
    }
  },
];

export const COMMUNITY_CARDS = [
  {
    description: 'Advance to GO (Collect £200).',
    action: (player: Player) => {
      player.moveTo(GO_POSITION);
      player.receive(200);
      console.log(`${player.name} receives £200 salary`);
    }
  },
  {
    description: 'Bank error in your favour. Collect £200.',
    action: (player: Player) => {
      player.receive(200);
      console.log(`${player.name} receives £200 from bank error`);
    }
  },
  {
    description: 'Doctor’s fee. Pay £50.',
    action: (player: Player) => {
      player.pay(50);
      console.log(`${player.name} pays £50 doctor fee`);
    }
  },
  {
    description: 'From sale of stock you get £50.',
    action: (player: Player) => {
      player.receive(50);
      console.log(`${player.name} receives £50 from stock sales`);
    }
  },
  {
    description: 'Get Out of Jail Free.',
    action: (player: Player) => {
      player.gainGetOutOfJailFreeCard();
    }
  },
  {
    description: 'Go to Jail. Go directly to Jail, do not pass Go, do not collect £200.',
    action: (player: Player) => {
      player.arrest();
      player.moveTo(JAIL_POSITION);
      console.log(`${player.name} has been arrested`);
    }
  },
  {
    description: 'Holiday fund matures. Receive £100.',
    action: (player: Player) => {
      player.receive(100);
      console.log(`${player.name} receives £100 from matured holiday fund`);
    }
  },
  {
    description: 'Income tax refund. Collect £20.',
    action: (player: Player) => {
      player.receive(20);
      console.log(`${player.name} receives £20 from income tax refund`);
    }
  },
  {
    description: 'It is your birthday. Collect £10 from every player.',
    action: (player: Player) => {
      const otherPlayers = player.game.getActivePlayers().filter(activePlayer => activePlayer !== player);
      otherPlayers.forEach(otherPlayer => {
        player.receive(10, otherPlayer);
        console.log(`${player.name} receives £10 from ${otherPlayer.name} as a birthday gift`);
      })
    }
  },
  {
    description: 'Life insurance matures. Collect £100',
    action: (player: Player) => {
      player.receive(100);
      console.log(`${player.name} receives £100 from matured life insurance`);
    }
  },
  {
    description: 'Pay hospital fees of £100',
    action: (player: Player) => {
      player.pay(100);
      console.log(`${player.name} pays £100 in hospital fees`);
    }
  },
  {
    description: 'Pay school fees of £50',
    action: (player: Player) => {
      player.pay(50);
      console.log(`${player.name} pays £50 in school fees`);
    }
  },
  {
    description: 'Receive £25 consultancy fee',
    action: (player: Player) => {
      player.receive(25);
      console.log(`${player.name} receives £25 for consulting`);
    }
  },
  {
    description: 'You are assessed for street repairs. £40 per house. £115 per hotel',
    action: (player: Player) => {
      const ownedBuildings = player.properties.filter(property => property.propertyType === PropertyType.Building);
      const ownedHotels = ownedBuildings.filter(property => property.houses === 5).map(property => property.houses)
      const numHotels = ownedHotels.length;
      const ownedHouses = ownedBuildings.filter(property => property.houses !== 5).map(property => property.houses);
      const numHouses = (ownedHouses.length && ownedHouses.reduce((prev, cur) => prev + cur)) || 0;
      const repairCost = numHouses * 40 + numHotels * 115;
      // TODO: fuck player up if they cant pay
      player.pay(repairCost);
      console.log(`${player.name} pays £${repairCost} in repairs`);
    }
  },
  {
    description: 'You have won second prize in a beauty contest. Collect £10',
    action: (player: Player) => {
      player.receive(10);
      console.log(`${player.name} receives £10 for beauty contest`);
    }
  },
  {
    description: 'You inherit £100',
    action: (player: Player) => {
      player.receive(100);
      console.log(`${player.name} receives £100 from inheritance`);
    }
  },
];
