-- ==========================================
-- Tabla de contenidos editables
-- Ejecutar en Supabase SQL Editor
-- ==========================================

CREATE TABLE IF NOT EXISTS contenidos (
  clave TEXT PRIMARY KEY,
  valor TEXT NOT NULL,
  seccion TEXT NOT NULL DEFAULT 'general',
  etiqueta TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'text',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contenidos ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer (las páginas públicas necesitan esto)
CREATE POLICY "Allow public reads on contenidos"
  ON contenidos FOR SELECT TO anon
  USING (true);

-- Solo admin puede modificar
CREATE POLICY "Allow authenticated full access on contenidos"
  ON contenidos FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ==========================================
-- Datos iniciales (seed)
-- ==========================================

INSERT INTO contenidos (clave, valor, seccion, etiqueta, tipo) VALUES
  -- Hero
  ('hero_badge', 'Clínica veterinaria profesional', 'hero', 'Badge del hero', 'text'),
  ('hero_titulo', 'Cuidamos la salud de tu mejor amigo', 'hero', 'Título principal', 'text'),
  ('hero_subtitulo', 'Equipo veterinario con más de 15 años de experiencia en el cuidado integral de mascotas. Consultas, cirugía, urgencias y mucho más.', 'hero', 'Subtítulo', 'textarea'),
  
  -- Stats
  ('stats_experiencia', '15+', 'stats', 'Años de experiencia', 'text'),
  ('stats_mascotas', '5,000+', 'stats', 'Mascotas atendidas', 'text'),
  ('stats_especialidades', '8', 'stats', 'Especialidades', 'text'),
  ('stats_urgencias', '24/7', 'stats', 'Urgencias', 'text'),

  -- Sección servicios
  ('servicios_badge', 'Lo que hacemos', 'servicios', 'Badge servicios', 'text'),
  ('servicios_titulo', 'Nuestros servicios', 'servicios', 'Título servicios', 'text'),
  ('servicios_subtitulo', 'Atención integral y especializada para el bienestar de tu mascota', 'servicios', 'Subtítulo servicios', 'text'),

  -- Sección por qué elegirnos
  ('why_badge', 'Por qué elegirnos', 'why', 'Badge sección', 'text'),
  ('why_titulo', 'Para nosotros, tu mascota es familia', 'why', 'Título sección', 'text'),
  ('why_1_titulo', 'Equipo certificado', 'why', 'Título ventaja 1', 'text'),
  ('why_1_desc', 'Veterinarios colegiados con formación continua y especializaciones de alto nivel.', 'why', 'Descripción ventaja 1', 'textarea'),
  ('why_2_titulo', 'Urgencias 24 horas', 'why', 'Título ventaja 2', 'text'),
  ('why_2_desc', 'Disponibles todos los días del año para cualquier emergencia de tu mascota.', 'why', 'Descripción ventaja 2', 'textarea'),
  ('why_3_titulo', 'Trato con cariño', 'why', 'Título ventaja 3', 'text'),
  ('why_3_desc', 'Entorno tranquilo y amable donde tu mascota se sentirá segura y cómoda.', 'why', 'Descripción ventaja 3', 'textarea'),

  -- CTA
  ('cta_titulo', '¿Tu mascota necesita atención?', 'cta', 'Título CTA', 'text'),
  ('cta_subtitulo', 'Reserva tu cita online en menos de un minuto. Sin esperas, sin complicaciones.', 'cta', 'Subtítulo CTA', 'textarea'),

  -- Contacto
  ('contacto_direccion', 'Calle Ejemplo 123, Ciudad, País', 'contacto', 'Dirección', 'text'),
  ('contacto_telefono', '(+34) 600 123 456', 'contacto', 'Teléfono', 'text'),
  ('contacto_email', 'info@vetcare.com', 'contacto', 'Email', 'text'),
  ('contacto_horario_semana', 'Lunes a Viernes: 9:00 – 20:00', 'contacto', 'Horario entre semana', 'text'),
  ('contacto_horario_sabado', 'Sábados: 10:00 – 14:00', 'contacto', 'Horario sábados', 'text')
ON CONFLICT (clave) DO NOTHING;
