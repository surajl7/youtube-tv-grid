function Btn({ label, onClick, cls = '', title = '' }) {
  return (
    <button className={`r-btn ${cls}`} onClick={onClick} title={title}>
      {label}
    </button>
  )
}

function Divider() { return <div className="r-divider" /> }

function Label({ text }) { return <span className="r-label">{text}</span> }

const DIGITS = ['1','2','3','4','5','6','7','8','9','CLR','0','OK']

export default function Remote({
  onChUp, onChDown,
  volume, onVolUp, onVolDown,
  muted, onMute,
  chInput, onNumPress, onChEnter, onChClear,
  onGuide, onInfo, onStop, onOpen, onSignOut,
  isPlaying,
}) {
  return (
    <div className="remote">

      {/* Power */}
      <Btn label="⏻" onClick={onSignOut} cls="r-btn--power" title="Sign out" />

      <Divider />

      {/* Channel */}
      <Label text="CH" />
      <Btn label="▲" onClick={onChUp}   cls="r-btn--nav" title="Channel up (↑)" />
      <Btn label="▼" onClick={onChDown} cls="r-btn--nav" title="Channel down (↓)" />

      <Divider />

      {/* Volume */}
      <Label text="VOL" />
      <Btn label="+" onClick={onVolUp}   cls="r-btn--nav" title="Volume up (→)" />
      <Btn label="–" onClick={onVolDown} cls="r-btn--nav" title="Volume down (←)" />

      <Divider />

      {/* Mute */}
      <Btn
        label={muted ? '🔇' : '🔈'}
        onClick={onMute}
        cls={`r-btn--fn ${muted ? 'r-btn--active' : ''}`}
        title={muted ? 'Unmute (M)' : 'Mute (M)'}
      />

      <Divider />

      {/* Number pad */}
      {chInput && <div className="r-ch-preview">CH{chInput}_</div>}
      <div className="r-numpad">
        {DIGITS.map(d => (
          <Btn
            key={d}
            label={d}
            onClick={() => {
              if (d === 'CLR') onChClear()
              else if (d === 'OK') onChEnter()
              else onNumPress(d)
            }}
            cls={`r-btn--num ${d === 'OK' ? 'r-btn--ok' : ''} ${d === 'CLR' ? 'r-btn--clr' : ''}`}
            title={d === 'OK' ? 'Go (Enter)' : d === 'CLR' ? 'Clear (Backspace)' : d}
          />
        ))}
      </div>

      <Divider />

      {/* Guide + Info + Stop */}
      <Btn label="GUIDE" onClick={onGuide} cls="r-btn--fn" title="Toggle guide (G)" />
      <Btn label="INFO"  onClick={onInfo}  cls="r-btn--fn" title="Now playing (I)" />
      <Btn label="■ STOP" onClick={onStop} cls="r-btn--fn" title="Stop (Esc)" />

      <Divider />

      {/* Open in YouTube */}
      <Btn
        label={isPlaying ? '↗ VIDEO' : '↗ CH'}
        onClick={onOpen}
        cls="r-btn--fn r-btn--open"
        title={isPlaying ? 'Open video on YouTube' : 'Open channel on YouTube'}
      />

    </div>
  )
}
