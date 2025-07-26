// app/api/recipe-webhook/route.js
import { createClient } from "@/lib/supabase/server";

export async function POST(req) {
  const body = await req.json();
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const user_id = session.user.id;
  const input = body.input;

  // 👉 n8n Webhook URL (replace with your actual n8n webhook URL)
  const n8nWebhookURL = "https://YOUR_N8N_DOMAIN/webhook/chat-message";

  const n8nRes = await fetch(n8nWebhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: session.user.email, // Optional: You can customize this
      action: "sendMessage",
      chatInput: input,
      user_id, // Pass user_id to n8n
    }),
  });

  const n8nData = await n8nRes.json();
  return new Response(JSON.stringify(n8nData), { status: 200 });
}
