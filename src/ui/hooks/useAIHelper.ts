import { useState, useCallback } from 'react';
import { AIHelper } from '../../ai-helper/AIHelper';
import { Direction } from '../../gameplay/Board';

interface UseAIHelperReturn {
  isLoading: boolean;
  suggestedMove: Direction | null;
  error: string | null;
  getAIMove: (board: (number | null)[][]) => Promise<void>;
  clearSuggestion: () => void;
}

export const useAIHelper = (): UseAIHelperReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMove, setSuggestedMove] = useState<Direction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getAIMove = useCallback(async (board: (number | null)[][]) => {
    setIsLoading(true);
    setError(null);
    setSuggestedMove(null);

    try {
      // Get API key from environment or prompt user
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        throw new Error('Anthropic API key not found. Please set VITE_ANTHROPIC_API_KEY in your environment variables.');
      }

      const aiHelper = new AIHelper(apiKey);
      const move = await aiHelper.getNextMove(board);
      
      setSuggestedMove(move);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI suggestion';
      setError(errorMessage);
      console.error('AI Helper error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSuggestion = useCallback(() => {
    setSuggestedMove(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    suggestedMove,
    error,
    getAIMove,
    clearSuggestion
  };
}; 