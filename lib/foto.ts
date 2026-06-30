import { getSupabaseAdmin } from "@/lib/supabase-admin";

const FOTO_BUCKET = "fotos-voluntarios";
export const FOTO_MAX_BYTES = 2 * 1024 * 1024; // 2MB

const TIPOS_PERMITIDOS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Recibe un data URL ("data:image/jpeg;base64,...") y devuelve la URL pública
// si la subida fue exitosa, o null si el formato/tamaño no es válido o falla la subida.
export async function subirFotoVoluntario(fotoBase64: string): Promise<string | null> {
  const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(fotoBase64);
  if (!match) return null;

  const [, mime, base64] = match;
  const ext = TIPOS_PERMITIDOS[mime];
  if (!ext) return null;

  const buffer = Buffer.from(base64, "base64");
  if (buffer.byteLength > FOTO_MAX_BYTES) return null;

  const nombreArchivo = `${crypto.randomUUID()}.${ext}`;
  const supabaseAdmin = getSupabaseAdmin();

  const { error } = await supabaseAdmin.storage
    .from(FOTO_BUCKET)
    .upload(nombreArchivo, buffer, { contentType: mime });

  if (error) return null;

  const { data } = supabaseAdmin.storage.from(FOTO_BUCKET).getPublicUrl(nombreArchivo);
  return data.publicUrl;
}
