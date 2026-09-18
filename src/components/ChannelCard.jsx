function fmtSubs(n) {
  if (!n) return ''
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

export default function ChannelCard({ channel, selected, onClick }) {
  const { chNum, initials, color, name, subs, thumbnail } = channel

  return (
    <div
      className={`channel-card ${selected ? 'channel-card--selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`Channel ${chNum}: ${name}`}
    >
      <div className="card-thumb">
        {thumbnail
          ? <img src={thumbnail} alt={name} />
          : <div className="card-initials" style={{ background: `linear-gradient(135deg, ${color}dd, ${color}88)` }}>{initials}</div>
        }
        <span className="card-ch-badge">CH {String(chNum).padStart(2, '0')}</span>
      </div>
      <div className="card-info">
        <div className="card-name">{name}</div>
        {subs && <div className="card-subs">{fmtSubs(subs)} subscribers</div>}
      </div>
    </div>
  )
}
