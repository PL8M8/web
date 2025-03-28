import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from '../../config/supabase';
import styled from "styled-components";
import Button from "@components/Button";

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

const ImageWrapper = styled.div`
    border: 2px solid #fff;
    border-radius: 5px;
    height: 100%;
    width: 100%;
    overflow: hidden;
`

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
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
    border-radius: 5px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1% 1% 0 0;
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
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen); 
    };

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
            <Header>
                <Button 
                    onClick={() => router.back()}
                    value="Back"
                />
                <Title>{vehicle.year} {vehicle.make} {vehicle.model}</Title>
                <Button 
                    onClick={undefined}
                    value="Reply"
                />
            </Header>
            <ContentWrapper>
                <LeftWrapper>
                    <ImageWrapper>
                        <Image 
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
        </Container>
    );
};

export default VehicleDetail;