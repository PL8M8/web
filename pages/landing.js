import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from 'config/supabase';

export default function Index() {
    const router = useRouter();

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

    return (
        <div className="page">
            <div className="background" />
            <main className="main-content">
                <section>
                    <div className="intro">
                        <h1>Your Garage, Simplified.</h1>
                    </div>
                    <div className="description">
                        <p>
                            Keep all your car info in one spot! Easily track mileage, registration, and photos. Plus,
                            enjoy:
                        </p>
                        <ul>
                            <li>Friendly reminders to update your mileage</li>
                            <li>Never forget your tag number or important details</li>
                            <li>Quick access to all your vehicle info</li>
                        </ul>
                        <div className="survey-button">
                            <Link href="/survey" passHref>
                                Take the Survey
                            </Link>
                        </div>
                    </div>
                </section>
                <section>
                    <img className="screenshot" src="/screenshot.png" alt="app screenshot" />
                </section>
            </main>
        </div>
    );
}
