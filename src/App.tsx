
import { MainGameArea } from './components/MainGameArea';
import { TowerSidebar } from './components/TowerSidebar';
import { TopInfoPanel } from './components/TopInfoPanel';
import { LogicAnalyzer } from './components/LogicAnalyzer';
import { WaveSummaryPopup } from './components/WaveSummaryPopup';
import { GameOverPopup } from './components/GameOverPopup';
import { StartScreen } from './components/StartScreen';
import { GameProvider } from './engine/GameContext';
import './App.css';

function App() {
  return (
    <GameProvider>
      <div className="app-container">
        <TowerSidebar />
        <div className="main-content">
          <TopInfoPanel />
          <div className="game-area" style={{ position: 'relative' }}>
            <MainGameArea />
            <LogicAnalyzer />
            <WaveSummaryPopup />
            <GameOverPopup />
            <StartScreen />
          </div>
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
