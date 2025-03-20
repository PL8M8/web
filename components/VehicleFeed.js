import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from 'next/link';
import { supabase } from '../config/supabase';

const Mosaic = styled.div`
    --gap: clamp(1rem, 5vmin, 1rem);
    column-gap: var(--gap);
    width: 96%;
    columns: 275px;
    margin: 5rem auto;

    & > * {
        break-inside: avoid; /* Prevents items from breaking between columns */
        margin-bottom: var(--gap);
        width: 100%; /* Ensures the items respect the column width */
        display: inline-block; /* Ensures items behave correctly inside columns */
    }
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

export default function VehicleFeed() {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        async function getVehicles() {
            try {
                const { data, error } = await supabase
                    .from('vehicles')
                    .select()
                    .eq('is_sellable', true);

                if (error) throw error;

                if (data && data.length > 0) {
                    setVehicles(data);
                }
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            }
        }

        getVehicles();
    }, []);

    return (
        <Mosaic>
            {vehicles.map(({ id, image_uri, make, model, year, listing_price, color, condition, mileage, tag_number }) => (
                <Link key={id} href={`/vehicle/${id}`}>
                    <Card>
                        <Image src={image_uri} alt={`${make} ${model}`} />
                        <div style={{ padding: '10px' }}>
                            <Subtitle>{year} {make} {model}</Subtitle>
                            <Price>${listing_price.toLocaleString()}</Price>
                            <Detail><strong>Color:</strong> {color}</Detail>
                            <Detail><strong>Condition:</strong> {condition}</Detail>
                            <Detail><strong>Mileage:</strong> {mileage} miles</Detail>
                            <Detail><strong>Tag Number:</strong> {tag_number || "Unregistered"}</Detail>
                            {/* <Button href="#">Contact Seller</Button> */}
                        </div>
                    </Card>
                </Link>
            ))}
        </Mosaic>
    );
}