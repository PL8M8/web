import Navbar from '@components/Navbar';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;
`;

const Image = styled.img`
    width: 100%;
    height: auto;
    border-radius: 10px;
`;

const Price = styled.div`
    font-weight: bold;
    font-size: 1.2em;
`;

const Description = styled.p`
    margin: 10px 0;
    font-size: 0.9em;
`;

const Button = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
`;

const Marketplace = () => {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        const fetchCars = async () => {
            const response = await fetch('/api/cars');
            const data = await response.json();
            setCars(data);
        };

        fetchCars();
    }, []);

    return (
        <div className="page">
            <div className="background" />
            <Navbar />
            <Mosaic>
                {cars.length  ?  cars.map(car => (
                    <Card key={car.id}>
                        <Image src={car.image} alt={car.description} />
                        <Price>{car.price}</Price>
                        <Description>{car.description}</Description>
                        <Button>Interested</Button>
                    </Card>
                )) : undefined}
            </Mosaic>
        </div>
    );
};

export default Marketplace;
