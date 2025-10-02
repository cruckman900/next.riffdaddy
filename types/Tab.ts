export type TabData = {
  title: string
  artist: string
  genre: 'metal' | 'jazz' | 'blues' | 'rock' | 'classical' | 'country' | 'other'
  musicalKey: string
  tempo: number
  timeSignature: string
  tab: string
}
