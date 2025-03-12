import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from '../../config/supabase';
import styled from "styled-components";

const Badge = styled.span`
    padding: 5px 10px;
    border-radius: 15px;
    font-weight: bold;
    color: #fff;
    background-color: ${(props) => (props.isTrue ? '#28a745' : '#dc3545')};
`;

const VehicleDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [vehicle, setVehicle] = useState(null);

    useEffect(() => {
        if (id) {
            async function fetchVehicle() {
                try {
                    const { data, error } = await supabase
                        .from('vehicles')
                        .select()
                        .eq('id', id)
                        .single();

                    if (error) throw error;
                    setVehicle(data);
                } catch (error) {
                    console.error("Error fetching vehicle:", error);
                }
            }

            fetchVehicle();
        }
    }, [id]);

    if (!vehicle) return <div>Loading...</div>;

    return (
        <div>
            <button onClick={() => router.back()} style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
                Back
            </button>
            <h1>{vehicle.year} {vehicle.make} {vehicle.model}</h1>
            <img src={vehicle.image_uri} alt={`${vehicle.make} ${vehicle.model}`} />
            <p><strong>Price:</strong> ${vehicle.listing_price.toLocaleString()}</p>
            <p><strong>Color:</strong> {vehicle.color}</p>
            <p><strong>Condition:</strong> {vehicle.condition}</p>
            <p><strong>Mileage:</strong> {vehicle.mileage} miles</p>
            <p><strong>Tag Number:</strong> {vehicle.tag_number || "Unregistered"}</p>
            <p><strong>Nickname:</strong> {vehicle.nickname || "No nickname"}</p>
            <p><strong>VIN:</strong> {vehicle.vin}</p>
            <p><strong>Created At:</strong> {new Date(vehicle.created_at).toLocaleString()}</p>
            <p><strong>Tradeable:</strong> <Badge isTrue={vehicle.is_tradeable}>Yes</Badge></p>
            <p><strong>Sellable:</strong> <Badge isTrue={vehicle.is_sellable}>Yes</Badge></p>
        </div>
    );
};

export default VehicleDetail;