import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@utils/supabase';

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
        <div>
            <h1>Welcome to Your Garage</h1>
            <p>Manage your car details here!</p>
        </div>
    );
};

export default Garage;
