import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from 'next/link';
import { supabase } from '../config/supabase';
import colors from "constants/colors";

const Container = styled.div`
    height: 100vh;
const Mosaic = styled.div`
    --gap: clamp(1rem, 5vmin, 1rem);
    column-gap: var(--gap);
    width: 100%;
    padding: 0 1%;
    overflow: auto;
    @media (min-width: 500px) {
        columns: 1;
    }

    @media (min-width: 768px) {
        columns: 3;
    }

    @media (min-width: 1024px) {
        columns: 5;
    }

    & > * {
        break-inside: avoid;
        margin-bottom: var(--gap);
        width: 100%;
        display: inline-block;
    }
`;

const VehicleFeedHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 1%;
`;

const VehicleCount = styled.div`
    padding: 0.5%;
    color: #333;
`;

// Create container for smooth transitions
const ContentContainer = styled.div`
    position: relative;
    width: 100%;
    min-height: 100vh;
`;

const SkeletonLayer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    opacity: ${props => props.visible ? 1 : 0};
    transition: opacity 0.3s ease-out;
    z-index: ${props => props.visible ? 2 : 1};
`;

const VehicleLayer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    opacity: ${props => props.visible ? 1 : 0};
    transition: opacity 0.3s ease-in;
    z-index: ${props => props.visible ? 2 : 1};
`;

const Card = styled.div`
    position: relative;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #44444450;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Image = styled.img.attrs(() => ({
    loading: "lazy"
}))`
    width: 100%;
    height: auto;
    border-bottom: 3px solid orange;
    opacity: ${props => props.loaded ? 1 : 0};
    transition: opacity 0.2s ease-in;
`;

const Title = styled.h2`
    font-weight: bold;
    font-size: 1.2em;
`;

const DateListed = styled.p`
    color: gray;
    font-size: 0.65em;
    margin: 0;
    padding: 0;
    text-align: right;
`

const Subtitle = styled.h3`
    font-size: 1em;
    color: ${colors.primary};
    margin: 0;
`;

const Price = styled.h3`
    font-size: 1em;
    color: green;
    position: absolute;
    background: #fff;
    margin: 2%;
    border-radius: 5px;
    border: 1px solid #33333330;
    padding: 1% 4%;
    z-index: 1;
`;

const Detail = styled.p`
    font-size: 0.9em;
    margin: 5px 0;
`;

const Button = styled.a`
    background-color: #007bff;
    color: white;
    text-align: center;
    border-radius: 5px;
    padding: 10px;
    margin: 0.5rem;
    cursor: pointer;
    text-decoration: none;
    &:hover {
        background-color: #0056b3;
    }
`;

// Skeleton loader styles
const SkeletonCard = styled.div`
    position: relative;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #44444450;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SkeletonPrice = styled.div`
    position: absolute;
    top: 2%;
    left: 2%;
    width: 80px;
    height: 24px;
    background: #fff;
    border-radius: 5px;
    border: 1px solid #33333330;
    z-index: 1;
`;

const SkeletonImage = styled.div`
    width: 100%;
    height: ${props => props.height || '200px'};
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-bottom: 3px solid orange;

    @keyframes loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
`;

const SkeletonContent = styled.div`
    padding: 10px;
`;

const SkeletonLine = styled.div`
    height: ${props => props.height || '16px'};
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
    margin-bottom: ${props => props.marginBottom || '8px'};
    width: ${props => props.width || '100%'};

    @keyframes loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
