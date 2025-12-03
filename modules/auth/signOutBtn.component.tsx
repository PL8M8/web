"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function SignOutButton() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        };

        getSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
        });

        return () => {
        listener.subscription.unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace("/"); 
    };

    // Only render the button if the user is logged in
    if (!user) return null;

    return (
        <button onClick={handleSignOut}>
        Sign Out
        </button>
    );
}
