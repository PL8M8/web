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

    &:hover {
        background-color: darkorange;
    }
`;

const SwitchButton = styled.button`
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

const Navbar = ({ extraComponents }) => {
    const router = useRouter();
    const [activeLink, setActiveLink] = useState('Home');
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false); // 👈 Hydration Fix

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'Buy & Sell', path: '/' },
        { name: 'Case Study 001', path: '/survey'},
        { name: 'Add Your Service', path: '/add-service'},
        { name: 'Sign In', path: '#' },
    ];

    const loggedInNavLinks = [ 
        { name: 'Buy & Sell', path: '/' },
        { name: 'Garage', path: '/garage' },
        { name: 'Settings', path: '/settings' },
    ]

    const handleAuth = async (e) => {
        e.preventDefault();
        setMessage('');

        if (isSigningUp) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: { emailRedirectTo: `${window.location.origin}/welcome` },
            });
        
            if (error) {
                setMessage(`Error: ${error.message}`);
            } else {
                setMessage('Sign-up successful! Check your email for confirmation.');
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
        
            if (error) {
                setMessage(`Error: ${error.message}`);
            } else {
                setMessage('Sign-in successful! Redirecting...');
                setIsModalOpen(false);
                await router.replace('/garage');
            }
        }
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
        const currentPath = router.pathname;
        const active = navLinks.some(link => link.path === currentPath)
            ? navLinks.find(link => link.path === currentPath).name
            : 'Home';
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
                                {isSigningUp ? 'Sign Up' : 'Sign In'}
                            </h1>
                            {message && <p>{message}</p>}
                            <form onSubmit={handleAuth}>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Button type="submit">{isSigningUp ? 'Sign Up' : 'Sign In'}</Button>
                            </form>
                            <SwitchButton onClick={() => setIsSigningUp(!isSigningUp)}>
                                {isSigningUp
                                    ? 'Already have an account? Sign In'
                                    : "Don't have an account? Sign Up"}
                            </SwitchButton>
                        </FormWrapper>
                    </Modal>
                </ModalOverlay>
            )}
        </>
    );
};

export default Navbar;