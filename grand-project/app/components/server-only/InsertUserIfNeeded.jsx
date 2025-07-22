// app/components/server-only/InsertUserIfNeeded.jsx
// This is a Server Component responsible for ensuring a user profile exists in the database.
// It runs on the server and does not interact with client-side state or routing.

"use server";

// Import the correct server-side Supabase client wrapper.
// This function internally handles getting cookies from next/headers.
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * InsertUserIfNeeded component.
 * This component runs on the server to check if the currently authenticated user
 * has an existing profile in the 'user_profiles' table. If not, it creates one.
 * It returns null as it doesn't render any UI directly.
 */
export default async function InsertUserIfNeeded() {
  // Await the creation of the Supabase client for server-side operations.
  // This is crucial because createSupabaseServerClient internally calls cookies(),
  // which Next.js requires to be awaited in an async context during render.
  const supabase = await createSupabaseServerClient();

  // Get the current user session from Supabase.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user is authenticated, there's nothing to do, so return null.
  if (!user) {
    return null;
  }

  // Check if a profile already exists for the current user.
  const { data: existingProfile, error: profileError } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  // Handle potential errors during profile fetch, excluding "No rows found"
  if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means "No rows found"
    console.error("Error fetching user profile:", profileError);
    // In a real application, you might want to log this to a monitoring service
    // or trigger an alert, but for UI, we just continue.
  }

  // If no existing profile is found (data is null and no other error), create one.
  if (!existingProfile) {
    const { error: insertError } = await supabase.from("user_profiles").insert([
      {
        user_id: user.id,
        email: user.email,
        name: user.user_metadata?.name || "Anonymous", // Use user_metadata.name if available
      },
    ]);

    if (insertError) {
      console.error("Error inserting user profile:", insertError);
      // Log this error, but the component still returns null for rendering.
    }
  }

  // This component does not render any UI.
  return null;
}
