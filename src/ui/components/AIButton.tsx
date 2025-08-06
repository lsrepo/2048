import React from 'react';
import { Direction } from '../../gameplay/Board';

interface AIButtonProps {
  board: (number | null)[][];
  isLoading: boolean;
  suggestedMove: Direction | null;
  error: string | null;
  getAIMove: (board: (number | null)[][]) => Promise<void>;
}

const AIButton: React.FC<AIButtonProps> = ({ 
  board, 
  isLoading, 
  suggestedMove, 
  error, 
  getAIMove 
}) => {
  const handleClick = async () => {
    try {
      await getAIMove(board);
    } catch (error) {
      console.error('AI move failed:', error);
    }
  };

  const getDirectionEmoji = (direction: Direction): string => {
    switch (direction) {
      case 'up': return '⬆️';
      case 'down': return '⬇️';
      case 'left': return '⬅️';
      case 'right': return '➡️';
      default: return '🧙‍♂️';
    }
  };

  const getButtonContent = () => {
    if (isLoading) return '🧙‍♂️';
    if (error) return '❌';
    if (suggestedMove) return getDirectionEmoji(suggestedMove);
    return '🧙‍♂️';
  };

  const getTooltip = () => {
    if (error) return `Error: ${error}`;
    if (suggestedMove) return `AI suggests: ${suggestedMove}`;
    return "Ask AI for help";
  };

  return (
    <button 
      className={`ai-helper-btn ${isLoading ? 'clicked' : ''} ${suggestedMove ? 'suggestion' : ''}`} 
      title={getTooltip()}
      onClick={handleClick}
      disabled={isLoading || suggestedMove !== null}
    >
      {getButtonContent()}
    </button>
  );
};

export default AIButton; 