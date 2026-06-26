import { NextResponse } from 'next/server';

// Force Node.js runtime (not Edge)
export const runtime = 'nodejs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/jTugwykceKyJlATOSvkb/webhook-trigger/4016ec77-86a6-4b6e-b397-53061bf9a474';

/**
 * Make HTTPS request using Node.js core https module
 * to bypass undici's ByteString validation bug.
 */
async function safeRequest(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string
): Promise<{ status: number; data: any }> {
  const https = require('https');

  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options: any = {
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method,
      headers: {
        ...headers,
        ...(body ? { 'Content-Length': Buffer.byteLength(body).toString() } : {}),
      },
    };

    const req = https.request(options, (res: any) => {
      let responseBody = '';
      res.on('data', (chunk: any) => { responseBody += chunk.toString(); });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode || 500, data: JSON.parse(responseBody) });
        } catch {
          resolve({ status: res.statusCode || 500, data: responseBody });
        }
      });
    });

    req.on('error', (err: any) => reject(err));
    if (body) req.write(body);
    req.end();
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: 'Name, email, password and phone are required' }, { status: 400 });
    }

    // Debug: verify env vars are loaded
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ 
        error: 'Server configuration error',
        debug: { hasUrl: !!SUPABASE_URL, hasKey: !!SUPABASE_ANON_KEY }
      }, { status: 500 });
    }

    const supabaseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    };

    // 1. Create user in Supabase Auth
    let authResult;
    try {
      authResult = await safeRequest(
        `${SUPABASE_URL}/auth/v1/signup`,
        'POST',
        supabaseHeaders,
        JSON.stringify({ email, password })
      );
    } catch (authCatch: any) {
      return NextResponse.json({ 
        error: 'Auth request failed', 
        detail: authCatch?.message || String(authCatch),
        type: authCatch?.constructor?.name
      }, { status: 500 });
    }

    if (authResult.status >= 400) {
      const msg = authResult.data?.msg || authResult.data?.error_description || authResult.data?.message || 'Error al crear la cuenta';
      return NextResponse.json({ error: msg }, { status: authResult.status });
    }

    const userId = authResult.data?.id || authResult.data?.user?.id;

    // 2. Save or update user in flow_users (upsert)
    let upsertResult;
    try {
      upsertResult = await safeRequest(
        `${SUPABASE_URL}/rest/v1/flow_users?on_conflict=email`,
        'POST',
        {
          ...supabaseHeaders,
          'Prefer': 'resolution=merge-duplicates,return=representation',
        },
        JSON.stringify({ id: userId, name, email, phone })
      );
    } catch (dbCatch: any) {
      return NextResponse.json({ 
        error: 'DB request failed',
        detail: dbCatch?.message || String(dbCatch)
      }, { status: 500 });
    }

    if (upsertResult.status >= 400) {
      return NextResponse.json({ error: 'Database error', detail: upsertResult.data }, { status: 500 });
    }

    const user = Array.isArray(upsertResult.data) ? upsertResult.data[0] : upsertResult.data;

    // 3. Send data to GoHighLevel Webhook (fire-and-forget)
    safeRequest(
      GHL_WEBHOOK_URL,
      'POST',
      { 'Content-Type': 'application/json' },
      JSON.stringify({
        first_name: name, email, phone,
        tags: ['flow_app_lead'],
        source: 'Flow Simulator App',
      })
    ).catch(() => {});

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      detail: error?.message || String(error),
      stack: error?.stack?.split('\n').slice(0, 3)
    }, { status: 500 });
  }
}
