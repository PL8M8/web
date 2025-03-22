import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from 'next/link';
import { supabase } from '../config/supabase';
import colors from "constants/colors";

const Mosaic = styled.div`
    --gap: clamp(1rem, 5vmin, 1rem);
    column-gap: var(--gap);
    width: 96%;
    padding: 0.5%;

    columns: 1;

    @media (min-width: 500px) {
        columns: 1;
    }

    @media (min-width: 768px) {
        columns: 2;
    }

    @media (min-width: 1024px) {
        columns: 3;
    }

    & > * {
        break-inside: avoid;
        margin-bottom: var(--gap);
        width: 100%;
        display: inline-block;
    }
`;

const Card = styled.div`
    position: relative;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #44444450;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Image = styled.img.attrs(() => ({
    loading: "lazy"
}))`
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
    padding: 1% 4%;
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
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);

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

    if (!hasMounted) return null;

    return (
        <Mosaic>
            {vehicles.map(({ id, image_uri, make, model, year, listing_price, color, condition, mileage, tag_number }) => (
                <Link key={id} href={`/vehicle/${id}`}>
                    <Card>
                        <Price>${listing_price.toLocaleString()}</Price>
                        <Image
                            src={image_uri || '/fallback.jpg'}
                            alt={`${make} ${model}`}
                            onError={(e) => { e.currentTarget.src = '/fallback.jpg'; }}
                        />
                        <div style={{ padding: '10px' }}>
                            <Subtitle>{year} {make} {model}</Subtitle>
                            <Detail><strong>Condition:</strong> {condition}</Detail>
                            <Detail><strong>Mileage:</strong> {mileage} miles</Detail>
                        </div>
                    </Card>
                </Link>
            ))}
        </Mosaic>
    );
}