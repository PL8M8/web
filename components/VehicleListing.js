import React from "react";
import styled from "styled-components";

const ListingItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
  text-align: center;
  margin: 10px;
  flex: 0 0 calc((100% - 30px) / 3);
  max-width: calc((100% - 30px) / 3);
`;

const ListingImage = styled.img`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  overflow: hidden;
  width: 100%;
  object-fit: cover;
`;

const ListingDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ListingTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin: 5px 0;
`;

const ListingDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 5px 0;
`;

const ListingPrice = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;

export default function VehicleListing({ item, index }) {
  const vehicle = item;
  const placeholderImageSrc = `/blank.jpg`;

  return (
    <ListingItem key={index}>
      <ListingImage src={placeholderImageSrc} alt={vehicle.title || "Vehicle Image"} />
      <ListingDetails>
        <ListingTitle>
          {vehicle.title || "Title Placeholder"}
        </ListingTitle>
        <ListingDescription>
          {vehicle.description || "Description Placeholder"}
        </ListingDescription>
        <ListingPrice>
          {vehicle.price || "Price Placeholder"}
        </ListingPrice>
      </ListingDetails>
    </ListingItem>
  );
}