// app/page.jsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import HomeClient from '@/components/HomeClient';

export default async function HomePage() {
  const cookieStore = cookies();
  const supabase = await createSupabaseServerClient(cookieStore);

  // You can still use session if needed, just don't redirect
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return <HomeClient />;
}
