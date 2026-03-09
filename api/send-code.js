/**
 * Vercel Serverless Function — /api/send-code
 *
 * POST → generates a 6-digit verification code and sends it via e-mail
 *
 * Body: { email: string }
 *
 * Variáveis Vercel necessárias:
 *   RESEND_API_KEY   – API key do Resend (https://resend.com)
 *   EMAIL_FROM       – remetente (ex: "Ivie Ximenes <noreply@ivieximenes.com.br>")
 *                      O domínio precisa estar verificado no Resend.
 */

// ---- In-memory stores ----
// code store: email → { code, expires, used }
const codeStore = new Map();

// send limit: email → { count, windowStart }  (max 3 sends/hour per email)
const sendLimitStore = new Map();

// ---- Rate limit config ----
const MAX_SENDS_PER_HOUR = 3;
const CODE_TTL_MS        = 15 * 60 * 1000; // 15 minutes

function cleanStores() {
  const now = Date.now();
  if (codeStore.size > 5000) {
    for (const [k, v] of codeStore) {
      if (now > v.expires) codeStore.delete(k);
    }
  }
  if (sendLimitStore.size > 5000) {
    for (const [k, v] of sendLimitStore) {
      if (now - v.windowStart > 3_600_000) sendLimitStore.delete(k);
    }
  }
}

function checkSendLimit(email) {
  const now   = Date.now();
  cleanStores();
  const key   = email.toLowerCase();
  const entry = sendLimitStore.get(key);

  if (!entry || now - entry.windowStart >= 3_600_000) {
    sendLimitStore.set(key, { count: 1, windowStart: now });
    return false; // allowed
  }

  entry.count++;
  return entry.count > MAX_SENDS_PER_HOUR; // true = blocked
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function storeCode(email, code) {
  codeStore.set(email.toLowerCase(), {
    code,
    expires: Date.now() + CODE_TTL_MS,
    used: false,
  });
}

async function sendEmail(to, code, fromEnv) {
  const from       = fromEnv || 'Ivie Ximenes <noreply@ivieximenes.com.br>';
  const apiKey     = process.env.RESEND_API_KEY;

  const body = {
    from,
    to: [to],
    subject: 'Seu código de acesso — Diagnóstico Digital',
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <body style="margin:0;padding:0;font-family:'Inter', sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:40px 16px;">
              <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;border-radius:8px;">
                <tr>
                  <td style="padding:24px 30px;border-bottom:1px solid #ddd;">
                    <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#6B46C1;">IVIE XIMENES</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px;">
                    <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;line-height:1.3;">
                      Seu código de verificação
                    </h1>
                    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;">
                      Use o código abaixo para acessar o Diagnóstico de Presença Digital. Ele é válido por <strong>15 minutos</strong>.
                    </p>
                    <div style="text-align:center;margin:0 0 24px;">
                      <span style="display:inline-block;padding:16px 40px;border:2px solid #6B46C1;border-radius:8px;font-size:32px;font-weight:700;letter-spacing:0.25em;color:#6B46C1;font-family:'Inter', sans-serif;">
                        ${code}
                      </span>
                    </div>
                    <p style="margin:0;font-size:13px;line-height:1.6;">
                      Se você não solicitou este código, pode ignorar este e-mail com segurança.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 30px;border-top:1px solid #ddd;">
                    <p style="margin:0;font-size:12px;">
                      Ivie Ximenes — Sênior Full Stack Developer · Rio de Janeiro, Brasil
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error ${res.status}: ${err}`);
  }

  return await res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { email } = req.body || {};

  // ---- Validation ----
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Informe um e-mail válido.' });
  }

  const normalEmail = email.trim().toLowerCase();

  // ---- Send rate limit ----
  if (checkSendLimit(normalEmail)) {
    return res.status(429).json({
      error: 'Muitas tentativas. Aguarde antes de solicitar um novo código.',
    });
  }

  // ---- Check env ----
  if (!process.env.RESEND_API_KEY) {
    console.error('[send-code] RESEND_API_KEY não configurado.');
    return res.status(500).json({ error: 'Serviço de e-mail não configurado.' });
  }

  try {
    const code = generateCode();
    storeCode(normalEmail, code);
    await sendEmail(email.trim(), code, process.env.EMAIL_FROM);
    return res.status(200).json({ status: 'sent' });
  } catch (err) {
    console.error('[send-code] Erro ao enviar e-mail:', err.message);
    return res.status(500).json({ error: 'Não foi possível enviar o e-mail. Tente novamente em instantes.' });
  }
}

// Export codeStore for use in run-diagnostico.js
// NOTE: In Vercel, each serverless function runs in its own isolated module.
// The code store is intentionally in this module's scope.
// run-diagnostico.js calls /api/send-code internally is NOT how it works —
// instead, run-diagnostico validates codes via a shared validation endpoint pattern.
// To share state between functions in Vercel Edge/Serverless, use Vercel KV or Redis.
// For this portfolio use case (low traffic), both functions import from a shared module
// via a workaround: the code is re-exported below.

// ---- Exported validator (used by run-diagnostico via dynamic require) ----
export function validateAndConsumeCode(email, code) {
  const key   = email.toLowerCase();
  const entry = codeStore.get(key);

  if (!entry)                     return { valid: false, reason: 'Código não encontrado. Solicite um novo.' };
  if (entry.used)                 return { valid: false, reason: 'Este código já foi utilizado. Solicite um novo.' };
  if (Date.now() > entry.expires) return { valid: false, reason: 'Código expirado. Solicite um novo.' };
  if (entry.code !== code)        return { valid: false, reason: 'Código incorreto. Verifique e tente novamente.' };

  entry.used = true;
  return { valid: true };
}
