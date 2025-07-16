import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import Link from 'next/link';
import { supabase } from '../config/supabase';
import colors from "constants/colors";

const Container = styled.div`
    height: 100vh;
`;

const Mosaic = styled.div`
    display: grid;
    gap: clamp(1rem, 5vmin, 1rem);
    width: 100%;
    padding: 0 1%;
    overflow: auto;
    
    /* Responsive grid columns */
    grid-template-columns: repeat(1, 1fr);
    
    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
    }
    
    @media (min-width: 1440px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;

const VehicleFeedHeader = styled.div`
    background-color: #fff;
    border: 1px solid #44444450;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
    margin: 1rem;
    padding: 1rem;
    min-height: 72px;
`;

const FilterContainer = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-evenly;
    gap: 1rem;
    width: 100%;
    
    @media (max-width: 768px) {
        flex-wrap: wrap;
        gap: 0.75rem;
    }
`;

const FilterWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 120px;
    
    @media (max-width: 768px) {
        min-width: 140px;
    }
`;

const FilterLabel = styled.label`
    font-size: 0.75rem;
    color: #666;
    margin-bottom: 0.25rem;
    font-weight: 500;
`;

const FilterSelect = styled.select`
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    font-size: 0.9rem;
    cursor: pointer;
    flex: 1;
    
    &:focus {
        outline: none;
        border-color: ${colors.primary};
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
    
    @media (max-width: 480px) {
        font-size: 0.8rem;
    }
`;

const PriceRangeContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 180px;
    
    @media (max-width: 768px) {
        min-width: 200px;
    }
`;

const PriceInputsWrapper = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
`;

const PriceInput = styled.input`
    padding: 0.5rem 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    font-size: 0.9rem;
    flex: 1;
    text-align: center;
    
    &:focus {
        outline: none;
        border-color: ${colors.primary};
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
    
    &::placeholder {
        color: #999;
        font-size: 0.8rem;
    }
`;

const PriceLabel = styled.span`
    font-size: 0.9rem;
    color: #666;
    white-space: nowrap;
    flex-shrink: 0;
`;

const ClearFiltersButton = styled.button`
    background-color: ${colors.primary};
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
    white-space: nowrap;
    height: fit-content;
    
    &:hover {
        background-color: #5a6268;
    }
    
    &:disabled {
        background-color: #e9ecef;
        color: #6c757d;
        cursor: not-allowed;
    }
`;

const VehicleCount = styled.div`
    color: #999;
    font-weight: 500;
    font-size: 0.75rem;
    text-align: center;
    margin-bottom: 0.5rem;
    z-index: 10;
    text-transform: uppercase;
`;

// Create container for smooth transitions
const ContentContainer = styled.div`
    position: relative;
    width: 100%;
    min-height: 100vh;
    padding-bottom: 80px; /* Add space for fixed vehicle count */
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
    height: 450px;
    display: flex;
    flex-direction: column;
`;

const ImageContainer = styled.div`
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: hidden;
`;

const Image = styled.img.attrs(() => ({
    loading: "lazy"
}))`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-bottom: 3px solid orange;
    opacity: ${props => props.loaded ? 1 : 0};
    transition: opacity 0.2s ease-in;
`;

const CardContent = styled.div`
    padding: 10px;
    flex-shrink: 0;
    height: auto;
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

    // Filter states
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMake, setSelectedMake] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    // Filter vehicles with images and valid prices only
    const vehiclesWithImages = useMemo(() => {
        return vehicles.filter(vehicle => 
            vehicle.image_uri && 
            vehicle.image_uri !== '' && 
            vehicle.image_uri !== '/fallback.jpg' &&
            vehicle.listing_price &&
            vehicle.listing_price !== null &&
            vehicle.listing_price !== undefined &&
            vehicle.listing_price > 0
        );
    }, [vehicles]);

    // Generate filter options dynamically based on current selections
    const filterOptions = useMemo(() => {
        // Start with all vehicles that have images
        let availableVehicles = vehiclesWithImages;

        // Calculate available options for each filter based on other filters
        const availableYears = [...new Set(
            availableVehicles.filter(v => 
                (!selectedMake || v.make === selectedMake) &&
                (!selectedModel || v.model === selectedModel) &&
                (!minPrice || parseFloat(v.listing_price) >= parseFloat(minPrice)) &&
                (!maxPrice || parseFloat(v.listing_price) <= parseFloat(maxPrice))
            ).map(v => v.year)
        )].sort((a, b) => b - a);

        const availableMakes = [...new Set(
            availableVehicles.filter(v => 
                (!selectedYear || v.year.toString() === selectedYear) &&
                (!selectedModel || v.model === selectedModel) &&
                (!minPrice || parseFloat(v.listing_price) >= parseFloat(minPrice)) &&
                (!maxPrice || parseFloat(v.listing_price) <= parseFloat(maxPrice))
            ).map(v => v.make)
        )].sort();

        const availableModels = [...new Set(
            availableVehicles.filter(v => 
                (!selectedYear || v.year.toString() === selectedYear) &&
                (!selectedMake || v.make === selectedMake) &&
                (!minPrice || parseFloat(v.listing_price) >= parseFloat(minPrice)) &&
                (!maxPrice || parseFloat(v.listing_price) <= parseFloat(maxPrice))
            ).map(v => v.model)
        )].sort();
        
        return { 
            years: availableYears, 
            makes: availableMakes, 
            models: availableModels 
        };
    }, [vehiclesWithImages, selectedYear, selectedMake, selectedModel, minPrice, maxPrice]);

    // Filter vehicles based on selected criteria
    const filteredVehicles = useMemo(() => {
        return vehiclesWithImages.filter(vehicle => {
            const yearMatch = !selectedYear || vehicle.year.toString() === selectedYear;
            const makeMatch = !selectedMake || vehicle.make === selectedMake;
            const modelMatch = !selectedModel || vehicle.model === selectedModel;
            
            const price = parseFloat(vehicle.listing_price);
            const priceMatch = (!minPrice || price >= parseFloat(minPrice)) &&
                             (!maxPrice || price <= parseFloat(maxPrice));
            
            return yearMatch && makeMatch && modelMatch && priceMatch;
        });
    }, [vehiclesWithImages, selectedYear, selectedMake, selectedModel, minPrice, maxPrice]);

    // Clear all filters
    const clearFilters = () => {
        setSelectedYear('');
        setSelectedMake('');
        setSelectedModel('');
        setMinPrice('');
        setMaxPrice('');
    };

    // Check if any filters are active
    const hasActiveFilters = selectedYear || selectedMake || selectedModel || minPrice || maxPrice;

    // Auto-clear invalid selections when filter options change
    useEffect(() => {
        if (selectedYear && !filterOptions.years.includes(parseInt(selectedYear))) {
            setSelectedYear('');
        }
        if (selectedMake && !filterOptions.makes.includes(selectedMake)) {
            setSelectedMake('');
        }
        if (selectedModel && !filterOptions.models.includes(selectedModel)) {
            setSelectedModel('');
        }
    }, [filterOptions.years, filterOptions.makes, filterOptions.models]);

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
                    // Filter out vehicles without images or valid prices before setting state
                    const vehiclesWithValidImages = data.filter(vehicle => 
                        vehicle.image_uri && 
                        vehicle.image_uri !== '' && 
                        vehicle.image_uri !== '/fallback.jpg' &&
                        vehicle.listing_price &&
                        vehicle.listing_price !== null &&
                        vehicle.listing_price !== undefined &&
                        vehicle.listing_price > 0
                    );

                    // Set vehicles first (so DOM elements are ready)
                    setVehicles(vehiclesWithValidImages);
                    
                    // Then preload all images
                    setLoadingStatus('Loading images...');
                    console.log('Starting image preload for', vehiclesWithValidImages.length, 'vehicles');
                    
                    const imagePromises = vehiclesWithValidImages.map(async (vehicle, index) => {
                        try {
                            await preloadImage(vehicle.image_uri);
                            console.log(`Image ${index + 1}/${vehiclesWithValidImages.length} loaded`);
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
                <FilterContainer>
                    <FilterWrapper>
                        <FilterLabel>Year</FilterLabel>
                        <FilterSelect 
                            value={selectedYear} 
                            onChange={(e) => setSelectedYear(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="">All Years</option>
                            {filterOptions.years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </FilterSelect>
                    </FilterWrapper>
                    
                    <FilterWrapper>
                        <FilterLabel>Make</FilterLabel>
                        <FilterSelect 
                            value={selectedMake} 
                            onChange={(e) => setSelectedMake(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="">All Makes</option>
                            {filterOptions.makes.map(make => (
                                <option key={make} value={make}>{make}</option>
                            ))}
                        </FilterSelect>
                    </FilterWrapper>
                    
                    <FilterWrapper>
                        <FilterLabel>Model</FilterLabel>
                        <FilterSelect 
                            value={selectedModel} 
                            onChange={(e) => setSelectedModel(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="">All Models</option>
                            {filterOptions.models.map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </FilterSelect>
                    </FilterWrapper>
                    
                    <PriceRangeContainer>
                        <FilterLabel>Price Range</FilterLabel>
                        <PriceInputsWrapper>
                            <PriceInput
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                disabled={isLoading}
                            />
                            <PriceLabel>to</PriceLabel>
                            <PriceInput
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                disabled={isLoading}
                            />
                        </PriceInputsWrapper>
                    </PriceRangeContainer>
                    
                    <ClearFiltersButton 
                        onClick={clearFilters}
                        disabled={!hasActiveFilters || isLoading}
                    >
                        Clear Filters
                    </ClearFiltersButton>
                </FilterContainer>
            </VehicleFeedHeader>
            {!isLoading && (
                <VehicleCount>
                    {filteredVehicles.length} {filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'} available
                </VehicleCount>
            )}
            <ContentContainer>
                <SkeletonLayer visible={!showContent}>
                    <Mosaic>
                        {skeletonCards}
                    </Mosaic>
                </SkeletonLayer>
                
                {/* Vehicle Content Layer */}
                <VehicleLayer visible={showContent}>
                    <Mosaic>
                        {filteredVehicles.map(({ id, image_uri, make, model, year, listing_price, condition, mileage, created_at }) => (
                            <Link key={id} href={`/vehicle/${id}`}>
                                <Card>
                                    <Price>${listing_price?.toLocaleString()}</Price>
                                    <ImageContainer>
                                        <Image
                                            src={image_uri}
                                            alt={`${make} {model}`}
                                            draggable="false"
                                            loaded={imageLoadStates[id]}
                                            onError={(e) => { 
                                                // Since we filter out vehicles without images, this shouldn't happen
                                                // But just in case, we'll hide the image
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </ImageContainer>
                                    <CardContent>
                                        <Subtitle>{year} {make} {model}</Subtitle>
                                        <Detail><strong>Condition:</strong> {condition}</Detail>
                                        <Detail><strong>Mileage:</strong> {mileage} miles</Detail>
                                        <DateListed>Listed {formatRelativeTime(created_at)}</DateListed>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </Mosaic>
                </VehicleLayer>
            </ContentContainer>
        </Container>
    );
}