`;

// Create skeleton cards array with varying heights
const skeletonCards = Array.from({ length: 6 }, (_, index) => {
    // Generate random height between 400 and 600px
    const randomHeight = Math.floor(Math.random() * (600 - 400 + 1)) + 400;
    
    return (
        <SkeletonCard key={`skeleton-${index}`}>
            <SkeletonPrice />
            <SkeletonImage height={`${randomHeight}px`} />
            <SkeletonContent>
                <SkeletonLine height="20px" width="80%" marginBottom="10px" />
                <SkeletonLine height="14px" width="70%" marginBottom="6px" />
                <SkeletonLine height="14px" width="65%" marginBottom="6px" />
            </SkeletonContent>
        </SkeletonCard>
    );
});

// Format relative time from timestamp
const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    
    // Convert to seconds
    const diffInSec = Math.floor(diffInMs / 1000);
    
    // Less than a minute
    if (diffInSec < 60) {
        return 'just now';
    }
    
    // Less than an hour
    if (diffInSec < 3600) {
        const minutes = Math.floor(diffInSec / 60);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Less than a day
    if (diffInSec < 86400) {
        const hours = Math.floor(diffInSec / 3600);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Less than a week
    if (diffInSec < 604800) {
        const days = Math.floor(diffInSec / 86400);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
    // Less than a month (approximation)
    if (diffInSec < 2592000) {
        const weeks = Math.floor(diffInSec / 604800);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }
    
    // Less than a year (approximation)
    if (diffInSec < 31536000) {
        const months = Math.floor(diffInSec / 2592000);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
    
    // More than a year
    const years = Math.floor(diffInSec / 31536000);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
};

// Function to preload a single image
const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
        if (!src || src === '/fallback.jpg') {
            resolve();
            return;
        }
        
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        img.onload = () => {
            resolve(img);
        };
        img.onerror = () => {
            // For failed images, resolve anyway so the card still shows
            resolve(null);
        };
    });
};

export default function VehicleFeed() {
    const [vehicles, setVehicles] = useState([]);
    const [hasMounted, setHasMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingStatus, setLoadingStatus] = useState('Loading vehicles...');
    const [showContent, setShowContent] = useState(false);
    const [imageLoadStates, setImageLoadStates] = useState({});

    useEffect(() => {
        setHasMounted(true);

        async function getVehicles() {
            // Start timing for minimum loading duration
            const startTime = Date.now();
            
            try {
                // Fetch vehicle data
                setLoadingStatus('Fetching vehicle data...');
                const { data, error } = await supabase
                    .from('vehicles')
                    .select()
                    .eq('is_sellable', true);

                if (error) throw error;

                if (data && data.length > 0) {
                    // Set vehicles first (so DOM elements are ready)
                    setVehicles(data);
                    
                    // Then preload all images
                    setLoadingStatus('Loading images...');
                    console.log('Starting image preload for', data.length, 'vehicles');
                    
                    const imagePromises = data.map(async (vehicle, index) => {
                        try {
                            await preloadImage(vehicle.image_uri || '/fallback.jpg');
                            console.log(`Image ${index + 1}/${data.length} loaded`);
                            setImageLoadStates(prev => ({
                                ...prev,
                                [vehicle.id]: true
                            }));
                            return vehicle;
                        } catch (error) {
                            console.warn(`Failed to preload image for vehicle ${vehicle.id}:`, error);
                            // Mark as loaded even if failed, fallback will be used
                            setImageLoadStates(prev => ({
                                ...prev,
                                [vehicle.id]: true
                            }));
                            return vehicle;
                        }
                    });
                    
                    // Wait for all images to load or fail
                    await Promise.all(imagePromises);
                    console.log('All images processed!');
                    
                    setLoadingStatus('Ready!');
                    
                    // Wait a small moment to ensure all state updates are complete
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                    // Start the fade transition
                    setShowContent(true);
                }
                
                // Calculate how long everything took
                const elapsedTime = Date.now() - startTime;
                const minLoadingTime = 1500; // 1.5 second minimum to allow for smooth transition
                
                // If everything was faster than minimum time, wait for the remaining time
                if (elapsedTime < minLoadingTime) {
                    await new Promise(resolve => 
                        setTimeout(resolve, minLoadingTime - elapsedTime)
                    );
                }
            } catch (error) {
                console.error("Error fetching vehicles:", error);
                setLoadingStatus('Error loading vehicles');
                
                // Ensure minimum loading time even on error
                const elapsedTime = Date.now() - startTime;
                const minLoadingTime = 1000;
                
                if (elapsedTime < minLoadingTime) {
                    await new Promise(resolve => 
                        setTimeout(resolve, minLoadingTime - elapsedTime)
                    );
                }
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 400); // Small delay to complete transition
            }
        }

        getVehicles();
    }, []);

    if (!hasMounted) return null;

    return (
        <Container>
            <VehicleFeedHeader>
                {isLoading ? (
                    <VehicleCount>{loadingStatus}</VehicleCount>
                ) : (
                    <VehicleCount>{vehicles.length} of {vehicles.length}</VehicleCount>
                )}
            </VehicleFeedHeader>
            
            <ContentContainer>
                {/* Skeleton Layer */}
                <SkeletonLayer visible={!showContent}>
                    <Mosaic>
                        {skeletonCards}
                    </Mosaic>
                </SkeletonLayer>
                
                {/* Vehicle Content Layer */}
                <VehicleLayer visible={showContent}>
                    <Mosaic>
                        {vehicles.map(({ id, image_uri, make, model, year, listing_price, condition, mileage, created_at }) => (
                            <Link key={id} href={`/vehicle/${id}`}>
                                <Card>
                                    <Price>${listing_price?.toLocaleString()}</Price>
                                    <Image
                                        src={image_uri || '/fallback.jpg'}
                                        alt={`${make} ${model}`}
                                        draggable="false"
                                        loaded={imageLoadStates[id]}
                                        onError={(e) => { 
                                            e.currentTarget.src = '/fallback.jpg';
                                            setImageLoadStates(prev => ({
                                                ...prev,
                                                [id]: true
                                            }));
                                        }}
                                    />
                                    <div style={{ padding: '10px' }}>
                                        <Subtitle>{year} {make} {model}</Subtitle>
                                        <Detail><strong>Condition:</strong> {condition}</Detail>
                                        <Detail><strong>Mileage:</strong> {mileage} miles</Detail>
                                        <DateListed>Listed {formatRelativeTime(created_at)}</DateListed>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </Mosaic>
                </VehicleLayer>
            </ContentContainer>
        </Container>
    );
}