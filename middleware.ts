import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/modules/server/auth";

// Define protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/sets",
  "/cards",
  "/study",
  "/calendar",
  "/settings",
];

// Define public routes that should redirect to dashboard if authenticated
const publicRoutes = ["/", "/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API route protection in middleware - let API routes handle their own auth
  // This is because JWT verification doesn't work reliably in edge runtime

  // For page routes, we rely on client-side ProtectedRoute component
  // This allows for proper hydration and user experience
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
