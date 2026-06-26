import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Custom fetch wrapper that sanitizes HTTP headers to prevent
 * ByteString errors caused by locale-sensitive string operations
 * in the Node.js runtime (e.g., Turkish locale where 'i'.toUpperCase() = 'İ').
 */
const safeFetch: typeof globalThis.fetch = (input, init) => {
  if (init?.headers) {
    const sanitized: Record<string, string> = {};
    const entries =
      init.headers instanceof Headers
        ? Array.from(init.headers.entries())
        : Array.isArray(init.headers)
          ? init.headers
          : Object.entries(init.headers as Record<string, string>);

    for (const [key, value] of entries) {
      // Replace any non-Latin1 characters (code > 255) with '?'
      const safeKey = [...key].map(c => c.charCodeAt(0) > 255 ? '?' : c).join('');
      const safeValue = [...String(value)].map(c => c.charCodeAt(0) > 255 ? '?' : c).join('');
      sanitized[safeKey] = safeValue;
    }
    init = { ...init, headers: sanitized };
  }
  return globalThis.fetch(input, init);
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: { fetch: safeFetch },
});
