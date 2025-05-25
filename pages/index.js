import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { supabase } from 'config/supabase';
import Button from '@components/Button';
import TextInput from '@components/TextInput';

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

const FooterLogoImage = styled.img`
    width: 60px;
    height: 60px;
    object-fit: contain;
`;

const Tagline = styled.div`
    font-size: 2rem;
    max-width: 700px;
    line-height: 1.4;
    color: #4E1F00;
    margin-top: 2rem;
`;

const InputSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 500px;
    
    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

const Disclaimer = styled.div`
    font-size: 0.75rem;
    color: #4E1F00;
    max-width: 400px;
    text-align: left;
`;

const Footer = styled.footer`
    padding: 2rem;
    border-top: 1px solid #eee;
    background-color: #4E1F00;
    color: white;
`;

const FooterContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
    margin-bottom: 2rem;
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 2rem;
    }
`;

const FooterLeft = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Tagline2 = styled.div`
    font-size: 0.875rem;
    color: #ccc;
`;

const SocialLinks = styled.div`
    font-size: 0.875rem;
    color: #ccc;
`;

const FooterRight = styled.div`
    display: flex;
    gap: 3rem;
    
    @media (max-width: 768px) {
        gap: 2rem;
    }
`;

const FooterSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const FooterHeading = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: white;
`;

const FooterLink = styled.div`
    font-size: 0.875rem;
    color: #ccc;
    cursor: pointer;
    
    &:hover {
        color: white;
    }
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

export default function Index() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            // Redirect to /garage if the user is signed in
            if (session) {
                router.replace('/garage');
            }
        };

        checkSession();

        // Listen for auth state changes
        const { data: subscription } = supabase.auth.onAuthStateChange(() => {
            checkSession();
        });

        return () => {
            // subscription
            // console.log('Subscript is', subscription)
        };
    }, [router]);

    const handleEmailSubmit = async () => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return;
        }
        
        setIsSubmitting(true);
        // Add your waitlist submission logic here
        try {
            // Example: await submitToWaitlist(email);
            console.log('Submitting email:', email);
        } catch (error) {
            console.error('Error submitting to waitlist:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MainWrapper>
            <Main>
                <LogoContainer>
                    <LogoImage src="/logo.png" alt="PL8M8 Logo" />
                </LogoContainer>
                <Tagline>Where car buying meets community. Real people, real deals, real transparency.</Tagline>
                <InputSection>
                    <TextInput 
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        validateEmail={true}
                        showSuccess={true}
                        required={true}
                    />
                    <Button 
                        value={isSubmitting ? "Joining..." : "Join waitlist"}
                        onClick={handleEmailSubmit}
                        disabled={isSubmitting || !email}
                    />
                </InputSection>
                <Disclaimer>
                    By submitting my personal data I agree to receive marketing emails from PL8M8
                </Disclaimer>
            </Main>
            
            <Footer>
                <FooterContent>
                    <FooterLeft>
                        <FooterLogoImage src="/logo.png" alt="PL8M8 Logo" />
                        <Tagline2>Know your car™</Tagline2>
                    </FooterLeft>
                    
                    <FooterRight>
                        <FooterSection>
                            <FooterHeading>Company</FooterHeading>
                            <FooterLink>Contact</FooterLink>
                        </FooterSection>
                        
                        <FooterSection>
                            <FooterHeading>Legal</FooterHeading>
                            <FooterLink>Terms of Service</FooterLink>
                            <FooterLink>Privacy Policy</FooterLink>
                        </FooterSection>
                    </FooterRight>
                </FooterContent>
                
                <Divider />
                <Copyright>© {new Date().getFullYear()} PL8M8 LLC. All rights reserved.</Copyright>
            </Footer>
        </MainWrapper>
    );
}