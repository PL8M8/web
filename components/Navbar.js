import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { supabase } from 'config/supabase';

const NavbarContainer = styled.nav`
    display: flex;
    align-items: center;
    padding-left: 20px;
    padding-top: 4px;
    background-color: white;
    flex-wrap: nowrap; 
    justify-content: space-between;
    width: 100%; 
    height: 50px;
    box-sizing: border-box;
    position: fixed; 
    top: 0;
    left: 0;
    z-index: 1000;
    border-bottom: 1px solid #ddd;
`;

const Brand = styled.div`
    img {
        height: 40px;
    }
`;

const NavLinks = styled.div`
    display: flex;
    gap: 20px;
    padding: 20px;
    flex-wrap: wrap;
    align-items: center;
    
    @media (max-width: 768px) {
        display: none;
    }
    
    @media (max-width: 600px) {
        flex-direction: column;
        padding-left: 0;
        
        span {
        margin: 5px 0;
        }
    }
`;

const NavLink = styled.span`
    text-decoration: none;
    color: #bbbc;
    font-weight: ${props => props.active ? 'bold' : 'normal'};
    transition: color 0.3s;
    cursor: pointer;

    &:hover {
        color: #ff8800;
    }
    
    ${props => props.active && `
        color: #ff8900;
    `}
`;

const SignOutButton = styled.a`
    background-color: red;
    cursor: pointer;
    border: 2px solid red;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    padding: 5px 20px;
`;

const HamburgerButton = styled.button`
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 0 20px;
    
    @media (max-width: 768px) {
        display: block;
    }
`;

const MobileMenu = styled.div`
    display: none;
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 999;
    flex-direction: column;
    border-bottom: 1px solid #ddd;
    
    @media (max-width: 768px) {
        display: ${props => props.isOpen ? 'flex' : 'none'};
    }
`;

const MobileNavLink = styled(NavLink)`
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    display: block;
    width: 100%;
    text-align: left;
    
    &:last-child {
        border-bottom: none;
    }
`;

const MobileSignOutButton = styled(SignOutButton)`
    margin: 15px 20px;
    justify-content: flex-start;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const Modal = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
    h2 {
        margin-top: 0;
    }
`;

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

const Button = styled.button`
    width: 100%;
    padding: 10px;
    background-color: orange;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
    opacity: ${props => props.disabled ? 0.6 : 1};

    &:hover {
        background-color: ${props => props.disabled ? 'orange' : 'darkorange'};
    }

    &:disabled {
        cursor: not-allowed;
    }
`;

const BackButton = styled.button`
    margin-top: 20px;
    background: none;
    border: none;
    color: blue;
    cursor: pointer;
    font-size: 14px;
    text-decoration: underline;

    &:hover {
        color: darkblue;
    }
`;

const Message = styled.p`
    margin: 15px 0;
    padding: 10px;
    border-radius: 5px;
    background-color: ${props => props.error ? '#ffebee' : '#e8f5e8'};
    color: ${props => props.error ? '#c62828' : '#2e7d32'};
    border: 1px solid ${props => props.error ? '#ffcdd2' : '#c8e6c9'};
`;

