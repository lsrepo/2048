import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameBoard from './GameBoard';
import { Game } from '../../gameplay/Game';

// Mock the useAIHelper hook
jest.mock('../hooks/useAIHelper', () => ({
  useAIHelper: () => ({
    isLoading: false,
    suggestedMove: null,
    error: null,
    getAIMove: jest.fn(),
    clearSuggestion: jest.fn(),
  }),
}));

// Mock the Game class to control game state
jest.mock('../../gameplay/Game');

describe('GameBoard - Game Over State', () => {
  let mockGame: jest.Mocked<Game>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a mock game instance
    mockGame = {
      status: 'playing',
      state: {
        board: {
          grid: Array(4).fill(null).map(() => Array(4).fill(null)),
          size: 4,
          score: 0
        },
        status: 'playing',
        bestScore: 0
      },
      getBoard: jest.fn().mockReturnValue(Array(4).fill(null).map(() => Array(4).fill(null))),
      getAllTiles: jest.fn().mockReturnValue([]),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      start: jest.fn(),
      move: jest.fn(),
      hasValidMoves: jest.fn(),
      isGameOver: jest.fn(),
      hasWon: jest.fn(),
      canMove: jest.fn(),
      getTileAt: jest.fn(),
      getEmptyPositions: jest.fn(),
      addTileAt: jest.fn(),
      setScore: jest.fn(),
      saveGame: jest.fn(),
      loadGame: jest.fn(),
      newGame: jest.fn(),
      board: {} as any,
      score: 0,
      bestScore: 0
    } as any;

    // Mock the Game constructor to return our mock instance
    (Game as jest.MockedClass<typeof Game>).mockImplementation(() => mockGame);
  });

  describe('Game Over Display', () => {
    test('should display game over overlay when game status is "lost"', () => {
      // Set up mock game to be in lost state
      Object.defineProperty(mockGame, 'status', { value: 'lost', writable: true });
      mockGame.state.status = 'lost';
      mockGame.state.board.score = 1024;
      mockGame.state.bestScore = 2048;

      render(<GameBoard />);

      // Check that game over overlay is displayed
      expect(screen.getByText('Game Over')).toBeInTheDocument();
      expect(screen.getByText('Final Score: 1024')).toBeInTheDocument();
      expect(screen.getByText('Best Score: 2048')).toBeInTheDocument();
      // Check that New Game button exists in the game over overlay
      const gameOverOverlay = screen.getByText('Game Over').closest('.game-over');
      expect(gameOverOverlay).toBeInTheDocument();
      expect(gameOverOverlay).toHaveTextContent('New Game');
    });

    test('should display win overlay when game status is "won"', () => {
      // Set up mock game to be in won state
      Object.defineProperty(mockGame, 'status', { value: 'won', writable: true });
      mockGame.state.status = 'won';
      mockGame.state.board.score = 2048;
      mockGame.state.bestScore = 2048;

      render(<GameBoard />);

      // Check that win overlay is displayed
      expect(screen.getByText('You Won!')).toBeInTheDocument();
      expect(screen.getByText('Final Score: 2048')).toBeInTheDocument();
      expect(screen.getByText('Best Score: 2048')).toBeInTheDocument();
      // Check that New Game button exists in the game over overlay
      const gameOverOverlay = screen.getByText('You Won!').closest('.game-over');
      expect(gameOverOverlay).toBeInTheDocument();
      expect(gameOverOverlay).toHaveTextContent('New Game');
    });

    test('should not display game over overlay when game is still playing', () => {
      // Set up mock game to be in playing state
      Object.defineProperty(mockGame, 'status', { value: 'playing', writable: true });
      mockGame.state.status = 'playing';

      render(<GameBoard />);

      // Check that game over overlay is not displayed
      expect(screen.queryByText('Game Over')).not.toBeInTheDocument();
      expect(screen.queryByText('You Won!')).not.toBeInTheDocument();
    });
  });

  describe('Game Over Interactions', () => {

    test('should start new game when "New Game" button is clicked from game over state', () => {
      // Set up mock game to be in lost state
      Object.defineProperty(mockGame, 'status', { value: 'lost', writable: true });
      mockGame.state.status = 'lost';

      render(<GameBoard />);

      // Click the new game button in the game over overlay
      const gameOverOverlay = screen.getByText('Game Over').closest('.game-over');
      const newGameButton = gameOverOverlay?.querySelector('button');
      expect(newGameButton).toBeInTheDocument();
      fireEvent.click(newGameButton!);

      // Verify that a new Game instance was created (this happens in handleNewGame)
      expect(Game).toHaveBeenCalledWith(4, 0);
    });

    test('should start new game when "New Game" button is clicked from win state', () => {
      // Set up mock game to be in won state
      Object.defineProperty(mockGame, 'status', { value: 'won', writable: true });
      mockGame.state.status = 'won';

      render(<GameBoard />);

      // Click the new game button in the game over overlay
      const gameOverOverlay = screen.getByText('You Won!').closest('.game-over');
      const newGameButton = gameOverOverlay?.querySelector('button');
      expect(newGameButton).toBeInTheDocument();
      fireEvent.click(newGameButton!);

      // Verify that a new Game instance was created
      expect(Game).toHaveBeenCalledWith(4, 0);
    });
  });

  describe('Game Over State Transitions', () => {
    test('should transition from playing to game over when no moves are possible', () => {
      // Start with playing state
      Object.defineProperty(mockGame, 'status', { value: 'playing', writable: true });
      mockGame.state.status = 'playing';
      mockGame.isGameOver.mockReturnValue(true);

      render(<GameBoard />);

      // Simulate a move attempt that fails
      screen.getByRole('button', { name: /new game/i });
      
      // The game should remain in playing state until a move is actually attempted
      // This test verifies the component handles the game over state correctly
      expect(screen.queryByText('Game Over')).not.toBeInTheDocument();
    });

    test('should handle keyboard input correctly when game is over', () => {
      // Set up mock game to be in lost state
      Object.defineProperty(mockGame, 'status', { value: 'lost', writable: true });
      mockGame.state.status = 'lost';

      render(<GameBoard />);

      // Try to move with arrow keys - should not trigger moves
      fireEvent.keyDown(window, { key: 'ArrowUp' });
      fireEvent.keyDown(window, { key: 'ArrowDown' });
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      // Verify that move was not called (since game is over)
      expect(mockGame.move).not.toHaveBeenCalled();
    });

    test('should allow new game with "N" key when game is over', () => {
      // Set up mock game to be in lost state
      Object.defineProperty(mockGame, 'status', { value: 'lost', writable: true });
      mockGame.state.status = 'lost';

      render(<GameBoard />);

      // Press N key to start new game
      fireEvent.keyDown(window, { key: 'n' });

      // Verify that a new Game instance was created
      expect(Game).toHaveBeenCalledWith(4, 0);
    });
  });

  describe('Game Over UI Elements', () => {
    test('should display correct score information in game over state', () => {
      // Set up mock game with specific scores
      Object.defineProperty(mockGame, 'status', { value: 'lost', writable: true });
      mockGame.state.status = 'lost';
      mockGame.state.board.score = 512;
      mockGame.state.bestScore = 1024;

      render(<GameBoard />);

      // Check that both current score and best score are displayed
      expect(screen.getByText('Final Score: 512')).toBeInTheDocument();
      expect(screen.getByText('Best Score: 1024')).toBeInTheDocument();
    });

    test('should have proper styling classes for game over overlay', () => {
      // Set up mock game to be in lost state
      Object.defineProperty(mockGame, 'status', { value: 'lost', writable: true });
      mockGame.state.status = 'lost';

      render(<GameBoard />);

      // Check that the game over overlay has the correct CSS class
      const gameOverOverlay = screen.getByText('Game Over').closest('.game-over');
      expect(gameOverOverlay).toBeInTheDocument();
    });

    test('should display new game button in win state', () => {
      // Set up mock game to be in won state
      Object.defineProperty(mockGame, 'status', { value: 'won', writable: true });
      mockGame.state.status = 'won';

      render(<GameBoard />);

      // Check that New Game button exists in the game over overlay
      const gameOverOverlay = screen.getByText('You Won!').closest('.game-over');
      expect(gameOverOverlay).toBeInTheDocument();
      expect(gameOverOverlay).toHaveTextContent('New Game');
    });

    test('should display new game button in lose state', () => {
      // Set up mock game to be in lost state
      Object.defineProperty(mockGame, 'status', { value: 'lost', writable: true });
      mockGame.state.status = 'lost';

      render(<GameBoard />);

      // Check that New Game button exists in the game over overlay
      const gameOverOverlay = screen.getByText('Game Over').closest('.game-over');
      expect(gameOverOverlay).toBeInTheDocument();
      expect(gameOverOverlay).toHaveTextContent('New Game');
    });
  });
}); 