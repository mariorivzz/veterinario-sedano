---
name: astro-supabase-veterinary
description: "Use when: building new pages, adding features, or modifying the Clínica Veterinaria Sedano website (Astro + Supabase). Covers page structure, the design system tokens, Supabase data fetching and form handling."
argument-hint: "Describe the page or feature to build (e.g., 'crear una página de consejos para dueños de perros')"
---

# Clínica Veterinaria Sedano — Astro + Supabase

## Reglas que no se saltan

1. **Datos de la clínica**: dirección, teléfono, correo y horarios viven **solo** en
   `src/config/clinica.ts`. Nunca los escribas a mano en una página. Lo que esté como
   `PENDIENTE` se pinta con `<Dato />`, que muestra «Por confirmar» en vez de inventar.
2. **Nada de reservas ni urgencias**. La web es informativa: no hay sistema de citas y
   no se anuncian urgencias, aunque la web antigua de la clínica sí las anuncie.
3. **Nada de cifras sin verificar**: años de experiencia, número de mascotas atendidas,
   número de especialidades. Si no se puede comprobar, no se publica.
4. **Todo en castellano**, en lenguaje llano, sin tecnicismos médicos.

## Estructura de una página nueva

```astro
---
import Layout from '../layouts/Layout.astro';
import { clinica, telefonoEnlace } from '../config/clinica';

const tel = telefonoEnlace();
---

<Layout title="Título" description="Frase para Google, con Salamanca dentro.">
  <section class="page-hero">
    <div class="container">
      <span class="badge">Etiqueta</span>
      <h1>Título</h1>
      <p>Entradilla.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">…</div>
  </section>
</Layout>
```

`.page-hero` ya lleva la banda tostada y el filete inferior: es el patrón de cabecera
de todas las páginas.

## Sistema de diseño

Todo sale de `src/styles/global.css`. **No inventes valores**, usa los tokens.

| Concepto | Tokens |
| :-- | :-- |
| Marca | `--color-brand` #e77f4a — **solo relleno y gráficos**, sobre blanco da 2,8:1 |
| Interactivo | `--color-primary` #b85a28 (4,6:1) · `--color-primary-dark` #9c4a1e (6,2:1) |
| Texto | `--color-text` #1d2a3b · `--color-text-secondary` · `--color-text-muted` |
| Superficies | `--surface-base` · `--surface-raised` · `--surface-tinted`. **Solo tres** |
| Espaciado | `--space-1` a `--space-8`, múltiplos de 8 px salvo el primero |
| Radios | `--radius` (10 px) y `--radius-round`. **Solo dos en todo el sitio** |
| Sombras | `--shadow-sm` · `--shadow-md` · `--shadow-lg` |
| Tipografía | Figtree, un solo tipo. Los títulos se distinguen por peso |

Detalles que se olvidan y rompen la coherencia:

- Entre `--surface-raised` y `--surface-base` solo hay un 1,3 % de diferencia de
  luminosidad: si dos secciones seguidas los usan, hace falta `.section--filete`.
- Sobre `--surface-tinted` no uses `--color-primary-tint` como fondo de nada: son
  casi el mismo color y desaparece. Usa `--color-primary-tint-strong`.
- Sobre el naranja, el texto va en **blanco puro**. Al 90 % se queda en 3,7:1.

## Servicios que ofrece la clínica

Consulta general, vacunación, odontología, peluquería, análisis, cirugía y farmacia.
Están en un array al principio de `src/pages/servicios.astro`.

## Supabase

| Tabla | Para qué |
| :-- | :-- |
| `contacto_mensajes` | Mensajes del formulario de contacto |
| `contenidos` | Textos editables desde el panel (clave, valor, seccion, etiqueta, tipo) |

El cliente está en `src/lib/supabase.ts`. Para las páginas del panel, el guardián de
sesión es `requireAdmin(Astro)` de `src/lib/adminAuth.ts`:

```astro
---
const { user, redirect } = await requireAdmin(Astro);
if (redirect) return redirect;
---
```

## Formularios

Usa `.form-field` de `global.css` (ya trae label, input, foco y estados). El envío va
por script de cliente, con el botón deshabilitado mientras dura y un `<p role="status"
aria-live="polite">` para el resultado. Mira `src/pages/contacto.astro` como referencia.

## Antes de dar algo por terminado

- [ ] `npx astro check` sin errores
- [ ] Sin desbordes horizontales en 375 / 768 / 1024 / 1440
- [ ] Todo lo pulsable mide 44 px o más en móvil
- [ ] Contraste de 4,5:1 en texto normal y 3:1 en el grande
- [ ] Iconos SVG de trazo 2, viewBox 24×24. **Nunca emojis como iconos**
- [ ] Foco visible con teclado, y `prefers-reduced-motion` respetado
