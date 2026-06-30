import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

// Cliente con la service_role key — solo para uso server-side (API routes).
// Nunca importar este archivo desde un componente "use client".
export function getSupabaseAdmin(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase admin no configurado. Agrega SUPABASE_SERVICE_ROLE_KEY en .env.local");
  }
  _client = createClient(url, key);
  return _client;
}
