import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function POST(req) {
  try {
    // 🔐 Log the incoming secret header from the browser
    const receivedSecret = req.headers.get("x-chef-secret");
    console.log("🔐 X-Chef-Secret header received:", receivedSecret);

    const body = await req.json();
    const supabase = await createSupabaseServerClient();

    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    const user_id = body.user_id || session?.user?.id;
    if (authError || !user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const input = body.input?.toString?.().trim();
    if (!input) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    const secret = process.env.NEXT_PUBLIC_CHEF_WEBHOOK_SECRET;

    if (!webhookUrl || !secret) {
      return NextResponse.json(
        { error: "Server Misconfigured" },
        { status: 500 }
      );
    }

    const client_info = body.client_info || {
      user_agent: req.headers.get("user-agent") || "unknown",
      origin: req.headers.get("origin") || "unknown",
      timestamp: new Date().toISOString(),
    };

    const payload = { user_id, input, client_info };

    console.log("🔍 Sending to n8n:", JSON.stringify(payload, null, 2));

    const n8nRes = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Chef-Secret": secret,
        Origin: client_info.origin,
      },
      body: JSON.stringify(payload),
    });

    if (!n8nRes.ok) {
      const errorDetails = await n8nRes.text();
      console.error("❌ n8n response error:", errorDetails);
      return NextResponse.json(
        { error: "n8n webhook failed", details: errorDetails },
        { status: n8nRes.status }
      );
    }

    const data = await n8nRes.json();
    console.log("✅ n8n response:", JSON.stringify(data, null, 2));
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("❗ Webhook Proxy Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: err.message },
      { status: 500 }
    );
  }
}
