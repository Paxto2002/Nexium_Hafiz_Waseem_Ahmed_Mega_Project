// lib/supabase/server.js
import { createServerClient as createServerClientOriginal } from "@supabase/ssr"; // Import the original
import { cookies } from "next/headers";

// This function acts as a wrapper around the original createServerClient
// ensuring it's configured for server components/actions.
export const createServerClient = (cookieStore) => {
  return createServerClientOriginal(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => cookieStore.set(name, value, options),
        remove: (name, options) => cookieStore.set(name, "", options),
      },
    }
  );
};
