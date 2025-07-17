import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from '../../config/supabase';
import { uploadImage } from 'lib/uploadImage';
import styled from "styled-components";
import Button from "@components/Button";

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex: 1;
    width: 100%;
    text-align: center;
`

const EditableTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
`

const TitleText = styled.h1`
    color: #333;
    margin: 0;
    font-size: 1.125rem;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    
    &:hover {
        background-color: #f0f0f0;
    }

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`

const TitleSelect = styled.select`
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1.125rem;
    background-color: #fff;
    color: #333;
    cursor: pointer;
    max-width: 120px;
    
    &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
    
    @media (max-width: 768px) {
        font-size: 1rem;
    }
`

const TitleEditIcon = styled.span`
    color: #666;
    cursor: pointer;
    font-size: 16px;
    padding: 4px;
    
    &:hover {
        color: #333;
    }
`

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    height: 50px;
    margin: 10px 0;
    padding: 1%;
`

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
`

const HeaderRight = styled.div`
    display: flex;
    gap: 8px;
`

const Container = styled.div`
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: #f8f9fa;
    padding: 50px 12px 12px 12px;
`

const ContentWrapper = styled.div`
    flex: 1;
    overflow: hidden;
    display: flex;
    gap: 12px;
    height: 100%;
`

const LeftWrapper = styled.div`
    width: 400px;
    background-color: #fff;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
    padding: 8px;
    overflow: hidden;
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 12px;
    height: 100%;
    
    /* Images container takes up upper half */
    .images-container {
        grid-row: 1;
        display: grid;
        grid-template-rows: min-content 1fr;
        gap: 8px;
        overflow: hidden;
    }
    
    /* Main image display */
    .main-image-container {
        width: 100%;
    }
    
    .main-image {
        width: 100%;
        height: 250px;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid #e0e0e0;
    }
    
    .no-image {
        width: 100%;
        height: 250px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f8f9fa;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        color: #555;
        font-size: 0.8125rem;
    }
    
    /* Vehicle details take up lower half */
    .vehicle-details {
        grid-row: 2;
        overflow-y: auto;
        background-color: #f8f9fa;
        border-radius: 6px;
        border: 1px solid #e0e0e0;
        padding: 10px;
    }
`

const RightWrapper = styled.div`
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const BottomSection = styled.div`
    flex: 1;
    background-color: #fff;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
    padding: 10px;
    overflow-y: auto;
`

const FieldWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    padding: 4px 0;
    border-bottom: 1px solid #f5f5f5;
    
    &:last-child {
        border-bottom: none;
    }
`

const FieldLabel = styled.span`
    color: #666;
    font-size: 0.8125rem;
    font-weight: 500;
    width: 100px;
    display: inline-block;
`

const FieldValue = styled.span`
    flex: 1;
    font-size: 0.8125rem;
    color: #333;
`

const EditIcon = styled.span`
    cursor: pointer;
    color: #666;
    margin-left: 8px;
    font-size: 14px;
    &:hover {
        color: #333;
    }
`

const EditInput = styled.input`
    width: 100%;
    padding: 4px;
    margin: 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.8125rem;
    flex: 1;
`;

const EditSelect = styled.select`
    width: 100%;
    padding: 4px;
    margin: 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.8125rem;
    flex: 1;
`;

const SaveButton = styled(Button)`
    background-color: #28a745;
    color: white;
    border: none;
    padding: 4px 12px;
    height: 100%;
    font-size: 0.8125rem;
    
    &:hover {
        background-color: #218838;
    }
    
    &:disabled {
        background-color: #6c757d;
    }
`

const SectionTitle = styled.h3`
    color: #333;
    margin-bottom: 8px;
    font-size: 1rem;
`

const ImagesSection = styled.div`
    overflow-y: auto;
    grid-row: 2;
`;

const ImagesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, minmax(40px, 1fr));
    gap: 1px;
    margin-top: 2px;
`;

const ImageItem = styled.div`
    position: relative;
    aspect-ratio: 1;
    border-radius: 4px;
    overflow: hidden;
    border: 2px solid ${props => props.isMain ? '#28a745' : 'transparent'};
`;

const ImageThumbnail = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const ImageOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    opacity: 0;
    transition: opacity 0.2s ease;
    
    ${ImageItem}:hover & {
        opacity: 1;
    }
`;

