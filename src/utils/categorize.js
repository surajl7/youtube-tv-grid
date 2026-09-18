// Maps Wikipedia topic URLs (from YouTube API) → our TV category IDs
const TOPIC_MAP = {
  Music:                  'music',
  Music_of_Asia:          'music',
  Music_of_Latin_America: 'music',
  Classical_music:        'music',
  Christian_music:        'music',
  Electronic_music:       'music',
  Hip_hop_music:          'music',
  Independent_music:      'music',
  Country_music:          'music',
  Jazz:                   'music',
  'Rhythm_and_blues':     'music',
  Rock_music:             'music',
  Pop_music:              'music',
  Soul_music:             'music',
  Reggae:                 'music',

  Sport:                  'sports',
  American_football:      'sports',
  Baseball:               'sports',
  Basketball:             'sports',
  Boxing:                 'sports',
  Cricket:                'sports',
  Football:               'sports',
  Golf:                   'sports',
  Ice_hockey:             'sports',
  Mixed_martial_arts:     'sports',
  Motorsport:             'sports',
  Rugby_league:           'sports',
  Rugby_union:            'sports',
  Tennis:                 'sports',
  Volleyball:             'sports',
  Wrestling:              'sports',

  Film:                   'movies',
  Television_program:     'movies',
  Animation:              'movies',
  Anime:                  'movies',

  Video_game:             'gaming',
  Action_game:            'gaming',
  'Action-adventure_game':'gaming',
  'Role-playing_video_game': 'gaming',
  Shooter_game:           'gaming',
  Strategy_video_game:    'gaming',

  Humor:                  'comedy',
  Comedy:                 'comedy',
  Entertainment:          'comedy',
  'Stand-up_comedy':      'comedy',

  News:                   'news',
  Politics:               'news',
  'Current_events':       'news',

  Technology:             'tech',
  Consumer_electronics:   'tech',
  Computing:              'tech',
  Science:                'tech',
}

// Keyword fallback for channels with no topicDetails
const KEYWORD_MAP = [
  { cat: 'music',   words: ['music', 'vevo', 'records', 'sounds', 'songs', 'lyrics', 'band', 'beats'] },
  { cat: 'sports',  words: ['sport', 'football', 'soccer', 'nba', 'nfl', 'cricket', 'tennis', 'league', 'f1', 'racing', 'fitness', 'gym', 'esport'] },
  { cat: 'movies',  words: ['movie', 'film', 'cinema', 'trailer', 'series', 'tv show', 'netflix', 'anime', 'animation'] },
  { cat: 'gaming',  words: ['gaming', 'games', 'gamer', 'playstation', 'xbox', 'nintendo', 'fortnite', 'minecraft', 'streamer', 'twitch'] },
  { cat: 'news',    words: ['news', 'bbc', 'cnn', 'reuters', 'times', 'journalist', 'politics', 'breaking', 'daily', 'report'] },
  { cat: 'tech',    words: ['tech', 'technology', 'coding', 'programming', 'software', 'hardware', 'developer', 'ai', 'review', 'gadget', 'unbox'] },
  { cat: 'comedy',  words: ['comedy', 'funny', 'humor', 'laugh', 'sketch', 'prank', 'stand-up', 'memes', 'satire'] },
]

export function categorizeChannel(title = '', topicUrls = []) {
  // Try topic URLs first (most reliable)
  for (const url of topicUrls) {
    const slug = url.split('/wiki/').pop()
    if (TOPIC_MAP[slug]) return TOPIC_MAP[slug]
  }

  // Keyword fallback on channel title
  const lower = title.toLowerCase()
  for (const { cat, words } of KEYWORD_MAP) {
    if (words.some(w => lower.includes(w))) return cat
  }

  return 'other'
}

// Generate a deterministic dark color from a string ID
export function colorFromId(id = '') {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash % 360)
  return `hsl(${hue}, 40%, 22%)`
}
