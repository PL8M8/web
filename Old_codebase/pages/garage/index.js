import React, { useEffect, useState, useTransition, useRef } from 'react';
import { uploadImage } from 'lib/uploadImage';
import { supabase } from 'config/supabase';
import styled from 'styled-components';
import Link from 'next/link';
import colors from 'constants/colors';

// Main container matching VehicleFeed
const Container = styled.div`
    padding-top: 3rem;
    height: 100vh;
`;

// Updated Mosaic to match VehicleFeed exactly
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

// Header section matching VehicleFeed structure
const GarageHeader = styled.div`
    background-color: #fff;
    border: 1px solid #44444450;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
    margin: 1rem;
    padding: 1rem;
    min-height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const GarageTitle = styled.h1`
    margin: 0;
    color: #333;
    font-size: 1.5rem;
`;

const VehicleCount = styled.div`
    color: #999;
    font-weight: 500;
    font-size: 0.75rem;
    text-align: center;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
`;

// Updated Card styling to match VehicleFeed
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
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
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

const Subtitle = styled.h3`
    font-size: 1em;
    color: ${colors.primary};
    margin: 0 0 8px 0;
    font-weight: bold;
`;

const Detail = styled.p`
    font-size: 0.9em;
    margin: 5px 0;
    color: #666;
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
    top: 0;
    left: 0;
`;

// Toggle button styling
const ToggleButton = styled.button`
    background-color: ${colors.primary};
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #5a6268;
        transform: translateY(-1px);
    }
`;

// Delete button styled to match the design
const DeleteButton = styled.button`
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    margin-top: 8px;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: #c82333;
    }
