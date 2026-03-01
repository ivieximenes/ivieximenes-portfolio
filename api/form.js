/**
 * Vercel Serverless Function — /api/form
 *
 * POST → proxy ao webhook do formulário de contato (n8n)
 *
 * Variáveis Vercel necessárias:
 *   N8N_FORM_WEBHOOK – URL do webhook do formulário
 */

// ---- Rate limit (in-memory, por instância Vercel) ----
// POST /api/form : máx 3 envios por 5 minutos por IP
const RATE_FORM = { max: 3, windowMs: 5 * 60_000 };

/** Map<ip, { count, windowStart }> */
const rateLimitStore = new Map();

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (fwd ? fwd.split(',')[0] : req.socket?.remoteAddress || 'unknown').trim();
}

/**
 * @returns {{ blocked: boolean, retryAfterSec: number }}
 */
function checkRateLimit(ip) {
  const now = Date.now();

  // Limpeza leve: remove entradas expiradas
  if (rateLimitStore.size > 1000) {
    for (const [k, v] of rateLimitStore) {
      if (now - v.windowStart > RATE_FORM.windowMs * 2) rateLimitStore.delete(k);
    }
  }

  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart >= RATE_FORM.windowMs) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return { blocked: false, retryAfterSec: 0 };
  }

  entry.count++;
  if (entry.count > RATE_FORM.max) {
    const retryAfterSec = Math.ceil((RATE_FORM.windowMs - (now - entry.windowStart)) / 1000);
    return { blocked: true, retryAfterSec };
  }

  return { blocked: false, retryAfterSec: 0 };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  // ---- Rate limit ----
  const ip = getClientIp(req);
  const { blocked, retryAfterSec } = checkRateLimit(ip);
  if (blocked) {
    res.setHeader('Retry-After', String(retryAfterSec));
    return res.status(429).json({
      error: `Muitas tentativas. Aguarde ${Math.ceil(retryAfterSec / 60)} minuto(s) antes de tentar novamente.`,
    });
  }

  const formWebhook = process.env.N8N_FORM_WEBHOOK;
  if (!formWebhook) return res.status(500).json({ error: 'N8N_FORM_WEBHOOK não configurado.' });

  try {
    const upstream = await fetch(formWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    return res.status(upstream.status).json({ ok: upstream.ok });
  } catch (err) {
    console.error('[api/form POST]', err);
    return res.status(502).json({ error: 'Erro ao enviar formulário.' });
  }
}
