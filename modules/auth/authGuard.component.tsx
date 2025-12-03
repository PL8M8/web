"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

const PUBLIC_ROUTES = ["/", "/signin"];

const isPublicRoute = (path: string) =>
    PUBLIC_ROUTES.some((route) => path === route || path.startsWith(route));

    export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    // Unified redirect logic
    const handleRedirect = (user: any) => {
        if (!user && !isPublicRoute(pathname)) router.replace("/signin");
        if (user && isPublicRoute(pathname)) router.replace("/listings");
    };

    useEffect(() => {
        const init = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        handleRedirect(session?.user);
        setLoading(false);
        };

        init();

        // Subscribe to auth state changes
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        handleRedirect(session?.user);
        });

        return () => listener.subscription.unsubscribe();
    }, [pathname, router]);

    if (loading) return <div>Loading…</div>;

    return <>{children}</>;
}
