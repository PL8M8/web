import { NextResponse } from 'next/server';

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    
    // Define protected routes (routes that need authentication)
    const protectedRoutes = ['/garage', '/settings', '/vehicle', '/garage'];
    
    // Check if current path is protected
    const isProtectedRoute = protectedRoutes.some(route => 
        pathname.startsWith(route)
    );
    
    // If it's not a protected route, let it through
    if (!isProtectedRoute) {
        return NextResponse.next();
    }
    
    // Check for session cookie (Supabase stores auth in cookies)
    const authToken = request.cookies.get('sb-access-token') || request.cookies.get('supabase-auth-token') || request.cookies.get('sb-localhost-auth-token');
    
    // If no auth token on protected route, redirect to home
    if (!authToken) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }
    
    // Let the request through
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};