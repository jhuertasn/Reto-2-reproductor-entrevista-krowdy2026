// src/App.jsx
import { useSmartPlayer } from './hooks/useSmartPlayer';
import { ProgressBar } from './components/ProgressBar';
import { VIDEO_URL } from './dominio';
import './App.css';

function App() {
  const { videoRef, playerState, actions } = useSmartPlayer();
  const { isPlaying, currentTime, virtualTime, duration, virtualDuration } = playerState;

  return (
    <div className="stage">
      {/* Noise grain overlay */}
      <div className="grain" aria-hidden="true" />

      <div className="player-shell">

        {/* ── HEADER ── */}
        <header className="player-header">
          <div className="header-badge">
            <span className="badge-dot" />
            LIVE
          </div>
          <div className="header-title">
            <h1>Reproductor de Video-Entrevista</h1>
            <p className="header-sub">Reto Krowdy 2026 · Reproductor Inteligente</p>
          </div>
          <div className="header-logo">🎬</div>
        </header>

        {/* ── VIDEO ── */}
        <div className="video-frame">
          <div className="corner tl" /><div className="corner tr" />
          <div className="corner bl" /><div className="corner br" />
          <video
            ref={videoRef}
            src={VIDEO_URL}
            style={{ display: 'block', width: '100%' }}
            onTimeUpdate={actions.onTimeUpdate}
            onLoadedMetadata={actions.onLoadedMetadata}
            onClick={actions.togglePlay}
          />
          {/* Scanline overlay */}
          <div className="scanlines" aria-hidden="true" />
          {/* Center play overlay hint */}
          <div className={`play-overlay ${isPlaying ? 'hidden' : ''}`} onClick={actions.togglePlay}>
            <div className="play-icon-big">▶</div>
          </div>
        </div>

        {/* ── PROGRESS BAR ── */}
        <ProgressBar
          virtualTime={virtualTime}
          virtualDuration={virtualDuration}
          onSeek={actions.seekVirtual}
        />

        {/* ── CONTROLS ── */}
        <div className="controls-row">
          <button
            onClick={actions.togglePlay}
            className={`btn-play ${isPlaying ? 'playing' : ''}`}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            <span className="btn-icon">{isPlaying ? '⏸' : '▶'}</span>
            <span className="btn-label">{isPlaying ? 'Pausa' : 'Play'}</span>
          </button>

          <div className="timecode-panel">
            <div className="timecode-row">
              <span className="tc-label">REAL</span>
              <span className="tc-value">{fmt(currentTime)}</span>
              <span className="tc-sep">/</span>
              <span className="tc-total">{fmt(duration)}</span>
            </div>
            <div className="timecode-row virtual">
              <span className="tc-label accent">VIRTUAL</span>
              <span className="tc-value accent">{fmt(virtualTime)}</span>
              <span className="tc-sep">/</span>
              <span className="tc-total">{fmt(virtualDuration)}</span>
            </div>
          </div>
        </div>

        {/* ── KEYBOARD HINTS ── */}
        <div className="hints-bar">
          <KbdHint keys={['Space']} label="Play / Pausa" />
          <KbdHint keys={['→']} label="Sig. etiqueta" />
          <KbdHint keys={['←']} label="Ant. etiqueta" />
        </div>

      </div>
    </div>
  );
}

function KbdHint({ keys, label }) {
  return (
    <div className="hint">
      {keys.map(k => <kbd key={k} className="kbd">{k}</kbd>)}
      <span className="hint-label">{label}</span>
    </div>
  );
}

/** Formats seconds → MM:SS.d */
function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = (s % 60).toFixed(1).padStart(4, '0');
  return `${String(m).padStart(2, '0')}:${sec}`;
}

export default App;