import React, { useState, useEffect } from 'react';
import fetchImages from 'lib/fetchImages';
import type { ImagesResults } from 'models/Images';
import styled from 'styled-components';
import Image from 'next/image';

const Section = styled.section`
    padding: 0 0.5rem;
    margin: 0.75rem 0; 
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
`;

const PhotoCard = styled.div`
  height: 16rem; /* Equivalent to h-64 */
  background-color: #e5e7eb; /* Equivalent to bg-gray-200 */
  border-radius: 0.75rem; /* Equivalent to rounded-xl */
`;


export default function Gallery() {
    const [images, setImages] = useState<ImagesResults | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const url = 'https://api.pexels.com/v1/curated';

        const loadImages = async () => {
            try {
                const fetchedImages = await fetchImages(url);
                if (fetchedImages) {
                setImages(fetchedImages);
                } else {
                setError('No images found.');
                }
            } catch (e) {
                setError('Failed to fetch images.');
            } finally {
                setLoading(false);
            }
        };

        loadImages();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!images) return <p>No images found.</p>;

    return (
        <Section>
            { images.photos.map(photo => (
                <PhotoCard key={photo.id}>
                    <Image
                        src={photo.src.large}
                        alt={photo.alt}
                        width={250}
                        height={250}
                    />
                </PhotoCard>
            ))}
        </Section>
    );
}