export const prerender = false;

import type { APIRoute } from 'astro';
import { clinica, valor } from '../../config/clinica';

/**
 * Modelo de Groq que responde en el chat.
 *
 * El anterior, llama-3.1-8b-instant, lo retiró Groq y dejó el chat mudo.
 * Para ver los que siguen vivos con tu clave:
 *   curl https://api.groq.com/openai/v1/models -H "Authorization: Bearer $GROQ_API_KEY"
 *
 * Se puede cambiar sin tocar el código con la variable GROQ_MODEL.
 */
const MODELO_POR_DEFECTO = 'openai/gpt-oss-120b';

/** Si Groq tarda más que esto, cortamos y avisamos en vez de dejar colgada la página. */
const TIEMPO_MAXIMO_MS = 20_000;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.GROQ_API_KEY;
  const modelo = import.meta.env.GROQ_MODEL || MODELO_POR_DEFECTO;

  if (!apiKey) {
    console.error('[chat] Falta GROQ_API_KEY en las variables de entorno');
    return new Response(JSON.stringify({ error: 'El chat no está configurado.' }), {
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
No prometas atención fuera del horario que aparece abajo, ni inventes cómo funciona la
clínica: si te preguntan si hace falta cita, si se puede pasar sin avisar o cuánto cuesta
algo, di que eso se pregunta por teléfono. Somos una clínica, no un hospital.

Datos confirmados de la clínica:
${datosConocidos || '- (todavía no hay datos de contacto cargados)'}

Formato de las respuestas:
- Dos o tres frases. Solo te extiendes si te piden explícitamente más detalle.
- Texto normal. Nada de títulos, tablas, emojis ni listas numeradas largas.
- Como mucho puedes destacar en **negrita** un teléfono o un horario.`;

  const cortar = AbortSignal.timeout(TIEMPO_MAXIMO_MS);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      signal: cortar,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelo,
        messages: [
          { role: 'system', content: systemPrompt },
          ...sanitized,
        ],
        // Es un modelo de razonamiento: en 'low' responde igual de bien para
        // preguntas de este tipo y gasta bastantes menos tokens.
        reasoning_effort: 'low',
        max_completion_tokens: 500,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      // El detalle se queda en el servidor: al visitante no le sirve de nada
      // y puede revelar cómo está montado esto por dentro.
      console.error(`[chat] Groq respondió ${response.status} con el modelo "${modelo}":`, JSON.stringify(err));
      return new Response(JSON.stringify({ error: 'El chat no está disponible ahora mismo.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.error('[chat] Groq devolvió una respuesta vacía:', JSON.stringify(data?.choices?.[0] ?? {}));
      return new Response(JSON.stringify({ error: 'El chat no está disponible ahora mismo.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const porTiempo = error instanceof Error && error.name === 'TimeoutError';
    console.error(porTiempo ? '[chat] Groq ha tardado demasiado' : '[chat] Fallo al llamar a Groq:', error);
    return new Response(JSON.stringify({ error: 'El chat no está disponible ahora mismo.' }), {
      status: porTiempo ? 504 : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};