const ImageButton = styled.button`
    background: #fff;
    border: none;
    color: #333;
    padding: 3px 5px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 8px;
    
    &.primary {
        background: #28a745;
        color: #fff;
    }
    
    &.danger {
        background: #dc3545;
        color: #fff;
    }
`;

const AddImageButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    border: 2px dashed #adb5bd;
    border-radius: 4px;
    background: none;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #6c757d;
    
    &:hover {
        border-color: #007bff;
        background-color: #f8f9fa;
        color: #007bff;
    }
    
    span:first-child {
        font-size: 14px;
        margin-bottom: 2px;
    }
    
    span:last-child {
        font-size: 8px;
    }
`;

// Reports Section
const ReportsSection = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const ReportForm = styled.div`
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 8px;
    margin: 8px 0;
`;

const AddReportsHeader = styled.h2`
    background-color: #fe8901;
    text-align: center;
    color: white;
    width: 100%;
    height: 140px;
    padding: 10px;
    border-radius: 12px 12px 0px 0px;      
    margin: 0px;
`

const ReportsLogo = styled.div`
  background-color: #f7b05eff; 
  color: white;            
  padding: 10px 20px;       
  border: none;            
  border-radius: 12px;      
  cursor: pointer;         
  display: inline-block;    
  font-size: 16px;          
`

const AddButton = styled(Button)`
    margin-bottom: 8px;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 4px 12px;
    font-size: 0.8125rem;
`;

const ReportsContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding-right: 4px;
    
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
    }
`;

const ReportItem = styled.div`
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 8px;
    margin: 8px 0;
    position: relative;
    
    &:hover .report-controls {
        opacity: 1;
    }
`;

const ReportHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 6px;
    padding-right: 60px;
`;

const ReportMetadata = styled.div`
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-left: auto;
    padding-right: 6px;
`;

const Badge = styled.span`
    padding: 2px 6px;
    border-radius: 3px;
    font-weight: 500;
    color: #fff;
    font-size: 0.6875rem;
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

const ReportEditControls = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s ease;
`;

const IconButton = styled.button`
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #dee2e6;
    color: #666;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
    line-height: 1;
    
    &:hover {
        color: #333;
        background: #fff;
    }
`;

// Forms
const Input = styled.input`
    width: 100%;
    padding: 4px;
    margin: 4px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.8125rem;
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 4px;
    margin: 4px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.8125rem;
    min-height: 60px;
    resize: vertical;
`;

const Select = styled.select`
    width: 100%;
    padding: 4px;
    margin: 4px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.8125rem;
`;

const SegmentedControl = styled.div`
    display: flex;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
    margin: 4px 0;
`;

const SegmentedOption = styled.button`
    flex: 1;
    padding: 4px 8px;
    border: none;
    border-bottom: ${props => props.selected ? "solid": "none"};
    color: ${props => props.selected ? "orange": "gray"};
    background-color: ${props => props.selected ? "white": "none"};
    cursor: pointer;
    font-size: 0.75rem;
    transition: all 0.2s ease;
    height: 3rem;
    
    &:not(:last-child) {
        border-right: 1px solid #ccc;
    }
    
`;

const FormLabel = styled.label`
    display: block;
    margin: 8px 0 4px 0;
    font-weight: 500;
    color: #333;
    font-size: 0.8125rem;
`;

const ButtonWrapper = styled.div`
    margin-top: 8px;
    display: flex;
    gap: 8px;
    justify-content: center;
`;

// Toast notification
const ToastContainer = styled.div`
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 1000;
`;

const ToastNotification = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: ${props => props.type === 'success' ? '#d4edda' : '#f8d7da'};
    color: ${props => props.type === 'success' ? '#155724' : '#721c24'};
    border: 1px solid ${props => props.type === 'success' ? '#c3e6cb' : '#f5c6cb'};
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    opacity: ${props => props.show ? 1 : 0};
    transform: ${props => props.show ? 'translateY(0)' : 'translateY(-100%)'};
    transition: all 0.3s ease;
    min-width: 240px;
`;

const CheckMarkIcon = styled.div`
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #28a745;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    animation: checkmark 0.5s ease;
    
    @keyframes checkmark {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
        }
        100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
        }
    }
`;

const ToastMessage = styled.span`
    font-size: 0.8125rem;
`;

// Delete Confirmation
const DeleteConfirmation = styled.div`
    text-align: center;
    padding: 16px;
`;

