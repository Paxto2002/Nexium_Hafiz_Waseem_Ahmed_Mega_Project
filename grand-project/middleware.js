import { NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/ssr";

export async function middleware(req) {
  const res = NextResponse.next();

  const supabase = createMiddlewareSupabaseClient({ req, res });

  await supabase.auth.getSession(); // Keeps session alive

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], // Protect these routes
};
