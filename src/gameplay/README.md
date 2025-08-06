# 2048 Game Logic Architecture

Core game logic implemented in TypeScript with three main classes:

**Tile** - Individual tile with value, position, and merge logic. Handles tile merging and prevents double-merges.

**Board** - 2D grid manager that handles tile movement, merging, score tracking, and game state validation.

**Game** - Main orchestrator that manages game flow, random tile generation, events, and provides the primary interface.

Key interfaces: Position (row/col), Direction (up/down/left/right), GameStatus (playing/won/lost).

Usage: Create Game instance, call start(), then move() with directions. Events notify UI of state changes. 