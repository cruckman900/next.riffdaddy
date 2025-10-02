'use client'
import { useState } from 'react'

export default function TabUploadForm() {
    const [form, setForm] = useState({
        title: '', artist: '', genre: '', tab: ''
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log('Mock upload:', form)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl space-y-4 text-white">
            <input name="title" placeholder="Title" onChange={handleChange} className="w-full p-2 rounded bg-gray-800" />
            <input name="artist" placeholder="Artist" onChange={handleChange} className="w-full p-2 rounded bg-gray-800" />
            <select name="genre" onChange={handleChange} className="w-full p-2 rounded bg-gray-800">
                <option value="">Select Genre</option>
                <option value="metal">Metal</option>
                <option value="jazz">Jazz</option>
                <option value="blues">Blues</option>
                <option value="rock">Rock</option>
                <option value="classical">Classical</option>
                <option value="country">Country</option>
                <option value="other">Other</option>
            </select>
            <textarea name="tab" placeholder="Paste tab here..." rows={6} onChange={handleChange} className="w-full p-2 rounded bg-gray-800" />
            <button type="submit" className="bg-riff text-black px-4 py-2 rounded hover:scale-105 transition">Upload Tab</button>
        </form>
    )
}