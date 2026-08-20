import type { AstroGlobal } from 'astro';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

/**
 * Comprueba que quien entra tiene sesión de administrador.
 *
 * Uso en una página del panel:
 *   const { user, redirect } = await requireAdmin(Astro);
 *   if (redirect) return redirect;
 */
export async function requireAdmin(
  Astro: AstroGlobal
): Promise<{ user: User; redirect: null } | { user: null; redirect: Response }> {
  const token = Astro.cookies.get('sb-access-token')?.value;
  const refresh = Astro.cookies.get('sb-refresh-token')?.value;

  const alLogin = () => {
    Astro.cookies.delete('sb-access-token', { path: '/' });
    Astro.cookies.delete('sb-refresh-token', { path: '/' });
    return { user: null as null, redirect: Astro.redirect('/admin/login') };
  };

  if (!token || !refresh) {
    return alLogin();
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: token,
    refresh_token: refresh,
  });

  if (error || !data.session) {
    return alLogin();
  }

  return { user: data.session.user, redirect: null };
}

/** Fecha corta en español: '20 ago 2026' */
export function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
