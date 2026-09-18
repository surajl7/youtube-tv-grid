export const CATEGORIES = [
  { id: 'music',   label: 'MUSIC',   startCh: 1  },
  { id: 'sports',  label: 'SPORTS',  startCh: 11 },
  { id: 'movies',  label: 'MOVIES',  startCh: 21 },
  { id: 'gaming',  label: 'GAMING',  startCh: 31 },
  { id: 'news',    label: 'NEWS',    startCh: 41 },
  { id: 'tech',    label: 'TECH',    startCh: 51 },
  { id: 'comedy',  label: 'COMEDY',  startCh: 61 },
  { id: 'other',   label: 'OTHER',   startCh: 71 },
];

export const CHANNELS = [
  // Music
  { id: 'ch_01', name: 'Coldplay',       category: 'music',   color: '#1a472a', initials: 'CP',   subs: '20.1M' },
  { id: 'ch_02', name: 'BTS HYBE',       category: 'music',   color: '#4a0e8f', initials: 'BTS',  subs: '74.2M' },
  { id: 'ch_03', name: 'Taylor Swift',   category: 'music',   color: '#8b1a1a', initials: 'TS',   subs: '56.9M' },
  { id: 'ch_04', name: 'Vevo',           category: 'music',   color: '#c00000', initials: 'VEVO', subs: '25.3M' },
  { id: 'ch_05', name: 'Eminem',         category: 'music',   color: '#2d2d2d', initials: 'EM',   subs: '53.1M' },
  { id: 'ch_06', name: 'Ed Sheeran',     category: 'music',   color: '#1565c0', initials: 'ES',   subs: '54.8M' },
  // Sports
  { id: 'ch_11', name: 'ESPN',           category: 'sports',  color: '#c8102e', initials: 'ESPN', subs: '8.2M'  },
  { id: 'ch_12', name: 'Sky Sports',     category: 'sports',  color: '#003087', initials: 'SKY',  subs: '7.4M'  },
  { id: 'ch_13', name: 'LaLiga',         category: 'sports',  color: '#ee8208', initials: 'LL',   subs: '12.1M' },
  { id: 'ch_14', name: 'NBA',            category: 'sports',  color: '#c9082a', initials: 'NBA',  subs: '19.6M' },
  { id: 'ch_15', name: 'F1',             category: 'sports',  color: '#e10600', initials: 'F1',   subs: '10.3M' },
  // Movies
  { id: 'ch_21', name: 'Movieclips',     category: 'movies',  color: '#7b2d8b', initials: 'MC',   subs: '60.4M' },
  { id: 'ch_22', name: 'A24',            category: 'movies',  color: '#2c2c2c', initials: 'A24',  subs: '1.8M'  },
  { id: 'ch_23', name: 'IMDb',           category: 'movies',  color: '#c8a900', initials: 'IMDb', subs: '9.5M'  },
  { id: 'ch_24', name: 'Rotten Tomatoes',category: 'movies',  color: '#aa1111', initials: 'RT',   subs: '2.3M'  },
  // Gaming
  { id: 'ch_31', name: 'IGN',            category: 'gaming',  color: '#e60000', initials: 'IGN',  subs: '18.7M' },
  { id: 'ch_32', name: 'GameSpot',       category: 'gaming',  color: '#1b5e20', initials: 'GS',   subs: '4.9M'  },
  { id: 'ch_33', name: 'Markiplier',     category: 'gaming',  color: '#b71c1c', initials: 'MARK', subs: '37.2M' },
  { id: 'ch_34', name: 'PewDiePie',      category: 'gaming',  color: '#1a237e', initials: 'PDP',  subs: '111M'  },
  { id: 'ch_35', name: 'Jacksepticeye',  category: 'gaming',  color: '#1b5e20', initials: 'JSE',  subs: '32.4M' },
  // News
  { id: 'ch_41', name: 'BBC News',       category: 'news',    color: '#bb1919', initials: 'BBC',  subs: '13.6M' },
  { id: 'ch_42', name: 'CNN',            category: 'news',    color: '#cc0000', initials: 'CNN',  subs: '16.3M' },
  { id: 'ch_43', name: 'Reuters',        category: 'news',    color: '#ff6600', initials: 'RTR',  subs: '3.1M'  },
  // Tech
  { id: 'ch_51', name: 'Linus Tech Tips',category: 'tech',   color: '#f57c00', initials: 'LTT',  subs: '15.8M' },
  { id: 'ch_52', name: 'MKBHD',          category: 'tech',   color: '#212121', initials: 'MK',   subs: '18.9M' },
  { id: 'ch_53', name: 'Fireship',       category: 'tech',   color: '#00b0ff', initials: 'FS',   subs: '3.4M'  },
  { id: 'ch_54', name: 'Veritasium',     category: 'tech',   color: '#00695c', initials: 'VRT',  subs: '16.1M' },
  // Comedy
  { id: 'ch_61', name: 'SNL',            category: 'comedy',  color: '#1565c0', initials: 'SNL',  subs: '12.7M' },
  { id: 'ch_62', name: 'Comedy Central', category: 'comedy',  color: '#e65100', initials: 'CC',   subs: '8.9M'  },
  { id: 'ch_63', name: 'Smosh',          category: 'comedy',  color: '#6a1b9a', initials: 'SM',   subs: '25.6M' },
  // Other
  { id: 'ch_71', name: 'National Geo',   category: 'other',   color: '#f9a825', initials: 'NAT',  subs: '22.4M' },
  { id: 'ch_72', name: 'TED',            category: 'other',   color: '#e53935', initials: 'TED',  subs: '19.1M' },
  { id: 'ch_73', name: 'Kurzgesagt',     category: 'other',   color: '#0288d1', initials: 'KRZ',  subs: '23.5M' },
];

export function assignChannelNumbers(channels, categories) {
  const countPerCat = {};
  return channels.map((ch) => {
    const cat = categories.find((c) => c.id === ch.category);
    const start = cat ? cat.startCh : 71;
    const idx = countPerCat[ch.category] ?? 0;
    countPerCat[ch.category] = idx + 1;
    return { ...ch, chNum: start + idx };
  });
}
