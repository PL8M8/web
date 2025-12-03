import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_ROUTES = ["/", "/signin", "/signin/otp"];

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => {
                    return req.cookies.getAll().map((c: { name: string; value: string }) => ({
                        name: c.name,
                        value: c.value,
                    }));
                },
                setAll: (cookies) => {
                    cookies.forEach(({ name, value, options }) => {
                        res.cookies.set(name, value, options);
                    });
                }
            }
        }
    );

    const { 
        data: { session }, 
    } = await supabase.auth.getSession();

    const pathname = req.nextUrl.pathname;
    
    // Check if route is public
    const isPublic = PUBLIC_ROUTES.includes(pathname);
    
    // Check if it's a profile page (format: /[username])
    // Matches any route like /username but not /signin or other multi-segment routes
    const isProfilePage = /^\/[a-zA-Z0-9_-]+$/.test(pathname) && !PUBLIC_ROUTES.includes(pathname);

    // Allow access to public routes and profile pages without auth
    if (!session?.user && !isPublic && !isProfilePage) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    // Redirect authenticated users away from signin pages to their profile
    if (session?.user && (pathname === "/signin" || pathname === "/signin/otp")) {
        try {
            // Fetch user's username from database
            const { data: profile, error } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", session.user.id)
                .single();
            
            if (profile?.username) {
                return NextResponse.redirect(new URL(`/${profile.username}`, req.url));
            }
            
            // If no profile found, redirect to home page
            console.error("No profile found for user:", session.user.id, error);
            return NextResponse.redirect(new URL("/", req.url));
        } catch (err) {
            console.error("Error fetching profile in middleware:", err);
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return res;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};