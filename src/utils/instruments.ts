// utils/instruments.ts

import { IconType } from 'react-icons'
import { GiGuitar, GiViolin } from 'react-icons/gi'
import { FaGuitar } from 'react-icons/fa'
import { MdCellTower } from 'react-icons/md' // placeholder for cello

export interface Instrument {
  label: string
  value: string
  icon: IconType
}

export const instruments: Instrument[] = [
  { label: 'Guitar', value: 'guitar', icon: GiGuitar },
  { label: 'Electric Guitar', value: 'electric-guitar', icon: FaGuitar },
  { label: 'Bass', value: 'bass', icon: GiGuitar },
  { label: 'Violin', value: 'violin', icon: GiViolin },
  { label: 'Cello', value: 'cello', icon: MdCellTower },
]
