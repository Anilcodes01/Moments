import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions'; 

export async function middleware(req: Request) {
  const session = await getServerSession(authOptions);

  
  if (!session) {
    const url = new URL('/auth/login', req.url); 
    return NextResponse.redirect(url);
  }

  
  return NextResponse.next();
}


export const config = {
  matcher: ['/moments/*',, '/', '/profile/*'], 
};
