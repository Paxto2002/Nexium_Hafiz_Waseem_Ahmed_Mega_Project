import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        async get(name) {
          return (await cookieStore).get(name)?.value;
        },
        async set(name, value, options) {
          try {
            (await cookieStore).set({
              name,
              value,
              ...options,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
            });
          } catch (error) {
            console.error("Cookie set error:", error);
          }
        },
        async remove(name, options) {
          try {
            (await cookieStore).set({
              name,
              value: "",
              ...options,
              expires: new Date(0),
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
            });
          } catch (error) {
            console.error("Cookie remove error:", error);
          }
        },
      },
    }
  );
}
