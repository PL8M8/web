import Navbar from '@components/Navbar';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../config/supabase'

const Mosaic = styled.div`
    display: grid;
    padding: 0 0.5rem;
    margin: 0.75rem 0; 
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    overflow: hidden;
`;


const Card = styled.div`
    position: relative;
    border-radius: 0.75rem; 
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #ffffff20;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Image = styled.img`
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
    color: #555;
    margin-top: 5px;
`;

const Price = styled.h3`
    font-size: 1em;
    color: orange;
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

const Marketplace = () => {
    const [vehicles, setVehicles] = useState([])

    useEffect(() => {
        async function getVehicles() {
            const { data: vehicles } = await supabase
                .from('vehicles')
                .select()
                .eq('is_sellable', true);

            if (vehicles && vehicles.length > 0) {
                setVehicles(vehicles);
            }
        }
        getVehicles();
    }, []);

    return (
        <>
            <Navbar />
            <div className='background'/>
            <Mosaic>
                {vehicles.map(vehicle => (
                    <Card key={vehicle.id}>
                        <Image src={vehicle.image_uri} alt={`${vehicle.make} ${vehicle.model}`} />
                        <div style={{ padding: '10px'}}>
                            <Subtitle>{vehicle.year} {vehicle.make} {vehicle.model}</Subtitle>
                            <Price>${vehicle.listing_price.toLocaleString()}</Price>
                            <Detail><strong>Color:</strong> {vehicle.color}</Detail>
                            <Detail><strong>Condition:</strong> {vehicle.condition}</Detail>
                            <Detail><strong>Mileage:</strong> {vehicle.mileage} miles</Detail>
                            <Detail><strong>Tag Number:</strong> {vehicle.tag_number || "Unregistered"}</Detail>
                            {/* <Button href="#">Contact Seller</Button> */}
                        </div>
                    </Card>
                ))}
            </Mosaic>
        </>
    )
};

export default Marketplace;
