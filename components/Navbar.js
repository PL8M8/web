// components/Navbar.js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
    const router = useRouter();
    const [activeLink, setActiveLink] = useState('Home');

    // Define your links directly in the component
    const navLinks = [
        // { name: 'Home', path: '/' },
        // { name: 'Early Access', path: '/beta' },
        // { name: 'Support', path: '/contact' },
        // { name: 'Android Waitlist', path: '/waitlist' },
        // { name: 'About Us', path: '/about' },
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
            <div className="brand">
                <img src="/logo.png" alt="Netlify Logo" />
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
