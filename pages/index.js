import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// import Sidebar from '@components/Sidebar';
import VehicleFeed from '@components/VehicleFeed';

const Container = styled.div`
    display: grid;
    grid-template-columns: ${props => props.sidebarCollapsed ? '10px' : '20%'} 1fr;
    min-height: 100vh;
    margin-top: 3.5%;
    transition: grid-template-columns 0.3s ease;

    @media (max-width: 768px) {
        margin-top: 15%;
    }
`;

const SidebarWrapper = styled.div`
    position: fixed;
    top: 4%;
    left: 0;
    bottom: 0;
    width: ${props => props.collapsed ? '10px' : '20%'};
    overflow-y: auto;
    transition: width 0.3s ease;
    z-index: 10;
`;

const FeedContainer = styled.div`
    width: 100%;
    min-height: 100%;
    grid-column: 2;
    overflow-y: auto;
`;

const ToggleButton = styled.button`
    position: absolute;
    bottom: 20px;
    right: 10px;
    z-index: 20;
    background: #f0f0f0;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    
    &:hover {
        background: #e0e0e0;
    }
`;

const Marketplace = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    // Add hydration fix
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    // Handle server-side rendering issues
    if (!mounted) {
        return (
            <div style={{ marginTop: '4%', height: '100vh' }}>
                <div style={{ padding: '20px' }}>Loading...</div>
            </div>
        );
    }

    const carImages = [
        'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Tesla Model S
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Porsche 911
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Chevrolet Corvette
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Mercedes-Benz
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // BMW
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Audi R8
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Classic Car
        'https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'  // Lamborghini
    ];

    return (
        <Container sidebarCollapsed={sidebarCollapsed}>
            {/* <SidebarWrapper collapsed={sidebarCollapsed}>
                <Sidebar collapsed={sidebarCollapsed} />
                <ToggleButton onClick={toggleSidebar}>
                    {sidebarCollapsed ? '→' : '←'}
                </ToggleButton>
            </SidebarWrapper> */}
            <FeedContainer>
                <VehicleFeed />
            </FeedContainer>

        </Container>
    );
};

export default Marketplace;