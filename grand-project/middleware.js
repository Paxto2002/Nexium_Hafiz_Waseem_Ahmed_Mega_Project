import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/signin", "/signup"];

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client with proper cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
          response.cookies.set({
            name,
            value,
            ...options,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        },
        remove(name, options) {
          request.cookies.set({
            name,
            value: "",
            ...options,
            expires: new Date(0),
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
            expires: new Date(0),
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        },
      },
    }
  );

  // Check authentication status
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Remove the root redirect to prevent loops
  if (request.nextUrl.pathname === "/") {
    return response; // Allow direct access to home page
  }

  // Route protection logic
  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    if (!user) {
      // Store original path for redirect after login
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Prevent authenticated users from accessing auth pages
  if (authRoutes.includes(request.nextUrl.pathname)) {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return response; // Allow access to auth pages for unauthenticated users
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
