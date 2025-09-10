export interface Position {
  row: number;
  col: number;
}

export enum TileType {
  NORMAL = 'normal',
  OBSTACLE = 'obstacle'
}

export class Tile {
  readonly value: number;
  readonly type: TileType;
  private _position: Position;
  private _merged: boolean;

  constructor(value: number, position: Position, type: TileType = TileType.NORMAL) {
    this.value = value;
    this._position = position;
    this.type = type
    this._merged = false;
  }

  get position(): Position {
    return { ...this._position };
  }

  get merged(): boolean {
    return this._merged;
  }

  set merged(value: boolean) {
    this._merged = value;
  }

  setPosition(position: Position): void {
    this._position = { ...position };
  }

  mergeWith(other: Tile): Tile {
    const newValue = this.value + other.value;
    const mergedTile = new Tile(newValue, this._position, );
    mergedTile.merged = true;
    return mergedTile;
  }

  canMergeWith(other: Tile): boolean {
    // Obstacle tiles cannot merge with any tile
    if (this.type === TileType.OBSTACLE || other.type === TileType.OBSTACLE) {
      return false;
    }
    return this.value === other.value && !this._merged && !other.merged;
  }

  isObstacle(): boolean {
    return this.type === TileType.OBSTACLE;
  }



  clone(): Tile {
    const cloned = new Tile(this.value, this._position, );
    cloned._merged = this._merged;
    return cloned;
  }
} 