import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user_id = session.user.id;
    const input = body.input;

    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    const secret = process.env.NEXT_PUBLIC_CHEF_WEBHOOK_SECRET;

    const n8nRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Chef-Secret': secret,
      },
      body: JSON.stringify({
        user_id,
        input,
        client_info: body.client_info ?? {
          user_agent: req.headers.get('user-agent'),
          origin: req.headers.get('origin'),
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!n8nRes.ok) {
      const errData = await n8nRes.json().catch(() => ({}));
      return NextResponse.json({ message: errData.message || 'Failed to generate recipe' }, { status: n8nRes.status });
    }

    const data = await n8nRes.json();
    return NextResponse.json(data, { status: 200 });

  } catch (err) {
    console.error('Proxy Error:', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
