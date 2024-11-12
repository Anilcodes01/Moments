// app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import  {authOptions}  from '@/app/lib/authOptions'; // Adjust the import path if needed

export async function middleware(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Define restricted paths when not logged in
  const restrictedPaths = ['/dashboard', '/profile', '/settings'];

  // Check if the path requires authentication
  const isRestrictedPath = restrictedPaths.some((path) => req.nextUrl.pathname.startsWith(path));

  // Redirect to `/info` if not authenticated and trying to access a restricted page
  if (!session && isRestrictedPath) {
    return NextResponse.redirect(new URL('/info', req.url));
  }

  // Allow access if logged in or accessing public pages
  return NextResponse.next();
}

// Enable the middleware for all routes except `/info`
export const config = {
  matcher: ['/((?!info).*)'],
};
