'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

export function RecipeForm({
  onSubmit,
  initialData = {},
  loading = false,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    ingredients: initialData.ingredients || '',
    instructions: initialData.instructions || '',
    cookTime: initialData.cookTime || '',
    servings: initialData.servings || 2,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl border border-green-200 shadow-md">
      <CardHeader>
        <CardTitle className="text-green-800">
          {initialData.id ? 'Edit Recipe' : 'Create New Recipe'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800">
              Title*
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Recipe title"
              required
            />
          </div>

          {/* Ingredients */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800">
              Ingredients*
            </label>
            <Textarea
              value={formData.ingredients}
              onChange={(e) =>
                setFormData({ ...formData, ingredients: e.target.value })
              }
              placeholder="List ingredients (separate by commas)"
              rows={3}
              required
            />
          </div>

          {/* Instructions */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800">
              Instructions*
            </label>
            <Textarea
              value={formData.instructions}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              placeholder="Step-by-step instructions"
              rows={5}
              required
            />
          </div>

          {/* Cook Time + Servings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-800">
                Cook Time
              </label>
              <Input
                value={formData.cookTime}
                onChange={(e) =>
                  setFormData({ ...formData, cookTime: e.target.value })
                }
                placeholder="30 mins"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-800">
                Servings
              </label>
              <Input
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) =>
                  setFormData({ ...formData, servings: e.target.value })
                }
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#4fa740] hover:bg-[#449c3c] text-white"
            >
              {loading ? 'Saving...' : 'Save Recipe'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
