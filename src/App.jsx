// src/App.jsx
import { useSmartPlayer } from './hooks/useSmartPlayer';
import { ProgressBar } from './components/ProgressBar';
import { VIDEO_URL } from './dominio';
import './App.css';

function App() {
  const { videoRef, playerState, actions } = useSmartPlayer();
  const { isPlaying, currentTime, virtualTime, duration, virtualDuration } = playerState;

  return (
    <div className="player-container">
      
      <div className="header">
        <h2>🎬 Smart Interview Player</h2>
        <span className="header-subtitle">Reto Krowdy 2026 - Reproductor Inteligente</span>
      </div>
      
      <div className="video-wrapper">
        <video 
          ref={videoRef}
          src={VIDEO_URL}
          width="100%"
          style={{ display: 'block' }}
          onTimeUpdate={actions.onTimeUpdate}
          onLoadedMetadata={actions.onLoadedMetadata}
          onClick={actions.togglePlay}
        />
      </div>

      <ProgressBar 
        virtualTime={virtualTime} 
        virtualDuration={virtualDuration} 
        onSeek={actions.seekVirtual} 
      />

      <div className="controls-panel">
        <button 
          onClick={actions.togglePlay}
          className={`btn-play ${isPlaying ? 'playing' : 'paused'}`}
        >
          {isPlaying ? '⏸ Pausa' : '▶️ Reproducir'}
        </button>

        <div className="time-stats">
          <div>
            REAL: {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
          </div>
          <div className="time-virtual">
            <span className="highlight">VIRTUAL:</span> {virtualTime.toFixed(1)}s / {virtualDuration.toFixed(1)}s
          </div>
        </div>
      </div>

      {/* GUÍA DE UX PARA EL USUARIO */}
      <div className="keyboard-hints">
        <div className="hint"><span className="kbd">Espacio</span> Play / Pausa</div>
        <div className="hint"><span className="kbd">➡️</span> Siguiente etiqueta</div>
        <div className="hint"><span className="kbd">⬅️</span> Etiqueta anterior</div>
      </div>

    </div>
  );
}

export default App;