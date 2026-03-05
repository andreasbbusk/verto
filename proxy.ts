import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  DEMO_EMBED_START_PATH,
  DEMO_SESSION_COOKIE,
} from "@/modules/server/demo/constants";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasDemoSession = request.cookies.get(DEMO_SESSION_COOKIE)?.value === "1";
  const fetchDest = request.headers.get("sec-fetch-dest");
  const isTopLevelDocumentNav = fetchDest === "document";
  const shouldClearDemoSession =
    hasDemoSession && isTopLevelDocumentNav && pathname !== "/demo/embed";
  const isDemoSessionActive = hasDemoSession && !shouldClearDemoSession;

  if (shouldClearDemoSession) {
    // Keep direct visits on real auth flow, even if a demo cookie exists.
    request.cookies.delete(DEMO_SESSION_COOKIE);
  }

  const applyDemoCookieCleanup = (response: NextResponse) => {
    if (shouldClearDemoSession) {
      response.cookies.set(DEMO_SESSION_COOKIE, "", {
        path: "/",
        httpOnly: true,
        maxAge: 0,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
    }

    return response;
  };

  const protectedRoutes = [
    "/dashboard",
    "/sets",
    "/cards",
    "/study",
    "/calendar",
    "/settings",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (pathname === "/demo/embed") {
    const demoRedirect = NextResponse.redirect(
      new URL(DEMO_EMBED_START_PATH, request.url)
    );
    demoRedirect.cookies.set(DEMO_SESSION_COOKIE, "1", {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return demoRedirect;
  }

  if ((pathname === "/" || isAuthRoute) && isDemoSessionActive) {
    return applyDemoCookieCleanup(
      NextResponse.redirect(new URL("/dashboard", request.url))
    );
  }

  if (isProtectedRoute && isDemoSessionActive) {
    return applyDemoCookieCleanup(NextResponse.next({ request }));
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return applyDemoCookieCleanup(
      NextResponse.redirect(new URL("/login", request.url))
    );
  }

  // Redirect authenticated users away from auth pages and landing
  if ((pathname === "/" || isAuthRoute) && isAuthenticated) {
    return applyDemoCookieCleanup(
      NextResponse.redirect(new URL("/dashboard", request.url))
    );
  }

  return applyDemoCookieCleanup(supabaseResponse);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
