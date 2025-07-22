// lib/supabase/server.js
// This file sets up the Supabase client for Server Components and Server Actions.
// It uses the 'cookies' helper from 'next/headers' to access request cookies.

import { createServerClient as createClientSSR } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates and returns a Supabase client instance configured for server-side operations.
 * This client can access and set cookies within the server environment.
 * It automatically retrieves cookies using `next/headers`.
 *
 * @returns {object} The Supabase client instance.
 */
export const createSupabaseServerClient = () => {
  // Get the cookie store from Next.js headers. This must be called inside
  // a Server Component or Server Action.
  const cookieStore = cookies();

  return createClientSSR(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // Getter for cookies, used by Supabase to read session tokens.
        get: (name) => cookieStore.get(name)?.value,
        // Setter for cookies, used by Supabase to update session tokens.
        // Wrapped in a try-catch to handle cases where cookies() might not be
        // available (e.g., during static generation or certain build phases).
        set: (name, value, options) => {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (e) {
            console.warn("Could not set cookie in server component:", e);
          }
        },
        // Remover for cookies.
        remove: (name, options) => {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (e) {
            console.warn("Could not remove cookie in server component:", e);
          }
        },
      },
    }
  );
};
