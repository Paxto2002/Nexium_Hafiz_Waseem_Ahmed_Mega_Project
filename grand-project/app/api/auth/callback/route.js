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

  // Create redirect response first
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
    // Exchange code for session
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(
      code
    );
    if (sessionError) {
      console.error("Auth error:", sessionError);
      return NextResponse.redirect(
        `${requestUrl.origin}/signin?error=auth_failed`
      );
    }

    // Fetch authenticated user
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
    const fallbackName = user.email.split("@")[0];
    const metadataName = user.user_metadata?.name?.trim();
    const preferredName = metadataName || fallbackName;

    // Check if user profile already exists
    const { data: existingProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("name")
      .eq("user_id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116 = no rows found, that's OK
      console.error("Profile fetch error:", profileError);
    }

    // If profile doesn't exist or name is empty, insert or update it
    await supabase.from("user_profiles").upsert(
      {
        user_id: user.id,
        email: user.email,
        name: existingProfile?.name?.trim()
          ? existingProfile.name
          : preferredName,
      },
      {
        onConflict: "user_id",
      }
    );

    return response;
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.redirect(
      `${requestUrl.origin}/signin?error=server_error`
    );
  }
}
