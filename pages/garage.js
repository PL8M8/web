import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@utils/supabase';
import Navbar from '@components/Navbar';

const Garage = () => {
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // Redirect to '/' if the user is not signed in
                router.push('/');
            }
        };

        checkSession();
    }, [router]);

    return (
        <div className="page">
            <Navbar />
            <div className='background'/>
            <div>Your new garage</div>
        </div>
    );
};

export default Garage;
