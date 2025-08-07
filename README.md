# 2048 Game

A modern implementation of the classic 2048 game built with React and TypeScript.

**[🎮 Play Here](https://lsrepo.github.io/2048/)**

## Features

- 🎮 Classic 2048 gameplay with minimalist UI
- ⌨️ Keyboard controls (Arrow keys, 'N' for new game, 'I' for AI advice)
- 🎯 Win/lose detection and best score persistence
- 🤖 AI helper for game suggestions (only supported in local mode to protect API keys)(VPN might be required)
- 🏗️ Clean architecture with separated game logic and UI

## How to Play

**Objective**: Combine tiles with the same number to reach the 2048 tile!

**Controls**: Use arrow keys to move tiles, press 'N' for a new game, press 'I' for advice from AI.

**Rules**: Tiles slide and merge when colliding with the same number. New tiles (2 or 4) appear after each move. Game over when no moves are possible.

## Quick Start

### Prerequisites
- Node.js (version 22.0.0 or higher)
- npm or yarn

### Installation & Running

```bash
git clone <repository-url>
cd 2048
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

**Note**: For AI helper features, set the `VITE_ANTHROPIC_API_KEY` environment variable. Follow the `env.sample` files in the project folders for setup instructions.

### Build for Production
```bash
npm run build
```

## Project Structure

- **`src/gameplay/`**: Pure game logic (Game, Board, Tile classes)
- **`src/ui/`**: React components and user interaction
- **`src/ai-helper/`**: AI assistance features

## Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling

## Architecture

The game follows clean architecture principles:
- Game logic is independent of browser APIs
- UI layer handles user interaction and localStorage persistence
- Separation of concerns enables easy testing and reusability

## License

MIT License 