---
name: astro-supabase-veterinary
description: "Use when: building new pages, adding features, or modifying the veterinary Astro website with Supabase backend. Covers creating Astro pages with Supabase data fetching, form handling, appointment booking, and veterinary-specific UI components."
argument-hint: "Describe the page or feature to build (e.g., 'create a pet vaccination history page')"
---

# Astro + Supabase Veterinary Website Skill

## Procedure

### 1. Understand the Request
Determine what type of work is needed:
- **New page**: Create in `src/pages/` with `.astro` extension
- **New component**: Create in `src/components/` with `.astro` extension
- **Data feature**: Involves Supabase queries (use client from `src/lib/supabase.ts`)
- **Style update**: Modify component `<style>` or `src/styles/global.css`

### 2. Page Template
For new pages, use this pattern:
```astro
---
import Layout from '../layouts/Layout.astro';
import { supabase } from '../lib/supabase';

// Fetch data if needed
const { data, error } = await supabase.from('table_name').select('*');
---
<Layout title="Título de la Página">
  <main class="container">
    <h1>Título</h1>
    <!-- Content here -->
  </main>
</Layout>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
</style>
```

### 3. Form Handling Pattern
For forms that submit to Supabase (like appointments):
```astro
<form id="form-name">
  <!-- Form fields -->
  <button type="submit">Enviar</button>
</form>
<div id="mensaje"></div>

<script>
  import { createClient } from '@supabase/supabase-js';
  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );

  document.getElementById('form-name')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const { error } = await supabase.from('table').insert({
      field: formData.get('field')
    });

    const msg = document.getElementById('mensaje');
    if (error) {
      msg!.textContent = 'Error al enviar. Intente nuevamente.';
      msg!.style.color = 'red';
    } else {
      msg!.textContent = '¡Enviado correctamente!';
      msg!.style.color = 'green';
      (e.target as HTMLFormElement).reset();
    }
  });
</script>
```

### 4. Supabase Tables Reference
| Table | Columns | Purpose |
|-------|---------|---------|
| `citas` | nombre, email, telefono, mascota, tipo_mascota, servicio, fecha, notas | Appointment bookings |

### 5. Veterinary Services
Available services: Consulta General, Vacunación, Cirugía, Odontología, Peluquería, Laboratorio, Farmacia, Urgencias 24h

### 6. Styling Convention
- Primary green: `#2d6a4f`
- Hover green: `#1b4332`
- Cards with `border-radius: 12px` and hover `translateY(-5px)`
- All text in Spanish
