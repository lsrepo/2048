import React, { useState, useEffect, useCallback } from 'react';
import {Game, GameEvent} from '../../gameplay/Game';
import { Direction } from '../../gameplay/Board';
import { Tile } from '../../gameplay/Tile';
import AIButton from './AIButton';
import { useAIHelper } from '../hooks/useAIHelper';

const BEST_SCORE_KEY = '2048_best_score';

// Local storage utilities
const loadBestScore = (): number => {
  try {
    const savedScore = localStorage.getItem(BEST_SCORE_KEY);
    return savedScore ? parseInt(savedScore, 10) : 0;
  } catch (error) {
    console.warn('Failed to load best score from localStorage:', error);
    return 0;
  }
};

const saveBestScore = (score: number): void => {
  try {
    localStorage.setItem(BEST_SCORE_KEY, score.toString());
  } catch (error) {
    console.warn('Failed to save best score to localStorage:', error);
  }
};

const GameBoard: React.FC = () => {
  const [game, setGame] = useState<Game>(() => {
    const initialBestScore = loadBestScore();
    return new Game(4, initialBestScore);
  });
  const [board, setBoard] = useState<(Tile|null)[][]>(game.getBoard());
  const [animationState, setAnimationState] = useState<{
    newTiles: Set<string>;
    mergedTiles: Set<string>;
  }>({
    newTiles: new Set(),
    mergedTiles: new Set()
  });
  
  const { clearSuggestion, isLoading, suggestedMove, error, getAIMove } = useAIHelper();

  // Save best score whenever it changes
  useEffect(() => {
    const currentBestScore = game.bestScore;
    if (currentBestScore > 0) {
      saveBestScore(currentBestScore);
    }
  }, [game.bestScore]);

  // Initialize game
  useEffect(() => {
    game.addEventListener(handleGameEvent);
    game.start();
    setBoard(game.getBoard());
    return () => {
      game.removeEventListener(handleGameEvent);
    };
  }, [game]);

  const handleGameEvent = useCallback((event: GameEvent) => {
    if (event.type === 'new_tile') {
      const newTile = event.data.tile;
      if (newTile) {
        setAnimationState(prev => ({
          ...prev,
          newTiles: new Set([...prev.newTiles, newTile.id])
        }));

        // Clear new tile animation after animation completes
        setTimeout(() => {
          setAnimationState(prev => ({
            ...prev,
            newTiles: new Set([...prev.newTiles].filter(id => id !== newTile.id))
          }));
        }, 300);
      }
    }
  }, [game]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (game.status !== 'playing') return;

      let direction: Direction | null = null;
      
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          direction = 'up';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          direction = 'down';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          direction = 'left';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          direction = 'right';
          break;
        case 'n':
        case 'N':
          handleNewGame();
          return;
        case 'i':
        case 'I':
          event.preventDefault();

          getAIMove( game.getBoard().map(row =>
            row.map(tile => tile ? tile.value : null)
          )).catch(error => {
            console.error('Failed to get AI move:', error);
          });
          return;
        default:
          return;
      }

      if (direction) {
        event.preventDefault();
        game.move(direction);
        setBoard(game.getBoard());
        clearSuggestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game]);

  const handleNewGame = () => {
    const currentBestScore = game.bestScore;
    const newGame = new Game(4, currentBestScore);
    setGame(newGame);
    setAnimationState({
      newTiles: new Set(),
      mergedTiles: new Set()
    });
    
    // Clear AI suggestion when starting a new game
    clearSuggestion();
  };





  const getCellClass = (tile: Tile | null): string => {
    if (!tile) return 'cell empty';
    
    const baseClass = `cell tile-${tile.value}`;
    const classes = [baseClass];
    
    if (animationState.newTiles.has(tile.id)) {
      classes.push('new');
    }
    
    if (animationState.mergedTiles.has(tile.id)) {
      classes.push('merged');
    }
    
    return classes.join(' ');
  };

  const renderCell = (tile: Tile | null, row: number, col: number) => {
    const cellClass = getCellClass(tile);
    // Include value in key for proper React tracking of value changes
    const key = tile ? `${tile.id}-${tile.value}-${row}-${col}` : `empty-${row}-${col}`;
    
    return (
      <div key={key} className={cellClass}>
        {tile ? (tile.type === 'obstacle' ? '🗿' : tile.value) : ''}
      </div>
    );
  };

  const renderGameOver = () => {
    if (game.status === 'playing') return null;

    const isWin = game.status === 'won';
    const gameState = game.state;
    
    return (
      <div className="game-over">
        <div className="game-over-content">
          <h2>{isWin ? 'You Won!' : 'Game Over'}</h2>
          <p>Final Score: {gameState.board.score}</p>
          <p>Best Score: {gameState.bestScore}</p>
          <button onClick={handleNewGame}>
            New Game
          </button>
        </div>
      </div>
    );
  };

  const gameState = game.state;

  return (
    <>
      <div className="game-container">
        <div className="game-info">
          <div className="score-container">
            <div className="score-label">Score</div>
            <div className="score-value">{gameState.board.score}</div>
          </div>
          <AIButton
            board={board.map(row => 
              row.map(tile => tile ? tile.value : null)
            )}
            isLoading={isLoading}
            suggestedMove={suggestedMove}
            error={error}
            getAIMove={getAIMove}
          />
          <div className="score-container">
            <div className="score-label">Best</div>
            <div className="score-value">{gameState.bestScore}</div>
          </div>
        </div>

        <div className="game-board">
          <div className="board-grid">
            {Array.from({ length: 4 }, (_, row) =>
              Array.from({ length: 4 }, (_, col) => renderCell(board[row][col], row, col))
            )}
          </div>
        </div>

        <div className="game-controls">
          <button className="new-game-btn" onClick={handleNewGame}>
            New Game
          </button>
        </div>
      </div>

      <div className="instructions">
        <p>Use <span className="key">Arrow Keys</span> or <span className="key">WASD</span> to move tiles &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; Press <span className="key">N</span> for new game &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; Press <span className="key">I</span> for AI advice</p>
        <p>Combine tiles with the same number to reach 2048!</p>
      </div>

      {renderGameOver()}
    </>
  );
};

export default GameBoard; 