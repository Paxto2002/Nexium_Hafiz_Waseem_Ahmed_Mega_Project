'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function RecipeCard({ recipe, onEdit, onDelete, onView }) {
  return (
    <Card className="hover:shadow-lg border border-green-200 transition-shadow h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg text-green-800">
          {recipe.ai_title || recipe.title || 'Untitled'}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-2 text-sm text-gray-700">
        <div>
          <p className="font-semibold text-gray-900">Ingredients:</p>
          <p className="text-muted-foreground line-clamp-2">
            {recipe.ai_ingredients || recipe.ingredients}
          </p>
        </div>

        {recipe.cookTime && (
          <p>
            <span className="font-semibold text-gray-900">Cook Time:</span>{' '}
            {recipe.cookTime}
          </p>
        )}
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
            onClick={() => onDelete(recipe.id)}
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
