import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Helper function to check if user exists
export async function checkUserExists(email) {
  try {
    const supabase = createClient();

    // Try to get user by email from auth.users (requires service role key in production)
    // For now, we'll use a workaround by attempting a sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: "dummy_password_for_check",
    });

    // If error is "Invalid login credentials", user exists but password is wrong
    // If error is "Email not confirmed", user exists but not confirmed
    // If error is "User not found" or similar, user doesn't exist

    if (error) {
      const userNotFoundMessages = [
        "Invalid login credentials",
        "Email not confirmed",
        "User not found",
      ];

      // If it's invalid credentials or email not confirmed, user likely exists
      if (
        error.message.includes("Invalid login credentials") ||
        error.message.includes("Email not confirmed")
      ) {
        return true;
      }

      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking user existence:", error);
    return false; // Default to treating as new user
  }
}
