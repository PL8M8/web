import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '@utils/supabase';

const Navbar = () => {
    const router = useRouter();
    const [activeLink, setActiveLink] = useState('Home');
    const [isSignedIn, setIsSignedIn] = useState(false);

    const navLinks = [
        { name: 'Buy & Sell', path: '/marketplace' },
        { name: 'Case Study 001', path: '/survey'},
        { name: 'Add Your Service', path: '/add-service'},
        { name: 'Sign In', path: '/signin' },
        // { name: 'Early Access', path: '/beta' },
        // { name: 'Support', path: '/contact' },
        // { name: 'Android Waitlist', path: '/waitlist' },
        // { name: 'About Us', path: '/about' },
    ];

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
        router.push('/'); // Redirect to home after sign out
    };

    return (
        <nav className="navbar">
            {/* Logo navigates to Home */}
            <div className="brand">
                <Link href="/" passHref>
                    <img
                        src="/logo.png"
                        alt="PL8M8 Logo"
                        style={{ cursor: 'pointer' }}
                    />
                </Link>
            </div>
            <div className="nav-links">
                {isSignedIn ? (
                    <a
                        href="#"
                        onClick={handleSignOut}
                        className={activeLink === 'Sign Out' ? 'active' : ''}
                        style={{ cursor: 'pointer' }}
                    >
                        Sign Out
                    </a>
                ) : (
                    navLinks.map(({ name, path }) => (
                        <Link key={name} href={path} passHref>
                            <span
                                className={activeLink === name ? 'active' : ''}
                                style={{ cursor: 'pointer' }}
                            >
                                {name}
                            </span>
                        </Link>
                    ))
                )}
            </div>
        </nav>
    );
};

export default Navbar;
