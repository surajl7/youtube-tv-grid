function fmt(iso) {
  if (!iso) return ''
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function PlItem({ item, active }) {
  return (
    <div className={`pl-item ${active ? 'pl-item--active' : ''}`}>
      {item.thumbnail
        ? <img className="pl-thumb" src={item.thumbnail} alt="" />
        : <div className="pl-thumb pl-thumb--blank" />
      }
      <div className="pl-info">
        <div className="pl-title">{item.title}</div>
        <div className="pl-age">{fmt(item.publishedAt)}</div>
      </div>
    </div>
  )
}

export default function PlaylistOverlay({ items, currentIndex, visible }) {
  if (!items?.length) return null
  const current = items[currentIndex] ?? items[0]
  const upNext  = items.slice(currentIndex + 1, currentIndex + 5)

  return (
    <div className={`playlist-overlay ${visible ? 'playlist-overlay--on' : ''}`}>
      <div className="pl-section-label">NOW PLAYING</div>
      <PlItem item={current} active />

      {upNext.length > 0 && (
        <>
          <div className="pl-section-label pl-section-label--up">UP NEXT</div>
          {upNext.map((item, i) => (
            <PlItem key={item.videoId ?? i} item={item} />
          ))}
        </>
      )}
    </div>
  )
}
