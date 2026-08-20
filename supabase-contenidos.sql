-- ==========================================
-- Tabla de textos editables desde el panel
-- Ejecutar en el editor SQL de Supabase
--
-- Aquí van SOLO los textos de marketing de la web.
-- Los datos de contacto (dirección, teléfono, horario) NO están aquí:
-- viven en src/config/clinica.ts, para tener una única fuente de verdad.
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

-- Cualquiera puede leer: las páginas públicas lo necesitan
CREATE POLICY "Allow public reads on contenidos"
  ON contenidos FOR SELECT TO anon
  USING (true);

-- Solo quien ha iniciado sesión puede modificar
CREATE POLICY "Allow authenticated full access on contenidos"
  ON contenidos FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ==========================================
-- Textos iniciales
-- ==========================================

INSERT INTO contenidos (clave, valor, seccion, etiqueta, tipo) VALUES
  -- Portada
  ('hero_badge', 'Clínica veterinaria', 'hero', 'Etiqueta de portada', 'text'),
  ('hero_titulo', 'Cuidamos a tu mascota como si fuera nuestra', 'hero', 'Título principal', 'text'),
  ('hero_subtitulo', 'Revisiones, vacunas, cirugía y urgencias. Te explicamos siempre qué le pasa a tu animal y qué vamos a hacer, sin palabras raras.', 'hero', 'Texto de portada', 'textarea'),

  -- Servicios
  ('servicios_badge', 'Lo que hacemos', 'servicios', 'Etiqueta de sección', 'text'),
  ('servicios_titulo', 'Nuestros servicios', 'servicios', 'Título de sección', 'text'),
  ('servicios_subtitulo', 'Todo lo que tu mascota necesita, en un mismo sitio', 'servicios', 'Texto de sección', 'text'),

  -- Por qué elegirnos
  ('why_badge', 'Por qué elegirnos', 'why', 'Etiqueta de sección', 'text'),
  ('why_titulo', 'Para nosotros, tu mascota es de la familia', 'why', 'Título de sección', 'text'),
  ('why_1_titulo', 'Veterinarios colegiados', 'why', 'Título del motivo 1', 'text'),
  ('why_1_desc', 'Todo el equipo está colegiado y se sigue formando cada año.', 'why', 'Texto del motivo 1', 'textarea'),
  ('why_2_titulo', 'Te lo explicamos claro', 'why', 'Título del motivo 2', 'text'),
  ('why_2_desc', 'Antes de hacer nada te contamos qué le pasa, qué cuesta y qué opciones hay.', 'why', 'Texto del motivo 2', 'textarea'),
  ('why_3_titulo', 'Con calma y con mimo', 'why', 'Título del motivo 3', 'text'),
  ('why_3_desc', 'Vamos al ritmo del animal para que la visita le asuste lo menos posible.', 'why', 'Texto del motivo 3', 'textarea'),

  -- Llamada final
  ('cta_titulo', '¿Tu mascota necesita que la veamos?', 'cta', 'Título de la llamada final', 'text'),
  ('cta_subtitulo', 'Llámanos y te decimos cuándo podemos atenderla. Si es urgente, dilo al llamar.', 'cta', 'Texto de la llamada final', 'textarea'),

  -- Página de contacto
  ('contacto_titulo', 'Estamos aquí para ayudarte', 'contacto', 'Título de la página', 'text'),
  ('contacto_subtitulo', 'Llámanos, escríbenos o pásate por la clínica. Te atendemos encantados.', 'contacto', 'Texto de la página', 'textarea')
ON CONFLICT (clave) DO NOTHING;

-- ==========================================
-- Si vienes de la versión anterior, esto borra los textos
-- que ya no se usan (cifras inventadas y datos de contacto).
-- ==========================================

DELETE FROM contenidos WHERE seccion = 'stats';
DELETE FROM contenidos WHERE clave IN (
  'contacto_direccion',
  'contacto_telefono',
  'contacto_email',
  'contacto_horario_semana',
  'contacto_horario_sabado'
);
