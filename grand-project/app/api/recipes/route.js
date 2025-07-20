import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req) {
  // 1. Create authenticated Supabase server client
  const supabase = createSupabaseServerClient();

  // 2. Get the current user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Reject if user not logged in
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 4. Get ingredients from request body
  const { input } = await req.json(); // input = "chicken, tomato" etc.

  // 5. Connect to MongoDB and insert the raw user input
  const client = await clientPromise;
  const db = client.db("chefDB");
  const collection = db.collection("user_inputs");

  const mongoResult = await collection.insertOne({
    user_id: user.id,
    ingredients: input,
    created_at: new Date(),
  });

  // 6. Dummy AI response (replace this later with real AI logic / n8n call)
  const ai_title = "Quick Chicken Tomato Delight";
  const ai_ingredients = "Chicken, Tomato, Garlic, Onion, Olive Oil";
  const ai_steps =
    "1. Marinate chicken...\n2. Cook with tomatoes...\n3. Serve hot!";
  const ai_tips = "Use ripe tomatoes for extra flavor.";

  // 7. Save AI response to Supabase `recipes` table
  const { error } = await supabase.from("recipes").insert({
    user_id: user.id,
    input,
    ai_title,
    ai_ingredients,
    ai_steps,
    ai_tips,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 8. Respond back to frontend
  return NextResponse.json({
    success: true,
    mongo_id: mongoResult.insertedId,
    message: "Recipe input received and saved successfully",
  });
}
