import { Game } from './Game';

describe('Game - Game Over State', () => {
  let game: Game;

  beforeEach(() => {
    // Create a new game instance
    game = new Game(4);
  });

  describe('Game Over State Management', () => {
    test('should start in playing state', () => {
      game.start();
      expect(game.status).toBe('playing');
    });

    test('should start new game correctly', () => {
      // Start the game
      game.start();
      expect(game.status).toBe('playing');

      // Start new game
      game.newGame();

      // Verify that game is in playing state
      expect(game.status).toBe('playing');
    });

    test('should not allow moves when game is not in playing state', () => {
      // Manually set game to won state
      (game as any)._status = 'won';
      
      // Try to make a move
      game.move('up');

      // Verify that move was not allowed
      expect(game.status).toBe('won');
    });

    test('should not allow moves when game is lost', () => {
      // Manually set game to lost state
      (game as any)._status = 'lost';
      
      // Try to make a move
      game.move('up');

      // Verify that move was not allowed
      expect(game.status).toBe('lost');
    });
  });

  describe('Event System', () => {
    test('should emit events when listeners are added', () => {
      const eventListener = jest.fn();
      game.addEventListener(eventListener);

      // Start the game to trigger events
      game.start();

      // Verify that events were emitted (new_tile events)
      expect(eventListener).toHaveBeenCalled();
    });

    test('should remove event listeners', () => {
      const eventListener = jest.fn();
      game.addEventListener(eventListener);
      game.removeEventListener(eventListener);

      // Start the game
      game.start();

      // Verify that no events were emitted to the removed listener
      expect(eventListener).not.toHaveBeenCalled();
    });
  });

  describe('Obstacle Management', () => {

    test('should have one obstacle on the board after game starts', () => {
      // Start the game
      game.start();
      
      // Get all tiles and count obstacles
      const allTiles = game.getAllTiles();
      const obstacles = allTiles.filter(tile => tile.isObstacle());
      
      // Verify there is exactly one obstacle
      expect(obstacles).toHaveLength(1);
    });
  });

  describe('Game State Queries', () => {
    test('should report correct game status', () => {
      expect(game.status).toBe('playing');
      expect(game.isGameOver()).toBe(false);
      expect(game.hasWon()).toBe(false);
    });


    test('should report valid moves availability', () => {
      game.start();
      // Just test that the methods exist and don't throw errors
      expect(typeof game.hasValidMoves()).toBe('boolean');
      expect(typeof game.canMove('up')).toBe('boolean');
    });

    test('should end game when moving up from almost full board', () => {
      // Start the game
      game.start();
      
      // Configure the board to the specified layout:
      // ┌─────┬─────┬─────┬─────┐
      // │  2  │  4  │  2  │     │
      // ├─────┼─────┼─────┼─────┤
      // │  4  │  2  │  8  │ 64  │
      // ├─────┼─────┼─────┼─────┤
      // │  2  │  4  │  2  │ 16  │
      // ├─────┼─────┼─────┼─────┤
      // │  4  │  2  │  8  │ 32  │
      // └─────┴─────┴─────┴─────┘
      
      // Clear the board first
      game.board.clear();
      
      // Add tiles in the specified positions
      game.addTileAt(2, 0, 0);   // Row 0, Col 0
      game.addTileAt(4, 0, 1);   // Row 0, Col 1
      game.addTileAt(2, 0, 2);   // Row 0, Col 2
      // Row 0, Col 3 is empty
      
      game.addTileAt(4, 1, 0);   // Row 1, Col 0
      game.addTileAt(2, 1, 1);   // Row 1, Col 1
      game.addTileAt(8, 1, 2);   // Row 1, Col 2
      game.addTileAt(64, 1, 3);  // Row 1, Col 3
      
      game.addTileAt(2, 2, 0);   // Row 2, Col 0
      game.addTileAt(4, 2, 1);   // Row 2, Col 1
      game.addTileAt(2, 2, 2);   // Row 2, Col 2
      game.addTileAt(16, 2, 3);  // Row 2, Col 3
      
      game.addTileAt(4, 3, 0);   // Row 3, Col 0
      game.addTileAt(2, 3, 1);   // Row 3, Col 1
      game.addTileAt(8, 3, 2);   // Row 3, Col 2
      game.addTileAt(32, 3, 3);  // Row 3, Col 3
      
      // Verify the game is still in playing state before the move
      expect(game.status).toBe('playing');
      expect(game.isGameOver()).toBe(false);
      
      // Debug: Check board state before move
      console.log('Empty positions before move:', game.board.getEmptyPositions().length);
      console.log('Can move up before move:', game.canMove('up'));
      
      // Player clicks up - this should lead to game over
      game.move('up');
      
      // Debug: Check board state after move
      console.log('Empty positions after move:', game.board.getEmptyPositions().length);
      console.log('Is game over after move:', game.isGameOver());
      console.log('Game status after move:', game.status);
      
      // Verify that the move was made and game is now over
      expect(game.status).toBe('lost');
      expect(game.isGameOver()).toBe(true);
    });
  });

  describe('Winning Game', () => {
    test('should win game when creating 2048 tile', () => {
      // Start the game
      game.start();
      
      // Configure the board to have two 1024 tiles that can merge:
      // ┌─────┬─────┬─────┬─────┐
      // │     │     │     │     │
      // ├─────┼─────┼─────┼─────┤
      // │     │     │     │     │
      // ├─────┼─────┼─────┼─────┤
      // │     │     │     │     │
      // ├─────┼─────┼─────┼─────┤
      // │ 1024│     │ 1024│     │
      // └─────┴─────┴─────┴─────┘
      
      // Clear the board first
      game.board.clear();
      
      // Add two 1024 tiles that can merge horizontally
      game.addTileAt(1024, 3, 0);  // Row 3, Col 0
      game.addTileAt(1024, 3, 2);  // Row 3, Col 2
      
      // Verify the game is still in playing state before the move
      expect(game.status).toBe('playing');
      expect(game.hasWon()).toBe(false);
      
      // Debug: Check board state before move
      console.log('Has winning tile before move:', game.hasWon());
      console.log('Can move left before move:', game.canMove('left'));
      
      // Player clicks left - this should merge the 1024 tiles to create 2048 and win
      game.move('left');
      
      // Debug: Check board state after move
      console.log('Has winning tile after move:', game.hasWon());
      console.log('Game status after move:', game.status);
      console.log('Has won after move:', game.hasWon());
      
      // Verify that the move was made and game is now won
      expect(game.status).toBe('won');
      expect(game.hasWon()).toBe(true);
    });
  });
}); 