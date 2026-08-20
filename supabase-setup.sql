-- ==========================================
-- Base de datos de Veterinaria Sedano
-- Ejecutar en el editor SQL de Supabase
-- ==========================================

-- Mensajes que llegan desde el formulario de contacto
CREATE TABLE IF NOT EXISTS contacto_mensajes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  asunto TEXT,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contacto_mensajes ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede enviar un mensaje desde la web...
CREATE POLICY "Allow public inserts on contacto_mensajes"
  ON contacto_mensajes FOR INSERT TO anon
  WITH CHECK (true);

-- ...pero solo quien ha iniciado sesión puede leerlos o borrarlos
CREATE POLICY "Allow authenticated full access on contacto_mensajes"
  ON contacto_mensajes FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ==========================================
-- Crear el usuario administrador (una sola vez)
--
-- En Supabase: Authentication > Users > Add User
-- Usa el correo real de la clínica y una contraseña segura.
-- ==========================================

-- ==========================================
-- La web ya no tiene sistema de citas online.
-- Si vienes de la versión anterior y quieres eliminar la tabla,
-- descomenta la línea siguiente. Ojo: borra las citas guardadas.
-- ==========================================

-- DROP TABLE IF EXISTS citas;
