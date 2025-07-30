'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

export function RecipeCard({ recipe, onEdit, onDelete, onView }) {
  const supabase = createClient();

  const handleDelete = async () => {
    if (!recipe?.id) return;

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipe.id);

    if (error) {
      console.error('❌ Failed to delete recipe:', error.message);
      return alert('Failed to delete recipe. Please try again.');
    }

    if (onDelete) onDelete(recipe.id); // remove from UI
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="hover:shadow-lg border border-green-200 transition-shadow h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg text-green-800">
            {recipe.ai_title || recipe.title || 'Untitled'}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 space-y-4 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">🥗 Ingredients</h3>
            <ul className="list-disc pl-6 space-y-1">
              {(Array.isArray(recipe.ai_ingredients)
                ? recipe.ai_ingredients
                : JSON.parse(recipe.ai_ingredients || '[]')
              ).map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">👨‍🍳 Steps</h3>
            <ol className="list-decimal pl-6 space-y-1">
              {(Array.isArray(recipe.ai_steps)
                ? recipe.ai_steps
                : JSON.parse(recipe.ai_steps || '[]')
              ).map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">💡 Tips</h3>
            <ul className="list-disc pl-6 space-y-1">
              {(Array.isArray(recipe.ai_tips)
                ? recipe.ai_tips
                : JSON.parse(recipe.ai_tips || '[]')
              ).map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between gap-2 mt-auto pt-4">
          <Button
            variant="outline"
            size="sm"
            className="border-green-600 text-green-700 hover:bg-green-50"
            onClick={() => onView(recipe)}
          >
            View
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-green-600 text-green-700 hover:bg-green-50"
              onClick={() => onEdit(recipe)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
