import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const { user_id, input, client_info } = await request.json();
    const supabase = createClient();

    // Verify session
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for duplicate recipes
    const { data: existing, error: queryError } = await supabase
      .from("recipes")
      .select("id")
      .eq("user_id", user_id)
      .ilike("ingredients", `%${input}%`)
      .limit(1);

    if (queryError) throw queryError;
    if (existing?.length > 0) {
      return NextResponse.json(
        { error: "Similar recipe already exists" },
        { status: 409 }
      );
    }

    // Forward to n8n
    const n8nResponse = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Chef-Secret": process.env.NEXT_PUBLIC_CHEF_WEBHOOK_SECRET,
      },
      body: JSON.stringify({
        user_id,
        input,
        client_info,
        supabase_user: session.user,
        groq_api_key: process.env.GROQ_API_KEY,
      }),
    });

    if (!n8nResponse.ok) {
      const errorData = await n8nResponse.json().catch(() => ({}));
      throw new Error(errorData.message || `n8n error: ${n8nResponse.status}`);
    }

    return NextResponse.json(await n8nResponse.json());
  } catch (error) {
    console.error("API Error:", {
      error: error.message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: error.message.includes("Failed to fetch")
          ? "Service unavailable. Please try again later."
          : error.message,
      },
      { status: 500 }
    );
  }
}
