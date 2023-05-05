import { BasicTile } from './BasicTile';
import { ActionTile } from './ActionTile';
import { PropertyTile } from './PropertyTile';

export { BasicTile, ActionTile, PropertyTile };

export type Tile = BasicTile | ActionTile | PropertyTile;
