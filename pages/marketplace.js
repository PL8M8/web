import Navbar from '@components/Navbar';
import React from 'react';
import styled from 'styled-components';

const Mosaic = styled.section`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
    padding: 20px;
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
    const cars = [
        {
            id: 1,
            image: 'https://via.placeholder.com/250x150?text=Car+1',
            price: '$20,000',
            description: '2019 Toyota Camry',
        },
        {
            id: 2,
            image: 'https://via.placeholder.com/250x150?text=Car+2',
            price: '$25,000',
            description: '2020 Honda Accord',
        },
        {
            id: 3,
            image: 'https://via.placeholder.com/250x150?text=Car+3',
            price: '$30,000',
            description: '2021 Tesla Model 3',
        },
        {
            id: 4,
            image: 'https://via.placeholder.com/250x150?text=Car+4',
            price: '$22,500',
            description: '2018 Ford Fusion',
        },
    ];

    return (
        <div className="page">
            <div className="background" />
            <Navbar />
            <Mosaic>
                {cars.map(car => (
                    <Card key={car.id}>
                        <Image src={car.image} alt={car.description} />
                        <Price>{car.price}</Price>
                        <Description>{car.description}</Description>
                        <Button>Interested</Button>
                    </Card>
                ))}
            </Mosaic>
        </div>
    );
};

export default Marketplace;
