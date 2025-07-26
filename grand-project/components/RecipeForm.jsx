// components/RecipeForm.jsx
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/lib/supabase/use-user"; // Updated import path
import { createClient } from "@/lib/supabase/client";

export function RecipeForm({ onSubmit, onCancel }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();

  const handleSubmit = async () => {
    setError(null);

    if (!input.trim()) {
      setError("Please enter some ingredients.");
      return;
    }

    if (!user?.id) {
      setError("User not authenticated.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        throw new Error("Session expired");
      }

      const res = await fetch("https://paxto2002.app.n8n.cloud/webhook/chefpaxto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: session.user.id,
          input: input.trim(),
        }),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Request failed: ${res.status} - ${errorBody}`);
      }

      const data = await res.json();
      setInput("");
      if (onSubmit) onSubmit(data);
    } catch (err) {
      console.error("Failed to send to n8n:", err);
      setError(err.message || "Something went wrong. Please try again.");
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
          className="w-full border px-3 py-2 rounded"
          type="text"
          placeholder="e.g. eggs, cheese, tomatoes"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />

        {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}

        <div className="mt-4 flex justify-between">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="bg-[#4fa740] text-white hover:bg-[#449c3c]"
          >
            {loading ? "Generating..." : "Generate Recipe"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}