import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../config/supabase';
import styled from 'styled-components';
import Link from 'next/link';
import colors from 'constants/colors';

const Container = styled.div`
    height: 100vh;
    background-color: #f8f9fa;
    padding-top: 2.5rem;
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    background-color: white;
    border-bottom: 1px solid #e0e0e0;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const BackButton = styled.button`
    background: none;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #666;
    
    &:hover {
        background-color: #f8f9fa;
    }
`;

const VehicleInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
`;

const VehicleImage = styled.img`
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
`;

const VehicleDetails = styled.div`
    display: flex;
    flex-direction: column;
`;

const VehicleTitle = styled.h1`
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
`;

const VehicleSubtitle = styled.span`
    font-size: 14px;
    color: #666;
`;

const ChatContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
    background-color: white;
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
`;

const MessagesContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const MessageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    
    ${props => props.isOwn ? `
        align-items: flex-end;
    ` : `
        align-items: flex-start;
    `}
`;

const MessageBubble = styled.div`
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 18px;
    word-wrap: break-word;
    
    ${props => props.isOwn ? `
        background-color: ${colors.primary};
        color: white;
        border-bottom-right-radius: 4px;
    ` : `
        background-color: #f1f3f4;
        color: #333;
        border-bottom-left-radius: 4px;
    `}
`;

const MessageInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
    
    ${props => props.isOwn ? `
        justify-content: flex-end;
    ` : `
        justify-content: flex-start;
    `}
`;

const MessageAuthor = styled.span`
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.isOwn ? 'rgba(255,255,255,0.8)' : '#666'};
`;

const MessageTime = styled.span`
    font-size: 11px;
    color: ${props => props.isOwn ? 'rgba(255,255,255,0.6)' : '#999'};
`;

const MessageText = styled.div`
    font-size: 14px;
    line-height: 1.4;
`;

const InputContainer = styled.div`
    border-top: 1px solid #e0e0e0;
    background-color: white;
    padding: 1rem;
    display: flex;
    gap: 12px;
    align-items: flex-end;
`;

const TextArea = styled.textarea`
    flex: 1;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    padding: 12px 16px;
    font-size: 14px;
    font-family: inherit;
    resize: none;
    min-height: 20px;
    max-height: 100px;
    
    &:focus {
        outline: none;
        border-color: ${colors.primary};
    }
    
    &:disabled {
        background-color: #f8f9fa;
        color: #6c757d;
    }
`;

const SendButton = styled.button`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background-color: ${props => props.disabled ? '#ccc' : colors.primary};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: all 0.2s;
    
    &:hover:not(:disabled) {
        transform: translateY(-1px);
    }
`;

const LoadingState = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 1.1rem;
    color: #666;
`;

const ErrorState = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 1.1rem;
    color: #dc3545;
`;

const EmptyState = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #666;
    text-align: center;
    padding: 2rem;
`;

const EmptyIcon = styled.div`
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
`;

const EmptyTitle = styled.h3`
    margin: 0 0 0.5rem 0;
    color: #333;
`;

const DisclaimerContainer = styled.div`
    background-color: #f8f9fa;
    border-top: 1px solid #e0e0e0;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const DisclaimerText = styled.span`
    font-size: 12px;
    color: #666;
    font-style: italic;
    display: flex;
    align-items: center;
    gap: 6px;
`;

const EmptyText = styled.p`
    margin: 0;
    font-size: 14px;
