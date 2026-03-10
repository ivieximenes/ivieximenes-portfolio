/**
 * Vercel Serverless Function — /api/diagnostico
 *
 * Handles the full diagnostico tool flow in a single Lambda to share in-memory state:
 *
 *  POST { action: 'send_code', email }
 *    → Generates + sends a 6-digit verification code via e-mail
 *    → Returns { status: 'sent' }
 *
 *  POST { action: 'run', email, code, url, nicho, cidade }
 *    → Validates code, checks daily quota, calls n8n webhook
 *    → Returns { html: string }
 *
 * Variáveis Vercel necessárias:
 *   GMAIL_USER       – Seu e-mail Gmail (ex: ivieximenes.dev@gmail.com)
 *   GMAIL_APP_PASS   – Senha de app do Google (Google Account → Segurança → Senhas de app)
 *   ALLOWED_ORIGIN   – Domínio do site (ex: https://ivieximenes.com.br) — opcional, padrão abaixo
 *
 * NOTA: O codeStore e quotaStore são in-memory e compartilhados dentro do mesmo
 * processo Lambda aquecido. Para alta escala, migrar para Vercel KV / Upstash Redis.
 */

import nodemailer from 'nodemailer';

// ============================================================
//  ALLOWED ORIGINS — rejeita chamadas fora do site
// ============================================================
const PRODUCTION_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://ivieximenes.com.br';
const ALLOWED_ORIGINS   = new Set([
  PRODUCTION_ORIGIN,
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  'https://ivieximenes-portfolio-git-dev-ivieximenes-projects.vercel.app/',
  'https://www.ivieximenes.cloud',
]);

function getAllowedOrigin(req) {
  const origin = req.headers['origin'] || '';
  return ALLOWED_ORIGINS.has(origin) ? origin : null;
}

function isAllowedRequest(req) {
  const origin   = req.headers['origin']   || '';
  const referer  = req.headers['referer']  || '';
  // Allow if origin matches
  if (ALLOWED_ORIGINS.has(origin)) return true;
  // Allow if referer starts with any allowed origin
  for (const o of ALLOWED_ORIGINS) {
    if (referer.startsWith(o)) return true;
  }
  return false;
}

// ============================================================
//  IN-MEMORY STORES (shared within same warm Lambda instance)
// ============================================================

/** Map<normalizedEmail, { code, expires, used }> */
const codeStore = new Map();

/** Map<normalizedEmail, { count, windowStart }> — max 3 sends/hour */
const sendLimitStore = new Map();

/** Map<normalizedEmail, { date: 'YYYY-MM-DD', count }> — max 1 use/day */
const quotaStore = new Map();

// ============================================================
//  CONSTANTS
// ============================================================
const CODE_TTL_MS        = 15 * 60 * 1000;   // 15 minutes
const MAX_SENDS_PER_HOUR = 3;
const DAILY_LIMIT        = 1;

// ============================================================
//  HELPERS
// ============================================================

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getTodayUTC() {
  return new Date().toISOString().slice(0, 10);
}

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (fwd ? fwd.split(',')[0] : req.socket?.remoteAddress || 'unknown').trim();
}

// ---- Periodic light cleanup (prevents unbounded growth) ----
function cleanStores() {
  const now = Date.now();
  if (codeStore.size > 3000) {
    for (const [k, v] of codeStore) if (now > v.expires) codeStore.delete(k);
  }
  if (sendLimitStore.size > 3000) {
    for (const [k, v] of sendLimitStore) if (now - v.windowStart > 3_600_000 * 2) sendLimitStore.delete(k);
  }
}

// ============================================================
//  SEND LIMIT  (max 3 sends/hour per email)
// ============================================================
function checkSendLimit(normalEmail) {
  const now = Date.now();
  cleanStores();
  const entry = sendLimitStore.get(normalEmail);
  if (!entry || now - entry.windowStart >= 3_600_000) {
    sendLimitStore.set(normalEmail, { count: 1, windowStart: now });
    return false; // allowed
  }
  entry.count++;
  return entry.count > MAX_SENDS_PER_HOUR; // true = blocked
}

// ============================================================
//  DAILY QUOTA  (max 1 run/day per email)
// ============================================================
function checkAndIncrementQuota(normalEmail) {
  // Permite múltiplas análises para o e-mail master
  if (normalEmail === 'ivieximenes@gmail.com') return false;
  const today = getTodayUTC();
  const entry = quotaStore.get(normalEmail);
  if (!entry || entry.date !== today) {
    quotaStore.set(normalEmail, { date: today, count: 1 });
    return false; // allowed
  }
  if (entry.count >= DAILY_LIMIT) return true; // blocked
  entry.count++;
  return false;
}

// ============================================================
//  CODE STORE
// ============================================================
function storeCode(normalEmail, code) {
  codeStore.set(normalEmail, { code, expires: Date.now() + CODE_TTL_MS, used: false });
}

function validateAndConsumeCode(normalEmail, code) {
  const entry = codeStore.get(normalEmail);
  if (!entry)         return { valid: false, reason: 'Código não encontrado. Solicite um novo.' };
  if (entry.used)     return { valid: false, reason: 'Este código já foi utilizado. Solicite um novo.' };
  if (Date.now() > entry.expires) return { valid: false, reason: 'Código expirado. Solicite um novo.' };
  if (entry.code !== code) return { valid: false, reason: 'Código incorreto. Verifique e tente novamente.' };
  entry.used = true;
  return { valid: true };
}

