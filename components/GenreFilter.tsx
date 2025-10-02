// components/GenreFilter.tsx
import { motion } from 'framer-motion'

const genres = ['all', 'metal', 'jazz', 'blues', 'rock', 'classical', 'country', 'other']
type Genre = 'metal' | 'jazz' | 'blues' | 'rock' | 'classical' | 'country' | 'other' | 'all'

type GenreFilterProps = {
  activeGenre: Genre
  setGenre: React.Dispatch<React.SetStateAction<Genre>>
}

export default function GenreFilter({ activeGenre, setGenre }: GenreFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6">
      {genres.map((genre) => (
        <motion.button
          key={genre}
          onClick={() => setGenre(genre as Genre)}
          whileHover={{ scale: 1.1 }}
          className={`px-4 py-2 rounded-full font-semibold transition ${
            activeGenre === genre
              ? 'bg-riff text-black shadow-[0_0_12px_#00ff80]'
              : 'bg-gray-800 text-white'
          }`}
        >
          {genre.toUpperCase()}
        </motion.button>
      ))}
    </div>
  )
}
