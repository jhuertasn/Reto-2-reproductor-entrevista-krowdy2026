// src/App.jsx
import { useSmartPlayer } from './hooks/useSmartPlayer';
import { ProgressBar } from './components/ProgressBar';
import { VIDEO_URL } from './dominio';
import './App.css';


function App() {
  // Usamos nuestro Custom Hook (Toda la lógica compleja vive ahí dentro)
  const { videoRef, playerState, actions } = useSmartPlayer();

  const { isPlaying, currentTime, virtualTime, duration, virtualDuration } = playerState;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      
      {/* Cabecera */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        <h2>🎬 Smart Interview Player</h2>
        <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Reto Krowdy - Fase 2 Refactor</span>
      </div>
      
      {/* Contenedor de Video */}
      <div style={{ position: 'relative', width: '100%', backgroundColor: 'black', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <video 
          ref={videoRef}
          src={VIDEO_URL}
          width="100%"
          style={{ display: 'block' }}
          onTimeUpdate={actions.onTimeUpdate}
          onLoadedMetadata={actions.onLoadedMetadata}
          onClick={actions.togglePlay} // UX: Click en video para pausar
        />
      {/* Nueva Barra de Progreso Customizada */}
      <ProgressBar 
        virtualTime={virtualTime} 
        virtualDuration={virtualDuration} 
        onSeek={actions.seekVirtual} 
      />
      </div>



      {/* Controles Básicos */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#252525', padding: '15px', borderRadius: '8px' }}>
        
        <button 
          onClick={actions.togglePlay}
          style={{ 
            padding: '10px 24px', 
            cursor: 'pointer', 
            backgroundColor: isPlaying ? '#ef4444' : '#22c55e', // Rojo pausa, Verde play
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'background 0.2s'
          }}
        >
          {isPlaying ? '⏸ Pausa' : '▶️ Reproducir'}
        </button>

        {/* Panel de Debugging (Más elegante) */}
        <div style={{ textAlign: 'right', fontSize: '13px', fontFamily: 'monospace', color: '#ccc' }}>
          <div>
            <span style={{ color: '#666' }}>REAL:</span> {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
          </div>
          <div style={{ marginTop: '4px' }}>
            <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>VIRTUAL:</span> {virtualTime.toFixed(1)}s / {virtualDuration.toFixed(1)}s
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;