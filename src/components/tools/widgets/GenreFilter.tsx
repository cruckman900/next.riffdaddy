// components/GenreFilter.tsx
import { motion } from 'framer-motion'
import { Genre } from '@/types/genre'

const genres: Genre[] = Object.values(Genre)

type GenreFilterProps = {
  activeGenre: Genre
  setGenre: (genre: Genre) => void
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
