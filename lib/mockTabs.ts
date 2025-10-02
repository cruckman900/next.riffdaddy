// lib/mockTabs.ts
import type { TabData } from '@/types/Tab'

export const mockTabs: TabData[] = [
  {
    title: 'Smoke on the Water',
    artist: 'Deep Purple',
    genre: 'rock',
    musicalKey: 'G Minor',
    tempo: 112,
    timeSignature: '4/4',
    tab: `E|------------------------|\nB|------------------------|\nG|--3--5--3--6--5--3------|\nD|------------------------|\nA|------------------------|\nE|------------------------|`,
  },
  {
    title: 'Canon in D',
    artist: 'Pachelbel',
    genre: 'classical',
    musicalKey: 'D Major',
    tempo: 80,
    timeSignature: '4/4',
    tab: `E|--2--0--2--4--5--4--2--0--|\nB|--------------------------|\nG|--------------------------|\nD|--------------------------|\nA|--------------------------|\nE|--------------------------|`,
  },
  {
    title: 'Ring of Fire',
    artist: 'Johnny Cash',
    genre: 'country',
    musicalKey: 'G Major',
    tempo: 95,
    timeSignature: '4/4',
    tab: `E|--3--3--3--3--3--3--3--3--|\nB|--0--0--0--0--0--0--0--0--|\nG|--0--0--0--0--0--0--0--0--|\nD|--0--0--0--0--0--0--0--0--|\nA|--2--2--2--2--2--2--2--2--|\nE|--3--3--3--3--3--3--3--3--|`,
  },
]
