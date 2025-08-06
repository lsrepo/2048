import { Tile, Position } from './Tile';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface BoardState {
  grid: (Tile | null)[][];
  size: number;
  score: number;
}

export class Board {
  private _grid: (Tile | null)[][];
  private readonly _size: number;
  private _score: number;

  constructor(size: number = 4) {
    this._size = size;
    this._grid = this.createEmptyGrid();
    this._score = 0;
  }

  get size(): number {
    return this._size;
  }

  get score(): number {
    return this._score;
  }

  get grid(): (Tile | null)[][] {
    return this._grid.map(row => [...row]);
  }

  private createEmptyGrid(): (Tile | null)[][] {
    return Array(this._size).fill(null).map(() => Array(this._size).fill(null));
  }

  addTile(tile: Tile): void {
    const { row, col } = tile.position;
    if (this.isValidPosition(row, col) && this._grid[row][col] === null) {
      this._grid[row][col] = tile;
    }
  }

  getTileAt(row: number, col: number): Tile | null {
    if (this.isValidPosition(row, col)) {
      return this._grid[row][col];
    }
    return null;
  }

  isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this._size && col >= 0 && col < this._size;
  }

  getEmptyPositions(): Position[] {
    const empty: Position[] = [];
    for (let row = 0; row < this._size; row++) {
      for (let col = 0; col < this._size; col++) {
        if (this._grid[row][col] === null) {
          empty.push({ row, col });
        }
      }
    }
    return empty;
  }

  canMove(direction: Direction): boolean {
    // Check if any tile can move in the given direction
    for (let row = 0; row < this._size; row++) {
      for (let col = 0; col < this._size; col++) {
        const tile = this._grid[row][col];
        if (tile && this.canTileMove(tile, direction)) {
          return true;
        }
      }
    }
    return false;
  }

  private canTileMove(tile: Tile, direction: Direction): boolean {
    const { row, col } = tile.position;
    const nextPos = this.getNextPosition(row, col, direction);
    
    if (!this.isValidPosition(nextPos.row, nextPos.col)) {
      return false;
    }

    const nextTile = this._grid[nextPos.row][nextPos.col];
    
    // Can move to empty cell
    if (nextTile === null) {
      return true;
    }
    
    // Can merge with same value tile
    if (tile.canMergeWith(nextTile)) {
      return true;
    }

    return false;
  }

  private getNextPosition(row: number, col: number, direction: Direction): Position {
    switch (direction) {
      case 'up': return { row: row - 1, col };
      case 'down': return { row: row + 1, col };
      case 'left': return { row, col: col - 1 };
      case 'right': return { row, col: col + 1 };
    }
  }

  move(direction: Direction): void {

    // Process movement based on direction
    switch (direction) {
      case 'up':
        this.moveUp();
        break;
      case 'down':
        this.moveDown();
        break;
      case 'left':
        this.moveLeft();
        break;
      case 'right':
        this.moveRight();
        break;
    }

    // Reset merged flags after the move is complete
    this.getAllTiles().forEach(tile => tile.merged = false);
  }

  private moveUp(): void {
    for (let col = 0; col < this._size; col++) {
      this.moveColumn(col, 'up');
    }
  }

  private moveDown(): void {
    for (let col = 0; col < this._size; col++) {
      this.moveColumn(col, 'down');
    }
  }

  private moveLeft(): void {
    for (let row = 0; row < this._size; row++) {
      this.moveRow(row, 'left');
    }
  }

  private moveRight(): void {
    for (let row = 0; row < this._size; row++) {
      this.moveRow(row, 'right');
    }
  }

  private moveColumn(col: number, direction: 'up' | 'down'): void {
    const tiles: Tile[] = [];
    
    // Collect non-null tiles in the column
    for (let row = 0; row < this._size; row++) {
      const tile = this._grid[row][col];
      if (tile) {
        tiles.push(tile);
        this._grid[row][col] = null;
      }
    }

    // For DOWN direction, we need to merge from bottom to top
    const reversed = direction === 'down';
    const mergedTiles = this.mergeTiles(tiles, reversed);
    
    // For UP direction, start from position 0; for DOWN direction, start from the end
    const startPos = reversed ? this._size - 1 : 0;
    const beginAt: Position = { row: startPos, col };
    
    // For UP direction, we need to place tiles from top to bottom, so use positive direction vector
    // For DOWN direction, we need to place tiles from bottom to top, so use negative direction vector
    const directionVector: [number, number] = direction === 'up' ? [1, 0] : [-1, 0];
    this.placeTiles(beginAt, directionVector, mergedTiles);
  }

  private moveRow(row: number, direction: 'left' | 'right'): void {
    const tiles: Tile[] = [];
    
    // Collect non-null tiles in the row
    for (let col = 0; col < this._size; col++) {
      const tile = this._grid[row][col];
      if (tile) {
        tiles.push(tile);
        this._grid[row][col] = null;
      }
    }

    // For RIGHT direction, we need to merge from right to left
    const reversed = direction === 'right';
    const mergedTiles = this.mergeTiles(tiles, reversed);
    
    // For LEFT direction, start from position 0; for RIGHT direction, start from the end
    const startPos = reversed ? this._size - 1 : 0;
    const beginAt: Position = { row, col: startPos };
    
    // For RIGHT direction, we need to place tiles from right to left, so use negative direction vector
    // For LEFT direction, we need to place tiles from left to right, so use positive direction vector
    const directionVector: [number, number] = direction === 'right' ? [0, -1] : [0, 1];
    this.placeTiles(beginAt, directionVector, mergedTiles);
  }

  /**
   * Merge tiles from left to right (or right to left if reverse is true)
   * @param tiles - The tiles to merge
   * @param reverse - If true, merge from right to left instead of left to right
   * @returns The tiles after the merging process
   */
  private mergeTiles(tiles: Tile[], reverse: boolean = false): Tile[] {
    if (tiles.length === 0) return [];

    const tilesToProcess = reverse ? [...tiles].reverse() : tiles;
    const result: Tile[] = [];
    
    let i = 0;
    while (i < tilesToProcess.length) {
      const current = tilesToProcess[i];
      
      if (i + 1 < tilesToProcess.length && current.canMergeWith(tilesToProcess[i + 1])) {
        const merged = current.mergeWith(tilesToProcess[i + 1]);
        this._score += merged.value;
        result.push(merged);
        i += 2; // Skip next tile as it's merged
      } else {
        result.push(current);
        i++;
      }
    }

    return result;
  }
  
  /**
   * Place tiles back into the grid after merging
   * @param beginAt - The starting position to place tiles
   * @param directionVector - The direction vector [rowDelta, colDelta] indicating placement direction
   * @param tiles - The tiles to place
   */
  private placeTiles(beginAt: Position, directionVector: [number, number], tiles: Tile[]): void {
    const [rowDelta, colDelta] = directionVector;
    
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      const row = beginAt.row + (rowDelta * i);
      const col = beginAt.col + (colDelta * i);
      
      if (tile.position.row !== row || tile.position.col !== col) {
        tile.setPosition({ row, col });
      }
      this._grid[row][col] = tile;
    }
  }

  getAllTiles(): Tile[] {
    const tiles: Tile[] = [];
    for (let row = 0; row < this._size; row++) {
      for (let col = 0; col < this._size; col++) {
        const tile = this._grid[row][col];
        if (tile) {
          tiles.push(tile);
        }
      }
    }
    return tiles;
  }

  getState(): BoardState {
    return {
      grid: this.grid,
      size: this._size,
      score: this._score
    };
  }

  clear(): void {
    this._grid = this.createEmptyGrid();
    this._score = 0;
  }
} 