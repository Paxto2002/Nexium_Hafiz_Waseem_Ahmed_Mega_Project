import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  // Handle CORS preflight request
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
    // Parse the request body
    const requestBody = await request.json();
    const { user_id, input, client_info } = requestBody;

    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    if (!process.env.N8N_WEBHOOK_URL || !process.env.CHEF_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // Forward the request to n8n
    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Chef-Secret": process.env.CHEF_WEBHOOK_SECRET,
      },
      body: JSON.stringify({
        user_id,
        input,
        client_info,
      }),
    });

    if (!n8nResponse.ok) {
      const errorData = await n8nResponse.json().catch(() => ({}));
      throw new Error(errorData.message || `n8n error: ${n8nResponse.status}`);
    }

    const data = await n8nResponse.json();
    return NextResponse.json(data, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
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
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
