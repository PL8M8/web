import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from '../../config/supabase';
import styled from "styled-components";
import Button from "@components/Button";
import Reply from "@components/ReplyButton";
import VehicleGallery from "@components/ProductImageGallery";

const Title = styled.h1`
    color: #333;
    text-align: center;
    width: 100%;
    padding: 0;
    margin: 0;
`

const FormWrapper = styled.div`
    padding: 40px;
    border-radius: 10px;
    text-align: center;
    width: 100%;
    max-width: 400px;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
`;

const Header = styled.div`
    display: flex;
`

const Badge = styled.span`
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: bold;
    color: #fff;
    background-color: ${(props) => (props.isTrue ? '#28a745' : '#dc3545')};
`;

const Container = styled.div`
    padding: 4% 2% 0;
    display: flex;
    justify-content: center;
    flex-direction: column;

    @media (max-width: 768px) {
        margin-top: 10%;
    }
`

const ContentWrapper = styled.div`
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 2%;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`

const LeftWrapper = styled.div`
    border-radius: 5px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1% 1% 0 0;
    padding: 0 4.5%;
`

const RightWrapper = styled.div`
    border-radius: 5px;
    width: 100%;
    padding: 2%;
    background-color: #fff;
    border: 1px solid #33333330;
    margin: 1% 0 0 1%;
`

const VehicleDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [vehicle, setVehicle] = useState(null);
    const [vehicleImages, setVehicleImages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen); 
    };

    useEffect(() => {
        if (id) {
            async function fetchVehicleData() {
                try {
                    // Fetch vehicle details
                    const { data: vehicleData, error: vehicleError } = await supabase
                        .from('vehicles')
                        .select()
                        .eq('id', id)
                        .single();

                    if (vehicleError) throw vehicleError;
                    setVehicle(vehicleData);

                    // Fetch vehicle images from vehicles_images table
                    const { data: imagesData, error: imagesError } = await supabase
                        .from('vehicles_images')
                        .select('url')
                        .eq('vehicle_id', id);

                    if (imagesError) throw imagesError;
                    
                    // Create an array of image URLs
                    let imageUrls = [];
                    
                    // Add the main vehicle image if it exists
                    if (vehicleData.image_uri) {
                        imageUrls.push(vehicleData.image_uri);
                    }
                    
                    // Add additional images from vehicles_images table
                    if (imagesData && imagesData.length > 0) {
                        const additionalUrls = imagesData.map(img => img.url);
                        imageUrls = [...imageUrls, ...additionalUrls];
                    }
                    
                    setVehicleImages(imageUrls);
                } catch (error) {
                    console.error("Error fetching vehicle data:", error);
                }
            }

            fetchVehicleData();
        }
    }, [id]);

    if (!vehicle) return <div>Loading...</div>;

    return (
        <Container>
            <Header>
                <Button 
                    onClick={() => router.back()}
                    value="Back"
                />
                <Title>{vehicle.year} {vehicle.make} {vehicle.model}</Title>
                <Reply/>
            </Header>
            <ContentWrapper>
                <LeftWrapper>
                    <VehicleGallery images={vehicleImages} imageUri={vehicle.image_uri} />
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
        </Container>
    );
};

export default VehicleDetail;