// ============================================================
//  EMAIL SENDER (Gmail SMTP via nodemailer)
// ============================================================
async function sendVerificationEmail(to, code) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASS;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <body style="margin:0;padding:0;font-family:Inter, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding:40px 16px;">
          <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;border-radius:16px;">
            <tr><td style="padding:32px 40px 24px;border-bottom:1px solid #ddd;">
              <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#A855F7;">IVIE XIMENES</p>
            </td></tr>
            <tr><td style="padding:32px 40px;">
              <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;line-height:1.3;">Seu código de verificação</h1>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.7;">
                Use o código abaixo para acessar o Diagnóstico de Presença Digital.<br>
                Válido por <strong>15 minutos</strong>.
              </p>
              <div style="text-align:center;margin:0 0 28px;">
                <span style="display:inline-block;padding:20px 48px;border:2px solid #A855F7;border-radius:12px;font-size:36px;font-weight:700;letter-spacing:0.25em;color:#A855F7;font-family:'Inter', sans-serif;">
                  ${code}
                </span>
              </div>
              <p style="margin:0;font-size:13px;line-height:1.7;">
                Se você não solicitou este código, ignore este e-mail.<br>
              </p>
            </td></tr>
            <tr><td style="padding:20px 40px;border-top:1px solid #ddd;">
              <p style="margin:0;font-size:12px;">Ivie Ximenes · Sênior Full Stack Developer · Rio de Janeiro, Brasil</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Ivie Ximenes" <${user}>`,
    to,
    subject: 'Seu código de acesso — Diagnóstico Digital',
    html,
  });
}

// ============================================================
//  MAIN HANDLER
// ============================================================
export default async function handler(req, res) {
  const allowedOrigin = getAllowedOrigin(req);

  // CORS — only expose to allowed origins
  res.setHeader('Access-Control-Allow-Origin',  allowedOrigin || PRODUCTION_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });

  // Block requests from outside the website
  if (!isAllowedRequest(req)) {
    return res.status(403).json({ error: 'Acesso não autorizado.' });
  }

  const { action, email, code, url } = req.body || {};

  // ======================================================
  //  ACTION: send_code
  // ======================================================
  if (action === 'send_code') {
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Informe um e-mail válido.' });
    }
    const normalEmail = normalizeEmail(email);

    if (checkSendLimit(normalEmail)) {
      return res.status(429).json({ error: 'Muitas tentativas. Aguarde antes de solicitar um novo código.' });
    }
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
      console.error('[diagnostico] GMAIL_USER ou GMAIL_APP_PASS não configurados.');
      return res.status(500).json({ error: 'Serviço de e-mail não configurado.' });
    }

    try {
      const newCode = generateCode();
      storeCode(normalEmail, newCode);
      await sendVerificationEmail(email.trim(), newCode);
      return res.status(200).json({ status: 'sent' });
    } catch (err) {
      console.error('[diagnostico] Erro ao enviar e-mail:', err.message);
      return res.status(500).json({ error: 'Não foi possível enviar o e-mail. Tente novamente.' });
    }
  }

  // ======================================================
  //  ACTION: run
  // ======================================================
  if (action === 'run') {
    const { nicho, cidade } = req.body || {};

    // Validate inputs
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'E-mail inválido.' });
    }
    if (!code || !/^\d{6}$/.test(String(code).trim())) {
      return res.status(400).json({ error: 'Código inválido. Deve ter 6 dígitos.' });
    }
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return res.status(400).json({ error: 'URL inválida. Inclua https:// ou http://.' });
    }
    if (!nicho || typeof nicho !== 'string' || !nicho.trim()) {
      return res.status(400).json({ error: 'Informe o nicho ou segmento do negócio.' });
    }
    if (!cidade || typeof cidade !== 'string' || !cidade.trim()) {
      return res.status(400).json({ error: 'Informe a cidade.' });
    }

    const normalEmail = normalizeEmail(email);
    const normalCode  = String(code).trim();

    // Validate code
    const { valid, reason } = validateAndConsumeCode(normalEmail, normalCode);
    if (!valid) return res.status(400).json({ error: reason });

    // Check daily quota (only in production)
    // Só aplica limitação diária se VERCEL_ENV === 'production'
    if (process.env.VERCEL_ENV === 'production' && checkAndIncrementQuota(normalEmail)) {
      return res.status(429).json({
        error: 'Você já utilizou o diagnóstico gratuito hoje. Volte amanhã para uma nova análise.',
      });
    }

    // Check env
    const webhook = process.env.N8N_DIAGNOSTICO_WEBHOOK
      || 'https://flowhub-n8n-webhook.easypanel.ivieximenes.cloud/webhook/diagnostico';

    // Call n8n
    try {
      const ip       = getClientIp(req);
      const upstream = await fetch(webhook, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          landing_page_url: url.trim(),
          nicho:            nicho.trim(),
          cidade:           cidade.trim(),
          email:            normalEmail,
          ip,
          requestedAt:      new Date().toISOString(),
        })
      });

      if (!upstream.ok) {
        const errText = await upstream.text().catch(() => '');
        console.error(`[diagnostico] n8n retornou ${upstream.status}: ${errText}`);
        return res.status(502).json({ error: 'O serviço de análise retornou um erro. Tente novamente.' });
      }

      const contentType = upstream.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const result = await upstream.json();
        return res.status(200).json({ result });
      } else {
        const html = await upstream.text();
        return res.status(200).json({ html });
      }

    } catch (err) {
      console.error('[diagnostico] Erro inesperado:', err.message);
      return res.status(500).json({ error: 'Erro interno. Tente novamente em instantes.' });
    }
  }

  // Unknown action
  return res.status(400).json({ error: 'Ação inválida.' });
}
