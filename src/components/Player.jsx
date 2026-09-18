import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'

const Player = forwardRef(function Player({
  playlistId, muted, volume, channelName, chNum, loadingVideo, onTrackChange, resumeState,
}, ref) {
  const containerRef    = useRef(null)
  const playerRef       = useRef(null)
  const readyRef        = useRef(false)
  const pendingIdRef    = useRef(playlistId)
  const pendingResumeRef = useRef(null) // { idx, time } — seek after first PLAYING
  const onTrackRef      = useRef(onTrackChange)

  useEffect(() => { onTrackRef.current = onTrackChange }, [onTrackChange])

  // Expose getPlaybackState() so App can snapshot position before switching channel
  useImperativeHandle(ref, () => ({
    getPlaybackState: () => ({
      idx:  playerRef.current?.getPlaylistIndex?.() ?? 0,
      time: playerRef.current?.getCurrentTime?.()   ?? 0,
    }),
  }))

  // Create YT player ONCE — never destroy between channels
  useEffect(() => {
    const div = document.createElement('div')
    if (containerRef.current) containerRef.current.appendChild(div)

    function create() {
      playerRef.current = new window.YT.Player(div, {
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay:       1,
          controls:       0,
          rel:            0,
          modestbranding: 1,
          iv_load_policy: 3,
          fs:             0,
          disablekb:      1,
          enablejsapi:    1,
        },
        events: {
          onReady(e) {
            readyRef.current = true
            if (muted) e.target.mute()
            e.target.setVolume(volume ?? 80)
            if (pendingIdRef.current) {
              const resume = pendingResumeRef.current
              e.target.loadPlaylist({
                listType: 'playlist',
                list:  pendingIdRef.current,
                index: resume?.idx ?? 0,
              })
            }
          },
          onStateChange(e) {
            if (e.data === window.YT.PlayerState.PLAYING) {
              // Seek to saved position on first play after a channel resume
              const resume = pendingResumeRef.current
              if (resume?.time > 5) {
                try { e.target.seekTo(resume.time, true) } catch (_) {}
                pendingResumeRef.current = null
              }
              try { onTrackRef.current?.(e.target.getPlaylistIndex()) } catch (_) {}
            }
          },
        },
      })
    }

    if (window.YT?.Player) {
      create()
    } else {
      const prev = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => { if (prev) prev(); create() }
    }

    return () => {
      try { playerRef.current?.destroy() } catch (_) {}
      playerRef.current = null
      readyRef.current  = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Switch playlist — resume at saved index + time if available
  useEffect(() => {
    pendingIdRef.current    = playlistId
    pendingResumeRef.current = resumeState ?? null
    if (!playerRef.current || !readyRef.current) return
    try {
      if (playlistId) {
        playerRef.current.loadPlaylist({
          listType: 'playlist',
          list:  playlistId,
          index: resumeState?.idx ?? 0,
        })
        // seek happens in onStateChange once PLAYING fires
      } else {
        playerRef.current.stopVideo()
      }
    } catch (_) {}
  }, [playlistId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!playerRef.current || !readyRef.current) return
    try {
      if (muted) playerRef.current.mute()
      else       playerRef.current.unMute()
    } catch (_) {}
  }, [muted])

  useEffect(() => {
    if (!playerRef.current || !readyRef.current) return
    try { playerRef.current.setVolume(volume) } catch (_) {}
  }, [volume])

  const isActive = !!playlistId

  return (
    <div className={`player-wrap ${isActive ? 'player-wrap--active' : ''}`}>
      <div ref={containerRef} className="player-iframe-wrap" />

      {loadingVideo && (
        <div className="player-tuning"><span>TUNING</span></div>
      )}

      {isActive && (
        <div className="player-info-bar">
          <span className="player-ch">CH {String(chNum ?? 0).padStart(2, '0')}</span>
          <span className="player-name">{channelName}</span>
          <span className="player-live-dot" />
        </div>
      )}
    </div>
  )
})

export default Player
