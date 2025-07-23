// lib/supabase/auth-utils.js
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: async (key) => (await cookieStore).get(key)?.value,
        set: async (key, value, options) => {
          try {
            (await cookieStore).set({ name: key, value, ...options });
          } catch (e) {
            console.error("Error setting cookie:", e);
          }
        },
        remove: async (key, options) => {
          try {
            (await cookieStore).set({ name: key, value: "", ...options });
          } catch (e) {
            console.error("Error removing cookie:", e);
          }
        },
      },
    }
  );
}
