import { createClient } from "@/lib/supabase/client";

export async function signInWithEmail(email) {
  const supabase = createClient();

  // First try to sign in
  const { error: signInError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/api/auth/callback`,
    },
  });

  // If no account exists, sign up instead
  if (signInError?.message.includes("No user found")) {
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (signUpError) {
      throw signUpError;
    }
    return { isNewUser: true };
  }

  if (signInError) {
    throw signInError;
  }

  return { isNewUser: false };
}
