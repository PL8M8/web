// components/Navbar.js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
    const router = useRouter();
    const [activeLink, setActiveLink] = useState('Home');

    // Define your links directly in the component
    const navLinks = [
        { name: 'Sign In', path: '/signin' },
    ];

    useEffect(() => {
        const currentPath = router.pathname;
        const active = navLinks.some(link => link.path === currentPath)
            ? navLinks.find(link => link.path === currentPath).name
            : 'Home';
        setActiveLink(active);
    }, [router.pathname, navLinks]);

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
                {navLinks.map(({ name, path }) => (
                    <Link key={name} href={path} passHref>
                        <span
                            className={activeLink === name ? 'active' : ''}
                            style={{ cursor: 'pointer' }}
                        >
                            {name}
                        </span>
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