const Navbar = ({ extraComponents }) => {
    const router = useRouter();
    const [activeLink, setActiveLink] = useState('Home');
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'Buy & Sell', path: '/' },
        { name: 'Sign In', path: '#' },
    ];

    const loggedInNavLinks = [ 
        { name: 'Buy & Sell', path: '/' },
        { name: 'Garage', path: '/garage' },
        { name: 'Settings', path: '/settings' },
    ]

    const resetForm = () => {
        setEmail('');
        setOtp('');
        setMessage('');
        setIsError(false);
        setOtpSent(false);
        setIsLoading(false);
    };

    const sendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setIsError(false);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/welcome`,
            },
        });

        if (error) {
            setMessage(`Error: ${error.message}`);
            setIsError(true);
        } else {
            setMessage('Check your email for the verification code!');
            setIsError(false);
            setOtpSent(true);
        }
        
        setIsLoading(false);
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setIsError(false);

        const { error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'email'
        });

        if (error) {
            setMessage(`Error: ${error.message}`);
            setIsError(true);
        } else {
            setMessage('Sign-in successful! Redirecting...');
            setIsError(false);
            setIsModalOpen(false);
            resetForm();
            await router.replace('/garage');
        }
        
        setIsLoading(false);
    };

    const goBack = () => {
        setOtpSent(false);
        setOtp('');
        setMessage('');
        setIsError(false);
    };
    
    useEffect(() => {
        setMounted(true);
    
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsSignedIn(!!session);

            if (!session && router.pathname === '/garage') {
                router.push('/');
            }
        };

        checkSession();

        const { data: subscription } = supabase.auth.onAuthStateChange(() => {
            checkSession();
        });

        return () => {
            if (subscription && subscription.unsubscribe) {
                subscription.unsubscribe();
            }
        };
    }, [router]);

    useEffect(() => {
        // Utility: convert a dynamic path like "/profile/[id]" into a regex
        const pathToRegex = (path) => {
        const escaped = path
            .replace(/\//g, "\\/")
            .replace(/\[.*?\]/g, "[^/]+"); // replace [id] with wildcard

        return new RegExp(`^${escaped}(\\/.*)?$`); // match full path or subroutes
        };

        const currentPath = loggedInNavLinks
            .filter(link => pathToRegex(link.path).test(router.pathname))
            .sort((a, b) => b.path.length - a.path.length)[0]?.path;

        const active = isSignedIn ? (
                loggedInNavLinks.some(link => link.path === currentPath)
                ? loggedInNavLinks.find(link => link.path === currentPath).name
                : 'Home'
            ) : (
                navLinks.some(link => link.path === currentPath)
                ? navLinks.find(link => link.path === currentPath).name
                : 'Home'
            )
        setActiveLink(active);
    }, [router.pathname, navLinks]);

    useEffect(() => {
        // Close mobile menu when route changes
        const handleRouteChange = () => {
            setIsMobileMenuOpen(false);
        };

        router.events.on('routeChangeComplete', handleRouteChange);
        
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    const handleSignOut = async (e) => {
        e.preventDefault();
        await supabase.auth.signOut();
        setIsSignedIn(false);
        router.push('/'); 
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setIsMobileMenuOpen(false);
        if (!isModalOpen) {
            resetForm();
        }
    };

    const renderDesktopNavLinks = () => {
        return isSignedIn ? (
            <>
                {extraComponents}
                {loggedInNavLinks.map(({ name, path }) => (
                    <Link key={name} href={path} passHref>
                        <NavLink
                            active={activeLink === name}
                        >
                            {name}
                        </NavLink>
                    </Link>
                ))}
                <SignOutButton
                    href="#"
                    onClick={handleSignOut}
                    className={activeLink === 'Sign Out' ? 'active' : ''}
                >
                    Sign Out
                </SignOutButton>
            </>
        ) : (
            navLinks.map(({ name, path }) => (
                name === 'Sign In' ? (
                    <NavLink
                        key={name}
                        onClick={toggleModal}
                        active={activeLink === name}
                    >
                        {name}
                    </NavLink>
                ) : (
                    <Link key={name} href={path} passHref>
                        <NavLink
                            active={activeLink === name}
                        >
                            {name}
                        </NavLink>
                    </Link>
                )
            ))
        );
    };

    const renderMobileNavLinks = () => {
        return isSignedIn ? (
            <>
                {extraComponents}
                {loggedInNavLinks.map(({ name, path }) => (
                    <Link key={name} href={path} passHref>
                        <MobileNavLink
                            active={activeLink === name}
                        >
                            {name}
                        </MobileNavLink>
                    </Link>
                ))}
                <MobileSignOutButton
                    href="#"
                    onClick={(e) => {
                        handleSignOut(e);
                        handleNavLinkClick();
                    }}
                    className={activeLink === 'Sign Out' ? 'active' : ''}
                >
                    Sign Out
                </MobileSignOutButton>
            </>
        ) : (
            navLinks.map(({ name, path }) => (
                name === 'Sign In' ? (
                    <MobileNavLink
                        key={name}
                        onClick={() => {
                            toggleModal();
                            handleNavLinkClick();
                        }}
                        active={activeLink === name}
                    >
                        {name}
                    </MobileNavLink>
                ) : (
                    <Link key={name} href={path} passHref>
                        <MobileNavLink
                            active={activeLink === name}
                            onClick={handleNavLinkClick}
                        >
                            {name}
                        </MobileNavLink>
                    </Link>
                )
            ))
        );
    };

    // prevent mismatch
    if (!mounted) return null;

    return (
        <>
            <NavbarContainer>
                <Brand>
                    <Link href="/" passHref>
                        <img
                            src="/logo.png"
                            alt="PL8M8 Logo"
                            draggable={false}
                            style={{ cursor: 'pointer', userSelect: "none" }}
                        />
                    </Link>
                </Brand>
                <NavLinks>
                    {renderDesktopNavLinks()}
                </NavLinks>
                <HamburgerButton onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? '✕' : '☰'}
                </HamburgerButton>
            </NavbarContainer>

            <MobileMenu isOpen={isMobileMenuOpen}>
                {renderMobileNavLinks()}
            </MobileMenu>

            {isModalOpen && (
                <ModalOverlay onClick={toggleModal}>
                    <Modal onClick={(e) => e.stopPropagation()}>
                        <FormWrapper>
                            <h1 style={{ textAlign: 'center', width: '100%', color: "orange" }}>
                                {otpSent ? 'Enter Verification Code' : 'Sign In'}
                            </h1>
                            
                            {message && (
                                <Message error={isError}>
                                    {message}
                                </Message>
                            )}

                            {!otpSent ? (
                                <form onSubmit={sendOtp}>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? 'Sending...' : 'Send Verification Code'}
                                    </Button>
                                </form>
                            ) : (
                                <form onSubmit={verifyOtp}>
                                    <p style={{ marginBottom: '20px', color: '#666' }}>
                                        We sent a verification code to <strong>{email}</strong>
                                    </p>
                                    <Input
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength="6"
                                        required
                                        disabled={isLoading}
                                    />
                                    <Button type="submit" disabled={isLoading || otp.length !== 6}>
                                        {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                                    </Button>
                                    <BackButton type="button" onClick={goBack}>
                                        ← Use different email
                                    </BackButton>
                                </form>
                            )}
                        </FormWrapper>
                    </Modal>
                </ModalOverlay>
            )}
        </>
    );
};

export default Navbar;