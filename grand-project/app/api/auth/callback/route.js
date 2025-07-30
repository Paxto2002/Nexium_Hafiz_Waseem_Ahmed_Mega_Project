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
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(
      code
    );
    if (sessionError) {
      console.error("Auth error:", sessionError);
      return NextResponse.redirect(
        `${requestUrl.origin}/signin?error=auth_failed`
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User fetch error:", userError);
      return NextResponse.redirect(
        `${requestUrl.origin}/signin?error=missing_user`
      );
    }

    // Get name from metadata or fallback to email prefix
    const metadataName = user.user_metadata?.name?.trim();
    const fallbackName = user.email?.split("@")[0] || "Chef";
    const preferredName = metadataName || fallbackName;

    // Upsert user profile with the name
    const { error: profileError } = await supabase.from("user_profiles").upsert(
      {
        id: user.id,
        user_id: user.id,
        email: user.email,
        name: preferredName,
        created_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

    if (profileError) {
      console.error("Profile upsert error:", profileError);
    }

    return response;
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.redirect(
      `${requestUrl.origin}/signin?error=server_error`
    );
  }
}
