import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from 'next/link';
import { supabase } from '../config/supabase';
import colors from "constants/colors";

const Container = styled.div`
    height: 100vh;
`

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
        columns: 2;
    }

    @media (min-width: 1024px) {
        columns: 3;
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

`

const VehicleCount = styled.div`
    padding: 0.5%;
    color: #333;
`

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
`;

const Title = styled.h2`
    font-weight: bold;
    font-size: 1.2em;
`;

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

export default function VehicleFeed() {
    const [vehicles, setVehicles] = useState([]);
    const [hasMounted, setHasMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setHasMounted(true);

        async function getVehicles() {
            // Start timing for minimum loading duration
            const startTime = Date.now();
            
            try {
                const { data, error } = await supabase
                    .from('vehicles')
                    .select()
                    .eq('is_sellable', true);

                if (error) throw error;

                if (data && data.length > 0) {
                    setVehicles(data);
                }
                
                // Calculate how long the data fetch took
                const elapsedTime = Date.now() - startTime;
                const minLoadingTime = 1000; // 1 second minimum
                
                // If fetch was faster than minimum time, wait for the remaining time
                if (elapsedTime < minLoadingTime) {
                    await new Promise(resolve => 
                        setTimeout(resolve, minLoadingTime - elapsedTime)
                    );
                }
            } catch (error) {
                console.error("Error fetching vehicles:", error);
                
                // Ensure minimum loading time even on error
                const elapsedTime = Date.now() - startTime;
                const minLoadingTime = 1000;
                
                if (elapsedTime < minLoadingTime) {
                    await new Promise(resolve => 
                        setTimeout(resolve, minLoadingTime - elapsedTime)
                    );
                }
            } finally {
                setIsLoading(false);
            }
        }

        getVehicles();
    }, []);

    if (!hasMounted) return null;

    return (
        <Container>
            <VehicleFeedHeader>
                {isLoading ? (
                    <VehicleCount>Loading vehicles...</VehicleCount>
                ) : (
                    <VehicleCount>{vehicles.length} of {vehicles.length}</VehicleCount>
                )}
            </VehicleFeedHeader>
            <Mosaic>
                {isLoading ? (
                    // Show skeleton cards while loading
                    skeletonCards
                ) : (
                    // Show actual vehicle cards
                    vehicles.map(({ id, image_uri, make, model, year, listing_price, condition, mileage }) => (
                        <Link key={id} href={`/vehicle/${id}`}>
                            <Card>
                                <Price>${listing_price.toLocaleString()}</Price>
                                <Image
                                    src={image_uri || '/fallback.jpg'}
                                    alt={`${make} ${model}`}
                                    draggable="false"
                                    onError={(e) => { e.currentTarget.src = '/fallback.jpg'; }}
                                />
                                <div style={{ padding: '10px' }}>
                                    <Subtitle>{year} {make} {model}</Subtitle>
                                    <Detail><strong>Condition:</strong> {condition}</Detail>
                                    <Detail><strong>Mileage:</strong> {mileage} miles</Detail>
                                </div>
                            </Card>
                        </Link>
                    ))
                )}
            </Mosaic>
        </Container>
    );
}