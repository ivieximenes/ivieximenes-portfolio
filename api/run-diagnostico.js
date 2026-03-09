/**
 * Vercel Serverless Function — /api/run-diagnostico
 *
 * POST → validates code, checks daily quota, runs the n8n diagnostico workflow
 *
 * Body:
 *   { email: string, code: string, url: string }
 *
 * Response:
 *   200 → { html: string }  (HTML report from n8n)
 *   400 → { error: string }
 *   429 → { error: string }  (daily quota exceeded)
 *
 * Variáveis Vercel necessárias:
 *   N8N_DIAGNOSTICO_WEBHOOK – URL do webhook n8n do diagnóstico
 *   RESEND_API_KEY           – (herdado de send-code, para e-mail de resultado opcional)
 */

// ---- Code validation store (shared in-memory with send-code via module import) ----
// NOTE: In Vercel serverless, each function is a separate process.
// For true sharing, use Vercel KV. For this low-traffic portfolio case,
// we duplicate the code store here with import re-use pattern.
// Codes sent by /api/send-code are validated here independently —
// both modules share the node_modules cache ONLY within the same warm instance.
// For robustness, use Vercel KV (https://vercel.com/docs/storage/vercel-kv) if needed.
import { validateAndConsumeCode } from './send-code.js';

// ---- Daily quota store: email → { date (YYYY-MM-DD), count } ----
const quotaStore = new Map();
const DAILY_LIMIT = 1;

function getTodayStr() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC
}

function checkAndIncrementQuota(email) {
  const key   = email.toLowerCase();
  const today = getTodayStr();
  const entry = quotaStore.get(key);

  if (!entry || entry.date !== today) {
    quotaStore.set(key, { date: today, count: 1 });
    return false; // allowed
  }

  if (entry.count >= DAILY_LIMIT) return true; // blocked

  entry.count++;
  return false;
}

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (fwd ? fwd.split(',')[0] : req.socket?.remoteAddress || 'unknown').trim();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { email, code, url } = req.body || {};

  // ---- Input validation ----
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }
  if (!code || typeof code !== 'string' || !/^\d{6}$/.test(code.trim())) {
    return res.status(400).json({ error: 'Código inválido. Deve ter 6 dígitos.' });
  }
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return res.status(400).json({ error: 'URL inválida. Inclua https:// ou http://.' });
  }

  const normalEmail = email.trim().toLowerCase();
  const normalCode  = code.trim();
  const normalUrl   = url.trim();

  // ---- Validate code ----
  const { valid, reason } = validateAndConsumeCode(normalEmail, normalCode);
  if (!valid) {
    return res.status(400).json({ error: reason });
  }

  // ---- Daily quota ----
  if (checkAndIncrementQuota(normalEmail)) {
    return res.status(429).json({
      error: 'Você já utilizou o diagnóstico gratuito hoje. Volte amanhã para uma nova análise.',
    });
  }

  // ---- Env check ----
  const webhook = process.env.N8N_DIAGNOSTICO_WEBHOOK;
  if (!webhook) {
    console.error('[run-diagnostico] N8N_DIAGNOSTICO_WEBHOOK não configurado.');
    return res.status(500).json({ error: 'Serviço de diagnóstico não configurado.' });
  }

  // ---- Call n8n webhook ----
  try {
    const ip = getClientIp(req);

    const upstream = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url:   normalUrl,
        email: normalEmail,
        ip,
        requestedAt: new Date().toISOString(),
      }),
      // n8n workflows can take longer — 55s max for Vercel Hobby, 300s for Pro
      signal: AbortSignal.timeout(55_000),
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => '');
      console.error(`[run-diagnostico] n8n returned ${upstream.status}: ${errText}`);
      return res.status(502).json({
        error: 'O serviço de análise retornou um erro. Tente novamente em instantes.',
      });
    }

    // n8n can return JSON with { html } or plain HTML text
    const contentType = upstream.headers.get('content-type') || '';
    let html = '';

    if (contentType.includes('application/json')) {
      const data = await upstream.json();
      // Accept: { html }, { result }, { output }, or { data.html }
      html = data.html || data.result || data.output || data.data?.html || JSON.stringify(data, null, 2);
    } else {
      html = await upstream.text();
    }

    return res.status(200).json({ html });

  } catch (err) {
    if (err.name === 'TimeoutError') {
      console.error('[run-diagnostico] n8n webhook timeout');
      return res.status(504).json({
        error: 'A análise demorou mais do que o esperado. Tente novamente.',
      });
    }
    console.error('[run-diagnostico] Erro inesperado:', err.message);
    return res.status(500).json({ error: 'Erro interno. Tente novamente em instantes.' });
  }
}
