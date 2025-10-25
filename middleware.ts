import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session token from cookies
  const sessionToken = request.cookies.get("authjs.session-token") ||
                       request.cookies.get("__Secure-authjs.session-token");

  const isAuthenticated = !!sessionToken;

  const protectedRoutes = ["/dashboard", "/sets", "/cards", "/study", "/calendar", "/settings"];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from auth pages and landing
  if ((pathname === "/" || isAuthRoute) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
