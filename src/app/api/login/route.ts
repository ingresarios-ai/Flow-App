import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son obligatorios' }, { status: 400 });
    }

    // Validate inputs don't contain non-Latin1 characters (btoa() limitation)
    const hasInvalidChar = [...password, ...email].some(ch => ch.charCodeAt(0) > 255);
    if (hasInvalidChar) {
      return NextResponse.json({ error: 'El correo o contraseña contienen caracteres no soportados.' }, { status: 400 });
    }

    // 1. Authenticate with Supabase Auth
    let authData, authError;
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      authData = result.data;
      authError = result.error;
    } catch (loginCatch: any) {
      console.error('Supabase login crash:', loginCatch);
      if (loginCatch?.message?.includes('ByteString')) {
        return NextResponse.json({ error: 'El correo o contraseña contienen caracteres especiales no soportados.' }, { status: 400 });
      }
      return NextResponse.json({ error: 'Error al iniciar sesión. Intenta de nuevo.' }, { status: 500 });
    }

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Correo o contraseña incorrectos.' }, { status: 401 });
    }

    // 2. Fetch user profile from flow_users
    const { data: user, error: dbError } = await supabase
      .from('flow_users')
      .select('*')
      .eq('email', email)
      .single();

    if (dbError || !user) {
      return NextResponse.json({ error: 'No se encontró el perfil del usuario.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
