import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from '../../config/supabase';
import styled from "styled-components";
import Button from "@components/Button";
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

const TextArea = styled.textarea`
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    min-height: 100px;
    resize: vertical;
    box-sizing: border-box;
`;

const Select = styled.select`
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    box-sizing: border-box;
`;

const Header = styled.div`
    display: flex;
    padding: 1%;
    align-items: center;
    justify-content: space-between;
`

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
`

const HeaderRight = styled.div`
    display: flex;
    gap: 10px;
`

const Badge = styled.span`
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: bold;
    color: #fff;
    background-color: ${(props) => {
        if (props.isTrue !== undefined) {
            return props.isTrue ? '#28a745' : '#dc3545';
        }
        if (props.severity === 'high') return '#dc3545';
        if (props.severity === 'medium') return '#ffc107';
        if (props.severity === 'low') return '#28a745';
        if (props.status === 'open') return '#007bff';
        if (props.status === 'in progress') return '#17a2b8';
        if (props.status === 'resolved') return '#28a745';
        if (props.status === 'closed') return '#6c757d';
        return '#6c757d';
    }};
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

const FieldWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`

const FieldValue = styled.span`
    flex: 1;
    margin-right: 10px;
`

const EditIcon = styled.span`
    cursor: pointer;
    color: #666;
    margin-left: 10px;
    font-size: 16px;
    &:hover {
        color: #333;
    }
`

const EditInput = styled(Input)`
    margin: 0;
    flex: 1;
`

const EditSelect = styled(Select)`
    margin: 0;
    flex: 1;
`

const SaveButton = styled(Button)`
    margin-top: 20px;
    background-color: #28a745;
    color: white;
    border: none;
`

const ReportsCard = styled.div`
    margin-top: 30px;
    padding: 20px;
    border-top: 1px solid #eee;
`;

const SectionTitle = styled.h3`
    color: #333;
    margin-bottom: 15px;
    font-size: 1.25rem;
`

const ReportItem = styled.div`
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 5px;
    padding: 15px;
    margin: 10px 0;
`;

const ReportHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
`;

const ReportMetadata = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 10px;
`;

const ButtonWrapper = styled.div`
    margin-top: 15px;
    display: flex;
    gap: 10px;
    justify-content: center;
`;

const ReportForm = styled.div`
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 5px;
    padding: 15px;
    margin: 15px 0;
`;

const AddButton = styled(Button)`
    margin-bottom: 15px;
    background-color: #007bff;
    color: white;
    border: none;
`;

const ToggleButton = styled.button`
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 5px;
    
    &:hover {
        color: #333;
    }
