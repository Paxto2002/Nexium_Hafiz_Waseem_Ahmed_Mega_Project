'use client'; // Add this for client-side interactivity

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [recipeCount, setRecipeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      // Get current user
      const { 
        data: { user }, 
        error: userError 
      } = await supabase.auth.getUser();

      if (!user || userError) {
        router.push('/signin');
        return;
      }

      setUser(user);

      // Get profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProfile(profileData || {});

      // Get recipe count
      const { count } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setRecipeCount(count || 0);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">👤 Profile</h1>

      <div className="bg-white p-4 rounded-md shadow">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Name:</strong> {profile?.name || "Not set"}</p>
        <p><strong>Joined:</strong> {new Date(user.created_at).toDateString()}</p>
      </div>

      <div className="bg-white p-4 rounded-md shadow">
        <p><strong>📊 Recipes Generated:</strong> {recipeCount}</p>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => router.push('/dashboard/profile/edit')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Edit Profile
        </button>
        <button 
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            router.push('/signin');
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}