import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle case where cookies can't be set (e.g., in Server Components)
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Handle case where cookies can't be removed
          }
        },
      },
    }
  );
}

// Helper function to get user on server side
export async function getServerUser() {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error getting server user:", error);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Server user fetch error:", error);
    return null;
  }
}

// Helper function to create user profile
export async function createUserProfile(user) {
  try {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email.split("@")[0],
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating user profile:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Create user profile error:", error);
    return null;
  }
}
