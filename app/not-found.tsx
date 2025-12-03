"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

interface Profile {
    id: string;
    username: string;
}

export default function NotFound() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfiles() {
            try {
                const { data, error } = await supabase
                .from("profiles")
                .select("id, username")
                .order("username", { ascending: true });

                if (error) throw error;
                setProfiles(data || []);
            } catch (err) {
                console.error("Failed to load profiles:", err);
            } finally {
                setLoading(false);
            }
        }

        loadProfiles();
    }, []);

    return (
        <div>
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>

        {loading ? (
            <p>Loading profiles...</p>
        ) : profiles.length === 0 ? (
            <p>No profiles found.</p>
        ) : (
            <div>
            <h2>Available Profiles ({profiles.length})</h2>
            <ul>
                {profiles.map((profile) => (
                <li key={profile.id}>
                    <Link href={`/${profile.username}`}>
                    /{profile.username}
                    </Link>
                </li>
                ))}
            </ul>
            </div>
        )}

        <Link href="/">Go back home</Link>
        </div>
    );
}