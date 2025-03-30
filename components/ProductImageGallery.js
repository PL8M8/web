import colors from 'constants/colors';
import React, { useState } from 'react';
import styled from 'styled-components';

const defaultCarImages = [
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
];

const GalleryContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 16px;
`;

const MainImageContainer = styled.div`
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: #f3f4f6;
    border: 1px solid #33333330;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
`;

const MainImage = styled.img`
    width: 100%;
    height: auto;
    object-fit: cover;
    aspect-ratio: 1/1;
`;

const ThumbnailGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    
    @media (min-width: 640px) {
        grid-template-columns: repeat(7, 1fr);
    }
`;

const ThumbnailContainer = styled.div`
    cursor: pointer;
    border: 2px solid ${props => props.isActive ? colors.primary : '#33333330'};
    border-radius: 6px;
    overflow: hidden;
`;

const ThumbnailImage = styled.img`
    width: 100%;
    height: auto;
    object-fit: cover;
    aspect-ratio: 1/1;
`;

const ProductImageGallery = ({ images = [], imageUri }) => {
    const displayImages = images && images.length > 0 ? images : defaultCarImages;
    
    const [mainImage, setMainImage] = useState(imageUri);

    const handleThumbnailHover = (image) => {
        setMainImage(image);
    };

    return (
        <GalleryContainer>
        <MainImageContainer>
            <MainImage 
                src={mainImage} 
                alt="Product main view" 
                draggable="false"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultCarImages[0];
                    if (mainImage !== defaultCarImages[0]) {
                    setMainImage(defaultCarImages[0]);
                    }
                }}
            />
        </MainImageContainer>
        { displayImages.length > 1 && (
                    <ThumbnailGrid>
                    {displayImages.map((image, index) => (
                    <ThumbnailContainer 
                        key={index}
                        isActive={mainImage === image}
                        onMouseEnter={() => handleThumbnailHover(image)}
                        onClick={() => setMainImage(image)}
                    >
                        <ThumbnailImage 
                            src={image} 
                            alt={`Product view ${index + 1}`}
                            draggable="false"
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultCarImages[index % defaultCarImages.length];
                            }}
                        />
                    </ThumbnailContainer>
                    ))}
                </ThumbnailGrid>
        )}
        </GalleryContainer>
    );
};

export default ProductImageGallery;