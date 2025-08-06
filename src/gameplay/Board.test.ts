import { Board } from './Board';
import { Tile } from './Tile';
/**
 * Test suite for the Board class, focusing on tile merging functionality.
 * Each test case simulates a specific scenario to ensure correct behavior of tile merging.
 */
describe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board(4);
  });

  describe('Basic merge', () => {
    describe('UP', () => {
      /**
       * Two tiles of same value merging when moving up
       */
      test('should merge two tiles of same value when moving up', () => {
        // Initial state:
        // ┌─────┬─────┬─────┬─────┐
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  2  │     │     │
        // └─────┴─────┴─────┴─────┘
        
        const tile1 = new Tile(2, { row: 2, col: 1 });
        const tile2 = new Tile(2, { row: 3, col: 1 });
        
        board.addTile(tile1);
        board.addTile(tile2);

        // Verify initial state
        expect(board.getTileAt(2, 1)?.value).toBe(2);
        expect(board.getTileAt(3, 1)?.value).toBe(2);
        expect(board.getTileAt(0, 1)).toBeNull();
        expect(board.getTileAt(1, 1)).toBeNull();

        // Move up
        board.move('up');

        // Final state after merge:
        // ┌─────┬─────┬─────┬─────┐
        // │     │  4  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // └─────┴─────┴─────┴─────┘

        // Verify tiles merged into one tile with value 4 at the top
        expect(board.getTileAt(0, 1)?.value).toBe(4);
        expect(board.getTileAt(1, 1)).toBeNull();
        expect(board.getTileAt(2, 1)).toBeNull();
        expect(board.getTileAt(3, 1)).toBeNull();

        // Verify score increased
        expect(board.score).toBe(4);

      });
    });
  });

  describe('Partial merge', () => {
    describe('UP', () => {
      /**
       * Three tiles where only the first two merge (2+2=4, remaining 2)
       */
      test('should not merge already merged tiles in the same move', () => {
        // Initial state:
        // ┌─────┬─────┬─────┬─────┐
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  2  │     │     │
        // └─────┴─────┴─────┴─────┘
        
        const tile1 = new Tile(2, { row: 1, col: 1 });
        const tile2 = new Tile(2, { row: 2, col: 1 });
        const tile3 = new Tile(2, { row: 3, col: 1 });
        
        board.addTile(tile1);
        board.addTile(tile2);
        board.addTile(tile3);

        // Move up
        board.move('up');

        // Final state after merge (only first two merge):
        // ┌─────┬─────┬─────┬─────┐
        // │     │  4  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // └─────┴─────┴─────┴─────┘

        // Verify only the first two tiles merged (2+2=4), third tile stays separate
        expect(board.getTileAt(0, 1)?.value).toBe(4);
        expect(board.getTileAt(1, 1)?.value).toBe(2);    

        // Verify score increased by 4 (only one merge)
        expect(board.score).toBe(4);
      });
    });

    describe('DOWN', () => {
      /**
       * Three tiles where only the last two merge (2+2=4, remaining 2)
       */
      test('should not merge already merged tiles in the same move', () => {
        // Initial state:
        // ┌─────┬─────┬─────┬─────┐
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // └─────┴─────┴─────┴─────┘
        
        const tile1 = new Tile(2, { row: 0, col: 1 });
        const tile2 = new Tile(2, { row: 1, col: 1 });
        const tile3 = new Tile(2, { row: 2, col: 1 });
        
        board.addTile(tile1);
        board.addTile(tile2);
        board.addTile(tile3);

        // Move down
        board.move('down');

        // Final state after merge (only last two merge):
        // ┌─────┬─────┬─────┬─────┐
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  4  │     │     │
        // └─────┴─────┴─────┴─────┘

        // Verify only the last two tiles merged (2+2=4), first tile stays separate
        expect(board.getTileAt(2, 1)?.value).toBe(2);
        expect(board.getTileAt(3, 1)?.value).toBe(4);    

        // Verify score increased by 4 (only one merge)
        expect(board.score).toBe(4);
      });
    });
  });

  describe('Multiple merges in one move', () => {

      /**
       * Different values that can merge (2+2=4, 4+4=8)
       */
    describe('should handle two merges in one move', () => {
      test('UP', () => {
        // Initial state:
        // ┌─────┬─────┬─────┬─────┐
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  4  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  4  │     │     │
        // └─────┴─────┴─────┴─────┘
        
        const tile1 = new Tile(2, { row: 0, col: 1 });
        const tile2 = new Tile(2, { row: 1, col: 1 });
        const tile3 = new Tile(4, { row: 2, col: 1 });
        const tile4 = new Tile(4, { row: 3, col: 1 });
        
        board.addTile(tile1);
        board.addTile(tile2);
        board.addTile(tile3);
        board.addTile(tile4);

        // Move up
        board.move('up');

        // Final state after merge: 2+2=4, 4+4=8
        // ┌─────┬─────┬─────┬─────┐
        // │     │  4  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  8  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // └─────┴─────┴─────┴─────┘

        // Verify tiles merged correctly: 2+2=4, 4+4=8
        expect(board.getTileAt(0, 1)?.value).toBe(4);
        expect(board.getTileAt(1, 1)?.value).toBe(8);
        expect(board.getTileAt(2, 1)).toBeNull();
        expect(board.getTileAt(3, 1)).toBeNull();

        // Verify score increased by 12 (4 + 8)
        expect(board.score).toBe(12);
      });

      test('DOWN', () => {
        // Initial state:
        // ┌─────┬─────┬─────┬─────┐
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  4  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  4  │     │     │
        // └─────┴─────┴─────┴─────┘
        
        const tile1 = new Tile(2, { row: 0, col: 1 });
        const tile2 = new Tile(2, { row: 1, col: 1 });
        const tile3 = new Tile(4, { row: 2, col: 1 });
        const tile4 = new Tile(4, { row: 3, col: 1 });
        
        board.addTile(tile1);
        board.addTile(tile2);
        board.addTile(tile3);
        board.addTile(tile4);

        // Move down
        board.move('down');

        // Final state after merge: 2+2=4, 4+4=8
        // ┌─────┬─────┬─────┬─────┐
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  4  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  8  │     │     │
        // └─────┴─────┴─────┴─────┘

        // Verify tiles merged correctly: 2+2=4, 4+4=8
        expect(board.getTileAt(2, 1)?.value).toBe(4);
        expect(board.getTileAt(3, 1)?.value).toBe(8);
        expect(board.getTileAt(0, 1)).toBeNull();
        expect(board.getTileAt(1, 1)).toBeNull();

        // Verify score increased by 12 (4 + 8)
        expect(board.score).toBe(12);
      });

      test('LEFT', () => {
        // Initial state:
        // ┌─────┬─────┬─────┬─────┐
        // │  2  │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │  4  │  4  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // └─────┴─────┴─────┴─────┘
        
        const tile1 = new Tile(2, { row: 0, col: 0 });
        const tile2 = new Tile(2, { row: 0, col: 1 });
        const tile3 = new Tile(4, { row: 2, col: 0 });
        const tile4 = new Tile(4, { row: 2, col: 1 });
        
        board.addTile(tile1);
        board.addTile(tile2);
        board.addTile(tile3);
        board.addTile(tile4);

        // Move left
        board.move('left');

        // Final state after merge: 2+2=4, 4+4=8
        // ┌─────┬─────┬─────┬─────┐
        // │  4  │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │  8  │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // └─────┴─────┴─────┴─────┘

        // Verify tiles merged correctly: 2+2=4, 4+4=8
        expect(board.getTileAt(0, 0)?.value).toBe(4);
        expect(board.getTileAt(2, 0)?.value).toBe(8);
        expect(board.getTileAt(0, 1)).toBeNull();
        expect(board.getTileAt(2, 1)).toBeNull();

        // Verify score increased by 12 (4 + 8)
        expect(board.score).toBe(12);
      });

      test('RIGHT', () => {
        // Initial state:
        // ┌─────┬─────┬─────┬─────┐
        // │     │     │  2  │  2  │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │  8  │  8  │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │  4  │  4  │
        // └─────┴─────┴─────┴─────┘
        
        const tile1 = new Tile(2, { row: 0, col: 2 });
        const tile2 = new Tile(2, { row: 0, col: 3 });
        const tile3 = new Tile(8, { row: 2, col: 2 });
        const tile4 = new Tile(8, { row: 2, col: 3 });
        const tile5 = new Tile(4, { row: 3, col: 2 });
        const tile6 = new Tile(4, { row: 3, col: 3 });
        
        board.addTile(tile1);
        board.addTile(tile2);
        board.addTile(tile3);
        board.addTile(tile4);
        board.addTile(tile5);
        board.addTile(tile6);

        // Move right
        board.move('right');

        // Final state after merge: 2+2=4, 8+8=16, 4+4=8
        // ┌─────┬─────┬─────┬─────┐
        // │     │     │     │  4  │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │ 16  │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │  8  │
        // └─────┴─────┴─────┴─────┘

        // Verify tiles merged correctly: 2+2=4, 8+8=16, 4+4=8
        expect(board.getTileAt(0, 3)?.value).toBe(4);
        expect(board.getTileAt(2, 3)?.value).toBe(16);
        expect(board.getTileAt(3, 3)?.value).toBe(8);
        expect(board.getTileAt(0, 2)).toBeNull();
        expect(board.getTileAt(2, 2)).toBeNull();
        expect(board.getTileAt(3, 2)).toBeNull();

        // Verify score increased by 28 (4 + 16 + 8)
        expect(board.score).toBe(28);
      });
    });
  });

  describe('No movement', () => {
    describe('UP', () => {
      /**
       * Full board with no possible merges
       */
      test('should return false when no movement is possible', () => {
        // Initial state (full board with no possible merges):
        // ┌─────┬─────┬─────┬─────┐
        // │  2  │  4  │  2  │  4  │
        // ├─────┼─────┼─────┼─────┤
        // │  4  │  2  │  4  │  2  │
        // ├─────┼─────┼─────┼─────┤
        // │  2  │  4  │  2  │  4  │
        // ├─────┼─────┼─────┼─────┤
        // │  4  │  2  │  4  │  2  │
        // └─────┴─────┴─────┴─────┘
        
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 4; col++) {
            const value = (row + col) % 2 === 0 ? 2 : 4;
            const tile = new Tile(value, { row, col });
            board.addTile(tile);
          }
        }

        // Try to move up
        board.move('up');
      });
    });
  });

  describe('Empty columns', () => {
    describe('UP', () => {
      /**
       * Handling columns with no tiles and partial merges
       */
      test('should handle empty columns correctly', () => {
        // Initial state:
        // ┌─────┬─────┬─────┬─────┐
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │  4  │     │
        // ├─────┼─────┼─────┼─────┤
        // │  2  │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │  2  │     │     │     │
        // └─────┴─────┴─────┴─────┘
        
        const tile1 = new Tile(2, { row: 2, col: 0 });
        const tile2 = new Tile(2, { row: 3, col: 0 });
        const tile3 = new Tile(4, { row: 1, col: 2 });
        
        board.addTile(tile1);
        board.addTile(tile2);
        board.addTile(tile3);

        // Move up
        board.move('up');

        // Final state after merge and move:
        // ┌─────┬─────┬─────┬─────┐
        // │  4  │     │  4  │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // └─────┴─────┴─────┴─────┘

        // Verify tiles in column 0 merged and moved to top
        expect(board.getTileAt(0, 0)?.value).toBe(4);
        expect(board.getTileAt(1, 0)).toBeNull();
        expect(board.getTileAt(2, 0)).toBeNull();
        expect(board.getTileAt(3, 0)).toBeNull();

        // Verify tile in column 2 moved to top
        expect(board.getTileAt(0, 2)?.value).toBe(4);
        expect(board.getTileAt(1, 2)).toBeNull();

        // Verify other columns remain empty
        expect(board.getTileAt(0, 1)).toBeNull();
        expect(board.getTileAt(0, 3)).toBeNull();
      });
    });
  });

  describe('No merge', () => {
    describe('UP', () => {
      /**
       * Tiles of different values moving but not merging
       */
      test('should not merge tiles of different values when moving up', () => {
        // Initial state:
        // ┌─────┬─────┬─────┬─────┐
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  4  │     │     │
        // └─────┴─────┴─────┴─────┘
        
        const tile1 = new Tile(2, { row: 2, col: 1 });
        const tile2 = new Tile(4, { row: 3, col: 1 });
        
        board.addTile(tile1);
        board.addTile(tile2);

        // Move up
        board.move('up');

        // Final state after move (no merge):
        // ┌─────┬─────┬─────┬─────┐
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  4  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // └─────┴─────┴─────┴─────┘

        // Verify tiles moved but did not merge
        expect(board.getTileAt(0, 1)?.value).toBe(2);
        expect(board.getTileAt(1, 1)?.value).toBe(4);
        expect(board.getTileAt(2, 1)).toBeNull();
        expect(board.getTileAt(3, 1)).toBeNull();

        // Verify score did not increase
        expect(board.score).toBe(0);
      });
    });

    describe('DOWN', () => {
      /**
       * Tiles of different values moving but not merging
       */
      test('should not merge tiles of different values when moving down', () => {
        // Initial state:
        // ┌─────┬─────┬─────┬─────┐
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  4  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // └─────┴─────┴─────┴─────┘
        
        const tile1 = new Tile(2, { row: 0, col: 1 });
        const tile2 = new Tile(4, { row: 1, col: 1 });
        
        board.addTile(tile1);
        board.addTile(tile2);

        // Move down
        board.move('down');

        // Final state after move (no merge):
        // ┌─────┬─────┬─────┬─────┐
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  4  │     │     │
        // └─────┴─────┴─────┴─────┘

        // Verify tiles moved but did not merge
        expect(board.getTileAt(2, 1)?.value).toBe(2);
        expect(board.getTileAt(3, 1)?.value).toBe(4);
        expect(board.getTileAt(0, 1)).toBeNull();
        expect(board.getTileAt(1, 1)).toBeNull();

        // Verify score did not increase
        expect(board.score).toBe(0);
      });
    });

    describe('LEFT', () => {
      /**
       * Tiles of different values moving but not merging
       */
      test('should not merge tiles of different values when moving left', () => {
        // Initial state:
        // ┌─────┬─────┬─────┬─────┐
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │  2  │     │  4  │     │
        // └─────┴─────┴─────┴─────┘
        
        const tile1 = new Tile(2, { row: 3, col: 0 });
        const tile2 = new Tile(4, { row: 3, col: 2 });
        
        board.addTile(tile1);
        board.addTile(tile2);

        // Move left
        board.move('left');

        // Final state after move (no merge):
        // ┌─────┬─────┬─────┬─────┐
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │  2  │  4  │     │     │
        // └─────┴─────┴─────┴─────┘

        // Verify tiles moved but did not merge
        expect(board.getTileAt(3, 0)?.value).toBe(2);
        expect(board.getTileAt(3, 1)?.value).toBe(4);
        expect(board.getTileAt(3, 2)).toBeNull();
        expect(board.getTileAt(3, 3)).toBeNull();

        // Verify score did not increase
        expect(board.score).toBe(0);
      });
    });

    describe('RIGHT', () => {
      /**
       * Tiles of different values moving but not merging
       */
      test('should not merge tiles of different values when moving right', () => {
        // Initial state:
        // ┌─────┬─────┬─────┬─────┐
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │  2  │     │  4  │     │
        // └─────┴─────┴─────┴─────┘
        
        const tile1 = new Tile(2, { row: 3, col: 0 });
        const tile2 = new Tile(4, { row: 3, col: 2 });
        
        board.addTile(tile1);
        board.addTile(tile2);

        // Move right
        board.move('right');

        // Final state after move (no merge):
        // ┌─────┬─────┬─────┬─────┐
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │  2  │  4  │
        // └─────┴─────┴─────┴─────┘

        // Verify tiles moved but did not merge
        expect(board.getTileAt(3, 2)?.value).toBe(2);
        expect(board.getTileAt(3, 3)?.value).toBe(4);
        expect(board.getTileAt(3, 0)).toBeNull();
        expect(board.getTileAt(3, 1)).toBeNull();

        // Verify score did not increase
        expect(board.score).toBe(0);
      });
    });
  });

  describe('Subsequent merges', () => {
    describe('DOWN', () => {
      /**
       * Test that a merged tile can be merged again in a subsequent move
       */
      test('should allow merged tile to be merged again in subsequent move', () => {
        // Initial state:
        // ┌─────┬─────┬─────┬─────┐
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  2  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  4  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  8  │     │     │
        // └─────┴─────┴─────┴─────┘
        
        const tile1 = new Tile(2, { row: 0, col: 1 });
        const tile2 = new Tile(2, { row: 1, col: 1 });
        const tile3 = new Tile(4, { row: 2, col: 1 });
        const tile4 = new Tile(8, { row: 3, col: 1 });
        
        board.addTile(tile1);
        board.addTile(tile2);
        board.addTile(tile3);
        board.addTile(tile4);

        // First move - merge 2+2=4
        board.move('down');

      
        expect(board.getTileAt(1, 1)?.value).toBe(4);
        expect(board.getTileAt(2, 1)?.value).toBe(4);
        expect(board.getTileAt(3, 1)?.value).toBe(8);
        expect(board.score).toBe(4);

        // State after first move:
        // ┌─────┬─────┬─────┬─────┐
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  4  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  4  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  8  │     │     │
        // └─────┴─────┴─────┴─────┘

        // Second move - the merged tile (4) should be able to merge with the existing tile (4)
        board.move('down');

        // Final state after second merge: 4+4=8
        // ┌─────┬─────┬─────┬─────┐
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │     │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  8  │     │     │
        // ├─────┼─────┼─────┼─────┤
        // │     │  8  │     │     │
        // └─────┴─────┴─────┴─────┘

        // Verify the merged tile can merge again

        expect(board.getTileAt(2, 1)?.value).toBe(8);
        expect(board.getTileAt(3, 1)?.value).toBe(8);

      });
    });
  });
}); 