import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const supabase = await createSupabaseServerClient();

    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user_id = session.user.id;
    const input = body.input?.toString?.().trim();
    if (!input) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    const secret = process.env.NEXT_PUBLIC_CHEF_WEBHOOK_SECRET;

    if (!webhookUrl || !secret) {
      return NextResponse.json(
        { error: 'Server Misconfigured' },
        { status: 500 }
      );
    }

    const client_info = body.client_info || {
      user_agent: req.headers.get('user-agent') || 'unknown',
      origin: req.headers.get('origin') || 'unknown',
      timestamp: new Date().toISOString(),
    };

    const n8nRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Chef-Secret': secret,
        Origin: client_info.origin,
      },
      body: JSON.stringify({ user_id, input, client_info }),
    });

    if (!n8nRes.ok) {
      const errorDetails = await n8nRes.text();
      return NextResponse.json(
        { error: 'n8n webhook failed', details: errorDetails },
        { status: n8nRes.status }
      );
    }

    const data = await n8nRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Webhook Proxy Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', message: err.message },
      { status: 500 }
    );
  }
}