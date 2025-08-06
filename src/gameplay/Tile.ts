export interface Position {
  row: number;
  col: number;
}

export class Tile {
  readonly value: number;
  readonly id: string;
  private _position: Position;
  private _merged: boolean;

  constructor(value: number, position: Position, id?: string) {
    this.value = value;
    this._position = position;
    this.id = id || this.generateId();
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
    const mergedTile = new Tile(newValue, this._position, this.id);
    mergedTile.merged = true;
    return mergedTile;
  }

  canMergeWith(other: Tile): boolean {
    return this.value === other.value && !this._merged && !other.merged;
  }

  private generateId(): string {
    return `tile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  clone(): Tile {
    const cloned = new Tile(this.value, this._position, this.id);
    cloned._merged = this._merged;
    return cloned;
  }
} 