`;

export default function ReportDetail() {
    const router = useRouter();
    const { report_id } = router.query;
    const [reportData, setReportData] = useState(null);
    const [vehicleData, setVehicleData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [vehicleOwner, setVehicleOwner] = useState(null);
    const [profilesMap, setProfilesMap] = useState({});
    const messagesEndRef = useRef(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchData = async () => {
            if (!report_id) return;
            
            try {
                setLoading(true);
                setError(null);
                
                console.log('Fetching data for report_id:', report_id);
                
                // Get current user
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) throw sessionError;
                
                if (!session?.user) {
                    router.push('/login');
                    return;
                }
                
                setCurrentUser(session.user.id);
                console.log('Current user:', session.user.id);
                
                // Fetch report data
                const { data: report, error: reportError } = await supabase
                    .from('reports')
                    .select('*')
                    .eq('id', report_id)
                    .single();

                console.log('Report query result:', { report, reportError });
                if (reportError) throw reportError;
                if (!report) throw new Error('Report not found');
                
                setReportData(report);

                // Fetch vehicle data
                const { data: vehicle, error: vehicleError } = await supabase
                    .from('vehicles')
                    .select('*')
                    .eq('id', report.vehicle_id)
                    .single();

                console.log('Vehicle query result:', { vehicle, vehicleError });
                if (vehicleError) throw vehicleError;
                if (!vehicle) throw new Error('Vehicle not found');
                
                setVehicleData(vehicle);

                // Find vehicle owner - check if reporter field exists, otherwise use users_vehicles
                let ownerId = null;
                if (report.reporter) {
                    ownerId = report.reporter;
                } else {
                    const { data: ownerData, error: ownerError } = await supabase
                        .from('users_vehicles')
                        .select('user_id')
                        .eq('vehicle_id', vehicle.id)
                        .single();

                    if (ownerError) {
                        console.warn('Could not find vehicle owner:', ownerError);
                        // Continue anyway, we can still show the conversation
                    } else {
                        ownerId = ownerData.user_id;
                    }
                }
                
                setVehicleOwner(ownerId);
                console.log('Vehicle owner:', ownerId);

                // Fetch messages (updates) - this is the key connection
                const { data: messagesData, error: messagesError } = await supabase
                    .from('updates')
                    .select('*')
                    .eq('report_id', report_id)
                    .order('created_at', { ascending: true });

                console.log('Messages query result:', { messagesData, messagesError });
                if (messagesError) throw messagesError;

                // Fetch profiles for all users involved
                const messageAuthors = messagesData?.map(m => m.author) || [];
                const userIds = [report.reporter, ownerId, session.user.id, ...messageAuthors];
                const uniqueUserIds = [...new Set(userIds.filter(Boolean))];
                
                if (uniqueUserIds.length > 0) {
                    const { data: profilesData, error: profilesError } = await supabase
                        .from('profiles')
                        .select('id, username, avatar_url')
                        .in('id', uniqueUserIds);

                    if (profilesError) {
                        console.warn('Error fetching profiles:', profilesError);
                    } else {
                        const profilesMapData = profilesData.reduce((acc, profile) => {
                            acc[profile.id] = profile;
                            return acc;
                        }, {});
                        
                        setProfilesMap(profilesMapData);
                        console.log('Profiles loaded:', profilesMapData);
                    }
                }
                
                setMessages(messagesData || []);
                console.log('Messages loaded:', messagesData?.length || 0);
                
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Failed to load conversation');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [report_id, router]);

    // Real-time subscription for new messages
    useEffect(() => {
        if (!report_id) return;

        const subscription = supabase
            .channel(`updates-${report_id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'updates',
                    filter: `report_id=eq.${report_id}`
                },
                (payload) => {
                    const newUpdate = payload.new;
                    
                    // Don't add if it's from the current user (already added optimistically)
                    if (newUpdate.author === currentUser) return;
                    
                    setMessages(prev => [...prev, newUpdate]);
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [report_id, currentUser]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || isPosting) return;

        setIsPosting(true);
        
        try {
            // Add message optimistically
            const optimisticMessage = {
                id: `temp-${Date.now()}`,
                summary: newMessage,
                report_id: report_id,
                author: currentUser,
                created_at: new Date().toISOString()
            };
            
            setMessages(prev => [...prev, optimisticMessage]);
            setNewMessage('');
            
            // Send to database
            const { data, error } = await supabase
                .from('updates')
                .insert([{
                    summary: newMessage,
                    report_id: report_id,
                    author: currentUser
                }])
                .select()
                .single();

            if (error) throw error;

            // Replace optimistic message with real one
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === optimisticMessage.id ? data : msg
                )
            );

        } catch (err) {
            console.error('Error sending message:', err);
            // Remove optimistic message on error
            setMessages(prev => 
                prev.filter(msg => msg.id !== `temp-${Date.now()}`)
            );
            setNewMessage(newMessage); // Restore message text
            alert('Failed to send message. Please try again.');
        } finally {
            setIsPosting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    if (loading) {
        return (
            <Container>
                <Header>
                    <BackButton onClick={() => router.back()}>
                        ← Back
                    </BackButton>
                    <VehicleInfo>
                        <VehicleDetails>
                            <VehicleTitle>Loading conversation...</VehicleTitle>
                            <VehicleSubtitle>Please wait</VehicleSubtitle>
                        </VehicleDetails>
                    </VehicleInfo>
                </Header>
                <ChatContainer>
                    <LoadingState>Loading conversation...</LoadingState>
                </ChatContainer>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Header>
                    <BackButton onClick={() => router.back()}>
                        ← Back
                    </BackButton>
                    <VehicleInfo>
                        <VehicleDetails>
                            <VehicleTitle>Error</VehicleTitle>
                            <VehicleSubtitle>{error}</VehicleSubtitle>
                        </VehicleDetails>
                    </VehicleInfo>
                </Header>
                <ChatContainer>
                    <ErrorState>{error}</ErrorState>
                </ChatContainer>
            </Container>
        );
    }

    // Show basic UI even if some data is missing
    const vehicleTitle = vehicleData 
        ? `${vehicleData.year || ''} ${vehicleData.make || ''} ${vehicleData.model || ''}`.trim()
        : 'Vehicle Conversation';
    
    const vehicleSubtitle = reportData 
        ? `Purchase Inquiry`
        : 'Loading...';

    return (
        <Container>
            <Header>
                <BackButton onClick={() => router.back()}>
                    ← Back
                </BackButton>
                
                <VehicleInfo>
                    {vehicleData?.image_uri && (
                        <VehicleImage 
                            src={vehicleData.image_uri} 
                            alt="Vehicle"
                        />
                    )}
                    <VehicleDetails>
                        <VehicleTitle>
                            {vehicleTitle || `Report #${report_id}`}
                        </VehicleTitle>
                        <VehicleSubtitle>
                            {vehicleSubtitle}
                        </VehicleSubtitle>
                    </VehicleDetails>
                </VehicleInfo>
            </Header>

            <ChatContainer>
                <MessagesContainer>
                    {!reportData || !vehicleData ? (
                        <LoadingState>Loading conversation details...</LoadingState>
                    ) : messages.length === 0 ? (
                        <EmptyState>
                            <EmptyIcon>💬</EmptyIcon>
                            <EmptyTitle>Start the conversation</EmptyTitle>
                            <EmptyText>
                                Send a message about this {vehicleData.year} {vehicleData.make} {vehicleData.model}
                            </EmptyText>
                        </EmptyState>
                    ) : (
                        messages.map((message) => {
                            const isOwn = message.author === currentUser;
                            const authorProfile = profilesMap[message.author];
                            
                            return (
                                <MessageWrapper key={message.id} isOwn={isOwn}>
                                    <MessageInfo isOwn={isOwn}>
                                        <MessageAuthor isOwn={isOwn}>
                                            {isOwn ? 'You' : authorProfile?.username || 'User'}
                                        </MessageAuthor>
                                        <MessageTime isOwn={isOwn}>
                                            {formatTime(message.created_at)}
                                        </MessageTime>
                                    </MessageInfo>
                                    <MessageBubble isOwn={isOwn}>
                                        <MessageText>{message.summary}</MessageText>
                                    </MessageBubble>
                                </MessageWrapper>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </MessagesContainer>

                <InputContainer>
                    <TextArea
                        placeholder={
                            !reportData || !vehicleData 
                                ? "Loading..." 
                                : "Type a message..."
                        }
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isPosting || !reportData || !vehicleData}
                        rows={1}
                    />
                    <SendButton 
                        onClick={handleSendMessage}
                        disabled={isPosting || !newMessage.trim() || !reportData || !vehicleData}
                    >
                        {isPosting ? '⏳' : '➤'}
                    </SendButton>
                </InputContainer>

                <DisclaimerContainer>
                    <DisclaimerText>
                        ⏰ Messages will expire after 14 days
                    </DisclaimerText>
                </DisclaimerContainer>
            </ChatContainer>
        </Container>
    );
}