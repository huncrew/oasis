import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/onboarding(.*)',
]);

export default clerkMiddleware(
  (auth, req) => {
    const authObj = auth();

    console.log('authObj:', authObj);

    if (isProtectedRoute(req)) {
      const signInUrl = new URL('/sign-in', req.url);

      authObj.protect({
        unauthenticatedUrl: signInUrl.toString(),
      });
    }

    return NextResponse.next();
  },
  {
    secretKey: process.env.CLERK_SECRET_KEY,
  }
);

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
