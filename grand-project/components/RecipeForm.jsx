'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/lib/supabase/use-user";
import { createClient } from "@/lib/supabase/client";

export function RecipeForm({ onSubmit, onCancel }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (error) setError(null);
  }, [input]);

  const handleSubmit = async () => {
    setError(null);

    if (!input.trim()) {
      setError("Please enter some ingredients.");
      return;
    }

    if (!user?.id) {
      setError("Please sign in to generate recipes.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session?.user?.id) {
        throw new Error(authError?.message || "Session expired. Please refresh the page.");
      }

      const response = await fetch('/api/recipe-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: session.user.id,
          input: input.trim(),
          client_info: {
            user_agent: navigator.userAgent,
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Recipe generation failed (${response.status})`);
      }

      const data = await response.json();
      setInput("");
      if (onSubmit) onSubmit(data);
    } catch (err) {
      console.error("API Error:", {
        error: err.message,
        input: input.trim(),
        timestamp: new Date().toISOString()
      });
      
      setError(
        err.message.includes("Failed to fetch") 
          ? "Network error. Please check your connection and try again."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto shadow-md border border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800">
          🍳 What ingredients do you have?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <input
          className="w-full border px-3 py-2 rounded mb-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          type="text"
          placeholder="e.g. eggs, cheese, tomatoes"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />

        {error && (
          <p className="text-red-600 mt-2 text-sm animate-fade-in">
            {error}
          </p>
        )}

        <div className="mt-4 flex justify-between gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="flex-1 bg-[#4fa740] text-white hover:bg-[#449c3c] transition-colors"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Generating...
              </span>
            ) : "Generate Recipe"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}