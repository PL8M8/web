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
    padding: 0.5%;
    margin: 0;

    @media (max-width: 768px) {
        font-size: 1.25rem;
    }
`

const Header = styled.div`
    display: flex;
    padding: 1%;
    align-items: center;
    justify-content: space-between;
`

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
`

const Badge = styled.span`
    padding: 4px 10px;
    border-radius: 5px;
    font-weight: bold;
    color: #fff;
    background-color: ${(props) => (props.isTrue ? '#28a745' : '#dc3545')};
    font-size: 0.875rem;
`;

const Container = styled.div`
    padding: 2% 4%;
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;

    @media (max-width: 768px) {
        padding: 5% 2%;
    }
`

const MainContent = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 20px;
    }
`

const LeftWrapper = styled.div`
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    padding: 20px;
    height: fit-content;
    
    /* Target the thumbnail gallery specifically */
    .thumbnail-gallery {
        margin-top: 10px;
        gap: 8px !important;
    }
    
    .thumbnail-image {
        width: 60px !important;
        height: 60px !important;
        object-fit: cover !important;
    }
`

const RightWrapper = styled.div`
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    padding: 20px;
    height: fit-content;
`

// Price Section styled more prominently
const PriceSection = styled.div`
    text-align: center;
    padding: 15px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 8px;
    border: 1px solid #dee2e6;
    margin-bottom: 20px;
`

const PriceLabel = styled.div`
    color: #666;
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
`

const PriceValue = styled.div`
    color: #333;
    font-size: 1.5rem;
    font-weight: 700;
`

// Compact details grid
const DetailsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
`

const DetailCard = styled.div`
    background-color: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #eee;
    padding: 10px;
`

const DetailLabel = styled.div`
    color: #666;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
`

const DetailValue = styled.div`
    color: #333;
    font-size: 0.9375rem;
    font-weight: 500;
`

const AvailabilitySection = styled.div`
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #eee;
    text-align: center;
`

const AvailabilityLabel = styled.div`
    color: #666;
    font-size: 0.875rem;
    margin-bottom: 8px;
`

const BadgeWrapper = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
`

const ReportsSection = styled.div`
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
`;

const SectionTitle = styled.h2`
    color: #333;
    margin-bottom: 20px;
    font-size: 1.25rem;
    text-align: center;
    border-bottom: 2px solid #f5f5f5;
    padding-bottom: 10px;
`;

const ReportsGrid = styled.div`
    display: grid;
    gap: 20px;
`;

const ReportCard = styled.div`
    background-color: #fafafa;
    border: 1px solid #eee;
    border-radius: 6px;
    padding: 20px;
    transition: all 0.2s ease;
    
    &:hover {
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        border-color: #ddd;
    }
`;

const ReportHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
`;

const ReportType = styled.h3`
    color: #333;
    font-size: 1.1rem;
    margin: 0;
    text-transform: capitalize;
`;

const ReportDate = styled.span`
    color: #666;
    font-size: 0.9em;
`;

const ReportDescription = styled.p`
    color: #444;
    margin: 12px 0;
    line-height: 1.6;
`;

const ReportMetaTags = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`;

const MetaTag = styled.span`
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.85em;
    font-weight: 500;
    background-color: ${props => {
        if (props.type === 'status') {
            if (props.value === 'open') return '#e3f2fd';
            if (props.value === 'in progress') return '#f3e5f5';
            if (props.value === 'resolved') return '#e8f5e9';
            if (props.value === 'closed') return '#e0e0e0';
        }
        if (props.type === 'severity') {
            if (props.value === 'high') return '#ffebee';
            if (props.value === 'medium') return '#fff3e0';
            if (props.value === 'low') return '#e8f5e9';
        }
        return '#f5f5f5';
    }};
    color: ${props => {
        if (props.type === 'status') {
            if (props.value === 'open') return '#1976d2';
            if (props.value === 'in progress') return '#7b1fa2';
            if (props.value === 'resolved') return '#388e3c';
            if (props.value === 'closed') return '#424242';
        }
        if (props.type === 'severity') {
            if (props.value === 'high') return '#c62828';
            if (props.value === 'medium') return '#ef6c00';
            if (props.value === 'low') return '#2e7d32';
        }
        return '#666';
    }};
`;

const NoReports = styled.div`
    text-align: center;
    color: #666;
    padding: 40px 0;
    font-style: italic;