`

const VehicleDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [vehicle, setVehicle] = useState(null);
    const [vehicleImages, setVehicleImages] = useState([]);
    const [reports, setReports] = useState([]);
    const [isAddingReport, setIsAddingReport] = useState(false);
    const [userId, setUserId] = useState(null);
    const [newReport, setNewReport] = useState({
        description: '',
        type: '',
        severity: 'low',
        status: 'open'
    });
    const [loading, setLoading] = useState(false);
    const [editingFields, setEditingFields] = useState({});
    const [editedValues, setEditedValues] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const reportTypes = [
        { value: 'forum', label: 'forum'},
        { value: 'warning', label: 'warning'},
        { value: 'problem', label: 'problem'},
        { value: 'document', label: 'document'},
    ];

    const severityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
    ];

    const statusOptions = [
        { value: 'open', label: 'Open' },
        { value: 'in progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'closed', label: 'Closed' }
    ];

    useEffect(() => {
        const fetchUserAndVehicleData = async () => {
            try {
                // First, get the current user session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) {
                    console.error('Error fetching session:', sessionError);
                    return;
                }
                if (!session || !session.user) {
                    console.warn('No active session found.');
                    router.push('/login'); // Redirect to login if no session
                    return;
                }

                const currentUserId = session.user.id;
                setUserId(currentUserId);

                // Continue with vehicle data fetching if we have an ID
                if (!id) return;

                // Fetch vehicle details
                const { data: vehicleData, error: vehicleError } = await supabase
                    .from('vehicles')
                    .select()
                    .eq('id', id)
                    .single();

                if (vehicleError) throw vehicleError;
                setVehicle(vehicleData);
                setEditedValues(vehicleData); // Initialize edited values with current vehicle data

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
        };

        fetchUserAndVehicleData();
    }, [id, router]);

    const handleEditField = (field) => {
        setEditingFields(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleFieldChange = (field, value) => {
        setEditedValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveVehicle = async () => {
        if (!vehicle || !userId) return;

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('vehicles')
                .update(editedValues)
                .eq('id', vehicle.id);

            if (error) throw error;

            // Update local state
            setVehicle(editedValues);
            // Clear all editing states
            setEditingFields({});
            alert('Vehicle details updated successfully!');
        } catch (error) {
            console.error("Error updating vehicle:", error);
            alert('Failed to update vehicle. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const renderField = (label, field, isBoolean = false, isEditable = true) => {
        const isEditing = editingFields[field];
        const value = isEditing ? editedValues[field] : vehicle[field];

        return (
            <FieldWrapper>
                <p style={{ margin: 0, flex: 1 }}>
                    <strong>{label}:</strong> {
                        isEditing ? (
                            isBoolean ? (
                                <EditSelect
                                    value={value ? 'true' : 'false'}
                                    onChange={(e) => handleFieldChange(field, e.target.value === 'true')}
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </EditSelect>
                            ) : field === 'condition' ? (
                                <EditSelect
                                    value={value}
                                    onChange={(e) => handleFieldChange(field, e.target.value)}
                                >
                                    <option value="excellent">Excellent</option>
                                    <option value="good">Good</option>
                                    <option value="fair">Fair</option>
                                    <option value="poor">Poor</option>
                                </EditSelect>
                            ) : (
                                <EditInput
                                    value={value || ''}
                                    onChange={(e) => handleFieldChange(field, e.target.value)}
                                    type={field === 'listing_price' || field === 'mileage' || field === 'year' ? 'number' : 'text'}
                                />
                            )
                        ) : (
                            <span>
                                {isBoolean ? 
                                    <Badge isTrue={value}>{value ? 'Yes' : 'No'}</Badge> : 
                                    field === 'listing_price' ? `${value?.toLocaleString()}` : 
                                    field === 'mileage' ? `${value} miles` :
                                    field === 'created_at' ? new Date(value).toLocaleString() :
                                    value || (field === 'tag_number' ? "Unregistered" : field === 'nickname' ? "No nickname" : "")
                                }
                            </span>
                        )
                    }
                </p>
                {isEditable && (
                    <EditIcon onClick={() => handleEditField(field)}>
                        {isEditing ? '✓' : '✎'}
                    </EditIcon>
                )}
            </FieldWrapper>
        );
    };

    const handleAddReport = async () => {
        if (!newReport.description || !newReport.type) {
            alert('Please fill in all required fields');
            return;
        }

        if (!userId) {
            alert('User not authenticated. Please log in.');
            return;
        }

        setLoading(true);
        try {
            const reportData = {
                ...newReport,
                vehicle_id: parseInt(id),
                reporter: userId // Use the authenticated user ID
            };

            const { data, error } = await supabase
                .from('reports')
                .insert([reportData])
                .select()
                .single();

            if (error) throw error;

            setReports([data, ...reports]);
            setNewReport({
                description: '',
                type: '',
                severity: 'low',
                status: 'open'
            });
            setIsAddingReport(false);
        } catch (error) {
            console.error("Error adding report:", error);
            alert('Failed to add report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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
                <HeaderRight>
                    {Object.values(editingFields).some(Boolean) && (
                        <SaveButton 
                            onClick={handleSaveVehicle}
                            value={isSaving ? "Saving..." : "Save Changes"}
                            disabled={isSaving}
                        />
                    )}
                </HeaderRight>
            </Header>
            <ContentWrapper>
                <LeftWrapper>
                    <VehicleGallery images={vehicleImages} imageUri={vehicle.image_uri} />
                </LeftWrapper>
                <RightWrapper>
                    {renderField('Price', 'listing_price')}
                    {renderField('Color', 'color')}
                    {renderField('Condition', 'condition')}
                    {renderField('Mileage', 'mileage')}
                    {renderField('Tag Number', 'tag_number')}
                    {renderField('Nickname', 'nickname')}
                    {renderField('VIN', 'vin')}
                    {renderField('Created At', 'created_at', false, false)}
                    {renderField('Tradeable', 'is_tradeable', true)}
                    {renderField('Sellable', 'is_sellable', true)}

                    <ReportsCard>
                        <SectionTitle>Vehicle Reports</SectionTitle>
                        
                        <AddButton 
                            onClick={() => setIsAddingReport(true)}
                            value="Add New Report"
                        />
                        
                        {isAddingReport && (
                            <ReportForm>
                                <h4>Add New Report</h4>
                                <Select
                                    value={newReport.type}
                                    onChange={(e) => setNewReport({...newReport, type: e.target.value})}
                                    required
                                >
                                    <option value="">Select Report Type</option>
                                    {reportTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </Select>
                                
                                <TextArea
                                    placeholder="Description*"
                                    value={newReport.description}
                                    onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                                    required
                                />
                                
                                <Select
                                    value={newReport.severity}
                                    onChange={(e) => setNewReport({...newReport, severity: e.target.value})}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </Select>
                                
                                <Select
                                    value={newReport.status}
                                    onChange={(e) => setNewReport({...newReport, status: e.target.value})}
                                >
                                    <option value="open">Open</option>
                                    <option value="in progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </Select>
                                
                                <ButtonWrapper>
                                    <Button 
                                        onClick={handleAddReport}
                                        value={loading ? "Adding..." : "Add Report"}
                                        disabled={loading}
                                    />
                                    <Button 
                                        onClick={() => setIsAddingReport(false)}
                                        value="Cancel"
                                    />
                                </ButtonWrapper>
                            </ReportForm>
                        )}

                        {reports.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9em', marginTop: '10px' }}>No reports found for this vehicle.</p>
                        ) : (
                            reports.map((report) => (
                                <ReportItem key={report.id}>
                                    <ReportHeader>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>
                                            {reportTypes.find(type => type.value === report.type)?.label || report.type}
                                        </h4>
                                        <span style={{ color: '#666', fontSize: '0.85em' }}>
                                            {formatDate(report.created_at)}
                                        </span>
                                    </ReportHeader>
                                    
                                    <p style={{ margin: '8px 0', color: '#333', fontSize: '0.95em' }}>{report.description}</p>
                                    
                                    <ReportMetadata>
                                        <Badge severity={report.severity}>
                                            {severityOptions.find(sev => sev.value === report.severity)?.label || report.severity}
                                        </Badge>
                                        <Badge status={report.status}>
                                            {statusOptions.find(stat => stat.value === report.status)?.label || report.status}
                                        </Badge>
                                    </ReportMetadata>
                                </ReportItem>
                            ))
                        )}
                    </ReportsCard>
                </RightWrapper>
            </ContentWrapper>
        </Container>
    );
};

export default VehicleDetail;