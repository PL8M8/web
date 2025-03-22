import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from '../../config/supabase';
import styled from "styled-components";
import Button from "@components/Button";

const Badge = styled.span`
    padding: 5px 10px;
    border-radius: 15px;
    font-weight: bold;
    color: #fff;
    background-color: ${(props) => (props.isTrue ? '#28a745' : '#dc3545')};
`;

const ImageWrapper = styled.div`
    border: 2px solid #fff;
    border-radius: 15px;
    overflow: hidden;
`

const Container = styled.div`
    padding: 4% 2% 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
`

const ContentWrapper = styled.div`
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 2%;
`

const LeftWrapper = styled.div`
    border-radius: 15px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const RightWrapper = styled.div`
    border-radius: 10px;
    width: 100%;
    padding: 2%;
    background-color: #fff;
`

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
        <Container>
            <h1>{vehicle.year} {vehicle.make} {vehicle.model}</h1>
            <ContentWrapper>
                <LeftWrapper>
                    <ImageWrapper>
                        <img 
                            src={vehicle.image_uri} alt={`${vehicle.make} ${vehicle.model}`} 
                        />
                    </ImageWrapper>
                </LeftWrapper>
                <RightWrapper>
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
                </RightWrapper>
            </ContentWrapper>
            <Button 
                onClick={() => router.back()}
                value="Back"
            />
        </Container>
    );
};

export default VehicleDetail;