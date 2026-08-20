/**
 * Datos de la clínica — fuente única de verdad.
 *
 * Tomados de la web actual, clinicaveterinariasedano.com (agosto de 2026).
 * Si alguno cambia, cámbialo aquí y se actualiza todo el sitio.
 *
 * Lo que se ponga como PENDIENTE se muestra en la web como «Por confirmar»,
 * nunca con un dato inventado.
 */

export const PENDIENTE = 'PENDIENTE' as const;

type Dato = string | typeof PENDIENTE;

export const clinica = {
  nombre: 'Clínica Veterinaria Sedano',
  nombreCorto: 'Sedano',

  direccion: 'Pso. Los Olivos, 32, 37005 Salamanca' as Dato,
  /** Enlace a Google Maps que ya usan en su web */
  mapa: 'https://maps.app.goo.gl/NuJusjU9isY7dBwG6',

  telefono: '923 70 69 58' as Dato,
  email: 'contacto@clinicaveterinariasedano.com' as Dato,

  horario: {
    semana: 'De lunes a viernes, de 9:30 a 20:30' as Dato,
    sabado: 'Sábados, de 10:00 a 14:00' as Dato,
    domingo: 'Domingos, cerrado' as Dato,
  },
} as const;

/** ¿Este dato sigue sin confirmar? */
export function esPendiente(valor: Dato): boolean {
  return valor === PENDIENTE;
}

/** El valor real, o null si todavía no lo tenemos. */
export function valor(dato: Dato): string | null {
  return esPendiente(dato) ? null : dato;
}

/** El teléfono listo para un enlace tel:, sin espacios. */
export function telefonoEnlace(): string | null {
  const tel = valor(clinica.telefono);
  return tel ? `tel:+34${tel.replace(/\s+/g, '')}` : null;
}
