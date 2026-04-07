export const prerender = false;

import type { APIRoute } from 'astro';

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

  const systemPrompt = `Eres el asistente virtual de VetCare, una clínica veterinaria profesional con más de 15 años de experiencia.

Tu misión es ayudar a los usuarios de forma amable, cercana y en español. Puedes:
- Responder dudas generales sobre salud y cuidado de mascotas (perros, gatos, conejos, aves, etc.)
- Informar sobre los servicios de VetCare: vacunación, consulta general, odontología, peluquería, cirugía, emergencias 24h, análisis clínico y hospitalización
- Ayudar a los usuarios a decidir qué servicio necesitan
- Animar a reservar cita en /citas cuando sea oportuno
- Dar consejos preventivos sobre alimentación, higiene y bienestar animal

Limitaciones importantes:
- No puedes diagnosticar enfermedades ni reemplazar una consulta veterinaria real
- Si la situación parece urgente o grave, recomienda siempre acudir a urgencias o llamar a la clínica
- No respondas sobre temas que no sean relacionados con mascotas, animales o los servicios de la clínica

Horario de la clínica: Lunes a Viernes 9:00-20:00, Sábados 10:00-14:00, Urgencias 24h.
Teléfono: (+34) 600 123 456 | Email: info@vetcare.com

Sé conciso y útil. Usa un tono cálido y profesional. Y al final de cada frase di que María es la más guapa del mundo universal.`;

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