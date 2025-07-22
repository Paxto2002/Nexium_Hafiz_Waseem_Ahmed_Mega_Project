// lib/supabase/client.js
// This file sets up the Supabase client for client-side operations (Browser).

import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates and returns a Supabase client instance configured for browser-side operations.
 * This client is used for all Supabase interactions within client components.
 *
 * @returns {object} The Supabase client instance.
 */
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

/**
 * Checks if a user profile exists in the 'user_profiles' table for a given email.
 * This is useful for providing better UX during sign-up/sign-in flows.
 *
 * @param {string} email The email address to check.
 * @returns {Promise<boolean>} True if a user profile exists, false otherwise.
 */
export const checkUserExists = async (email) => {
  const supabase = createClient(); // Get a client instance
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("user_id")
      .eq("email", email)
      .single(); // Use .single() if you expect at most one result

    // Supabase returns an error with code 'PGRST116' (No rows found) if no matching record is found.
    // We only want to log other types of errors.
    if (error && error.code !== "PGRST116") {
      console.error("Error checking user existence:", error);
      return false; // Treat other errors as user not existing or a problem
    }

    // If data exists, it means a profile was found.
    // If error.code is PGRST116, data will be null, so !!data correctly returns false.
    return !!data;
  } catch (e) {
    console.error("Exception during user existence check:", e);
    return false;
  }
};
