// app/api/auth/callback/route.js
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      `${requestUrl.origin}/signin?error=missing_code`
    );
  }

  // Create a redirect response first
  const redirectTo = new URL(`${requestUrl.origin}/dashboard`);
  const response = NextResponse.redirect(redirectTo);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookies().get(name)?.value;
        },
        set(name, value, options) {
          // Set cookie on both the request and response
          cookies().set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          cookies().set({ name, value: "", ...options });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Auth error:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/signin?error=auth_failed`
      );
    }

    // Create/update user profile
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("user_profiles").upsert(
      {
        user_id: user.id,
        email: user.email,
      },
      { onConflict: "user_id" }
    );

    return response;
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.redirect(
      `${requestUrl.origin}/signin?error=server_error`
    );
  }
}
