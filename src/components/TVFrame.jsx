import { useRef } from 'react'
import CategoryTabs from './CategoryTabs'
import ChannelCard  from './ChannelCard'
import Player       from './Player'
import InfoSidebar  from './InfoSidebar'

function padCh(n) { return String(n ?? 0).padStart(2, '0') }
function formatTime(d) {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export default function TVFrame({
  categories, filteredChannels, activeCat, setActiveCat,
  selectedCh, onSelectChannel, muted, volume, showVol, chInput,
  time, playlistId, playlistItems, currentTrackIdx,
  loadingVideo, onTrackChange, playerRef, resumeState,
  /* forceShowOverlay kept for prop compat but sidebar is always visible */
}) {
  const isPlaying      = !!playlistId
  const activeCatLabel = categories.find(c => c.id === activeCat)?.label ?? ''

  return (
    <div className="tv-frame">
      <div className="screen-bezel">
        <div className="tv-screen">

          {/* ── Status bar ── */}
          <div className="screen-header">
            <span className="ch-display">CH {padCh(selectedCh?.chNum)}</span>
            <span className="cat-label">
              {isPlaying ? (selectedCh?.name ?? '').toUpperCase() : activeCatLabel}
            </span>
            <span className="time-display">{formatTime(time)}</span>
          </div>

          {/* ── Player + Info Sidebar (split layout) ── */}
          <div className={`player-section ${isPlaying ? 'player-section--on' : 'player-section--off'}`}>
            <div className="player-split">
              <div className="player-left">
                <Player
                  ref={playerRef}
                  playlistId={playlistId}
                  muted={muted}
                  volume={volume}
                  channelName={selectedCh?.name}
                  chNum={selectedCh?.chNum}
                  loadingVideo={loadingVideo}
                  onTrackChange={onTrackChange}
                  resumeState={resumeState}
                />
              </div>
              <InfoSidebar
                channel={selectedCh}
                items={playlistItems}
                currentIndex={currentTrackIdx}
              />
            </div>
          </div>

          {/* ── Guide (EPG rows) ── */}
          <div className={`guide-section ${isPlaying ? 'guide-section--off' : 'guide-section--on'}`}>
            <CategoryTabs categories={categories} activeCat={activeCat} onSelect={setActiveCat} />
            <div className="epg-list">
              {loadingVideo && !isPlaying ? (
                <div className="no-channels">
                  <span className="no-channels-icon">▶</span>TUNING...
                </div>
              ) : filteredChannels.length === 0 ? (
                <div className="no-channels">
                  <span className="no-channels-icon">▓▓</span>NO SIGNAL
                </div>
              ) : (
                filteredChannels.map(ch => (
                  <ChannelCard
                    key={ch.id}
                    channel={ch}
                    selected={selectedCh?.id === ch.id}
                    onClick={() => onSelectChannel(ch)}
                  />
                ))
              )}
            </div>
          </div>

          {/* ── CH number input overlay ── */}
          {chInput && <div className="screen-overlay ch-overlay">CH {chInput}_</div>}

          {/* ── Volume overlay ── */}
          {showVol && (
            <div className="screen-overlay vol-overlay">
              <span className="vol-label">VOL</span>
              <div className="vol-bar-track">
                <div className="vol-bar-fill" style={{ width: `${volume}%` }} />
              </div>
              <span className="vol-num">{volume}</span>
            </div>
          )}

        </div>
      </div>

      {/* TV tray */}
      <div className="tv-tray">
        <div className="tv-speaker" />
        <div className="tv-knobs">
          <div className="tv-knob" /><div className="tv-knob" />
          <div className="tv-power-led" />
        </div>
      </div>
      <div className="tv-brand">YOUTUBE · TV</div>
    </div>
  )
}
