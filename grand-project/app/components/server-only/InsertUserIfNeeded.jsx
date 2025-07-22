"use server";

import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function InsertUserIfNeeded() {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: existingProfile } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!existingProfile) {
    await supabase.from("user_profiles").insert([
      {
        user_id: user.id,
        email: user.email,
        name: user.user_metadata?.name || "Anonymous", // You can customize this
      },
    ]);
  }

  return null;
}