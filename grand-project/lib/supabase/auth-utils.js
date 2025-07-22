import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key) => cookieStore.get(key)?.value,
        set: (key, value, options) => {
          // Not supported in edge runtime
          // Should only be used in server actions or route handlers
        },
        remove: (key, options) => {
          // Not supported in edge runtime
        },
      },
    }
  );
}
