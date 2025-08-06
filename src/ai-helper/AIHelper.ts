import { ChatAnthropic } from '@langchain/anthropic';
import { Direction } from '../gameplay/Board';

export class AIHelper {
  private model: ChatAnthropic;

  constructor(apiKey: string) {
    this.model = new ChatAnthropic({
      anthropicApiKey: apiKey,
      model: 'claude-3-5-haiku-latest',
      temperature: 0,
    });
  }

  async getNextMove(board: (number | null)[][]): Promise<Direction> {
    const prompt = this.formatBoard(board);
    
    console.log('User prompt:', prompt);
    
    const response = await this.model.invoke([
      ['system', 'You are a 2048 game AI. You only respond with only one word in lowercase: up, down, left, or right. In 2048, tiles slide and merge when moved in the same direction. Strategy: keep the largest tile in a corner and maintain monotonic increasing/decreasing patterns in rows/columns. Given the current board, what\'s the best next move? '],
      ['user', prompt]
    ]);

    const direction = response.content.toString().toLowerCase().trim();
    
    console.log('AI response:', direction);
    
    if (['up', 'down', 'left', 'right'].includes(direction)) {
      return direction as Direction;
    }
    
    return 'up'; // fallback
  }

  private formatBoard(board: (number | null)[][]): string {
    let formattedBoard = '[\n';
    for (let i = 0; i < board.length; i++) {
      formattedBoard += '    [';
      for (let j = 0; j < board[i].length; j++) {
        const cell = board[i][j];
        formattedBoard += cell === null ? 'null' : cell;
        if (j < board[i].length - 1) {
          formattedBoard += ', ';
        }
      }
      formattedBoard += ']';
      if (i < board.length - 1) {
        formattedBoard += ',';
      }
      formattedBoard += '\n';
    }
    formattedBoard += ']';
    return `Current 2048 board:\n${formattedBoard}\n\nWhat's the best next move?`; 
  }
} 