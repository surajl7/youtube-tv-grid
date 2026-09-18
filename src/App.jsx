import { useState, useEffect, useRef, useMemo } from 'react'
import './App.css'
import { CATEGORIES } from './data/dummy'
import { useAuth }    from './hooks/useAuth'
import { useYouTube } from './hooks/useYouTube'
import TVFrame        from './components/TVFrame'
import Remote         from './components/Remote'
import LoginScreen    from './components/LoginScreen'
import LoadingScreen  from './components/LoadingScreen'

function App() {
  const [activeCat, setActiveCat]         = useState('music')
  const [selectedCh, setSelectedCh]       = useState(null)
  const [playlistId, setPlaylistId]       = useState(null)
  const [playlistItems, setPlaylistItems] = useState([])
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0)
  const [forceShowOverlay, setForceShowOverlay] = useState(0)
  const [loadingVideo, setLoadingVideo]   = useState(false)
  const [muted, setMuted]                 = useState(false)
  const [volume, setVolume]               = useState(80)
  const [showVol, setShowVol]             = useState(false)
  const [chInput, setChInput]             = useState('')
  const [time, setTime]                   = useState(new Date())
  const [gisReady, setGisReady]           = useState(false)

  const chInputTimer    = useRef(null)
  const volTimer        = useRef(null)
  const playerRef       = useRef(null)        // imperative handle into Player
  const channelStates   = useRef({})          // channelId → { idx, time } last known position
  const [resumeState, setResumeState] = useState(null)

  const { token, loading: authLoading, error: authError, signIn, signOut } = useAuth()
  const { channels, loading: ytLoading, error: ytError, status, fetchSubscriptions, fetchChannelPlaylist } = useYouTube(token)

  const allSorted = useMemo(
    () => [...channels].sort((a, b) => a.chNum - b.chNum),
    [channels]
  )

  // ── Initialisation ───────────────────────────────────────────
  useEffect(() => {
    if (window.google?.accounts?.oauth2) { setGisReady(true); return }
    const t = setInterval(() => {
      if (window.google?.accounts?.oauth2) { setGisReady(true); clearInterval(t) }
    }, 100)
    return () => clearInterval(t)
  }, [])

  useEffect(() => { if (token) fetchSubscriptions() }, [token])

  useEffect(() => {
    if (channels.length === 0) return
    const first = channels.find(c => c.category === activeCat) ?? channels[0]
    setSelectedCh(first)
    setPlaylistId(null)
    setPlaylistItems([])
    setCurrentTrackIdx(0)
  }, [channels])

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // ── Channel selection & playback ─────────────────────────────
  async function handleSelectChannel(ch) {
    // Snapshot current channel's position + wall-clock time so we can advance it later
    if (selectedCh && playlistId && playerRef.current) {
      try {
        const pos = playerRef.current.getPlaybackState()
        channelStates.current[selectedCh.id] = { ...pos, departedAt: Date.now() }
      } catch (_) {}
    }

    if (selectedCh?.id === ch.id && playlistId) { setPlaylistId(null); setPlaylistItems([]); return }

    setSelectedCh(ch)
    if (ch.category !== activeCat) setActiveCat(ch.category)

    setLoadingVideo(true)
    try {
      const { playlistId: pid, items } = await fetchChannelPlaylist(ch.id, 20)
      setPlaylistItems(items)

      // Build resume: advance time by however long the user was away (simulate live broadcast)
      const saved = channelStates.current[ch.id]
      let resume = null
      if (saved) {
        const elapsedSec = (Date.now() - saved.departedAt) / 1000
        resume = { idx: saved.idx, time: saved.time + elapsedSec }
      }
      setCurrentTrackIdx(resume?.idx ?? 0)
      setResumeState(resume)
      setPlaylistId(pid)
    } catch (e) {
      console.error('fetchChannelPlaylist failed:', e)
    } finally {
      setLoadingVideo(false)
    }
  }

  function handleStop() { setPlaylistId(null); setPlaylistItems([]); setCurrentTrackIdx(0); setLoadingVideo(false) }

  function handleTabChange(catId) {
    setActiveCat(catId)
    setPlaylistId(null)
    setPlaylistItems([])
    setCurrentTrackIdx(0)
    const first = channels.find(c => c.category === catId)
    if (first) setSelectedCh(first)
  }

  function handleTrackChange(idx) {
    setCurrentTrackIdx(idx >= 0 ? idx : 0)
  }

  function handleInfo() {
    setForceShowOverlay(n => n + 1)
  }

  // ── Channel up / down ────────────────────────────────────────
  function handleChUp() {
    if (!allSorted.length) return
    const idx = allSorted.findIndex(c => c.id === selectedCh?.id)
    handleSelectChannel(allSorted[(idx + 1) % allSorted.length])
  }

  function handleChDown() {
    if (!allSorted.length) return
    const idx = allSorted.findIndex(c => c.id === selectedCh?.id)
    handleSelectChannel(allSorted[(idx - 1 + allSorted.length) % allSorted.length])
  }

  function goToChNum(num) {
    const ch = allSorted.find(c => c.chNum === num)
    if (ch) handleSelectChannel(ch)
  }

  // ── Number pad ───────────────────────────────────────────────
  function handleNumPress(digit) {
    const next = (chInput + digit).slice(-3)
    setChInput(next)
    clearTimeout(chInputTimer.current)
    chInputTimer.current = setTimeout(() => {
      goToChNum(parseInt(next, 10))
      setChInput('')
    }, 1500)
  }

  function handleChEnter() {
    clearTimeout(chInputTimer.current)
    if (chInput) { goToChNum(parseInt(chInput, 10)); setChInput('') }
  }

  function handleChClear() {
    clearTimeout(chInputTimer.current)
    setChInput('')
  }

  // ── Volume ───────────────────────────────────────────────────
  function flashVol() {
    setShowVol(true)
    clearTimeout(volTimer.current)
    volTimer.current = setTimeout(() => setShowVol(false), 1800)
  }

  function handleVolUp()   { setVolume(v => Math.min(100, v + 10)); flashVol() }
  function handleVolDown() { setVolume(v => Math.max(0,   v - 10)); flashVol() }
  function handleMute()    { setMuted(m => !m) }

  // ── Guide toggle ─────────────────────────────────────────────
  function handleGuide() {
    if (playlistId) setPlaylistId(null)
    else {
      const first = channels.find(c => c.category === activeCat)
      if (first) handleSelectChannel(first)
    }
  }

  // ── Open in YouTube ──────────────────────────────────────────
  function handleOpen() {
    if (!selectedCh) return
    const currentVideo = playlistItems[currentTrackIdx]
    const url = currentVideo
      ? `https://www.youtube.com/watch?v=${currentVideo.videoId}`
      : `https://www.youtube.com/channel/${selectedCh.id}`
    window.open(url, '_blank', 'noopener')
  }

  // ── Keyboard shortcuts ───────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      switch (e.key) {
        case 'ArrowUp':    e.preventDefault(); handleChUp();    break
        case 'ArrowDown':  e.preventDefault(); handleChDown();  break
        case 'ArrowRight': e.preventDefault(); handleVolUp();   break
        case 'ArrowLeft':  e.preventDefault(); handleVolDown(); break
        case 'm': case 'M': handleMute();   break
        case 'Escape':      handleStop();   break
        case 'g': case 'G': handleGuide();  break
        case 'i': case 'I': handleInfo();   break
        case 'Enter':       handleChEnter(); break
        case 'Backspace':   handleChClear(); break
        default:
          if (e.key >= '0' && e.key <= '9') handleNumPress(e.key)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedCh, playlistId, chInput, allSorted, activeCat, channels])

  // ── Screens ──────────────────────────────────────────────────
  if (!token) return <LoginScreen onSignIn={signIn} loading={!gisReady || authLoading} error={authError} />
  if (ytLoading) return <LoadingScreen status={status} />
  if (ytError) return <LoginScreen onSignIn={signIn} loading={false} error={`YOUTUBE API ERROR: ${ytError}`} />

  const filteredChannels = channels.filter(ch => ch.category === activeCat)

  return (
    <div className="app-layout">
      <TVFrame
        categories={CATEGORIES}
        filteredChannels={filteredChannels}
        activeCat={activeCat}
        setActiveCat={handleTabChange}
        selectedCh={selectedCh}
        onSelectChannel={handleSelectChannel}
        muted={muted}
        volume={volume}
        showVol={showVol}
        chInput={chInput}
        time={time}
        playlistId={playlistId}
        playlistItems={playlistItems}
        currentTrackIdx={currentTrackIdx}
        forceShowOverlay={forceShowOverlay}
        loadingVideo={loadingVideo}
        onTrackChange={handleTrackChange}
        playerRef={playerRef}
        resumeState={resumeState}
      />
      <Remote
        onChUp={handleChUp}
        onChDown={handleChDown}
        volume={volume}
        onVolUp={handleVolUp}
        onVolDown={handleVolDown}
        muted={muted}
        onMute={handleMute}
        chInput={chInput}
        onNumPress={handleNumPress}
        onChEnter={handleChEnter}
        onChClear={handleChClear}
        onGuide={handleGuide}
        onInfo={handleInfo}
        onStop={handleStop}
        onOpen={handleOpen}
        onSignOut={signOut}
        isPlaying={!!playlistId}
      />
    </div>
  )
}

export default App
