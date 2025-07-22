"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [recipeInput, setRecipeInput] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      const supabase = createClient();
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) return console.error("Session error:", error);
        if (session?.user) {
          setUser(session.user);
          if (session.user.user_metadata?.is_signup)
            await createUserProfile(session.user);
          await loadUserRecipes(session.user.id);
        }
      } catch (error) {
        console.error("User init error:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeUser();
  }, []);

  const createUserProfile = async (user) => {
    try {
      const res = await fetch("/api/users/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email.split("@")[0],
        }),
      });
      if (!res.ok) throw new Error("Profile creation failed");
    } catch (error) {
      console.error("Profile error:", error);
    }
  };

  const loadUserRecipes = async (userId) => {
    try {
      const res = await fetch(`/api/recipes?user_id=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch recipes");
      const data = await res.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error("Load recipes error:", error);
    }
  };

  const handleGenerateRecipe = async (e) => {
    e.preventDefault();
    if (!recipeInput.trim() || !user) return;

    setGenerating(true);
    try {
      const mockRecipe = {
        title: `Delicious ${recipeInput} Recipe`,
        ingredients: [recipeInput, "Salt and pepper", "Olive oil", "Garlic"],
        instructions: [
          "Prepare ingredients",
          "Heat oil, sauté garlic",
          `Add ${recipeInput}, season, cook until tender`,
          "Serve hot",
        ],
        cook_time: "20 minutes",
        servings: 4,
      };

      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          input: recipeInput,
          ai_title: mockRecipe.title,
          ai_ingredients: mockRecipe.ingredients,
          ai_steps: mockRecipe.instructions,
          ai_tips: `Great recipe using ${recipeInput}!`,
          cook_time: mockRecipe.cook_time,
          servings: mockRecipe.servings,
        }),
      });

      if (!response.ok) throw new Error("Failed to save recipe");
      await loadUserRecipes(user.id);
      setRecipeInput("");
    } catch (error) {
      console.error("Generation error:", error);
      alert("Failed to generate recipe. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="animate-spin h-10 w-[70vw] border-b-2 border-green-500 rounded-full mx-auto" />
          <p className="text-muted-foreground text-sm">
            Loading your kitchen...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-6 px-4 max-w-7xl mx-auto w-full">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-green-700">
          Welcome to Chef Paxto 👨‍🍳
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          Hello{" "}
          <span className="font-medium">
            {user?.user_metadata?.name || user?.email}
          </span>
          ! Start cooking with AI-powered recipes.
        </p>
      </div>

      {/* Recipe Generator */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            🧠 Generate New Recipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleGenerateRecipe}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Input
              placeholder="e.g., chicken, spinach, garlic"
              value={recipeInput}
              onChange={(e) => setRecipeInput(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={generating}
              className="w-full sm:w-auto"
            >
              {generating ? "Cooking..." : "Generate Recipe"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recipes Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          📜 Your Recipes ({recipes.length})
        </h2>

        {recipes.length === 0 ? (
          <Card className="py-10 text-center">
            <CardContent>
              <p className="text-muted-foreground">
                No recipes yet! Start by generating one above 🍳
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <Card
                key={recipe._id}
                className="hover:shadow-lg transition-shadow border-green-200"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{recipe.ai_title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    <strong>Ingredients:</strong> {recipe.input}
                  </p>
                  <p>
                    <strong>Cook Time:</strong> {recipe.cook_time}
                  </p>
                  <p>
                    <strong>Servings:</strong> {recipe.servings}
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(recipe.created_at).toLocaleDateString()}
                  </p>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View Recipe
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
