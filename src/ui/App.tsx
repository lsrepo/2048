import GameBoard from './components/GameBoard';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>2048</h1>
      </header>
      <main className="main">
        <GameBoard />
      </main>
    </div>
  );
}

export default App; 