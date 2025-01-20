import React, { useState, useEffect } from 'react';
import fetchImages from 'lib/fetchImages';
import type { ImagesResults } from 'models/Images';

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
    <section>
      <ul>
        {images.photos.map((photo) => (
          <li key={photo.id}>
            <img src={photo.src.large} alt={photo.alt} />
          </li>
        ))}
      </ul>
    </section>
  );
}