const ConfirmationText = styled.p`
    margin: 0 0 12px 0;
    color: #333;
    font-size: 0.9375rem;
`;

const WarningText = styled.p`
    margin: 0 0 16px 0;
    color: #dc3545;
    font-weight: 500;
    font-size: 0.8125rem;
`;

const ConfirmButtonWrapper = styled.div`
    display: flex;
    gap: 8px;
    justify-content: center;
`;

const DeleteButton = styled(Button)`
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 4px 12px;
    font-size: 0.8125rem;
    
    &:hover {
        background-color: #c82333;
    }
`;

const EditReportForm = styled.div`
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #dee2e6;
`;

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
        type: 'problem',
        severity: 'low',
        status: 'open',
        title: '',
        upload: ''
    });
    const [loading, setLoading] = useState(false);
    const [editingFields, setEditingFields] = useState({});
    const [editedValues, setEditedValues] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [editingReports, setEditingReports] = useState({});
    const [editedReports, setEditedReports] = useState({});
    const [deletingReportId, setDeletingReportId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const imageInputRef = useRef(null);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState({
        year: '',
        make: '',
        model: ''
    });
    
    // Year options (e.g., last 50 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);
    
    // Common make options (you can expand this list)
    const makeOptions = [
        'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz',
        'Audi', 'Volkswagen', 'Nissan', 'Hyundai', 'Kia', 'Mazda',
        'Subaru', 'Lexus', 'Acura', 'Tesla', 'Jeep', 'Ram', 'GMC',
        'Cadillac', 'Lincoln', 'Porsche', 'Ferrari', 'Lamborghini',
        'Other'
    ];

    const reportTypes = [
        { value: 'problem', label: 'Problem', icon: '🔧', title: 'Problem Title', levelSelect: 'Severity Level', description: 'Detailed Description', uploadPrompt: 'Attach Photos/Documents', banner: 'Report mchanical issues, breakdowns, or maintenance problems with your vehicle.', submitText: 'Submit Problem', titlePlaceholder: 'Brief description of the car problem', descriptionPlaceholder: 'Describe the problem in detail - what happened, when it started, symptoms, etc.'},
        { value: 'forum', label: 'Forum', icon: '💬', title: 'Discussion Title', levelSelect: 'Priority Level', description: 'Your Message', uploadPrompt: 'Attach Files', banner: 'Start discussions, ask questions, or share experiences with the community.', submitText: 'Post to Forum', titlePlaceholder: 'What would you like to discuss?', descriptionPlaceholder: 'Share your thoughts, ask questions, or start a discussion...'},
        { value: 'warning', label: 'Warning', icon: '⚠️', title: 'Warning Title', levelSelect: 'Severity Level', description: 'Warning Details', uploadPrompt: 'Supporting Documentation', banner: 'Alert others about safety issues, recalls, or important vehicle-related warnings.', submitText: 'Publish Warning', titlePlaceholder: 'Clear warning or safety alert title', descriptionPlaceholder: 'Describe the warning, safety concern, or importatnt information that needs to be shared...'},
        { value: 'document', label: 'Documentation', icon: '📄', title: 'Documentation Title', levelSelect: 'Importance Level', description: 'Documentation Description', uploadPrompt: 'Upload Documentation', banner: 'Share important documents, manuals, guides, or reference materials.', submitText: 'Share Documentation', titlePlaceholder: 'Name or title of the documentation', descriptionPlaceholder: 'Describe what this documentation contains and why it\'s useful to the community...'},
        { value: 'recommendation', label: "Recommendation", icon: "⭐", title: 'Recommendation Title', levelSelect: 'Recommendation Strength', description: 'Your Recommendation', uploadPrompt: 'Supporting Photos/Documents', banner: 'Recommend mechanics, parts suppliers, tools, or services to the community.', submitText: 'Share Recommendation', titlePlaceholder: 'What are you recommending?', descriptionPlaceholder: 'Share your exeperience and why you recommend this to others...'},
    ];

    const severityOptions = [
        { value: 'low', label: 'Low', color: 'green'},
        { value: 'medium', label: 'Medium', color: 'yellow'},
        { value: 'high', label: 'High', color: 'orange' },
        { value: 'urgent', label: 'Urgent', color: 'red'}
    ];

    const statusOptions = [
        { value: 'open', label: 'Open' },
        { value: 'in progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'closed', label: 'Closed' }
    ];

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    useEffect(() => {
        if (vehicle) {
            setEditedTitle({
                year: vehicle.year || '',
                make: vehicle.make || '',
                model: vehicle.model || ''
            });
        }
    }, [vehicle]);

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
                    router.push('/login');
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
                setEditedValues(vehicleData);
                setEditedTitle({
                    year: vehicleData.year || '',
                    make: vehicleData.make || '',
                    model: vehicleData.model || ''
                });

                // Fetch vehicle images from vehicles_images table
                const { data: imagesData, error: imagesError } = await supabase
                    .from('vehicles_images')
                    .select('*')
                    .eq('vehicle_id', id);

                if (imagesError) throw imagesError;
                
                // Create an array of image URLs
                let imageUrls = [];
                
                // First, add all images from vehicles_images table
                if (imagesData && imagesData.length > 0) {
                    imageUrls = imagesData.map(img => ({
                        url: img.url,
                        id: img.id,
                        storage_path: img.storage_path
                    }));
                }
                
                // Then, add the main vehicle image if it exists and isn't already in the list
                if (vehicleData.image_uri && !imageUrls.find(img => img.url === vehicleData.image_uri)) {
                    imageUrls.unshift({
                        url: vehicleData.image_uri,
                        id: null,
                        storage_path: null
                    });
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

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploadingImages(true);
        
        try {
            const uploadResults = [];
            
            for (const file of files) {
                // Upload image to Supabase storage
                const storagePath = `${userId}/${vehicle.id}/${file.name}`;
                const { imageUrl, error } = await uploadImage({
                    file: file,
                    bucket: "listing_images",
                    folder: `${userId}/${vehicle.id}`,
                });

                if (error) {
                    console.error("Error uploading image:", error);
                    continue;
                }

                // Save image reference to database
                const { data, error: dbError } = await supabase
                    .from('vehicles_images')
                    .insert({
                        user_id: userId,
                        vehicle_id: vehicle.id,
                        url: imageUrl,
                        storage_path: `listing_images/${storagePath}`
                    })
                    .select()
                    .single();

                if (dbError) {
                    console.error("Error saving image reference:", dbError);
                    continue;
                }

                uploadResults.push(data);
            }

            // Update local state with new images
            const newImages = uploadResults.map(img => ({
                url: img.url,
                id: img.id,
                storage_path: img.storage_path
            }));
            
            setVehicleImages(prev => [...prev, ...newImages]);
            showToast(`${uploadResults.length} image(s) uploaded successfully!`);
            
        } catch (error) {
            console.error("Error uploading images:", error);
            showToast('Failed to upload images. Please try again.', 'error');
        } finally {
            setIsUploadingImages(false);
            e.target.value = ''; // Reset file input
        }
    };

    const handleSetMainImage = async (imageUrl) => {
        try {
            // Update vehicle's main image
            const { error } = await supabase
                .from('vehicles')
                .update({ image_uri: imageUrl })
                .eq('id', vehicle.id);

            if (error) throw error;

            // Update local state
            setVehicle(prev => ({ ...prev, image_uri: imageUrl }));
            setEditedValues(prev => ({ ...prev, image_uri: imageUrl }));
            showToast('Main image updated successfully!');
            
        } catch (error) {
            console.error("Error setting main image:", error);
            showToast('Failed to set main image. Please try again.', 'error');
        }
    };

    const handleRemoveImage = async (image) => {
        try {
            if (image.storage_path) {
                // Delete from storage
                const { error: storageError } = await supabase
                    .storage
                    .from('listing_images')
                    .remove([image.storage_path]);

                if (storageError) {
                    console.error("Error deleting from storage:", storageError);
                }
            }

            if (image.id) {
                // Delete from database
                const { error: dbError } = await supabase
                    .from('vehicles_images')
                    .delete()
                    .eq('id', image.id);

                if (dbError) throw dbError;
            }

            // If this was the main image, clear it
            if (vehicle.image_uri === image.url) {
                const { error } = await supabase
                    .from('vehicles')
                    .update({ image_uri: null })
                    .eq('id', vehicle.id);

                if (!error) {
                    setVehicle(prev => ({ ...prev, image_uri: null }));
                    setEditedValues(prev => ({ ...prev, image_uri: null }));
                }
            }

            // Update local state
            setVehicleImages(prev => prev.filter(img => img.url !== image.url));
            showToast('Image removed successfully!');
            
        } catch (error) {
            console.error("Error removing image:", error);
            showToast('Failed to remove image. Please try again.', 'error');
        }
    };

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

        // If editing title, include title fields in the update
        const updatedValues = isEditingTitle ? 
            { ...editedValues, ...editedTitle } : 
            editedValues;

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('vehicles')
                .update(updatedValues)
                .eq('id', vehicle.id);

            if (error) throw error;

            // Update local state
            setVehicle(updatedValues);
            setEditedValues(updatedValues);
            setEditedTitle({
                year: updatedValues.year || '',
                make: updatedValues.make || '',
                model: updatedValues.model || ''
            });
            // Clear all editing states
            setEditingFields({});
            setIsEditingTitle(false);
            showToast('Vehicle details updated successfully!');
        } catch (error) {
            console.error("Error updating vehicle:", error);
            showToast('Failed to update vehicle. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleTitleFieldChange = (field, value) => {
        setEditedTitle(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const toggleTitleEdit = () => {
        if (isEditingTitle) {
            // Reset to original values if canceling
            setEditedTitle({
                year: vehicle.year || '',
                make: vehicle.make || '',
                model: vehicle.model || ''
            });
        }
        setIsEditingTitle(!isEditingTitle);
    };

    const renderField = (label, field, isBoolean = false, isEditable = true) => {
        const isEditing = editingFields[field];
        const value = isEditing ? editedValues[field] : vehicle[field];

        return (
            <FieldWrapper>
                <FieldLabel>{label}:</FieldLabel>
                <FieldValue>
                    {isEditing ? (
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
                                field === 'listing_price' ? `$${value?.toLocaleString()}` : 
                                field === 'mileage' ? `${value} miles` :
                                field === 'created_at' ? new Date(value).toLocaleString() :
                                value || (field === 'tag_number' ? "Unregistered" : field === 'nickname' ? "No nickname" : "")
                            }
                        </span>
                    )}
                </FieldValue>
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
            showToast('Please fill in all required fields', 'error');
            return;
        }

        if (!userId) {
            showToast('User not authenticated. Please log in.', 'error');
            return;
        }

        setLoading(true);
        try {
            const reportData = {
                ...newReport,
                vehicle_id: parseInt(id),
                reporter: userId
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
            showToast('Report added successfully!');
        } catch (error) {
            console.error("Error adding report:", error);
            showToast('Failed to add report. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEditReport = (reportId) => {
        const report = reports.find(r => r.id === reportId);
        setEditingReports(prev => ({
            ...prev,
            [reportId]: !prev[reportId]
        }));
        setEditedReports(prev => ({
            ...prev,
            [reportId]: { ...report }
        }));
    };

    const handleReportFieldChange = (reportId, field, value) => {
        setEditedReports(prev => ({
            ...prev,
            [reportId]: {
                ...prev[reportId],
                [field]: value
            }
        }));
    };

    const handleSaveReport = async (reportId) => {
        try {
            const { error } = await supabase
                .from('reports')
                .update({
                    description: editedReports[reportId].description,
                    type: editedReports[reportId].type,
                    severity: editedReports[reportId].severity,
                    status: editedReports[reportId].status
                })
                .eq('id', reportId);

            if (error) throw error;

            // Update local state
            setReports(prev => prev.map(report => 
                report.id === reportId ? { ...report, ...editedReports[reportId] } : report
            ));
            setEditingReports(prev => ({ ...prev, [reportId]: false }));
            showToast('Report updated successfully!');
        } catch (error) {
            console.error("Error updating report:", error);
            showToast('Failed to update report. Please try again.', 'error');
        }
    };

    const handleDeleteReport = async (reportId) => {
        try {
            const { error } = await supabase
                .from('reports')
                .delete()
                .eq('id', reportId);

            if (error) throw error;

            setReports(prev => prev.filter(report => report.id !== reportId));
            setDeletingReportId(null);
            showToast('Report deleted successfully!');
        } catch (error) {
            console.error("Error deleting report:", error);
            showToast('Failed to delete report. Please try again.', 'error');
        }
    };

    const handleCancelDelete = () => {
        setDeletingReportId(null);
    };

    const handleConfirmDelete = (reportId) => {
        setDeletingReportId(reportId);
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
            {/* Toast Notification */}
            <ToastContainer>
                <ToastNotification show={toast.show} type={toast.type}>
                    {toast.type === 'success' && (
                        <CheckMarkIcon>
                            ✓
                        </CheckMarkIcon>
                    )}
                    <ToastMessage>{toast.message}</ToastMessage>
                </ToastNotification>
            </ToastContainer>
            
            <Header>
                <HeaderLeft>
                    <Button 
                        onClick={() => router.back()}
                        value="Back"
                    />
                    <TitleContainer>
                        {isEditingTitle ? (
                            <EditableTitle>
                                <TitleSelect
                                    value={editedTitle.year}
                                    onChange={(e) => handleTitleFieldChange('year', parseInt(e.target.value))}
                                >
                                    <option value="">Year</option>
                                    {yearOptions.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </TitleSelect>
                                
                                <TitleSelect
                                    value={editedTitle.make}
                                    onChange={(e) => handleTitleFieldChange('make', e.target.value)}
                                >
                                    <option value="">Make</option>
                                    {makeOptions.map(make => (
                                        <option key={make} value={make}>{make}</option>
                                    ))}
                                </TitleSelect>
                                
                                <input
                                    type="text"
                                    value={editedTitle.model}
                                    onChange={(e) => handleTitleFieldChange('model', e.target.value)}
                                    placeholder="Model"
                                    style={{
                                        padding: '4px 8px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        fontSize: '1.125rem',
                                        backgroundColor: '#fff',
                                        color: '#333',
                                        maxWidth: '150px'
                                    }}
                                />
                                
                                <TitleEditIcon onClick={toggleTitleEdit}>✓</TitleEditIcon>
                                <TitleEditIcon onClick={toggleTitleEdit}>✕</TitleEditIcon>
                            </EditableTitle>
                        ) : (
                            <TitleText onClick={toggleTitleEdit}>
                                {vehicle.year} {vehicle.make} {vehicle.model}
                                <TitleEditIcon style={{ marginLeft: '8px' }}>✎</TitleEditIcon>
                            </TitleText>
                        )}
                    </TitleContainer>
                </HeaderLeft>
                <HeaderRight>
                    {(Object.values(editingFields).some(Boolean) || isEditingTitle) && (
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
                    {/* Images Container - Upper Half */}
                    <div className="images-container">
                        <div className="main-image-container">
                            {vehicle.image_uri ? (
                                <img 
                                    src={vehicle.image_uri} 
                                    alt="Vehicle" 
                                    className="main-image"
                                />
                            ) : (
                                <div className="no-image">
                                    No main image set
                                </div>
                            )}
                        </div>
                        
                        <ImagesSection>
                            <ImagesGrid>
                                <AddImageButton onClick={() => imageInputRef.current?.click()}>
                                    <span>+</span>
                                    <span>Add</span>
                                </AddImageButton>
                                
                                {vehicleImages.map((image, index) => (
                                    <ImageItem key={image.url} isMain={vehicle.image_uri === image.url}>
                                        <ImageThumbnail src={image.url} alt={`Vehicle ${index + 1}`} />
                                        <ImageOverlay>
                                            {vehicle.image_uri !== image.url && (
                                                <ImageButton 
                                                    className="primary"
                                                    onClick={() => handleSetMainImage(image.url)}
                                                >
                                                    Main
                                                </ImageButton>
                                            )}
                                            <ImageButton 
                                                className="danger"
                                                onClick={() => handleRemoveImage(image)}
                                            >
                                                Delete
                                            </ImageButton>
                                        </ImageOverlay>
                                    </ImageItem>
                                ))}
                            </ImagesGrid>
                            
                            <input
                                type="file"
                                ref={imageInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                            />
                            
                            {isUploadingImages && (
                                <p style={{ marginTop: '8px', color: '#666', fontSize: '0.8125rem' }}>
                                    Uploading images...
                                </p>
                            )}
                        </ImagesSection>
                    </div>

                    {/* Vehicle Details - Lower Half */}
                    <div className="vehicle-details">
                        {renderField('Price', 'listing_price')}
                        {renderField('Color', 'color')}
                        {renderField('Condition', 'condition')}
                        {renderField('Mileage', 'mileage')}
                        {renderField('Tag Number', 'tag_number')}
                        {renderField('Nickname', 'nickname')}
                        {renderField('VIN', 'vin')}
                        {renderField('Created At', 'created_at', false, false)}
                        {renderField('Rentable', 'is_rentable', true)}
                        {renderField('Sellable', 'is_sellable', true)}
                    </div>
                </LeftWrapper>
                
                <RightWrapper>                    
                    <BottomSection>
                        <ReportsSection>
                            <SectionTitle>Vehicle Reports</SectionTitle>
                            
                            <AddButton 
                                onClick={() => setIsAddingReport(true)}
                                value="Add New Report"
                            />
                            
                            {isAddingReport && (
                                // HERE 
                                <ReportForm>
                                    <AddReportsHeader>
                                        <ReportsLogo>
                                            PL8M8
                                        </ReportsLogo>
                                        <div style={ {padding: "20px", fontWeight:"bold"}}> Add a Report </div>
                                    </AddReportsHeader>

                                    <SegmentedControl>
                                        {reportTypes.map(type => (
                                            <SegmentedOption
                                                key={type.value}
                                                selected={newReport.type === type.value}
                                                onClick={() => setNewReport({...newReport, type: type.value})}
                                            >
                                                {type.icon} &nbsp;
                                                {type.label}
                                            </SegmentedOption>
                                        ))}
                                    </SegmentedControl>
                                    {console.log("TODO DELETE This is new Report ", newReport)}
                                    <FormLabel>{ reportTypes.find( reportType => reportType.value === newReport.type )?.title }</FormLabel>
                                    <TextArea
                                        placeholder={ reportTypes.find( reportType => reportType.value === newReport.type )?.titlePlaceholder }
                                        value={newReport.title}
                                        onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                                        required
                                    />
                                    
                                    <FormLabel>{ reportTypes.find( reportType => reportType.value === newReport.type )?.levelSelect }</FormLabel>
                                    <SegmentedControl>
                                        {severityOptions.map(severity => (
                                            <SegmentedOption
                                                key={severity.value}
                                                selected={newReport.severity === severity.value}
                                                onClick={() => setNewReport({...newReport, severity: severity.value})}
                                            >
                                                {severity.label}
                                            </SegmentedOption>
                                        ))}
                                    </SegmentedControl>

                                    <FormLabel>{ reportTypes.find( reportType => reportType.value === newReport.type )?.description }</FormLabel>
                                    <TextArea
                                        placeholder={ reportTypes.find( reportType => reportType.value === newReport.type )?.descriptionPlaceholder }
                                        value={newReport.description}
                                        onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                                        required
                                    />

                                    <FormLabel>{ reportTypes.find( reportType => reportType.value === newReport.type )?.uploadPrompt }</FormLabel>

                                    {/* TODO : <FormLabel>Status</FormLabel>
                                    <Select
                                        value={newReport.status}
                                        onChange={(e) => setNewReport({...newReport, status: e.target.value})}
                                    >
                                        <option value="open">Open</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </Select> */}
                                    
                                    <ButtonWrapper>
                                        <Button 
                                            onClick={handleAddReport}
                                            value={loading ? "Adding..." : reportTypes.find( reportType => reportType.value === newReport.type )?.submitText }
                                            disabled={loading}
                                        />
                                        <Button 
                                            onClick={() => setIsAddingReport(false)}
                                            value="Cancel"
                                        />
                                    </ButtonWrapper>
                                </ReportForm>
                            )}

                            <ReportsContainer>
                                {reports.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: '#666', fontSize: '0.8125rem', marginTop: '16px' }}>
                                        No reports found for this vehicle.
                                    </p>
                                ) : (
                                    reports.map((report) => (
                                        <ReportItem key={report.id}>
                                            {deletingReportId !== report.id && (
                                                <ReportEditControls className="report-controls">
                                                    <IconButton 
                                                        onClick={() => handleEditReport(report.id)}
                                                        title="Edit Report"
                                                    >
                                                        Edit
                                                    </IconButton>
                                                    <IconButton 
                                                        onClick={() => handleConfirmDelete(report.id)}
                                                        title="Delete Report"
                                                    >
                                                        Delete
                                                    </IconButton>
                                                </ReportEditControls>
                                            )}
                                            
                                            {deletingReportId === report.id ? (
                                                <DeleteConfirmation>
                                                    <ConfirmationText>
                                                        Are you sure you want to delete this report?
                                                    </ConfirmationText>
                                                    <WarningText>
                                                        This action cannot be undone.
                                                    </WarningText>
                                                    <ConfirmButtonWrapper>
                                                        <DeleteButton 
                                                            onClick={() => handleDeleteReport(report.id)}
                                                            value="Delete Report"
                                                        />
                                                        <Button 
                                                            onClick={handleCancelDelete}
                                                            value="Cancel"
                                                        />
                                                    </ConfirmButtonWrapper>
                                                </DeleteConfirmation>
                                            ) : editingReports[report.id] ? (
                                                <EditReportForm>
                                                    <ReportHeader>
                                                        <h4 style={{ margin: 0, fontSize: '0.9375rem' }}>
                                                            {reportTypes.find(type => type.value === report.type)?.label || report.type}
                                                        </h4>
                                                        <span style={{ color: '#666', fontSize: '0.75rem' }}>
                                                            {formatDate(report.created_at)}
                                                        </span>
                                                    </ReportHeader>
                                                    
                                                    <FormLabel>Report Type</FormLabel>
                                                    <SegmentedControl>
                                                        {reportTypes.map(type => (
                                                            <SegmentedOption
                                                                key={type.value}
                                                                selected={editedReports[report.id]?.type === type.value}
                                                                onClick={() => handleReportFieldChange(report.id, 'type', type.value)}
                                                            >
                                                                {type.label}
                                                            </SegmentedOption>
                                                        ))}
                                                    </SegmentedControl>
                                                    
                                                    <FormLabel>Description</FormLabel>
                                                    <TextArea
                                                        value={editedReports[report.id]?.description || ''}
                                                        onChange={(e) => handleReportFieldChange(report.id, 'description', e.target.value)}
                                                    />
                                                    
                                                    <FormLabel>Severity</FormLabel>
                                                    <SegmentedControl>
                                                        {severityOptions.map(severity => (
                                                            <SegmentedOption
                                                                key={severity.value}
                                                                selected={editedReports[report.id]?.severity === severity.value}
                                                                onClick={() => handleReportFieldChange(report.id, 'severity', severity.value)}
                                                            >
                                                                {severity.label}
                                                            </SegmentedOption>
                                                        ))}
                                                    </SegmentedControl>
                                                    
                                                    <FormLabel>Status</FormLabel>
                                                    <Select
                                                        value={editedReports[report.id]?.status || ''}
                                                        onChange={(e) => handleReportFieldChange(report.id, 'status', e.target.value)}
                                                    >
                                                        <option value="open">Open</option>
                                                        <option value="in progress">In Progress</option>
                                                        <option value="resolved">Resolved</option>
                                                        <option value="closed">Closed</option>
                                                    </Select>
                                                    
                                                    <ButtonWrapper>
                                                        <Button 
                                                            onClick={() => handleSaveReport(report.id)}
                                                            value="Save"
                                                        />
                                                        <Button 
                                                            onClick={() => handleEditReport(report.id)}
                                                            value="Cancel"
                                                        />
                                                    </ButtonWrapper>
                                                </EditReportForm>
                                            ) : (
                                                <>
                                                    <ReportHeader>
                                                        <h4 style={{ margin: 0, fontSize: '0.9375rem' }}>
                                                            {reportTypes.find(type => type.value === report.type)?.label || report.type}
                                                        </h4>
                                                        <ReportMetadata>
                                                            <Badge severity={report.severity}>
                                                                {severityOptions.find(sev => sev.value === report.severity)?.label || report.severity}
                                                            </Badge>
                                                            <Badge status={report.status}>
                                                                {statusOptions.find(stat => stat.value === report.status)?.label || report.status}
                                                            </Badge>
                                                        </ReportMetadata>
                                                        <span style={{ color: '#666', fontSize: '0.75rem' }}>
                                                            {formatDate(report.created_at)}
                                                        </span>
                                                    </ReportHeader>
                                                    
                                                    <p style={{ margin: '6px 0', color: '#333', fontSize: '0.8125rem' }}>
                                                        {report.description}
                                                    </p>
                                                </>
                                            )}
                                        </ReportItem>
                                    ))
                                )}
                            </ReportsContainer>
                        </ReportsSection>
                    </BottomSection>
                </RightWrapper>
            </ContentWrapper>
        </Container>
    );
};

export default VehicleDetail;