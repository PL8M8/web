import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../config/supabase';
import styled from 'styled-components';
import Link from 'next/link';
import colors from 'constants/colors';

const Container = styled.div`
    padding: 2% 4%;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    min-height: 100vh;

    @media (max-width: 768px) {
        padding: 5% 2%;
    }
`;

const Header = styled.div`
    margin-bottom: 2rem;
`;

const Title = styled.h1`
    color: #333;
    font-size: 2rem;
    margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
    color: #666;
    font-size: 1rem;
    margin: 0;
`;

const MessageCount = styled.div`
    color: #999;
    font-weight: 500;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    text-transform: uppercase;
`;

const MessagesGrid = styled.div`
    display: grid;
    gap: 1.5rem;
`;

const MessageCard = styled.div`
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    transition: all 0.2s ease;
    
    &:hover {
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        border-color: #ccc;
    }
`;

const MessageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.5rem;
    }
`;

const VehicleInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
    
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const VehicleImage = styled.img`
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
`;

const VehicleImagePlaceholder = styled.div`
    width: 60px;
    height: 60px;
    background-color: #f5f5f5;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 0.75rem;
`;

const VehicleDetails = styled.div`
    flex: 1;
`;

const VehicleTitle = styled.h3`
    margin: 0 0 0.25rem 0;
    font-size: 1.1rem;
    color: #333;
    
    &:hover {
        color: ${colors.primary};
    }
`;

const VehicleSubtitle = styled.p`
    margin: 0;
    color: #666;
    font-size: 0.875rem;
`;

const MessageDate = styled.div`
    color: #999;
    font-size: 0.875rem;
    white-space: nowrap;
`;

const MessageContent = styled.div`
    background-color: #f8f9fa;
    border-radius: 6px;
    padding: 1rem;
    margin-bottom: 1rem;
`;

const MessageText = styled.p`
    margin: 0;
    line-height: 1.6;
    color: #444;
`;

const MessageFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
`;

const StatusBadge = styled.span`
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    
    background-color: ${props => {
        if (props.status === 'open') return '#e3f2fd';
        if (props.status === 'in progress') return '#f3e5f5';
        if (props.status === 'resolved') return '#e8f5e9';
        if (props.status === 'closed') return '#e0e0e0';
        return '#f5f5f5';
    }};
    
    color: ${props => {
        if (props.status === 'open') return '#1976d2';
        if (props.status === 'in progress') return '#7b1fa2';
        if (props.status === 'resolved') return '#388e3c';
        if (props.status === 'closed') return '#424242';
        return '#666';
    }};
`;

const ViewVehicleLink = styled.a`
    color: ${colors.primary};
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    
    &:hover {
        text-decoration: underline;
    }
`;

const LoadingState = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: #666;
    font-size: 1.1rem;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 3rem 1rem;
    color: #666;
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

const EmptyText = styled.p`
    margin: 0;
    font-size: 0.9rem;
`;

const ErrorState = styled.div`
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 6px;
    padding: 1rem;
    color: #721c24;
    text-align: center;
`;

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // Get current user
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                
                if (sessionError) {
                    throw new Error('Authentication error: ' + sessionError.message);
                }

                if (!session || !session.user) {
                    router.push('/login'); // Redirect to login if not authenticated
                    return;
                }

                const userId = session.user.id;

                // Fetch all forum reports by this user with vehicle details
                const { data: messagesData, error: messagesError } = await supabase
                    .from('reports')
                    .select(`
                        *,
                        vehicles (
                            id,
                            year,
                            make,
                            model,
                            image_uri
                        )
                    `)
                    .eq('reporter', userId)
                    .eq('type', 'forum')
                    .order('created_at', { ascending: false });

                if (messagesError) {
                    throw new Error('Error fetching messages: ' + messagesError.message);
                }

                setMessages(messagesData || []);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [router]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) {
            return 'Today';
        } else if (diffInDays === 1) {
            return 'Yesterday';
        } else if (diffInDays < 7) {
            return `${diffInDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    };

    if (isLoading) {
        return (
            <Container>
                <LoadingState>Loading your messages...</LoadingState>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Header>
                    <Title>My Messages</Title>
                </Header>
                <ErrorState>
                    {error}
                </ErrorState>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <Title>My Messages</Title>
                <Subtitle>Your inquiries and messages about vehicles</Subtitle>
            </Header>

            <MessageCount>
                {messages.length} {messages.length === 1 ? 'message' : 'messages'}
            </MessageCount>

            {messages.length === 0 ? (
                <EmptyState>
                    <EmptyIcon>💬</EmptyIcon>
                    <EmptyTitle>No messages yet</EmptyTitle>
                    <EmptyText>
                        When you send inquiries about vehicles, they'll appear here.
                    </EmptyText>
                </EmptyState>
            ) : (
                <MessagesGrid>
                    {messages.map((message) => (
                        <MessageCard key={message.id}>
                            <MessageHeader>
                                <VehicleInfo>
                                    {message.vehicles?.image_uri ? (
                                        <VehicleImage 
                                            src={message.vehicles.image_uri} 
                                            alt={`${message.vehicles.year} ${message.vehicles.make} ${message.vehicles.model}`}
                                        />
                                    ) : (
                                        <VehicleImagePlaceholder>
                                            No Image
                                        </VehicleImagePlaceholder>
                                    )}
                                    <VehicleDetails>
                                        <Link href={`/vehicle/${message.vehicles?.id}`} passHref>
                                            <VehicleTitle>
                                                {message.vehicles?.year} {message.vehicles?.make} {message.vehicles?.model}
                                            </VehicleTitle>
                                        </Link>
                                        <VehicleSubtitle>Vehicle ID: {message.vehicles?.id}</VehicleSubtitle>
                                    </VehicleDetails>
                                </VehicleInfo>
                                <MessageDate>
                                    {formatDate(message.created_at)}
                                </MessageDate>
                            </MessageHeader>

                            <MessageContent>
                                <MessageText>{message.description}</MessageText>
                            </MessageContent>

                            <MessageFooter>
                                <StatusBadge status={message.status}>
                                    {message.status}
                                </StatusBadge>
                                <Link href={`/reports/${message.id}`} passHref>
                                    <ViewVehicleLink>
                                        See More →
                                    </ViewVehicleLink>
                                </Link>
                            </MessageFooter>
                        </MessageCard>
                    ))}
                </MessagesGrid>
            )}
        </Container>
    );
};

export default Messages;