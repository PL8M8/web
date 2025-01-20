import React from 'react'
import fetchImages from 'lib/fetchImages'
import type { ImagesResults } from 'models/Images'

export default async function Gallery() {
    const url = 'https://api.pexels.com/vi/curated'
    const images: ImagesResults | undefined = await fetchImages(url)

    if (!images) return <p>No images Found</p>

    return (
        <section>
            <ul>
                { images.photos.map(photo => (
                    <li key={photo.id}>{photo.src.large}</li>
                ))}
            </ul>
        </section>
    )
}