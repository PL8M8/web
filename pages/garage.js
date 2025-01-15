import React, { useEffect, useState, useTransition, useRef } from 'react';
import styled from 'styled-components';
import Navbar from '@components/Navbar';
import { uploadImage } from '@utils/uploadImage'
import { supabase } from '@utils/supabase';

const Mosaic = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
    padding: 20px;

    @media (min-width: 1024px) {
        grid-template-columns: repeat(5, 1fr);
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
    max-width: 400px;
    width: 100%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Card = styled.div`
    background: white;
    border-radius: 10px;
    border: 1px solid #f0f0f0;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
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
    background: #f7f7f7;
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    font-weight: bold;
    margin: 20px 0;

    &:hover {
        background-color: #0056b3;
    }
`;

const convertLocalFilesToTemporaryBlobs = files => {
    // console.log('we have files', files)
    const filesArray = Array.from(files)
    // console.log('Files Array Bruh', filesArray)
    const convertedImageUrls = filesArray.map(file => URL.createObjectURL(file))
    // console.log('We have URLs Bruh', newImageUrls)
    return convertedImageUrls
}

const fetchTemporaryBlobAndConvertToFileForUpload = async temporaryBlobUrl => {
    const response = await fetch(temporaryBlobUrl)
    // console.log("Response of fetching blob is ", response)
    const blob = await response.blob()
    // console.log("Blob after fetch is ", blob)
    const fileName = Math.random().toString(36).slice(2,9)
    // console.log('File name before interpolation:', fileName)
    const mimeType = blob.type || "application/octet-stream"
    // console.log('mime type is', mimeType)
    const file = new File([blob], `${fileName}.${mimeType.split("/")[1]}`,{ type: mimeType })
    // console.log('final file is', file)
    return file
}




const Garage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [imageUrls, setImageUrls] = React.useState([])
    const [isPending, startTransition] = React.useTransition()
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: '',
        mileage: '',
        color: '',
        vin: '',
        nickname: '',
        condition: 'excellent',
    });
    const [error, setError] = useState(null);
    const imageInputRef = React.useRef(null)

    const handleImageOnChange = e => {
        const files = e.target?.files
        if (files) {
            console.log('files before url conversion is', files)
            const newImageUrls = convertLocalFilesToTemporaryBlobs(files)
            setImageUrls([...imageUrls, ...newImageUrls])
        }
    }

    const handleImageUploadBtn = () => {
        // console.log('image upload button clicked')
        startTransition(async () => {
            let urls = []
            for (const url of imageUrls) {
                const imageFile = await fetchTemporaryBlobAndConvertToFileForUpload(url)
                // console.log('imageFile for upload is', imageFile)
                const { imageUrl, error } = await uploadImage({
                    file: imageFile,
                    bucket: "listing_images",
                    folder: userId
                })
                console.log('image url is', imageUrl)

                if (error) {
                    console.error(error)
                    return
                }

                urls.push(imageUrl)
            }

            console.log("image urls are", urls)
        })
    }


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

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        setError(null);

        if (!userId) {
            setError('User not authenticated. Please log in.');
            return;
        }

        try {
            const { data: vehicleData, error: vehicleError } = await supabase
                .from('vehicles')
                .insert([formData])
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
                });
                setIsFormVisible(false); // Hide the form after adding
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            console.error(err);
        }
    };

    return (
        <div className="page">
            <Navbar />
            <div className="background" />
            <div className="main-content">
                <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Your Garage</h1>

                <ToggleButton onClick={() => setIsFormVisible((prev) => !prev)}>
                    {isFormVisible ? 'Hide Form' : 'Add New Vehicle'}
                </ToggleButton>

                {isFormVisible && (
                            <ModalOverlay onClick={() => setIsFormVisible((prev) => !prev)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                    <FormContainer>
                        <h2>Add a New Vehicle</h2>
                        {/* image uploader */}
                        <div>
                            <h2>Images Bruh</h2>
                            <h3>JPG or PNG only!!!</h3>
                            { !imageUrls.length && (
                                <button 
                                style={{
                                    border: "2px dashed #dddddd",
                                    borderRadius: '5px',
                                    height: '150px', 
                                    width: '100%', 
                                    marginBottom: '2%',
                                    cursor: 'pointer'
                                }} 
                                onClick={() => imageInputRef.current?.click()}> Add Vehicle Image</button>
                            )}
                            <input type="file" hidden ref={imageInputRef} multiple onChange={handleImageOnChange}/>
                            {/* <button onClick={handleImageUploadBtn}>upload images</button> */}
                            <div>
                                { imageUrls.map((url, index)=> {
                                    return <img
                                        src={url}
                                        height={150}
                                        width={300}
                                        key={url}
                                        style={{
                                            objectFit: 'contain',
                                        }}
                                        alt={`image-${index}`}
                                    />
                                })}
                            </div>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <form onSubmit={handleAddVehicle}>
                            <Input
                                type="text"
                                name="make"
                                placeholder="Make"
                                value={formData.make}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="model"
                                placeholder="Model"
                                value={formData.model}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="number"
                                name="year"
                                placeholder="Year"
                                value={formData.year}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="number"
                                name="mileage"
                                placeholder="Mileage"
                                value={formData.mileage}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="color"
                                placeholder="Color"
                                value={formData.color}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="vin"
                                placeholder="VIN"
                                value={formData.vin}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="nickname"
                                placeholder="Nickname"
                                value={formData.nickname}
                                onChange={handleInputChange}
                            />
                            <Select
                                name="condition"
                                value={formData.condition}
                                onChange={handleInputChange}
                            >
                                <option value="excellent">Excellent</option>
                                <option value="good">Good</option>
                                <option value="fair">Fair</option>
                                <option value="poor">Poor</option>
                            </Select>
                            <Button type="submit">Add Vehicle</Button>
                        </form>
                    </FormContainer>
                    </ModalContent>
                    </ModalOverlay>
                )}

                <Mosaic>
                    {vehicles.map((vehicle) => (
                        <Card key={vehicle.id}>
                            <Image
                                src={vehicle.image_uri || '/default-car.jpg'}
                                alt={`${vehicle.make} ${vehicle.model}`}
                            />
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
                            </CardContent>
                        </Card>
                    ))}
                </Mosaic>
            </div>
        </div>
    );
};

export default Garage;