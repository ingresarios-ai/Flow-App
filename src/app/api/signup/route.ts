import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/jTugwykceKyJlATOSvkb/webhook-trigger/4016ec77-86a6-4b6e-b397-53061bf9a474';

/**
 * Direct HTTP call to Supabase REST API to avoid the ByteString/btoa crash
 * caused by Node.js undici in Vercel's runtime.
 */
async function supabaseRequest(path: string, method: string, body?: object) {
  const url = `${SUPABASE_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  return { data, status: res.status, ok: res.ok };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: 'Name, email, password and phone are required' }, { status: 400 });
    }

    // 1. Create user in Supabase Auth (direct REST call)
    const authResult = await supabaseRequest('/auth/v1/signup', 'POST', {
      email,
      password,
    });

    if (!authResult.ok) {
      console.error('Supabase Auth Error:', authResult.data);
      const msg = authResult.data?.msg || authResult.data?.error_description || authResult.data?.message || 'Error al crear la cuenta';
      return NextResponse.json({ error: msg }, { status: authResult.status });
    }

    const userId = authResult.data?.id || authResult.data?.user?.id;

    // 2. Save or update user in flow_users (direct REST call with upsert)
    const upsertUrl = `${SUPABASE_URL}/rest/v1/flow_users?on_conflict=email`;
    const upsertRes = await fetch(upsertUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify({ id: userId, name, email, phone }),
    });

    const users = await upsertRes.json();
    const user = Array.isArray(users) ? users[0] : users;

    if (!upsertRes.ok) {
      console.error('Supabase DB Error:', users);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // 3. Send data to GoHighLevel Webhook (fire-and-forget)
    try {
      await fetch(GHL_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: name,
          email,
          phone,
          tags: ['flow_app_lead'],
          source: 'Flow Simulator App',
        }),
      });
    } catch (ghlError) {
      console.error('GHL Webhook Error:', ghlError);
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Signup API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
