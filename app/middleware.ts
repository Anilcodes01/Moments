import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

export async function middleware(req: NextRequest) {
  const session = await getServerSession(authOptions);

  const restrictedPaths = ["/dashboard", "/profile", "/settings"];

  const isRestrictedPath = restrictedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!session && isRestrictedPath) {
    return NextResponse.redirect(new URL("/info", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!info).*)"],
};
