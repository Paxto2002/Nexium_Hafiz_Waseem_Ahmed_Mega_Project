// app/api/recipes/PerformanceResourceTiming.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    // Authenticate user via Supabase SSR
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { input, ai_title, ai_ingredients, ai_steps, ai_tips } = body;

    const { db } = await connectToDB();

    const newRecipe = {
      user_id: user.id,
      input,
      ai_title,
      ai_ingredients,
      ai_steps,
      ai_tips,
      created_at: new Date(),
    };

    const result = await db.collection("recipes_full").insertOne(newRecipe);

    return NextResponse.json(
      { success: true, insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error in POST /api/recipes:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: err.message },
      { status: 500 }
    );
  }
}
