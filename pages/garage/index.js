import React, { useEffect, useState, useTransition, useRef } from 'react';
import { uploadImage } from 'lib/uploadImage';
import { supabase } from 'config/supabase';
import {
    Mosaic,
    ImageGrid,
    ImagePreview,
    RemoveImageButton,
    ImageUploadButton,
    ImageGallery,
    ThumbnailImage,
    NavigationButtonContainer,
    DeleteButton,
    ModalOverlay,
    ModalContent,
    Card,
    Image,
    CardContent,
    Subtitle,
    Detail,
    FormContainer,
    Input,
    Select,
    Button,
    ToggleButton,
} from '../../styles/garage.styles';

import Link from 'next/link'

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
                
                // Use the new folder structure with vehicleId
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

            // Update the vehicle's image_uri with the first image URL if available
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

                // Create processed vehicle objects with images array for UI
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
                    
                    // Create an images array that includes all images from vehicles_images
                    // Make sure the primary image (image_uri) is first in the array if it exists
                    const allImageUrls = imageData.map(img => img.url);
                    
                    // If image_uri exists and is not already in the list, prepend it
                    if (vehicle.image_uri && !allImageUrls.includes(vehicle.image_uri)) {
                        allImageUrls.unshift(vehicle.image_uri);
                    }
                    
                    // Add the processed vehicle with images array
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

    const handleDeleteVehicle = async (vehicleId) => {
        try {
            // Delete the vehicle - Supabase will handle cascading deletes
            const { error } = await supabase
                .from('vehicles')
                .delete()
                .eq('id', vehicleId);

            if (error) {
                console.error('Error deleting vehicle:', error);
                return;
            }

            // Update state
            setVehicles((prevVehicles) => prevVehicles.filter((v) => v.id !== vehicleId));
        } catch (err) {
            console.error('Unexpected error deleting vehicle:', err);
        }
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        setError(null);
        console.log("Setting 'setIsSubmitting' to true...")
        setIsSubmitting(true);

        console.log('Checking for userId...')
        if (!userId) {
            setError('User not authenticated. Please log in.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Step 1: Create the vehicle to get the ID
            console.log('trying to create the vehicle...')
            const { data: vehicleData, error: vehicleError } = await supabase
                .from('vehicles')
                .insert([{
                    ...formData,
                    image_uri: null // We'll update this after uploading images
                }])
                .select('*');

            if (vehicleError) {
                console.log('there was an error creating the vehicle...')
                console.error(vehicleError)
                setError('Error adding vehicle: ' + vehicleError.message);
                setIsSubmitting(false);
                return;
            }

            console.log('Vehicle data at this point is:', vehicleData)
            if (vehicleData.length === 0) {
                console.log('Oops. No vehicle data Found...')
                setError('Failed to create vehicle record');
                setIsSubmitting(false);
                return;
            }

            const newVehicle = vehicleData[0];

            console.log('new vehicle was created:', newVehicle)
            // Step 2: Link vehicle to user
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

            // Add the vehicle to state immediately with temporary image URLs for a snappy UI
            const vehicleWithTempImages = {
                ...newVehicle,
                images: [...imageUrls] // Use the local blob URLs temporarily
            };
            
            setVehicles(prev => [...prev, vehicleWithTempImages]);
            
            // Reset form state and hide the form
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
            
            // Step 3: Upload images in the background and store their references
            startTransition(async () => {
                // Upload images to the new folder structure and get URLs and storage paths
                const imageData = await handleImageUpload(userId, newVehicle.id);
                
                // Store image references in vehicles_images table and update vehicle's image_uri
                if (imageData.urls.length > 0) {
                    await saveImageReferencesToDatabase(userId, newVehicle.id, imageData);
                    
                    // Update the vehicle in state with the actual image URLs
                    setVehicles(prev => prev.map(v => 
                        v.id === newVehicle.id 
                            ? { 
                                ...v, 
                                images: imageData.urls,
                                image_uri: imageData.urls[0] // Set the first image as the primary image
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
            return <Image src="/default-car.jpg" alt="Default vehicle" />;
        }
        
        return (
            <div style={{ position: 'relative' }}>
                <Image
                    src={images[activeIndex]}
                    alt="Vehicle image"
                    draggable="false"
                    style={{ userSelect: "none" }}
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
        <div className="page">
            <div className="main-content">
                <h1 style={{ textAlign: 'center', margin: '20px 0' }}>My Garage</h1>
                <ToggleButton onClick={() => setIsFormVisible((prev) => !prev)}>
                    {isFormVisible ? 'Hide Form' : 'Add New Vehicle'}
                </ToggleButton>
                {isFormVisible && (
                    <ModalOverlay onClick={() => setIsFormVisible(false)}>
                        <ModalContent onClick={(e) => e.stopPropagation()}>
                            {/* Error Message */}
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            <FormContainer>
                                {/* Step 2: Image Uploader */}
                                {currentFormStep === 2 && (
                                    <div>
                                        <h2>Upload Vehicle Images</h2>
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
                                            multiple // Allow multiple files
                                        />
                                    </div>
                                )}

                                {/* Step 1: Vehicle Information */}
                                {currentFormStep === 1 && (
                                    <>
                                        <h2>Enter Vehicle Details</h2>
                                        <h3 style={{fontWeight: 'bold', color: "orange"}}>{`${formData.year} ${formData.make} ${formData.model}`}</h3>
                                        
                                        <label style={{color: "orange", fontWeight: "bold"}} htmlFor="year">Year</label>
                                        <Input
                                            id="year"
                                            type="number"
                                            name="year"
                                            placeholder="Year"
                                            value={formData.year}
                                            onChange={handleInputChange}
                                        />
                                        <label style={{color: "orange", fontWeight: "bold"}} htmlFor="make">Make</label>
                                        <Input
                                            id="make"
                                            type="text"
                                            name="make"
                                            placeholder="Make"
                                            value={formData.make}
                                            onChange={handleInputChange}
                                        />

                                        <label style={{color: "orange", fontWeight: "bold"}} htmlFor="model">Model</label>
                                        <Input
                                            id="model"
                                            type="text"
                                            name="model"
                                            placeholder="Model"
                                            value={formData.model}
                                            onChange={handleInputChange}
                                        />

                                        <label style={{color: "orange", fontWeight: "bold"}} htmlFor="mileage">Mileage</label>
                                        <Input
                                            id="mileage"
                                            type="number"
                                            name="mileage"
                                            placeholder="Mileage"
                                            value={formData.mileage}
                                            onChange={handleInputChange}
                                        />

                                        <label style={{color: "orange", fontWeight: "bold"}} htmlFor="color">Color</label>
                                        <Input
                                            id="color"
                                            type="text"
                                            name="color"
                                            placeholder="Color"
                                            value={formData.color}
                                            onChange={handleInputChange}
                                        />

                                        <label style={{color: "orange", fontWeight: "bold"}} htmlFor="vin">VIN</label>
                                        <Input
                                            id="vin"
                                            type="text"
                                            name="vin"
                                            placeholder="VIN"
                                            value={formData.vin}
                                            onChange={handleInputChange}
                                        />

                                        <label style={{color: "orange", fontWeight: "bold"}} htmlFor="nickname">Nickname</label>
                                        <Input
                                            id="nickname"
                                            type="text"
                                            name="nickname"
                                            placeholder="Nickname (optional)"
                                            value={formData.nickname}
                                            onChange={handleInputChange}
                                        />

                                        <label style={{color: "orange", fontWeight: "bold"}} htmlFor="condition">Condition</label>
                                        <Select
                                            id="condition"
                                            name="condition"
                                            value={formData.condition}
                                            onChange={handleInputChange}
                                        >
                                            <option value="excellent">Excellent</option>
                                            <option value="good">Good</option>
                                            <option value="fair">Fair</option>
                                            <option value="poor">Poor</option>
                                        </Select>
                                    </>
                                )}

                                {/* Step 3: Finalize */}
                                {currentFormStep === 3 && (
                                    <>
                                        <h2>Set Sale Price</h2>
                                        <label style={{color: "orange", fontWeight: "bold"}} htmlFor="listing_price">Sale Price</label>
                                        <div style={{display: "flex", alignItems: 'center'}}>
                                            <h3 style={{color: 'orange', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>$</h3>
                                            <Input
                                                id="listing_price"
                                                type="number"
                                                name="listing_price"
                                                placeholder="Set Listing Price"
                                                value={formData.listing_price}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </>
                                )}
                            </FormContainer>

                            <NavigationButtonContainer>
                                {/* Navigation Buttons */}
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
                            <Card key={vehicle.id}>
                                <ImageCarousel images={vehicle.images || []} />
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
                                        <strong>Mileage:</strong> {vehicle.mileage || 'Unknown'} miles
                                    </Detail>
                                    <Detail>
                                        <strong>Condition:</strong> {vehicle.condition || 'Unknown'}
                                    </Detail>
                                    <DeleteButton onClick={() => handleDeleteVehicle(vehicle.id)}>Remove Vehicle</DeleteButton>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </Mosaic>
            </div>
        </div>
    );
};

export default Garage;