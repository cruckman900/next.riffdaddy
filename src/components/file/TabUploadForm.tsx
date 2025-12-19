'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Genre } from '@/types/genre'

const genres: Genre[] = Object.values(Genre)

export default function TabUploadForm() {
    const [form, setForm] = useState({
        title: '', artist: '', genre: '', tab: ''
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        toast.success("Tab uploaded successfully 🎉")
        console.log('Mock upload:', form)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-gray-900 dark:bg-white p-6 rounded-xl space-y-4 text-white dark:text-gray-900">
            <input name="title" placeholder="Title" onChange={handleChange} className="w-full p-2 rounded bg-gray-800 dark:bg-white" />
            <input name="artist" placeholder="Artist" onChange={handleChange} className="w-full p-2 rounded bg-gray-800" />
            <select name="genre" onChange={handleChange} className="w-full p-2 rounded bg-gray-800">
                <option value="">Select Genre</option>
                {genres.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                ))}
            </select>
            <textarea name="tab" placeholder="Paste tab here..." rows={6} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 dark:bg-white" />
            <button type="submit" className="bg-riff text-black px-4 py-2 rounded hover:scale-105 transition">Upload Tab</button>
        </form>
    )
}