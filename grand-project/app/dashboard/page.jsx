'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeForm } from "@/components/RecipeForm";
import { RecipeLoader } from "@/components/RecipeLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [showForm, setShowForm] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [username, setUsername] = useState("Chef");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push('/signin');
        return;
      }

      const userId = session.user.id;
      const nameFromSignup = session.user.user_metadata?.name;
      fetchRecipes(userId);

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('name')
        .eq('user_id', userId)
        .single();

      if (!profile && nameFromSignup) {
        await supabase.from('user_profiles').insert({
          user_id: userId,
          email: session.user.email,
          name: nameFromSignup,
        });

        setUsername(nameFromSignup);
      } else if (profile?.name) {
        setUsername(profile.name);
      }
    });
  }, [router]);

  const fetchRecipes = async (userId) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (recipeData) => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      const { data, error } = await supabase
        .from('recipes')
        .insert([{ ...recipeData, user_id: session.user.id }])
        .select();

      if (error) throw error;
      setRecipes([data[0], ...recipes]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 md:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-500 tracking-tight">
            Welcome back, Chef {username}!
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-bold">
            Ready to whip up something new?
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          size="sm"
          className="bg-[#4FA740] text-white hover:bg-[#3d8c32] transition-colors duration-200"
        >
          + New Recipe
        </Button>
      </div>

      {/* Recipe Form */}
      {showForm && (
        <div className="mb-6">
          <RecipeForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Recipes Grid */}
      {dataLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <RecipeLoader count={3} />
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onEdit={() => {}}
              onDelete={() => {}}
              onView={() => {}}
            />
          ))}
        </div>
      ) : (
        <Card className="mt-6 shadow-md border border-dashed border-gray-300 bg-white/5">
          <CardContent className="text-center py-10">
            <p className="text-gray-500 mb-4 font-bold">
              You haven't created any recipes yet.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[#4FA740] text-white hover:bg-[#3d8c32] transition-colors duration-200"
            >
              Create Your First Recipe
            </Button>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