`;

const VehicleDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [vehicle, setVehicle] = useState(null);
    const [vehicleImages, setVehicleImages] = useState([]);
    const [reports, setReports] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen); 
    };

    const reportTypes = [
        { value: 'forum', label: 'Forum Discussion'},
        { value: 'warning', label: 'Warning'},
        { value: 'problem', label: 'Problem'},
        { value: 'document', label: 'Document'},
    ];

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
                    
                    // First, add all images from vehicles_images table
                    if (imagesData && imagesData.length > 0) {
                        imageUrls = imagesData.map(img => img.url);
                    }
                    
                    // Then, add the main vehicle image if it exists and isn't already in the list
                    if (vehicleData.image_uri && !imageUrls.includes(vehicleData.image_uri)) {
                        imageUrls.unshift(vehicleData.image_uri); // Add to beginning to make it first
                    }
                    
                    setVehicleImages(imageUrls);

                    // Fetch reports for this vehicle
                    const { data: reportsData, error: reportsError } = await supabase
                        .from('reports')
                        .select('*')
                        .eq('vehicle_id', id)
                        .order('created_at', { ascending: false });

                    if (reportsError) throw reportsError;
                    setReports(reportsData || []);
                } catch (error) {
                    console.error("Error fetching vehicle data:", error);
                }
            }

            fetchVehicleData();
        }
    }, [id]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!vehicle) return <div>Loading...</div>;

    return (
        <Container>
            <Header>
                <HeaderLeft>
                    <Button 
                        onClick={() => router.back()}
                        value="Back"
                    />
                    <Title>{vehicle.year} {vehicle.make} {vehicle.model}</Title>
                </HeaderLeft>
                <Reply vehicleId={id}/>
            </Header>
            
            <MainContent>
                <LeftWrapper>
                    <VehicleGallery images={vehicleImages} imageUri={vehicle.image_uri} />
                </LeftWrapper>
                
                <RightWrapper>
                    <PriceSection>
                        <PriceLabel>Listed Price</PriceLabel>
                        <PriceValue>${vehicle.listing_price?.toLocaleString()}</PriceValue>
                    </PriceSection>
                    
                    <DetailsGrid>
                        {vehicle.color && (
                            <DetailCard>
                                <DetailLabel>Color</DetailLabel>
                                <DetailValue>{vehicle.color}</DetailValue>
                            </DetailCard>
                        )}
                        {vehicle.condition && (
                            <DetailCard>
                                <DetailLabel>Condition</DetailLabel>
                                <DetailValue>{vehicle.condition}</DetailValue>
                            </DetailCard>
                        )}
                        {vehicle.mileage && vehicle.mileage > 0 && (
                            <DetailCard>
                                <DetailLabel>Mileage</DetailLabel>
                                <DetailValue>{vehicle.mileage} miles</DetailValue>
                            </DetailCard>
                        )}
                        {vehicle.vin && (
                            <DetailCard>
                                <DetailLabel>VIN</DetailLabel>
                                <DetailValue>{vehicle.vin}</DetailValue>
                            </DetailCard>
                        )}
                        {vehicle.tag_number && (
                            <DetailCard>
                                <DetailLabel>Tag Number</DetailLabel>
                                <DetailValue>{vehicle.tag_number}</DetailValue>
                            </DetailCard>
                        )}
                        {vehicle.nickname && (
                            <DetailCard>
                                <DetailLabel>Nickname</DetailLabel>
                                <DetailValue>{vehicle.nickname}</DetailValue>
                            </DetailCard>
                        )}
                        {vehicle.created_at && (
                            <DetailCard>
                                <DetailLabel>Listed Date</DetailLabel>
                                <DetailValue>{formatDate(vehicle.created_at)}</DetailValue>
                            </DetailCard>
                        )}
                    </DetailsGrid>
                    
                    <AvailabilitySection>
                        <AvailabilityLabel>Availability</AvailabilityLabel>
                        <BadgeWrapper>
                            <Badge isTrue={vehicle.is_rentable}>
                                {vehicle.is_rentable ? 'Rentable' : 'Non-rentable'}
                            </Badge>
                            <Badge isTrue={vehicle.is_sellable}>
                                {vehicle.is_sellable ? 'For Sale' : 'Not for Sale'}
                            </Badge>
                        </BadgeWrapper>
                    </AvailabilitySection>
                    
                    <ReportsSection>
                        <SectionTitle>Vehicle History & Reports</SectionTitle>
                        {reports.length > 0 ? (
                            <ReportsGrid>
                                {reports.map((report) => (
                                    <ReportCard key={report.id}>
                                        <ReportHeader>
                                            <ReportType>
                                                {reportTypes.find(type => type.value === report.type)?.label || report.type}
                                            </ReportType>
                                            <ReportDate>{formatDate(report.created_at)}</ReportDate>
                                        </ReportHeader>
                                        
                                        <ReportDescription>{report.description}</ReportDescription>
                                        
                                        <ReportMetaTags>
                                            <MetaTag type="status" value={report.status}>
                                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                            </MetaTag>
                                            <MetaTag type="severity" value={report.severity}>
                                                {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)} Priority
                                            </MetaTag>
                                        </ReportMetaTags>
                                    </ReportCard>
                                ))}
                            </ReportsGrid>
                        ) : (
                            <NoReports>No reports available for this vehicle</NoReports>
                        )}
                    </ReportsSection>
                </RightWrapper>
            </MainContent>
        </Container>
    );
};

export default VehicleDetail;