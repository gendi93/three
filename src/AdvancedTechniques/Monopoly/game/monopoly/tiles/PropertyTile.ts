import { Player } from '../Player';
import { PropertyType, TileType } from './tiles.types';

type PropertyProps = {
  type: PropertyType;
  name: string;
  key: string;
  description: string;
  color: string;
  cost: number;
  houseCost?: number;
  rentalValues?: number[];
};

export class PropertyTile {
  type: TileType;
  propertyType: PropertyType;
  name: string;
  key: string;
  description: string;
  color: string;
  cost: number;
  houseCost: number;
  houses: number;
  rentalValues: number[];
  owner: Player | null;
  isMortgaged: boolean;

  constructor({
    type,
    name,
    key,
    description,
    color,
    cost,
    houseCost = 0,
    rentalValues = []
  }: PropertyProps) {
    this.propertyType = type;
    this.name = name;
    this.key = key;
    this.description = description;
    this.color = color;
    this.cost = cost;
    this.houseCost = houseCost;
    this.rentalValues = rentalValues;

    this.type = TileType.Property;
    this.owner = null;
    this.isMortgaged = false;
    this.houses = 0;
  }

  purchase = (player: Player, cost?: number) => {
    player.pay(cost || this.cost);
    player.properties.push(this);
    this.owner = player;
  };

  auction = (player: Player) => {
    const activePlayers = player.game.getActivePlayers();
    const biddingPlayers = activePlayers.map((player) => ({ player, bidding: true }));
    let bid = 1;
    let highestBidder = player;

    const getActiveBidders = () => biddingPlayers.filter((bidder) => bidder.bidding);

    while (getActiveBidders().length > 1) {
      biddingPlayers.forEach((bidder) => {
        if (bidder.player === highestBidder) return;

        const newBid = bidder.player.placeBid(bid, highestBidder, this.cost);
        if (!newBid) {
          bidder.bidding = false;
        } else if (newBid > bid) {
          highestBidder = bidder.player;
          bid = newBid;
        }
      });
    }

    console.log(`${highestBidder.name} bought ${this.name} for £${bid} at the auction`);
    this.purchase(highestBidder, bid);
  };

  collectRent = (player: Player, modifier: number) => {
    if (!this.owner) {
      console.log(`no owner recorded for ${this.name}`);
      return;
    }

    if (this.propertyType === PropertyType.Building) {
      console.log(
        `${player.name} paid ${this.owner.name} £${this.rentalValues[this.houses]} in rent`
      );
      player.pay(this.rentalValues[this.houses], this.owner);
    } else if (this.propertyType === PropertyType.Station) {
      const ownedStations = this.owner.properties.filter(
        (property) => property.propertyType === PropertyType.Station
      );
      console.log(
        `${player.name} paid ${this.owner.name} £${
          this.rentalValues[ownedStations.length - 1]
        } in travel tickets`
      );
      player.pay(this.rentalValues[ownedStations.length] * modifier, this.owner);
    } else if (this.propertyType === PropertyType.Utility) {
      const ownedUtilities = this.owner.properties.filter(
        (property) => property.propertyType === PropertyType.Utility
      );
      console.log(
        `${player.name} paid ${this.owner.name} £${
          this.rentalValues[ownedUtilities.length - 1] * player.previousRoll.total * modifier
        } in utility bills`
      );
      player.pay(
        player.previousRoll.total * this.rentalValues[ownedUtilities.length] * modifier,
        this.owner
      );
    }
  };
}
