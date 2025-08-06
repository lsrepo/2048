import { Tile, Position } from './Tile';

describe('Tile', () => {
  let tile: Tile;
  let position: Position;

  beforeEach(() => {
    position = { row: 1, col: 2 };
    tile = new Tile(4, position);
  });

  describe('Constructor', () => {
    test('should create a tile with correct value and position', () => {
      expect(tile.value).toBe(4);
      expect(tile.position).toEqual(position);
      expect(tile.merged).toBe(false);
    });

    test('should generate unique ID if not provided', () => {
      const tile1 = new Tile(2, { row: 0, col: 0 });
      const tile2 = new Tile(2, { row: 0, col: 0 });

      expect(tile1.id).toBeDefined();
      expect(tile2.id).toBeDefined();
      expect(tile1.id).not.toBe(tile2.id);
    });

    test('should use provided ID', () => {
      const customId = 'custom-tile-id';
      const tile = new Tile(8, { row: 0, col: 0 }, customId);

      expect(tile.id).toBe(customId);
    });
  });

  describe('Position Management', () => {
    test('should return position copy to prevent external modification', () => {
      const originalPosition = tile.position;
      const newPosition = { row: 3, col: 4 };
      
      tile.setPosition(newPosition);
      
      expect(tile.position).toEqual(newPosition);
      expect(tile.position).not.toBe(newPosition); // Should be a copy
      expect(originalPosition).toEqual({ row: 1, col: 2 }); // Original unchanged
    });

    test('should update position correctly', () => {
      const newPosition = { row: 5, col: 6 };
      tile.setPosition(newPosition);
      
      expect(tile.position).toEqual(newPosition);
    });
  });

  describe('Merge State', () => {
    test('should have merged property with getter and setter', () => {
      expect(tile.merged).toBe(false);
      
      tile.merged = true;
      expect(tile.merged).toBe(true);
      
      tile.merged = false;
      expect(tile.merged).toBe(false);
    });
  });

  describe('Merging Logic', () => {
    test('should merge two tiles with same value', () => {
      const tile1 = new Tile(2, { row: 0, col: 0 });
      const tile2 = new Tile(2, { row: 0, col: 1 });
      
      const mergedTile = tile1.mergeWith(tile2);
      
      expect(mergedTile.value).toBe(4);
      expect(mergedTile.position).toEqual(tile1.position);
      expect(mergedTile.id).toBe(tile1.id);
      expect(mergedTile.merged).toBe(true);
    });

    test('should merge tiles with different values correctly', () => {
      const tile1 = new Tile(8, { row: 0, col: 0 });
      const tile2 = new Tile(8, { row: 0, col: 1 });
      
      const mergedTile = tile1.mergeWith(tile2);
      
      expect(mergedTile.value).toBe(16);
    });

    test('should preserve position of first tile in merge', () => {
      const tile1 = new Tile(4, { row: 2, col: 3 });
      const tile2 = new Tile(4, { row: 1, col: 1 });
      
      const mergedTile = tile1.mergeWith(tile2);
      
      expect(mergedTile.position).toEqual({ row: 2, col: 3 });
    });
  });

  describe('Merge Validation', () => {
    test('should allow merge of tiles with same value', () => {
      const tile1 = new Tile(4, { row: 0, col: 0 });
      const tile2 = new Tile(4, { row: 0, col: 1 });
      
      expect(tile1.canMergeWith(tile2)).toBe(true);
      expect(tile2.canMergeWith(tile1)).toBe(true);
    });

    test('should not allow merge of tiles with different values', () => {
      const tile1 = new Tile(2, { row: 0, col: 0 });
      const tile2 = new Tile(4, { row: 0, col: 1 });
      
      expect(tile1.canMergeWith(tile2)).toBe(false);
      expect(tile2.canMergeWith(tile1)).toBe(false);
    });

    test('should not allow merge if first tile is already merged', () => {
      const tile1 = new Tile(2, { row: 0, col: 0 });
      const tile2 = new Tile(2, { row: 0, col: 1 });
      
      tile1.merged = true;
      
      expect(tile1.canMergeWith(tile2)).toBe(false);
    });

    test('should not allow merge if second tile is already merged', () => {
      const tile1 = new Tile(2, { row: 0, col: 0 });
      const tile2 = new Tile(2, { row: 0, col: 1 });
      
      tile2.merged = true;
      
      expect(tile1.canMergeWith(tile2)).toBe(false);
    });

    test('should not allow merge if both tiles are merged', () => {
      const tile1 = new Tile(2, { row: 0, col: 0 });
      const tile2 = new Tile(2, { row: 0, col: 1 });
      
      tile1.merged = true;
      tile2.merged = true;
      
      expect(tile1.canMergeWith(tile2)).toBe(false);
    });
  });

  describe('Cloning', () => {
    test('should create exact copy of tile', () => {
      const originalTile = new Tile(16, { row: 2, col: 3 }, 'original-id');
      originalTile.merged = true;
      
      const clonedTile = originalTile.clone();
      
      expect(clonedTile.value).toBe(originalTile.value);
      expect(clonedTile.position).toEqual(originalTile.position);
      expect(clonedTile.id).toBe(originalTile.id);
      expect(clonedTile.merged).toBe(originalTile.merged);
    });

    test('should create independent copy', () => {
      const originalTile = new Tile(4, { row: 1, col: 1 });
      const clonedTile = originalTile.clone();
      
      // Modify cloned tile
      clonedTile.setPosition({ row: 5, col: 5 });
      clonedTile.merged = true;
      
      // Original should remain unchanged
      expect(originalTile.position).toEqual({ row: 1, col: 1 });
      expect(originalTile.merged).toBe(false);
      
      // Cloned should have new values
      expect(clonedTile.position).toEqual({ row: 5, col: 5 });
      expect(clonedTile.merged).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle zero value', () => {
      const tile = new Tile(0, { row: 0, col: 0 });
      expect(tile.value).toBe(0);
    });

    test('should handle large values', () => {
      const tile = new Tile(2048, { row: 0, col: 0 });
      expect(tile.value).toBe(2048);
    });

    test('should handle negative position coordinates', () => {
      const tile = new Tile(2, { row: -1, col: -2 });
      expect(tile.position).toEqual({ row: -1, col: -2 });
    });

    test('should handle large position coordinates', () => {
      const tile = new Tile(2, { row: 999, col: 999 });
      expect(tile.position).toEqual({ row: 999, col: 999 });
    });
  });

  describe('ID Generation', () => {
    test('should generate unique IDs for different tiles', () => {
      const tiles = Array.from({ length: 100 }, () => 
        new Tile(2, { row: 0, col: 0 })
      );
      
      const ids = tiles.map(tile => tile.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(100);
    });

    test('should generate IDs with expected format', () => {
      const tile = new Tile(2, { row: 0, col: 0 });
      
      expect(tile.id).toMatch(/^tile_\d+_[a-z0-9]{9}$/);
    });
  });
}); 