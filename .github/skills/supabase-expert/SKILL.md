---
name: supabase-expert
description: "Use when: creating Supabase tables, configuring Row Level Security, writing database migrations, setting up Supabase Auth, or designing the database schema for the veterinary clinic."
argument-hint: "Describe the database or auth task (e.g., 'add a pets table', 'enable RLS on citas')"
---

# Supabase Database Expert Skill

## Procedure

### 1. SQL Schema Design
When creating new tables, follow this pattern:
```sql
CREATE TABLE table_name (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- columns here
);

-- Always enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Create appropriate policies
CREATE POLICY "Allow public inserts" ON table_name
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public reads" ON table_name
  FOR SELECT TO anon USING (true);
```

### 2. Existing Schema
| Table | Columns | RLS |
|-------|---------|-----|
| `citas` | id, nombre, email, telefono, mascota, tipo_mascota, servicio, fecha, notas, created_at | Should be enabled |

### 3. Suggested Additional Tables
- `mascotas` — Pet registry (nombre, tipo, raza, edad, peso, dueño_id)
- `servicios` — Service catalog (nombre, descripcion, precio, duracion)
- `contacto_mensajes` — Contact form submissions (nombre, email, mensaje)

### 4. Security Best Practices
- Always enable RLS on every table
- Use `anon` role for public operations (forms)
- Use `authenticated` role for admin operations
- Never expose `service_role` key in client code
- Validate data types and constraints at the database level with CHECK constraints
