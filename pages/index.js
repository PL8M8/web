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

const NavbarContainer = styled.nav`
    display: flex;
    align-items: center;
    padding-right: 20px;
    padding-top: 4px;
    flex-wrap: nowrap; 
    width: 100%; 
    height: 50px;
    box-sizing: border-box;
    position: fixed; 
    top: 0;
    left: 0;
    z-index: 1000;
`;

const SignInButtonContainer = styled.div`
    margin-left: auto;
    padding-right: 20px;
`

const GoBackButtonContainer = styled.div`
    margin-right: auto;
    padding-left: 140px;
`

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
        align-items: flex-end; 
    }
    
    button {
        padding: 0.75rem 1rem;
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

const SuccessMessage = styled.div`
    background-color: #d4edda;
    color: #155724;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #c3e6cb;
    text-align: center;
    font-size: 1rem;
    margin-top: 1rem;
    max-width: 500px;
    width: 100%;
`;

const ErrorMessage = styled.div`
    background-color: #f8d7da;
    color: #721c24;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #f5c6cb;
    text-align: center;
    font-size: 1rem;
    margin-top: 1rem;
    max-width: 500px;
    width: 100%;
`;

export default function Index() {
    const router = useRouter();
    const betaPassword = "pl8m8-2025-b3ta";
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [onPasswordPage, setOnPasswordPage] = useState(false);
    const [incorrectPassword, setIncorrectPassword ] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // router.replace('/listings'); // TODO: DEV Redirect to listings page on mount DEV - Temporary bypass
    }, []);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // router.replace('/garage');TODO: DEV Remove to bypass automatic redirect to garage
            } 
        };

        checkSession();

        const { data: subscription } = supabase.auth.onAuthStateChange(() => {
            checkSession();
        });

        return () => {
            // subscription cleanup
        };
    }, [router]);

    if (!isMounted) {
        return null;
    }

    const handleEmailSubmit = async () => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return;
        }
        
        setIsSubmitting(true);
        setSubmitStatus(null);
        setErrorMessage('');
        
        try {
            const cleanEmail = email.toLowerCase().trim();
        
            const { data: existingEmails, error: checkError } = await supabase
                .from('waitlist')
                .select('email')
                .eq('email', cleanEmail)
                .limit(1);

            if (checkError) {
                console.error('Error checking existing email:', checkError);
                setErrorMessage('Something went wrong. Please try again.');
                setSubmitStatus('error');
                return;
            }

            // If email already exists
            if (existingEmails && existingEmails.length > 0) {
                const cleverResponses = [
                    "Great minds think alike! You're already on our VIP list. 🚗",
                    "Déjà vu? You're already signed up and ready to roll! 🎉",
                    "We love the enthusiasm, but you're already in the driver's seat on our waitlist! 🏁",
                    "Plot twist: You're already part of the PL8M8 family! No double-dipping needed. 😄",
                    "Your email is already cruising in our waitlist. Sit tight, we'll be in touch! 🛣️"
                ];
                
                const randomResponse = cleverResponses[Math.floor(Math.random() * cleverResponses.length)];
                setErrorMessage(randomResponse);
                setSubmitStatus('error');
                return;
            }

            // If email doesn't exist, insert it
            const { data, error } = await supabase
                .from('waitlist')
                .insert([
                    { 
                        email: cleanEmail,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) {
                console.error('Supabase insert error:', error);
                setErrorMessage('Something went wrong. Please try again.');
                setSubmitStatus('error');
            } else {
                setSubmitStatus('success');
                setEmail(''); 
            }
        } catch (error) {
            console.error('Error submitting to waitlist:', error);
            setErrorMessage('Something went wrong. Please try again.');
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };


    const togglePasswordPage = () => {
        setOnPasswordPage(!onPasswordPage)
    }

    const handlePasswordSubmit = () => {
        if(password === betaPassword){
            setIncorrectPassword(false);
            router.replace('/listings');
        } else {
            setIncorrectPassword(true);
        }
    }

    return (
        <MainWrapper>
           { !onPasswordPage ? (
                <Main>
                    <NavbarContainer>
                        <SignInButtonContainer>
                            <Button
                                value={"Sign In"}
                                onClick={togglePasswordPage}

                            />                    
                        </SignInButtonContainer>
                    </NavbarContainer>
                    <LogoContainer>
                        <LogoImage src="/logo.png" alt="PL8M8 Logo" />
                    </LogoContainer>

                    <Tagline>Where car maintenence meets community. Real people, real deals, real transparency.</Tagline>
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

                    {submitStatus === 'success' && (
                        <SuccessMessage>
                            🎉 Welcome to the waitlist! You'll be among the first to know when PL8M8 launches. Keep an eye on your inbox!
                        </SuccessMessage>
                    )}

                    {submitStatus === 'error' && (
                        <ErrorMessage>
                            {errorMessage}
                        </ErrorMessage>
                    )}

                    {submitStatus !== 'success' && (
                        <Disclaimer>
                            By submitting my personal data I agree to receive marketing emails from PL8M8
                        </Disclaimer>
                    )}
                </Main>
            ) : (
                <Main>
                    <NavbarContainer>
                        <GoBackButtonContainer>
                            <Button
                                value={"Go Back"}
                                onClick={togglePasswordPage}
                            />                    
                        </GoBackButtonContainer>
                    </NavbarContainer>
                    <LogoContainer>
                        <LogoImage src="/logo.png" alt="PL8M8 Logo" />
                    </LogoContainer>

                    <Tagline>Thanks for helping us test! Enter your password to get started </Tagline>
                        <InputSection>
                            <TextInput 
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                showSuccess={true}
                                required={true}
                            />
                            <Button 
                                value={isSubmitting ? "Entering..." : "Enter"}
                                onClick={handlePasswordSubmit}
                                disabled={isSubmitting || !email}
                            />
                        </InputSection>

                        {submitStatus === 'success' && (
                            <SuccessMessage>
                                🎉 Welcome to the waitlist! You'll be among the first to know when PL8M8 launches. Keep an eye on your inbox!
                            </SuccessMessage>
                        )}

                        {incorrectPassword && (
                            <ErrorMessage>
                                Incorrect Password
                            </ErrorMessage>
                        )}

                        {/* {submitStatus !== 'success' && (
                            <Disclaimer>
                                By submitting my personal data I agree to receive marketing emails from PL8M8
                            </Disclaimer>
                        )} */}
                </Main>
            )}
            
            <Footer>
                { false && ( <FooterContent>
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
                </FooterContent>)}
                
                <Divider />
                <Copyright>© {new Date().getFullYear()} PL8M8 LLC. All rights reserved.</Copyright>
            </Footer>
        </MainWrapper>
    );
}