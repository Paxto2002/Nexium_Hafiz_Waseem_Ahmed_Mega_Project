// lib/supabase/client.js
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

export const checkUserExists = async (email) => {
  const supabase = createClient();
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.admin.getUserByEmail(email);
    if (error && error.message.includes("User not found")) {
      return false;
    }
    return !!user;
  } catch (error) {
    console.error("Error checking user:", error);
    return false;
  }
};
