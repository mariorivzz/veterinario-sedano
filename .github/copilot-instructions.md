# Veterinary Website - Copilot Instructions

## Project Overview
This is a veterinary clinic website built with **Astro 6**, **Supabase** as backend, and deployed to **Vercel**. The site is in Spanish (lang="es").

## Tech Stack
- **Framework**: Astro 6 (static + on-demand rendering)
- **Backend**: Supabase (Postgres DB, Auth, Edge Functions)
- **Deployment**: Vercel
- **Styling**: Vanilla CSS with custom properties (green theme #2d6a4f)
- **Language**: TypeScript

## Project Structure
```
src/
  components/   → Reusable .astro components (Header, Footer, ServiceCard)
  layouts/      → Page layouts (Layout.astro)
  lib/          → Utilities and clients (supabase.ts)
  pages/        → File-based routing (.astro pages)
  styles/       → Global CSS
public/         → Static assets
```

## Coding Conventions
- Use Astro components (.astro) for pages and UI — not React/Vue/Svelte unless explicitly needed
- Use `import.meta.env` for environment variables (never `process.env`)
- Supabase client is in `src/lib/supabase.ts` — import from there, don't create new clients
- All user-facing text must be in Spanish
- Use semantic HTML elements
- CSS uses custom properties for theming; primary color is `#2d6a4f`
- Forms submit data to Supabase tables using the JS client, not API endpoints

## Environment Variables
```
PUBLIC_SUPABASE_URL=...
PUBLIC_SUPABASE_ANON_KEY=...
```
Variables prefixed with `PUBLIC_` are exposed to the client.

## Supabase Tables
- `citas`: Appointment bookings (nombre, email, telefono, mascota, tipo_mascota, servicio, fecha, notas)

## Build & Dev Commands
- `npm run dev` — Start dev server (localhost:4321)
- `npm run build` — Production build
- `npm run preview` — Preview production build

## Deployment
Deploy to Vercel using the Astro adapter for Vercel. Set environment variables in the Vercel dashboard.
