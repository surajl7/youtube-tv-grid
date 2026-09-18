export default function TVControls({ muted, onMute, onStop, onOpen, onSignOut, hasChannel, isPlaying }) {
  return (
    <div className="tv-controls">
      <button
        className="ctrl-btn"
        onClick={onStop}
        title={isPlaying ? 'Stop — back to guide' : 'Back to first channel'}
      >
        ■ STOP
      </button>

      <button
        className={`ctrl-btn ${muted ? 'active' : ''}`}
        onClick={onMute}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? '◀X MUTED' : '◀) MUTE'}
      </button>

      <div className="ctrl-divider" />

      <button
        className="ctrl-open-btn"
        onClick={onOpen}
        disabled={!hasChannel}
        title={isPlaying ? 'Open video on YouTube' : 'Open channel on YouTube'}
      >
        ↗ {isPlaying ? 'OPEN VIDEO' : 'OPEN CHANNEL'}
      </button>

      <div className="ctrl-divider" />

      <button className="ctrl-open-btn" onClick={onSignOut} title="Sign out">
        ⏻ SIGN OUT
      </button>
    </div>
  )
}
