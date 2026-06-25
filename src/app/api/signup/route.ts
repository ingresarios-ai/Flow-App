import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/jTugwykceKyJlATOSvkb/webhook-trigger/4016ec77-86a6-4b6e-b397-53061bf9a474';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: 'Name, email, password and phone are required' }, { status: 400 });
    }

    // Validate password & email don't contain non-Latin1 characters (codes > 255)
    // Supabase Auth SDK uses btoa() internally which only supports Latin-1 (0-255)
    const hasInvalidPasswordChar = [...password].some(ch => ch.charCodeAt(0) > 255);
    if (hasInvalidPasswordChar) {
      return NextResponse.json({ error: 'La contraseña contiene caracteres especiales no soportados. Usa solo letras, números y símbolos del teclado.' }, { status: 400 });
    }

    const hasInvalidEmailChar = [...email].some(ch => ch.charCodeAt(0) > 127);
    if (hasInvalidEmailChar) {
      return NextResponse.json({ error: 'El correo contiene caracteres no válidos.' }, { status: 400 });
    }

    // Also validate the name for non-Latin1 chars
    const hasInvalidNameChar = [...name].some(ch => ch.charCodeAt(0) > 255);
    if (hasInvalidNameChar) {
      return NextResponse.json({ error: 'El nombre contiene caracteres no soportados.' }, { status: 400 });
    }

    // 1. Create user in Supabase Auth
    let authData, authError;
    try {
      const result = await supabase.auth.signUp({ email, password });
      authData = result.data;
      authError = result.error;
    } catch (signupCatch: any) {
      // Catch ByteString / btoa errors from Supabase SDK internals
      console.error('Supabase signUp crash:', signupCatch);
      if (signupCatch?.message?.includes('ByteString')) {
        return NextResponse.json({ error: 'Los datos contienen caracteres especiales no soportados. Revisa tu contraseña y nombre.' }, { status: 400 });
      }
      return NextResponse.json({ error: 'Error al crear la cuenta. Intenta de nuevo.' }, { status: 500 });
    }

    if (authError) {
      console.error('Supabase Auth Error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 2. Save or update user in flow_users (using auth.users id if available)
    const userId = authData.user?.id;
    const { data: user, error: dbError } = await supabase
      .from('flow_users')
      .upsert({ 
        id: userId,
        name, 
        email, 
        phone,
      }, { onConflict: 'email', ignoreDuplicates: false })
      .select()
      .single();

    if (dbError) {
      console.error('Supabase Error:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // 2. Send data to GoHighLevel Webhook
    try {
      const ghlPayload = {
        first_name: name,
        email: email,
        phone: phone,
        tags: ['flow_app_lead'],
        source: 'Flow Simulator App'
      };

      await fetch(GHL_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ghlPayload),
      });
      // We don't block the response on GHL success, as long as Supabase succeeded
    } catch (ghlError) {
      console.error('GHL Webhook Error:', ghlError);
      // Even if GHL fails, we consider the signup successful locally
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Signup API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
