// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Cambia esto por el dominio definitivo cuando lo tengas.
  // Mientras tanto vale la URL que da Vercel: https://<proyecto>.vercel.app
  site: 'https://veterinario-sedano.vercel.app',
  output: 'static',
  adapter: vercel(),
  integrations: [
    sitemap({
      // El panel de administración no debe salir en Google
      filter: (page) => !page.includes('/admin'),
    }),
  ],
});
