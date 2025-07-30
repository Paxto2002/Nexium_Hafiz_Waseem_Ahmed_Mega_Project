"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;
        if (!session) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        setUser({
          ...session.user,
          name:
            profile?.name ||
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "Chef",
          profile: profile,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        setUser({
          ...session.user,
          name:
            profile?.name ||
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "Chef",
          profile: profile,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, [supabase]);

  return { user, loading };
}
