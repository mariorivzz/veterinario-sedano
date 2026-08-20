export const prerender = false;

import type { APIRoute } from 'astro';
import { clinica, valor } from '../../config/clinica';

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.GROQ_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key de Groq no configurada' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Cuerpo de petición inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const messages = body.messages ?? [];

  const allowedRoles = new Set(['user', 'assistant']);
  const sanitized = messages
    .filter(m => allowedRoles.has(m.role) && typeof m.content === 'string')
    .slice(-20);

  // Solo pasamos al modelo los datos que están confirmados: si un dato falta,
  // preferimos que diga que no lo sabe a que se lo invente.
  const datosConocidos = [
    ['Teléfono', valor(clinica.telefono)],
    ['Correo', valor(clinica.email)],
    ['Dirección', valor(clinica.direccion)],
    ['Horario entre semana', valor(clinica.horario.semana)],
    ['Horario los sábados', valor(clinica.horario.sabado)],
    ['Domingos', valor(clinica.horario.domingo)],
  ]
    .filter((entrada): entrada is [string, string] => entrada[1] !== null)
    .map(([etiqueta, dato]) => `- ${etiqueta}: ${dato}`)
    .join('\n');

  const systemPrompt = `Eres el asistente de ${clinica.nombre}, una clínica veterinaria.

Ayudas a la gente en español, con un tono cercano y sencillo. Escribe para dueños de mascotas
sin conocimientos de medicina: nada de tecnicismos, frases cortas y directas.

Puedes:
- Resolver dudas generales sobre el cuidado de mascotas (perros, gatos, conejos, aves…)
- Explicar los servicios de la clínica: consulta general, vacunación, odontología, peluquería, análisis, cirugía y farmacia
- Ayudar a decidir si conviene traer al animal a la clínica
- Dar consejos de alimentación, higiene y bienestar

Nunca debes:
- Diagnosticar ni sustituir una consulta veterinaria de verdad
- Inventarte precios, horarios, direcciones, teléfonos ni datos de la clínica.
  Si no aparecen abajo, di que no tienes ese dato y remite a la página de contacto.
- Hablar de temas que no tengan que ver con animales o con la clínica

Si lo que cuentan suena grave, di claramente que llamen a la clínica cuanto antes.
No prometas atención fuera del horario que aparece abajo.

Datos confirmados de la clínica:
${datosConocidos || '- (todavía no hay datos de contacto cargados)'}

Sé breve: dos o tres frases por respuesta salvo que te pidan más detalle.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          ...sanitized,
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('[chat] Groq error:', JSON.stringify(err));
      const message = err?.error?.message ?? 'Error desconocido';
      return new Response(JSON.stringify({ error: message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? 'Lo siento, no pude generar una respuesta.';

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};