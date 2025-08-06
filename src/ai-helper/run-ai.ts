import { AIHelper } from './AIHelper';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runAITest() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY not found in environment variables');
    console.log('Please add your Anthropic API key to a .env file:');
    console.log('ANTHROPIC_API_KEY=your_api_key_here');
    process.exit(1);
  }

  // Create a dummy 2048 board
  const dummyBoard: (number | null)[][] = [
    [2, 4, 8, 16],
    [null, 2, 4, 8],
    [null, null, 2, 4],
    [null, null, null, 2]
  ];

  console.log('🎮 Testing AIHelper with dummy 2048 board:');
  console.log('\nCurrent board:');
  dummyBoard.forEach(row => {
    console.log(row.map(cell => (cell || 0).toString().padStart(4)).join(' '));
  });

  try {
    const aiHelper = new AIHelper(apiKey);
    console.log('\n🤖 AI is thinking...');
    
    const nextMove = await aiHelper.getNextMove(dummyBoard);
    
    console.log(`\n✅ AI suggests: ${nextMove}`);
    console.log('\nThis move should help maintain the pattern and keep large tiles in the corner.');
    
  } catch (error) {
    console.error('❌ Error running AI test:', error);
    process.exit(1);
  }
}

// Run the test
runAITest(); 