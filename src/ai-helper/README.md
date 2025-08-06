# 2048 AI Helper

A simple AI helper that uses Anthropic's Claude via LangChain to suggest the next move in 2048.

## Setup

1. Install dependencies (already included):
   - `@langchain/anthropic`
   - `dotenv`

2. Set your Anthropic API key in environment variables:
   ```bash
   ANTHROPIC_API_KEY=your_api_key_here
   ```

## Usage

```typescript
import { AIHelper } from './AIHelper';

const aiHelper = new AIHelper(process.env.ANTHROPIC_API_KEY);
const board = [
  [2, 4, 2, 4],
  [4, 2, 4, 2],
  [2, 4, 2, 4],
  [4, 2, 4, 2]
];

const nextMove = await aiHelper.getNextMove(board);
console.log(`AI suggests: ${nextMove}`); // 'up', 'down', 'left', or 'right'
```

## How it works

1. Takes current board state as 2D array
2. Sends formatted board to Anthropic's Claude via LangChain
3. Returns suggested direction (up/down/left/right)
4. Falls back to 'up' if response is invalid

## Files

- `AIHelper.ts` - Main class for AI move suggestions
- `run-ai.ts` - Test script to run AI helper
- `README.MD` - This documentation
