import { NextResponse } from 'next/server';

// Force Node.js runtime (not Edge) so we can use the https module
export const runtime = 'nodejs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Make HTTPS request using Node.js core https module
 * to bypass undici's ByteString validation bug on Vercel.
 */
async function safeRequest(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string
): Promise<{ status: number; data: any }> {
  const https = await import('https');

  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method,
      headers: {
        ...headers,
        ...(body ? { 'Content-Length': Buffer.byteLength(body).toString() } : {}),
      },
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk: Buffer) => { responseBody += chunk.toString(); });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode || 500, data: JSON.parse(responseBody) });
        } catch {
          resolve({ status: res.statusCode || 500, data: responseBody });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

const supabaseHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son obligatorios' }, { status: 400 });
    }

    // 1. Authenticate with Supabase Auth
    const authResult = await safeRequest(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      'POST',
      supabaseHeaders,
      JSON.stringify({ email, password })
    );

    if (authResult.status >= 400 || !authResult.data?.user) {
      return NextResponse.json({ error: 'Correo o contraseña incorrectos.' }, { status: 401 });
    }

    // 2. Fetch user profile from flow_users
    const encodedEmail = encodeURIComponent(email);
    const dbResult = await safeRequest(
      `${SUPABASE_URL}/rest/v1/flow_users?email=eq.${encodedEmail}&select=*&limit=1`,
      'GET',
      supabaseHeaders
    );

    const user = Array.isArray(dbResult.data) ? dbResult.data[0] : null;

    if (dbResult.status >= 400 || !user) {
      return NextResponse.json({ error: 'No se encontró el perfil del usuario.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
