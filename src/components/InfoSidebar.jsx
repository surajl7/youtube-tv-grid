function fmt(iso) {
  if (!iso) return ''
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function InfoSidebar({ channel, items, currentIndex }) {
  if (!channel) return null
  const idx     = currentIndex ?? 0
  const current = items?.[idx] ?? items?.[0]
  const upNext  = items ? items.slice(idx + 1, idx + 5) : []

  return (
    <div className="info-sidebar">
      <div className="isb-ch">CH {String(channel.chNum ?? 0).padStart(2, '0')}</div>
      <div className="isb-name">{channel.name}</div>
      <div className="isb-divider" />

      {current && (
        <>
          <div className="isb-label">NOW PLAYING</div>
          <div className="isb-now">
            {current.thumbnail && (
              <img className="isb-thumb" src={current.thumbnail} alt="" />
            )}
            <div className="isb-title isb-title--now">{current.title}</div>
            {current.publishedAt && (
              <div className="isb-age">{fmt(current.publishedAt)}</div>
            )}
          </div>
        </>
      )}

      {upNext.length > 0 && (
        <>
          <div className="isb-label isb-label--up">UP NEXT</div>
          {upNext.map((item, i) => (
            <div key={item.videoId ?? i} className="isb-up-item">
              <span className="isb-up-num">{idx + 2 + i}.</span>
              <div className="isb-up-body">
                <div className="isb-up-title">{item.title}</div>
                {item.publishedAt && (
                  <div className="isb-age">{fmt(item.publishedAt)}</div>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
