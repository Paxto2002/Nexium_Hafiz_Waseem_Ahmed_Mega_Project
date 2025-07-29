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

  const n8nWebhookURL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

  if (!n8nWebhookURL) {
    return new Response(
      JSON.stringify({ error: "Webhook URL not configured" }),
      {
        status: 500,
      }
    );
  }

  const n8nRes = await fetch(n8nWebhookURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Chef-Secret": process.env.NEXT_PUBLIC_CHEF_WEBHOOK_SECRET,
      Origin: req.headers.get("origin") || "https://chefpaxto.vercel.app",
    },
    body: JSON.stringify({
      user_id,
      input,
      client_info: {
        user_agent: req.headers.get("user-agent"),
        origin: req.headers.get("origin"),
        timestamp: new Date().toISOString(),
      },
    }),
  });

  const n8nData = await n8nRes.json();
  return new Response(JSON.stringify(n8nData), { status: 200 });
}
