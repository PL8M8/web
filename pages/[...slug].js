// pages/[...slug].js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const Main = styled.main`
    background-color: #FCEFCB;
    min-height: 100vh;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    gap: 2rem;
`;

const LogoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
`;

const LogoImage = styled.img`
    width: 240px;
    height: 120px;
    object-fit: contain;
`;

const Title = styled.h1`
    font-size: 3rem;
    color: #4E1F00;
    margin: 0;
    font-weight: bold;
`;

const Subtitle = styled.div`
    font-size: 1.25rem;
    max-width: 600px;
    line-height: 1.4;
    color: #4E1F00;
    margin-top: 1rem;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    
    @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
        max-width: 300px;
    }
`;

const HomeButton = styled.button`
    border: 2px solid #4E1F00;
    border-radius: 5px;
    color: #4E1F00;
    font-weight: bold;
    text-transform: uppercase;
    background: none;
    cursor: pointer;
    padding: 0.75rem 1.5rem;
    min-width: 150px;
    transition: background-color 0.3s, color 0.3s, transform 0.1s;

    &:hover {
        background-color: #4E1F00;
        color: #FCEFCB;
    }

    &:active {
        transform: scale(0.95);
    }
`;

const BackButton = styled(HomeButton)`
    border-color: #666;
    color: #666;

    &:hover {
        background-color: #666;
        color: #FCEFCB;
    }
`;

const Footer = styled.footer`
    padding: 2rem;
    border-top: 1px solid #eee;
    background-color: #4E1F00;
    color: white;
`;

const Divider = styled.div`
    height: 1px;
    background-color: #666;
    margin: 2rem 0 1rem 0;
`;

const Copyright = styled.div`
    font-size: 0.875rem;
    color: #ccc;
    text-align: center;
`;

export default function CatchAll() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [attemptedPath, setAttemptedPath] = useState('');

    useEffect(() => {
        setIsMounted(true);
        setAttemptedPath(router.asPath);
    }, [router.asPath]);

    const goHome = () => {
        router.push('/');
    };

    const goBack = () => {
        router.back();
    };

    if (!isMounted) {
        return null;
    }

    return (
        <MainWrapper>
            <Main>
                <LogoContainer>
                    <Link href="/">
                        <LogoImage src="/logo.png" alt="PL8M8 Logo" style={{ cursor: 'pointer' }} />
                    </Link>
                </LogoContainer>
                
                <Title>Oops! Wrong Turn</Title>
                
                <Subtitle>
                    Looks like you took a detour to <strong>{attemptedPath}</strong>. 
                    Don't worry, even the best GPS gets confused sometimes! 
                    Let's get you back on the road.
                </Subtitle>

                <ButtonContainer>
                    <HomeButton onClick={goHome}>
                        Take Me Home
                    </HomeButton>
                    <BackButton onClick={goBack}>
                        Go Back
                    </BackButton>
                </ButtonContainer>
            </Main>
            
            <Footer>
                <Divider />
                <Copyright>© {new Date().getFullYear()} PL8M8 LLC. All rights reserved.</Copyright>
            </Footer>
        </MainWrapper>
    );
}