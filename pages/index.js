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