`;

// Keep existing modal styles
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    animation: fadeIn 0.2s ease-out;
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

const FormContainer = styled.div`
    padding: 2rem;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
    
    &:focus {
        outline: none;
        border-color: ${colors.primary};
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    background-color: white;
    box-sizing: border-box;
    
    &:focus {
        outline: none;
        border-color: ${colors.primary};
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
`;

const Button = styled.button`
    background-color: ${colors.primary};
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
    
    &:hover:not(:disabled) {
        background-color: #5a6268;
    }
    
    &:disabled {
        background-color: #e9ecef;
        color: #6c757d;
        cursor: not-allowed;
    }
`;

const NavigationButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 1rem 2rem 2rem;
    gap: 1rem;
`;

// Image upload styles
const ImageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
`;

const ImagePreview = styled.div`
    position: relative;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid #ddd;
`;

const RemoveImageButton = styled.button`
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(220, 53, 69, 0.9);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    z-index: 1;
`;

const ImageUploadButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    border: 2px dashed #ddd;
    border-radius: 8px;
    background: #f8f9fa;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
        border-color: ${colors.primary};
        background: #e3f2fd;
    }
`;

const ImageGallery = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 0 0 0.5rem 0.5rem;
`;

const ThumbnailImage = styled.img`
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
    
    &.active, &:hover {
        opacity: 1;
    }
`;

const convertLocalFilesToTemporaryBlobs = files => {
    const filesArray = Array.from(files);
    const convertedImageUrls = filesArray.map(file => URL.createObjectURL(file));
    return convertedImageUrls;
};

const fetchTemporaryBlobAndConvertToFileForUpload = async temporaryBlobUrl => {
    const response = await fetch(temporaryBlobUrl);
    const blob = await response.blob();
    const fileName = Math.random().toString(36).slice(2,9);
    const mimeType = blob.type || "application/octet-stream";
    const file = new File([blob], `${fileName}.${mimeType.split("/")[1]}`,{ type: mimeType });
    return file;
};

const Garage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentFormStep, setCurrentFormStep] = useState(1);
    const maxSteps = 3;
    const [imageUrls, setImageUrls] = useState([]);
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: '',
        mileage: '',
        color: '',
        vin: '',
        nickname: '',
        condition: 'excellent',
        listing_price: 1000,
        is_sellable: true,
        is_rentable: true,
        image_uri: null
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const imageInputRef = useRef(null);

    const handleImageOnChange = e => {
        const files = e.target?.files;
        if (files) {
            const newImageUrls = convertLocalFilesToTemporaryBlobs(files);
            setImageUrls(prev => [...prev, ...newImageUrls]);
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleImageUpload = async (userId, vehicleId) => {
        const urls = [];
        const storagePaths = [];
    
        try {
            for (const url of imageUrls) {
                const imageFile = await fetchTemporaryBlobAndConvertToFileForUpload(url);
                
                const storagePath = `listing_images/${userId}/${vehicleId}/${imageFile.name}`;
                
                const { imageUrl, error } = await uploadImage({
                    file: imageFile,
                    bucket: "listing_images",
                    folder: `${userId}/${vehicleId}`,
                });
    
                if (error) {
                    console.error("Error uploading image:", error);
                    continue;
                }
    
                urls.push(imageUrl);
                storagePaths.push(storagePath);
            }
        } catch (err) {
            console.error("Error during image upload process:", err);
        }
    
        return { urls, storagePaths };
    };

    const saveImageReferencesToDatabase = async (userId, vehicleId, imageData) => {
        try {
            const imageEntries = imageData.urls.map((url, index) => ({
                user_id: userId,
                vehicle_id: vehicleId,
                url: url,
                storage_path: imageData.storagePaths[index]
            }));

            const { data, error } = await supabase
                .from('vehicles_images')
                .insert(imageEntries);

            if (error) {
                console.error('Error storing image references:', error);
            }

            if (imageData.urls.length > 0) {
                const { error: updateError } = await supabase
                    .from('vehicles')
                    .update({ image_uri: imageData.urls[0] })
                    .eq('id', vehicleId);
                
                if (updateError) {
                    console.error('Error updating vehicle image_uri:', updateError);
                }
            }

            return { data, error };
        } catch (err) {
            console.error('Unexpected error saving image references:', err);
            return { error: err };
        }
    };

    useEffect(() => {
        const fetchUserAndVehicles = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) {
                    console.error('Error fetching session:', sessionError);
                    return;
                }
                if (!session || !session.user) {
                    console.warn('No active session found.');
                    return;
                }

                const userId = session.user.id;
                setUserId(userId);

                const { data: userVehicles, error: userVehiclesError } = await supabase
                    .from('users_vehicles')
                    .select('vehicle_id')
                    .eq('user_id', userId);

                if (userVehiclesError) {
                    console.error('Error fetching user vehicle mappings:', userVehiclesError);
                    return;
                }

                const vehicleIds = userVehicles.map((entry) => entry.vehicle_id);
                if (vehicleIds.length === 0) {
                    console.log('No vehicles found for the user.');
                    setVehicles([]);
                    return;
                }

                const { data: vehiclesData, error: vehiclesError } = await supabase
                    .from('vehicles')
                    .select('*')
                    .in('id', vehicleIds);

                if (vehiclesError) {
                    console.error('Error fetching vehicles:', vehiclesError);
                    return;
                }

                const processedVehicles = [];
                
                for (let vehicle of vehiclesData || []) {
                    const { data: imageData, error: imageError } = await supabase
                        .from('vehicles_images')
                        .select('url')
                        .eq('vehicle_id', vehicle.id);
                    
                    if (imageError) {
                        console.error(`Error fetching images for vehicle ${vehicle.id}:`, imageError);
                        processedVehicles.push({
                            ...vehicle,
                            images: vehicle.image_uri ? [vehicle.image_uri] : []
                        });
                        continue;
                    }
                    
                    const allImageUrls = imageData.map(img => img.url);
                    
                    if (vehicle.image_uri && !allImageUrls.includes(vehicle.image_uri)) {
                        allImageUrls.unshift(vehicle.image_uri);
                    }
                    
                    processedVehicles.push({
                        ...vehicle,
                        images: allImageUrls
                    });
                }

                setVehicles(processedVehicles);
            } catch (err) {
                console.error('Unexpected error fetching vehicles:', err);
            }
        };

        fetchUserAndVehicles();
    }, []);

    const validateVIN = (vin) => {
        const isValidVin = /^[A-Z0-9]{13}$/i.test(vin);
        if (!isValidVin) {
            setError('VIN must be exactly 13 letters or numbers.');
        } else {
            setError('');
        }
    } 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if(name==="vin"){ 
            validateVIN(value);
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDeleteVehicle = async (e, vehicleId) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();
        
        try {
            const { error } = await supabase
                .from('vehicles')
                .delete()
                .eq('id', vehicleId);

            if (error) {
                console.error('Error deleting vehicle:', error);
                return;
            }

            setVehicles((prevVehicles) => prevVehicles.filter((v) => v.id !== vehicleId));
        } catch (err) {
            console.error('Unexpected error deleting vehicle:', err);
        }
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (!userId) {
            setError('User not authenticated. Please log in.');
            setIsSubmitting(false);
            return;
        }

        try {
            const { data: vehicleData, error: vehicleError } = await supabase
                .from('vehicles')
                .insert([{
                    ...formData,
                    image_uri: null
                }])
                .select('*');

            if (vehicleError) {
                setError('Error adding vehicle: ' + vehicleError.message);
                setIsSubmitting(false);
                return;
            }

            if (vehicleData.length === 0) {
                setError('Failed to create vehicle record');
                setIsSubmitting(false);
                return;
            }

            const newVehicle = vehicleData[0];

            const { error: userVehicleError } = await supabase
                .from('users_vehicles')
                .insert({
                    user_id: userId,
                    vehicle_id: newVehicle.id,
                });

            if (userVehicleError) {
                setError('Error linking vehicle to user: ' + userVehicleError.message);
                setIsSubmitting(false);
                return;
            }

            const vehicleWithTempImages = {
                ...newVehicle,
                images: [...imageUrls]
            };
            
            setVehicles(prev => [...prev, vehicleWithTempImages]);
            
            setFormData({
                make: '',
                model: '',
                year: '',
                mileage: '',
                color: '',
                vin: '',
                nickname: '',
                condition: 'excellent',
                listing_price: 1000,
                is_sellable: true,
                is_rentable: true,
                image_uri: null
            });
            setIsFormVisible(false);
            setCurrentFormStep(1);
            
            startTransition(async () => {
                const imageData = await handleImageUpload(userId, newVehicle.id);
                
                if (imageData.urls.length > 0) {
                    await saveImageReferencesToDatabase(userId, newVehicle.id, imageData);
                    
                    setVehicles(prev => prev.map(v => 
                        v.id === newVehicle.id 
                            ? { 
                                ...v, 
                                images: imageData.urls,
                                image_uri: imageData.urls[0]
                            } 
                            : v
                    ));
                }
                
                setImageUrls([]);
                setIsSubmitting(false);
            });
            
        } catch (err) {
            setError('An unexpected error occurred.');
            console.error(err);
            setIsSubmitting(false);
        }
    };

    // Component for image carousel in vehicle cards
    const ImageCarousel = ({ images }) => {
        const [activeIndex, setActiveIndex] = useState(0);
        
        if (!images || images.length === 0) {
            return <Image src="/default-car.jpg" alt="Default vehicle" loaded={true} />;
        }
        
        return (
            <div style={{ position: 'relative' }}>
                <Image
                    src={images[activeIndex]}
                    alt="Vehicle image"
                    draggable="false"
                    style={{ userSelect: "none" }}
                    loaded={true}
                />
                {images.length > 1 && (
                    <ImageGallery>
                        {images.map((img, idx) => (
                            <ThumbnailImage
                                key={idx}
                                src={img}
                                alt={`Thumbnail ${idx}`}
                                className={idx === activeIndex ? 'active' : ''}
                                onClick={() => setActiveIndex(idx)}
                            />
                        ))}
                    </ImageGallery>
                )}
            </div>
        );
    };

    return (
        <Container>
            <GarageHeader>
                <GarageTitle>My Garage</GarageTitle>
                <ToggleButton onClick={() => setIsFormVisible((prev) => !prev)}>
                    {isFormVisible ? 'Hide Form' : 'Add New Vehicle'}
                </ToggleButton>
            </GarageHeader>
            
            <VehicleCount>
                {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} in garage
            </VehicleCount>

            {isFormVisible && (
                <ModalOverlay onClick={() => setIsFormVisible(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        {error && <p style={{ color: "red", padding: "1rem" }}>{error}</p>}
                        <FormContainer>
                            {/* Step 1: Vehicle Information */}
                            {currentFormStep === 1 && (
                                <>
                                    <h2>Enter Vehicle Details</h2>
                                    <h3 style={{fontWeight: 'bold', color: "orange"}}>
                                        {`${formData.year || 'YYYY'} ${formData.make || 'Make'} ${formData.model || 'Model'}`}
                                    </h3>
                                    
                                    <label style={{color: "orange", fontWeight: "bold"}} htmlFor="year">Year *</label>
                                    <Input
                                        id="year"
                                        type="number"
                                        name="year"
                                        placeholder="Enter year (e.g. 2020)"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        required
                                    />
                                    
                                    <label style={{color: "orange", fontWeight: "bold"}} htmlFor="make">Make *</label>
                                    <Input
                                        id="make"
                                        type="text"
                                        name="make"
                                        placeholder="Enter make (e.g. Toyota, Honda, Ford)"
                                        value={formData.make}
                                        onChange={handleInputChange}
                                        required
                                    />

                                    <label style={{color: "orange", fontWeight: "bold"}} htmlFor="model">Model *</label>
                                    <Input
                                        id="model"
                                        type="text"
                                        name="model"
                                        placeholder="Enter model (e.g. Camry, Civic, F-150)"
                                        value={formData.model}
                                        onChange={handleInputChange}
                                        required
                                    />

                                    <label style={{color: "orange", fontWeight: "bold"}} htmlFor="mileage">Mileage</label>
                                    <Input
                                        id="mileage"
                                        type="number"
                                        name="mileage"
                                        placeholder="Enter mileage (miles)"
                                        value={formData.mileage}
                                        onChange={handleInputChange}
                                        min="0"
                                    />

                                    <label style={{color: "orange", fontWeight: "bold"}} htmlFor="color">Color</label>
                                    <Input
                                        id="color"
                                        type="text"
                                        name="color"
                                        placeholder="Enter color (e.g. Red, Blue, Silver)"
                                        value={formData.color}
                                        onChange={handleInputChange}
                                    />

                                    <label style={{color: "orange", fontWeight: "bold"}} htmlFor="vin">VIN</label>
                                    <Input
                                        id="vin"
                                        type="text"
                                        name="vin"
                                        placeholder="Enter 13-character VIN"
                                        value={formData.vin}
                                        onChange={handleInputChange}
                                        maxLength="13"
                                    />

                                    <label style={{color: "orange", fontWeight: "bold"}} htmlFor="nickname">Nickname (Optional)</label>
                                    <Input
                                        id="nickname"
                                        type="text"
                                        name="nickname"
                                        placeholder="Give your car a nickname (optional)"
                                        value={formData.nickname}
                                        onChange={handleInputChange}
                                    />

                                    <label style={{color: "orange", fontWeight: "bold"}} htmlFor="condition">Condition *</label>
                                    <Select
                                        id="condition"
                                        name="condition"
                                        value={formData.condition}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="excellent">Excellent - Like new, no visible wear</option>
                                        <option value="good">Good - Minor wear, well maintained</option>
                                        <option value="fair">Fair - Some wear, functional</option>
                                        <option value="poor">Poor - Significant wear, needs work</option>
                                    </Select>
                                </>
                            )}

                            {/* Step 2: Image Upload */}
                            {currentFormStep === 2 && (
                                <div>
                                    <h2>Upload Vehicle Images</h2>
                                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                        Add photos of your vehicle. You can upload multiple images to showcase different angles.
                                    </p>
                                    <p style={{ color: 'red', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', textAlign: 'center'}}>
                                        ***JPG or PNG only***
                                    </p>
                                    
                                    {imageUrls.length > 0 && (
                                        <div>
                                            <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>
                                                {imageUrls.length} Image{imageUrls.length !== 1 ? 's' : ''} Selected
                                            </h3>
                                            <ImageGrid>
                                                {imageUrls.map((url, index) => (
                                                    <ImagePreview key={`${url}-${index}`}>
                                                        <RemoveImageButton onClick={() => handleRemoveImage(index)}>
                                                            ×
                                                        </RemoveImageButton>
                                                        <img
                                                            src={url}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover'
                                                            }}
                                                            alt={`Vehicle image ${index + 1}`}
                                                        />
                                                    </ImagePreview>
                                                ))}
                                            </ImageGrid>
                                        </div>
                                    )}

                                    <ImageUploadButton onClick={() => imageInputRef.current?.click()}>
                                        <span style={{ fontSize: '24px', marginBottom: '5px' }}>+</span>
                                        <span>Add Vehicle Image{imageUrls.length > 0 ? 's' : ''}</span>
                                    </ImageUploadButton>
                                    
                                    <input
                                        type="file"
                                        hidden
                                        ref={imageInputRef}
                                        onChange={handleImageOnChange}
                                        multiple
                                        accept="image/jpeg,image/jpg,image/png"
                                    />
                                </div>
                            )}

                            {/* Step 3: Pricing */}
                            {currentFormStep === 3 && (
                                <>
                                    <h2>Set Sale Price</h2>
                                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                        Set the price you'd like to list your vehicle for. You can always change this later.
                                    </p>
                                    
                                    <label style={{color: "orange", fontWeight: "bold"}} htmlFor="listing_price">Sale Price *</label>
                                    <div style={{display: "flex", alignItems: 'center', gap: '0.5rem'}}>
                                        <span style={{color: 'orange', fontSize: '1.5rem', fontWeight: 'bold'}}>$</span>
                                        <Input
                                            id="listing_price"
                                            type="number"
                                            name="listing_price"
                                            placeholder="Enter listing price"
                                            value={formData.listing_price}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="100"
                                            required
                                        />
                                    </div>
                                    
                                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Listing Options</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <input
                                                    type="checkbox"
                                                    name="is_sellable"
                                                    checked={formData.is_sellable}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, is_sellable: e.target.checked }))}
                                                />
                                                <span>Available for sale</span>
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <input
                                                    type="checkbox"
                                                    name="is_rentable"
                                                    checked={formData.is_rentable}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, is_rentable: e.target.checked }))}
                                                />
                                                <span>Available for rent</span>
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}
                        </FormContainer>

                        <NavigationButtonContainer>
                            {currentFormStep > 1 ? (
                                <Button
                                    style={{ marginRight: "10px", border: "2px solid orange", backgroundColor: "#fff", color: "orange"}}
                                    onClick={() => setCurrentFormStep((prev) => prev - 1)}
                                >
                                    Back
                                </Button>
                            ): <div></div>}
                            {currentFormStep !== 3 && (
                                <Button
                                    style={{border: "2px solid orange", backgroundColor: "#fff", color: "orange"}}
                                    onClick={() => {
                                        if (currentFormStep < maxSteps) setCurrentFormStep((prev) => prev + 1);
                                    }}
                                >
                                    Next
                                </Button>
                            )}
                            
                            {currentFormStep === 3 && (
                                <Button 
                                    onClick={handleAddVehicle}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Adding...' : 'Add Vehicle'}
                                </Button>
                            )}
                        </NavigationButtonContainer>
                    </ModalContent>
                </ModalOverlay>
            )}
            
            <Mosaic>
                {vehicles.map((vehicle) => (
                    <Link key={vehicle.id} href={`/garage/${vehicle.id}`}>
                        <Card>
                            {vehicle.listing_price && (
                                <Price>${vehicle.listing_price?.toLocaleString()}</Price>
                            )}
                            <ImageContainer>
                                <ImageCarousel images={vehicle.images || []} />
                            </ImageContainer>
                            <CardContent>
                                <Subtitle>
                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                </Subtitle>
                                <Detail>
                                    <strong>Nickname:</strong> {vehicle.nickname || 'N/A'}
                                </Detail>
                                <Detail>
                                    <strong>Color:</strong> {vehicle.color || 'Unknown'}
                                </Detail>
                                <Detail>
                                    <strong>Mileage:</strong> {vehicle.mileage?.toLocaleString() || 'Unknown'} miles
                                </Detail>
                                <Detail>
                                    <strong>Condition:</strong> {vehicle.condition || 'Unknown'}
                                </Detail>
                                <DeleteButton onClick={(e) => handleDeleteVehicle(e, vehicle.id)}>
                                    Remove Vehicle
                                </DeleteButton>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </Mosaic>
        </Container>
    );
};

export default Garage;