function padCh(n) {
  return String(n).padStart(2, '0')
}

export default function ChannelCard({ channel, selected, onClick }) {
  const { chNum, initials, color, name, subs, thumbnail } = channel

  return (
    <div
      className={`epg-row ${selected ? 'epg-row--selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`Channel ${chNum}: ${name}`}
    >
      <div className="epg-ch">
        <span className="epg-ch-num">{padCh(chNum)}</span>
      </div>
      <div
        className="epg-thumb"
        style={!thumbnail ? { background: `linear-gradient(135deg, ${color}dd, ${color}88)` } : {}}
      >
        {thumbnail
          ? <img src={thumbnail} alt={name} />
          : <span>{initials}</span>
        }
      </div>
      <div className="epg-info">
        <div className="epg-name">{name}</div>
        {subs && <div className="epg-subs">{subs}</div>}
      </div>
      {selected && <div className="epg-arrow">▶</div>}
    </div>
  )
}
