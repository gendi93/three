import { Player } from '../Player';
import { ActionType, TileType } from './tiles.types';

type ActionTileProps = {
  type: ActionType,
  name: string;
  description: string,
  action: (player: Player) => void;
}

export class ActionTile {
  type: TileType;
  name: string;
  description: string;
  actionType: ActionType;
  action: (player: Player) => void;

  constructor({type, name, description, action}: ActionTileProps) {
    this.actionType = type;
    this.name = name;
    this.description = description;
    this.action = action;

    this.type = TileType.Action;
  }
}
