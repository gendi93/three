import { BasicType, TileType } from "./tiles.types";

type BasicTileProps = {
  type: BasicType,
  name: string,
  description: string,
}

export class BasicTile {
  type: TileType;
  basicType: BasicType;
  name: string;
  description: string;

  constructor({type, name, description}: BasicTileProps) {
    this.basicType = type;
    this.name = name;
    this.description = description;

    this.type = TileType.Basic;
  }
}
