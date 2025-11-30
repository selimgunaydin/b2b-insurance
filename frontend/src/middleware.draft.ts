import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret');

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value; // Or from Authorization header if you store it there
    // Note: In this app, we might be storing token in localStorage, which middleware can't access directly.
    // If we want middleware protection, we MUST store token in cookies or rely on client-side checks + backend protection.
    // Let's assume for "strict security" we should move to cookies or at least have a client-side wrapper.
    // BUT, changing to cookies now might break the current auth flow which uses localStorage.

    // ALTERNATIVE: For now, since we are using localStorage, we can't do true server-side middleware protection 
    // without moving the token to cookies. 
    // However, the user asked for "strict security". 
    // I will implement a client-side "AuthGuard" component for now to avoid refactoring the entire auth system 
    // to cookies in this step, BUT I will add a note that middleware is preferred.

    // WAIT: If I can't read localStorage in middleware, I can't protect routes server-side.
    // Let's stick to the current pattern but enforce it strictly in Layouts/Components.
    // OR, better: The "strict security" implies we SHOULD use cookies.

    // Let's try to read from cookie. If the previous dev put it in localStorage, I might need to change login to set a cookie too.
    // Let's check the Login page again.

    return NextResponse.next();
}

// See below for the actual plan.
