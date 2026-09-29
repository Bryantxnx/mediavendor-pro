import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login)
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow /admin/login through
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Allow admin auth API through (needed for login POST/DELETE)
  if (pathname.startsWith("/api/admin/auth")) {
    return NextResponse.next();
  }

  // Check for admin session cookie
  const session = request.cookies.get("admin_session");

  if (!session?.value) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
