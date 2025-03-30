import React, { useEffect, useState, useTransition, useRef } from 'react';
import styled from 'styled-components';
import { uploadImage } from 'lib/uploadImage';
import { supabase } from 'config/supabase';

const Mosaic = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
    padding: 20px;

    @media (min-width: 1024px) {
        grid-template-columns: repeat(5, 1fr);
    }
`;

const ImageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 15px;
    margin-bottom: 15px;
`;

const ImagePreview = styled.div`
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid orange;
    height: 150px;
`;

const RemoveImageButton = styled.button`
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: rgba(255, 0, 0, 0.8);
    color: white;
    border: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    z-index: 5;

    &:hover {
        background-color: red;
    }
`;

const ImageUploadButton = styled.button`
    border: 2px dashed #dddddd;
    border-radius: 5px;
    height: 150px;
    width: 100%;
    margin-bottom: 2%;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    &:hover {
        border-color: orange;
        background-color: rgba(255, 165, 0, 0.05);
    }
`;

const ImageGallery = styled.div`
    display: flex;
    overflow-x: auto;
    gap: 8px;
    margin-top: 10px;
    padding-bottom: 5px;
    
    &::-webkit-scrollbar {
        height: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: orange;
        border-radius: 10px;
    }
`;

const ThumbnailImage = styled.img`
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 5px;
    cursor: pointer;
    border: 2px solid transparent;
    
    &.active {
        border-color: orange;
    }
`;

const NavigationButtonContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

const DeleteButton = styled.button`
    top: 10px;
    right: 10px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 5px;
    visibility: hidden;
    transition: opacity 1s ease, visibility 0.3s ease;
    width: 100%;
    height: 30px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;

    &:hover {
        background-color: darkred;
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    border-radius: 10px;
    padding: 20px;
    min-width: 650px;
    min-height: 650px;
    max-width: 650px;
    max-height: 80vh;
    overflow-y: auto;
    border: 1px solid #ccc;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Card = styled.div`
    background: white;
    border-radius: 10px;
    border: 1px solid #f0f0f0;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    width: 300px;
    flex-direction: column;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    &:hover ${DeleteButton} {
        opacity: 1;
        visibility: visible;
    }
`;

const Image = styled.img`
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-bottom: 3px solid orange;
`;

const CardContent = styled.div`
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Subtitle = styled.h3`
    font-size: 1em;
    font-weight: bold;
    margin: 0;
    color: #333;
`;

const Detail = styled.p`
    font-size: 0.9em;
    margin: 0;
    color: #666;
`;

const FormContainer = styled.div`
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
    height: 600px;
    overflow-y: auto;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Select = styled.select`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Button = styled.button`
    background-color: orange;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    font-weight: bold;

    &:hover {
        background-color: #e69500;
    }
`;

const ToggleButton = styled.button`
    background-color: orange;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    font-weight: bold;
    border: 2px solid orange;
    &:hover {
        background-color: white;
        border: 2px solid orange;
        color: orange;
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
        is_tradeable: true,
        images: []
    });
    const [error, setError] = useState(null);
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

    const handleImageUpload = async () => {
        const urls = [];
    
        try {
            for (const url of imageUrls) {
                const imageFile = await fetchTemporaryBlobAndConvertToFileForUpload(url);
    
                const { imageUrl, error } = await uploadImage({
                    file: imageFile,
                    bucket: "listing_images",
                    folder: userId,
                });
    
                if (error) {
                    console.error("Error uploading image:", error);
                    continue;
                }
    
                console.log("Image URL is:", imageUrl);
                urls.push(imageUrl);
            }
        } catch (err) {
            console.error("Error during image upload process:", err);
        }
    
        return urls;
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

                // Fetch vehicle images
                for (let vehicle of vehiclesData || []) {
                    if (vehicle.images) {
                        // If images is already an array in your database, use it directly
                        continue;
                    } else if (vehicle.image_uri) {
                        // Convert single image_uri to images array for consistency
                        vehicle.images = [vehicle.image_uri];
                    } else {
                        vehicle.images = [];
                    }
                }

                setVehicles(vehiclesData || []);
            } catch (err) {
                console.error('Unexpected error fetching vehicles:', err);
            }
        };

        fetchUserAndVehicles();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDeleteVehicle = async (vehicleId) => {
        try {
            // Delete from database
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

        if (!userId) {
            setError('User not authenticated. Please log in.');
            return;
        }

        try {
            // Upload all images
            const uploadedImageUrls = await handleImageUpload();
            
            // Update formData with all uploaded image URLs
            const updatedFormData = {
                ...formData,
                image_uri: uploadedImageUrls[0] || null, // Keep the first image as the main image_uri for backward compatibility
                images: uploadedImageUrls // Store all images in the images array
            };

            const { data: vehicleData, error: vehicleError } = await supabase
                .from('vehicles')
                .insert([updatedFormData])
                .select('*');

            if (vehicleError) {
                setError('Error adding vehicle: ' + vehicleError.message);
                return;
            }

            if (vehicleData.length > 0) {
                const vehicle = vehicleData[0];

                const { error: userVehicleError } = await supabase
                    .from('users_vehicles')
                    .insert({
                        user_id: userId,
                        vehicle_id: vehicle.id,
                    });

                if (userVehicleError) {
                    setError('Error linking vehicle to user: ' + userVehicleError.message);
                    return;
                }

                setVehicles((prev) => [...prev, vehicle]);
                alert('Vehicle successfully added!');
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
                    is_tradeable: true,
                    images: []
                });
                setIsFormVisible(false);
                setCurrentFormStep(1);
                setImageUrls([]);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            console.error(err);
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
                                
                                {currentFormStep === 3 && <Button onClick={handleAddVehicle}>Add Vehicle</Button> }
                            </NavigationButtonContainer>
                        </ModalContent>
                    </ModalOverlay>
                )}
                <Mosaic>
                    {vehicles.map((vehicle) => (
                        <Card key={vehicle.id}>
                            <ImageCarousel images={vehicle.images || [vehicle.image_uri]} />
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
                    ))}
                </Mosaic>
            </div>
        </div>
    );
};

export default Garage;