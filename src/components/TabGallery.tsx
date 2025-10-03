// components/TabGallery.tsx
"use client"

import { useState } from "react"
import { mockTabs } from "@/lib/mockTabs"
import TabPreview from "./TabPreview"
import GenreFilter from "./GenreFilter"
import { Genre } from "@/types/genre"

export default function TabGallery() {
    const [activeGenre, setGenre] = useState<Genre>(Genre.All)
    const filteredTabs = activeGenre === Genre.All
        ? mockTabs
        : mockTabs.filter(tab => tab.genre === activeGenre)

    return (
        <>
            <GenreFilter activeGenre={activeGenre} setGenre={setGenre} />
            <div className="space-y-12 mt-8">
                {filteredTabs.map((tab, i) => (
                    <TabPreview key={i} {...tab} />
                ))}
            </div>
        </>
    )
}