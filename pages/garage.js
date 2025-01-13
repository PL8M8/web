import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '@components/Navbar';
import { supabase } from '../utils/supabase';

const Mosaic = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
    padding: 20px;

    @media (min-width: 1024px) {
        grid-template-columns: repeat(5, 1fr); // Limit to 5 columns on desktop
    }
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

const Garage = () => {
    const [vehicles, setVehicles] = useState([]);
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

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const { data, error } = await supabase
                    .from('vehicles')
                    .select();

                if (error) {
                    console.error('Error fetching vehicles:', error);
                } else {
                    setVehicles(data || []);
                }
            } catch (err) {
                console.error('Unexpected error fetching vehicles:', err);
            }
        };

        fetchVehicles();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        setError(null);
    
        try {
            // Insert vehicle data and return the inserted row
            const { data, error } = await supabase
                .from('vehicles')
                .insert([formData])
                .select('*'); // Ensure the inserted rows are returned
    
            if (error) {
                setError('Error adding vehicle: ' + error.message);
                return;
            }
    
            // Update the vehicles state with the new data
            setVehicles((prev) => [...prev, ...data]);
            alert('Vehicle succesfully added!')
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
        } catch (err) {
            setError('An unexpected error occurred.');
            console.error(err);
        }
    };
    

    return (
        <div className="page">
            <Navbar />
            <div className="background" />
            <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Your Garage</h1>

            <FormContainer>
                <h2>Add a New Vehicle</h2>
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
    );
};

export default Garage;
