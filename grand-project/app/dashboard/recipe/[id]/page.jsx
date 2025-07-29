// app/dashboard/recipe/[id]/page.jsx
import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function RecipeDetailPage({ params }) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  const { id } = params;

  const { data: recipe, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !recipe) {
    console.error('Recipe fetch error:', error);
    return notFound(); // fallback to 404
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2">{recipe.ai_title}</h2>
      <p className="text-muted-foreground text-sm mb-4">Created on {new Date(recipe.created_at).toLocaleDateString()}</p>

      <div className="space-y-4">
        <section>
          <h3 className="font-semibold text-lg mb-1">Ingredients</h3>
          <p className="text-gray-700 whitespace-pre-line">{recipe.ai_ingredients}</p>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-1">Steps</h3>
          <p className="text-gray-700 whitespace-pre-line">{recipe.ai_steps}</p>
        </section>

        {recipe.ai_tips && (
          <section>
            <h3 className="font-semibold text-lg mb-1">Chef Tips</h3>
            <p className="text-gray-700 whitespace-pre-line">{recipe.ai_tips}</p>
          </section>
        )}
      </div>
    </div>
  );
}
