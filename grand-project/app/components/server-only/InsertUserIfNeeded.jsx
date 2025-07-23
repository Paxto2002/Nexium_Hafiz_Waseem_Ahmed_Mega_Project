'use server'

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from 'next/navigation'

export async function ensureUserProfile() {
  const cookieStore = cookies()
  const supabase = await createSupabaseServerClient(cookieStore)

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect('/signin')
  }

  // Check if profile exists
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (profileError && profileError.code !== 'PGRST116') {
    console.error('Error checking profile:', profileError)
    return null
  }

  if (!profile) {
    // Create new profile
    const { error: insertError } = await supabase
      .from('user_profiles')
      .insert([{
        user_id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email.split('@')[0],
        created_at: new Date().toISOString()
      }])

    if (insertError) {
      console.error('Error creating profile:', insertError)
      return null
    }
  }

  return user
}