import { useState, useCallback } from 'react'
import { CATEGORIES, assignChannelNumbers } from '../data/dummy'
import { categorizeChannel, colorFromId } from '../utils/categorize'

const BASE = 'https://www.googleapis.com/youtube/v3'

async function apiFetch(url, token) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data
}

async function fetchAllSubscriptions(token) {
  const items = []
  let pageToken = null
  do {
    const url = new URL(`${BASE}/subscriptions`)
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('mine', 'true')
    url.searchParams.set('maxResults', '50')
    url.searchParams.set('order', 'alphabetical')
    if (pageToken) url.searchParams.set('pageToken', pageToken)

    const data = await apiFetch(url.toString(), token)
    items.push(...(data.items ?? []))
    pageToken = data.nextPageToken ?? null
  } while (pageToken)
  return items
}

async function fetchTopicsForIds(token, ids) {
  const url = new URL(`${BASE}/channels`)
  url.searchParams.set('part', 'topicDetails')
  url.searchParams.set('id', ids.join(','))
  url.searchParams.set('maxResults', '50')
  const data = await apiFetch(url.toString(), token)
  const map = {}
  for (const ch of data.items ?? []) {
    map[ch.id] = ch.topicDetails?.topicCategories ?? []
  }
  return map
}

export function useYouTube(token) {
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('')

  const fetchSubscriptions = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)

    try {
      setStatus('FETCHING SUBSCRIPTIONS...')
      const subs = await fetchAllSubscriptions(token)

      setStatus(`LOADING ${subs.length} CHANNELS...`)
      const channelIds = subs.map(s => s.snippet.resourceId.channelId)
      const topicsMap = {}

      // Fetch topics in batches of 50
      for (let i = 0; i < channelIds.length; i += 50) {
        const batch = channelIds.slice(i, i + 50)
        const partial = await fetchTopicsForIds(token, batch)
        Object.assign(topicsMap, partial)
      }

      setStatus('SORTING INTO CATEGORIES...')
      const mapped = subs.map(sub => {
        const chId = sub.snippet.resourceId.channelId
        const topics = topicsMap[chId] || []
        const thumb = sub.snippet.thumbnails?.medium?.url
          || sub.snippet.thumbnails?.default?.url
          || null

        return {
          id: chId,
          name: sub.snippet.title,
          category: categorizeChannel(sub.snippet.title, topics),
          thumbnail: thumb,
          color: colorFromId(chId),
          initials: sub.snippet.title.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase(),
          subs: null,
        }
      })

      const numbered = assignChannelNumbers(mapped, CATEGORIES)
      setChannels(numbered)
      setStatus('')
    } catch (e) {
      setError(e.message)
      setStatus('')
    } finally {
      setLoading(false)
    }
  }, [token])

  const fetchChannelPlaylist = useCallback(async (channelId, maxResults = 20) => {
    const playlistId = 'UU' + channelId.slice(2)
    const url = new URL(`${BASE}/playlistItems`)
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('playlistId', playlistId)
    url.searchParams.set('maxResults', String(maxResults))
    const data = await apiFetch(url.toString(), token)
    const items = (data.items ?? []).map(it => ({
      videoId:     it.snippet.resourceId.videoId,
      title:       it.snippet.title,
      thumbnail:   it.snippet.thumbnails?.medium?.url ?? it.snippet.thumbnails?.default?.url ?? null,
      publishedAt: it.snippet.publishedAt,
    }))
    return { playlistId, items }
  }, [token])

  return { channels, loading, error, status, fetchSubscriptions, fetchChannelPlaylist }
}
