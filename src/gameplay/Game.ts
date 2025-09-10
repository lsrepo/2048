import { Tile, TileType } from './Tile';
import { Board, Direction, BoardState } from './Board';
import { cloneDeep } from 'lodash';

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  board: BoardState;
  status: GameStatus;
  bestScore: number;
}

export interface GameEvent {
  type: 'new_tile'
  data: {
    tile: Tile;
  }
}

export class Game {
  private readonly _board: Board;
  private _status: GameStatus;
  private _bestScore: number;
  private _eventListeners: ((event: GameEvent) => void)[];

  constructor(boardSize: number = 4, initialBestScore: number = 0) {
    this._board = new Board(boardSize);
    this._status = 'playing';
    this._bestScore = initialBestScore;
    this._eventListeners = [];
  }

  get board(): Board {
    return this._board;
  }

  get status(): GameStatus {
    return this._status;
  }

  get bestScore(): number {
    return this._bestScore;
  }

  get state(): GameState {
    return {
      board: this._board.getState(),
      status: this._status,
      bestScore: this._bestScore
    };
  }

  // Event system for React integration
  addEventListener(listener: (event: GameEvent) => void): void {
    this._eventListeners.push(listener);
  }

  removeEventListener(listener: (event: GameEvent) => void): void {
    this._eventListeners = this._eventListeners.filter(l => l !== listener);
  }

  private emitEvent(event: GameEvent): void {
    this._eventListeners.forEach(listener => listener(event));
  }

  // Game initialization
  start(): void {
    this._status = 'playing';
    this._board.clear();
    
    // Generate 2-15 tiles with value 2 randomly
    const numTiles = Math.floor(Math.random() * 14) + 2; // Random number between 2 and 15
    
    for (let i = 0; i < numTiles; i++) {
      this.addRandomTile('two-only');
    }

    this.addObstacle();
  }

  // Main game logic
  move(direction: Direction): void {
    if (this._status !== 'playing') {
      return;
    }

    if (!this.canMove(direction)) {
      return;
    }

    /**
     * There will always be some changes pass this point.
     * A merge or a move or game over or win.
     */
    this._board.move(direction);
    this.addRandomTile();

    // Check for win condition
    if (this.hasWon() && this._status === 'playing') {
      this._status = 'won';
    }

    // Check for game over
    if (this.isGameOver() && this._status === 'playing') {
      this._status = 'lost';
    }

    // Update best score if current score is higher
    if (this._board.score > this._bestScore) {
      this._bestScore = this._board.score;
    }

  }

  // Tile management
  addRandomTile(strategy: 'two-or-four' | 'two-only' = 'two-or-four'): void {
    const emptyPositions = this._board.getEmptyPositions();
    
    if (emptyPositions.length === 0) {
      return;
    }

    // Randomly select an empty position
    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    const position = emptyPositions[randomIndex];

    // Determine tile value based on strategy
    let value: number;
    switch (strategy) {
      case 'two-or-four':
        value = Math.random() < 0.5 ? 2 : 4;
        break;
      default:
        value = 2;
        break;
    }
    
    const tile = new Tile(value, position);
    this._board.addTile(tile);
    
    // Emit event with the specific tile that was added
    this.emitEvent({ type: 'new_tile', data: { tile } });
  }

  addObstacle(): void {
    const emptyPositions = this._board.getEmptyPositions();
    
    if (emptyPositions.length === 0) {
      return;
    }

    // Randomly select an empty position
    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    const position = emptyPositions[randomIndex];
    
    const tile = new Tile(0, position, TileType.OBSTACLE);
    this._board.addTile(tile);
    
    // Emit event with the specific tile that was added
    this.emitEvent({ type: 'new_tile', data: { tile } });
  }

  // Game state queries
  canMove(direction: Direction): boolean {
    return this._board.canMove(direction);
  }

  hasValidMoves(): boolean {
    return ['up', 'down', 'left', 'right'].some(direction => 
      this.canMove(direction as Direction)
    );
  }

  isGameOver(): boolean {
    if (this.hasEmptyCells()) {
      return false;
    }
    return !this.hasValidMoves();
  }

  hasWon(): boolean {
    return this._board.getAllTiles().some(tile => tile.value >= 2048);
  }

  private hasEmptyCells(): boolean {
    return this._board.getEmptyPositions().length > 0;
  }

  // Game control
  newGame(): void {
    this.start();
  }

  getAllTiles(): Tile[] {
    return this._board.getAllTiles();
  }

  // Debug/testing methods
  addTileAt(value: number, row: number, col: number): void {
    const position = { row, col };
    const tile = new Tile(value, position);
    this._board.addTile(tile);
  }

  getBoard(): (Tile | null)[][] {
    return cloneDeep(this._board.grid);
  }
} 