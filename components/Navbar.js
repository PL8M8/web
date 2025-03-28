import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { supabase } from 'config/supabase';


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

const HamburgerButton = styled.button`
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    
    @media (max-width: 768px) {
        display: block;
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
                await router.replace('/garage')
            }
        }
        };
    

    useEffect(() => {
        // Check authentication state
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsSignedIn(!!session);

            // Redirect signed-out users to '/'
            if (!session && router.pathname === '/garage') {
                router.push('/');
            }
        };

        checkSession();

        // Listen for changes in authentication state
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

    const handleSignOut = async (e) => {
        e.preventDefault();
        await supabase.auth.signOut();
        setIsSignedIn(false);
        router.push('/'); 
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen); 
    };

    return (
        <>
            <nav className="navbar">
                <div className="brand">
                    <Link href="/" passHref>
                        <img
                            src="/logo.png"
                            alt="PL8M8 Logo"
                            draggable={false}
                            style={{ cursor: 'pointer', userSelect: "none" }}
                        />
                    </Link>
                </div>
                <div className="nav-links">
                    {isSignedIn ? (
                        <>
                            {extraComponents}
                            <a
                                href="#"
                                onClick={handleSignOut}
                                className={activeLink === 'Sign Out' ? 'active' : ''}
                                style={{ backgroundColor: 'red', cursor: 'pointer', border: "2px solid red", borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: "#fff", padding: '5px 20px' }}
                            >
                                Sign Out
                            </a>
                        </>
                    ) : (
                        navLinks.map(({ name, path }) => (
                            name === 'Sign In' ? (
                                <span
                                    key={name}
                                    onClick={toggleModal}
                                    className={activeLink === name ? 'active' : ''}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {name}
                                </span>
                            ) : (
                                <Link key={name} href={path} passHref>
                                    <span
                                        className={activeLink === name ? 'active' : ''}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {name}
                                    </span>
                                </Link>
                            )
                        ))
                    )}
                </div>
                {/* <HamburgerButton onClick={toggleMobileMenu} className="hamburger-button">
                    {isMobileMenuOpen ? '✕' : '☰'}
                </HamburgerButton> */}
            </nav>

            {/* Modal for Sign Up */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={toggleModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
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
                        {/* <button onClick={toggleModal}>Close</button> */}
                    </div>
                </div>
            )}

            <style jsx>{`
                .modal-overlay {
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
                }

                .modal {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 400px;
                    width: 100%;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .modal h2 {
                    margin-top: 0;
                }

                .modal button {
                    margin-top: 10px;
                    padding: 10px 15px;
                    background: #0070f3;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .modal button:hover {
                    background: #005bb5;
                }
            `}</style>
        </>
    );
};

export default Navbar;