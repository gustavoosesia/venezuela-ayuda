-- Ejecutar esto en el SQL Editor de Supabase

-- Tabla de voluntarios
CREATE TABLE voluntarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  pais TEXT NOT NULL,
  profesion TEXT NOT NULL,
  especialidad TEXT,
  idiomas TEXT[] DEFAULT '{}',
  disponibilidad TEXT,
  experiencia TEXT,
  como_puede_ayudar TEXT,
  estado TEXT DEFAULT 'disponible' CHECK (estado IN ('disponible', 'ocupado', 'inactivo')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de necesidades
CREATE TABLE necesidades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  ubicacion TEXT NOT NULL,
  tipo_ayuda TEXT NOT NULL,
  descripcion TEXT,
  urgencia TEXT DEFAULT 'media' CHECK (urgencia IN ('alta', 'media', 'baja')),
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'asignado', 'completado')),
  voluntario_id UUID REFERENCES voluntarios(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE voluntarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE necesidades ENABLE ROW LEVEL SECURITY;

-- Políticas: lectura y escritura pública (ajustar con auth cuando se implemente)
CREATE POLICY "Lectura pública voluntarios" ON voluntarios FOR SELECT USING (true);
CREATE POLICY "Inserción pública voluntarios" ON voluntarios FOR INSERT WITH CHECK (true);
CREATE POLICY "Actualización pública voluntarios" ON voluntarios FOR UPDATE USING (true);

CREATE POLICY "Lectura pública necesidades" ON necesidades FOR SELECT USING (true);
CREATE POLICY "Inserción pública necesidades" ON necesidades FOR INSERT WITH CHECK (true);
CREATE POLICY "Actualización pública necesidades" ON necesidades FOR UPDATE USING (true);

-- Tabla de sugerencias
CREATE TABLE sugerencias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT,
  email TEXT,
  tipo TEXT CHECK (tipo IN ('mejora', 'error', 'sugerencia', 'otro')),
  mensaje TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sugerencias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública sugerencias" ON sugerencias FOR SELECT USING (true);
CREATE POLICY "Inserción pública sugerencias" ON sugerencias FOR INSERT WITH CHECK (true);

-- También agregar columna email a necesidades (para notificaciones)
ALTER TABLE necesidades ADD COLUMN IF NOT EXISTS email TEXT;
