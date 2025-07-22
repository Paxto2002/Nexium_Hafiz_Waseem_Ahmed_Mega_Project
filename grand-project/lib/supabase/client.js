// lib/supabase/client.js
import { createBrowserClient } from "@supabase/ssr"; // Or just 'supabase/supabase-js'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
