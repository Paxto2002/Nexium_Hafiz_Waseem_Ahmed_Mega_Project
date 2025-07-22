import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = "https://gqwujwwjfmndahpqoear.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxd3Vqd3dqZm1uZGFocHFvZWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MDQ1MzgsImV4cCI6MjA2NzI4MDUzOH0.eBGhmGbUGxn7325eBITeFzqVneJvkHNxy3oC014iAHY";

const protectedRoutes = ["/app/dashboard"]; // Changed to match your actual route

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  const isProtected = protectedRoutes.some((route) => path.startsWith(route));
  if (!isProtected) return NextResponse.next();

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name) {
        return req.cookies.get(name)?.value;
      },
      set(name, value, options) {
        req.cookies.set({
          name,
          value,
          ...options,
        });
        return NextResponse.next({
          request: {
            headers: req.headers,
          },
        });
      },
      remove(name, options) {
        req.cookies.set({
          name,
          value: "",
          ...options,
        });
        return NextResponse.next({
          request: {
            headers: req.headers,
          },
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // If user is logged in and trying to access root, redirect to dashboard
  if (path === "/") {
    url.pathname = "/app/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/app/dashboard/:path*"],
};
