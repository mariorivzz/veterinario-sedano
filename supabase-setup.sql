-- ==========================================
-- VetCare Database Schema
-- Ejecutar en Supabase SQL Editor
-- ==========================================

-- Tabla: contacto_mensajes (para el formulario de contacto)
CREATE TABLE IF NOT EXISTS contacto_mensajes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  asunto TEXT,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en ambas tablas
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacto_mensajes ENABLE ROW LEVEL SECURITY;

-- Políticas para citas
CREATE POLICY "Allow public inserts on citas"
  ON citas FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on citas"
  ON citas FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Políticas para contacto_mensajes
CREATE POLICY "Allow public inserts on contacto_mensajes"
  ON contacto_mensajes FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on contacto_mensajes"
  ON contacto_mensajes FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ==========================================
-- Crear usuario admin (ejecutar una sola vez)
-- Cambia el email y contraseña por los tuyos
-- ==========================================
-- Ve a Supabase Dashboard > Authentication > Users > Add User
-- Email: admin@vetcare.com
-- Password: (tu contraseña segura)
