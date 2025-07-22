import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// POST → insert a new mood log
export async function POST(req) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { mood, description, tags, mood_score } = body;

    const { db } = await connectToDB();

    const newLog = {
      user_id: user.id,
      mood,
      description,
      tags,
      mood_score,
      created_at: new Date(),
    };

    const result = await db.collection("mood_logs").insertOne(newLog);

    return NextResponse.json(
      { success: true, insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/logs error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET → fetch all mood logs for the current user
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDB();

    const logs = await db
      .collection("mood_logs")
      .find({ user_id: user.id })
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json({ logs }, { status: 200 });
  } catch (err) {
    console.error("GET /api/logs error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
