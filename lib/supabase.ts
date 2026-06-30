import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || url === 'your_supabase_url_here') {
    throw new Error('Supabase no configurado. Agrega las variables en .env.local')
  }
  _client = createClient(url, key)
  return _client
}

export type Profesion =
  | 'Psicólogo/a'
  | 'Médico/a'
  | 'Enfermero/a'
  | 'Dentista'
  | 'Trabajador/a Social'
  | 'Ingeniero/a Civil'
  | 'Ingeniero/a Eléctrico'
  | 'Mecánico/a'
  | 'Arquitecto/a'
  | 'Abogado/a'
  | 'Contador/a'
  | 'Maestro/a'
  | 'Nutricionista'
  | 'Farmacéutico/a'
  | 'Bombero/a'
  | 'Paramédico/a'
  | 'Plomero/a'
  | 'Electricista'
  | 'Otro'

export const PROFESIONES: Profesion[] = [
  'Psicólogo/a',
  'Médico/a',
  'Enfermero/a',
  'Dentista',
  'Trabajador/a Social',
  'Ingeniero/a Civil',
  'Ingeniero/a Eléctrico',
  'Mecánico/a',
  'Arquitecto/a',
  'Abogado/a',
  'Contador/a',
  'Maestro/a',
  'Nutricionista',
  'Farmacéutico/a',
  'Bombero/a',
  'Paramédico/a',
  'Plomero/a',
  'Electricista',
  'Otro',
]

export const ESTADOS_VENEZUELA = [
  "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar",
  "Carabobo", "Cojedes", "Delta Amacuro", "Distrito Capital", "Falcón",
  "Guárico", "Lara", "Mérida", "Miranda", "Monagas", "Nueva Esparta",
  "Portuguesa", "Sucre", "Táchira", "Trujillo", "La Guaira", "Yaracuy", "Zulia",
] as const

export type Voluntario = {
  id?: string
  nombre: string
  email: string
  telefono: string
  pais: string
  profesion: Profesion | string
  especialidad: string
  idiomas: string[]
  disponibilidad: string
  experiencia: string
  como_puede_ayudar: string
  estado: 'pendiente_aprobacion' | 'disponible' | 'ocupado' | 'inactivo'
  created_at?: string
}

export type Necesidad = {
  id?: string
  nombre: string
  telefono: string
  ubicacion: string
  tipo_ayuda: string
  descripcion: string
  urgencia: 'alta' | 'media' | 'baja'
  estado: 'pendiente' | 'asignado' | 'completado'
  voluntario_id?: string
  voluntario?: Voluntario
  created_at?: string
}
