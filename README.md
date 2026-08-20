# Clínica Veterinaria Sedano

Web de la clínica, con panel de administración para gestionar los mensajes de
contacto y los textos de las páginas.

**Astro 6** · **Supabase** (base de datos y acceso al panel) · **Vercel** (despliegue)
· CSS propio con variables, sin frameworks de estilos.

Es una web informativa: no tiene reservas online ni avisos de urgencias.
El contacto es por teléfono, por el formulario o por el chat de ayuda.

## Antes de empezar

Hace falta Node 22.12 o superior.

```sh
npm install
cp .env.example .env   # y rellena las claves
npm run dev            # http://localhost:4321
```

### Variables de entorno

Copia `.env.example` a `.env` y rellena:

| Variable | De dónde sale |
| :-- | :-- |
| `PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API (la *anon public*) |
| `GROQ_API_KEY` | console.groq.com — solo para el chat de ayuda |

Sin las dos primeras, la portada y la página de contacto dan error.

## Datos de la clínica

Dirección, teléfono, correo y horarios **no** están repartidos por el código:
viven todos en [`src/config/clinica.ts`](src/config/clinica.ts).

Están tomados de la web actual de la clínica, clinicaveterinariasedano.com.
Si alguno cambia, cámbialo ahí y se actualiza el sitio entero de una vez.

Lo que se ponga como `PENDIENTE` se muestra en la web como «Por confirmar» en
lugar de inventar un dato.

## Base de datos

En el editor SQL de Supabase, ejecuta una sola vez:

1. `supabase-setup.sql` — tabla de mensajes de contacto y sus permisos
2. `supabase-contenidos.sql` — tabla de textos editables y sus valores iniciales

Después crea el usuario del panel en Supabase → Authentication → Users → Add User.

## Comandos

| Comando | Qué hace |
| :-- | :-- |
| `npm run dev` | Arranca el servidor local en `localhost:4321` |
| `npm run build` | Genera el sitio para producción |
| `npm run preview` | Previsualiza lo generado, antes de desplegar |
| `npx astro check` | Revisa los tipos de TypeScript |

## Estructura

```text
src/
├── components/     Header, Footer, tarjeta de servicio, chat
├── config/         clinica.ts — datos reales de la clínica
├── layouts/        Layout (web pública) y AdminLayout (panel)
├── lib/            Cliente de Supabase y control de acceso al panel
├── pages/
│   ├── admin/      Panel: mensajes y textos editables
│   └── api/        Endpoint del chat
└── styles/         global.css — el sistema de diseño completo
```

## Sistema de diseño

Todo sale de las variables de [`src/styles/global.css`](src/styles/global.css).
Si tocas algo, tócalo ahí:

- **Color**: el naranja del logotipo, `#e77f4a`, sobre texto azul pizarra
  `#1d2a3b` y fondo blanco cálido `#fdfbf8`. Ojo: `--color-brand` (`#e77f4a`) es
  solo para rellenos y gráficos, porque sobre blanco da 2.8:1. Todo lo que lleve
  texto usa `--color-primary` (`#b85a28`), el mismo naranja rebajado hasta 4.6:1.
- **Tipografía**: Open Sans, la misma que usa la web actual de la clínica.
- **Espaciado**: `--space-1` a `--space-8`, todos múltiplos de 8&nbsp;px salvo el
  primero (4&nbsp;px, para ajustes ópticos dentro de un componente).
- **Radios**: solo dos, `--radius` (10&nbsp;px) y `--radius-round`.
- **Sombras**: `--shadow-sm`, `--shadow-md` y `--shadow-lg`, suaves y tintadas
  hacia el color del texto.

## Despliegue

Vercel despliega solo con cada `push` a `main`. Las variables de entorno se
configuran en el panel de Vercel (Settings → Environment Variables), no en el
repositorio.

Cuando haya dominio propio, cámbialo en `site` dentro de
[`astro.config.mjs`](astro.config.mjs) para que el sitemap apunte bien.
