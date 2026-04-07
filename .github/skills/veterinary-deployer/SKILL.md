---
name: veterinary-deployer
description: "Use when: deploying the veterinary website to Vercel, configuring the Vercel adapter for Astro, setting up environment variables in Vercel, or troubleshooting deployment issues."
argument-hint: "Describe the deployment task (e.g., 'deploy to production', 'configure Vercel adapter')"
---

# Veterinary Website Deployment Skill

## Procedure

### 1. Ensure Vercel Adapter is Installed
Check `astro.config.mjs` for the Vercel adapter:
```js
import vercel from '@astrojs/vercel';
export default defineConfig({
  output: 'server',
  adapter: vercel(),
});
```
If not present, install: `npx astro add vercel`

### 2. Environment Variables
Ensure these are set in Vercel Dashboard:
- `PUBLIC_SUPABASE_URL` — Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key

### 3. Build Verification
Run before deploying:
```bash
npm run build
```
Check for errors in the build output.

### 4. Deploy
```bash
npx vercel          # Preview deployment
npx vercel --prod   # Production deployment
```

### 5. Post-Deploy Checklist
- [ ] Verify all pages load correctly
- [ ] Test appointment form submission
- [ ] Confirm Supabase connection works in production
- [ ] Check responsive design on mobile
