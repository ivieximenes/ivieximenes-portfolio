/**
 * Vercel Serverless Function — /api/chat
 *
 * POST  → proxy ao webhook do chat (n8n)
 * GET   → proxy ao endpoint de status/inatividade (n8n)
 *
 * Variáveis Vercel necessárias:
 *   N8N_CHAT_WEBHOOK        – URL do webhook de chat
 *   N8N_CHAT_STATUS_WEBHOOK – URL do webhook de status/inatividade
 */

// ---- Rate limit (in-memory, por instância Vercel) ----
// POST /api/chat : máx 20 mensagens por minuto por IP
// GET  /api/chat : máx  6 polls   por minuto por IP  (polling a cada 30s = ~2/min normal)
const RATE_POST = { max: 20, windowMs: 60_000 };
const RATE_GET  = { max:  6, windowMs: 60_000 };

/** Map<ip_method, { count, windowStart }> */
const rateLimitStore = new Map();

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (fwd ? fwd.split(',')[0] : req.socket?.remoteAddress || 'unknown').trim();
}

/**
 * @returns {boolean} true = bloqueado (429 deve ser retornado)
 */
function checkRateLimit(ip, method) {
  const cfg = method === 'POST' ? RATE_POST : RATE_GET;
  const key = `${ip}:${method}`;
  const now = Date.now();

  // Limpeza leve: remove entradas com janela expirada há mais de 2× o período
  if (rateLimitStore.size > 2000) {
    for (const [k, v] of rateLimitStore) {
      if (now - v.windowStart > cfg.windowMs * 2) rateLimitStore.delete(k);
    }
  }

  const entry = rateLimitStore.get(key);

  if (!entry || now - entry.windowStart >= cfg.windowMs) {
    rateLimitStore.set(key, { count: 1, windowStart: now });
    return false;
  }

  entry.count++;
  if (entry.count > cfg.max) return true; // bloqueado
  return false;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ---- Rate limit ----
  const ip = getClientIp(req);
  if (req.method === 'POST' || req.method === 'GET') {
    if (checkRateLimit(ip, req.method)) {
      res.setHeader('Retry-After', '60');
      return res.status(429).json({ error: 'Muitas requisições. Aguarde um momento.' });
    }
  }

  // ---- POST: enviar mensagem ao agente ----
  if (req.method === 'POST') {
    const chatWebhook = process.env.N8N_CHAT_WEBHOOK;
    if (!chatWebhook) return res.status(500).json({ error: 'N8N_CHAT_WEBHOOK não configurado.' });

    try {
      const upstream = await fetch(chatWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
      const data = await upstream.json();
      return res.status(upstream.status).json(data);
    } catch (err) {
      console.error('[api/chat POST]', err);
      return res.status(502).json({ error: 'Erro ao contatar o webhook de chat.' });
    }
  }

  // ---- GET: verificar mensagens pendentes / status de inatividade ----
  if (req.method === 'GET') {
    const statusWebhook = process.env.N8N_CHAT_STATUS_WEBHOOK;
    if (!statusWebhook) return res.status(500).json({ error: 'N8N_CHAT_STATUS_WEBHOOK não configurado.' });

    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: 'sessionId obrigatório.' });

    try {
      const upstream = await fetch(`${statusWebhook}?sessionId=${encodeURIComponent(sessionId)}`);
      const data = await upstream.json();
      return res.status(upstream.status).json(data);
    } catch (err) {
      console.error('[api/chat GET]', err);
      return res.status(502).json({ error: 'Erro ao verificar status da sessão.' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido.' });
}
