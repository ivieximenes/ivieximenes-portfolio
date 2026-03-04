/* =============================================
   TOOL: DIAGNÓSTICO DE PRESENÇA DIGITAL
   Step machine: form → verify → loading → result
   ============================================= */

/* ---- Module-level state ---- */
let _diagState = {
  step:      'form',   // 'form' | 'verify' | 'loading' | 'result'
  url:       '',
  nicho:     '',
  cidade:    '',
  email:     '',
  error:     '',
  resultHtml: '',
  resultData: null,   // parsed JSON from n8n
  resendCooldown: 0,  // seconds remaining
  resendTimer:    null,
};

function _setDiagState(patch) {
  Object.assign(_diagState, patch);
}

/* ---- Root render ---- */
function renderToolDiagnostico() {
  return `
    <section class="tool-page">
      <div class="tool-page__back">
        <a href="/ferramentas" class="tool-page__back-link" data-route="/ferramentas">
          <i class="ph ph-arrow-left"></i> Ferramentas
        </a>
      </div>
      <div id="diag-container"></div>
    </section>
  `;
}

function initToolDiagnostico() {
  // Reset state on page load
  if (_diagState.resendTimer) clearInterval(_diagState.resendTimer);
  _diagState = {
    step: 'form', url: '', nicho: '', cidade: '', email: '', error: '', resultHtml: '', resultData: null,
    resendCooldown: 0, resendTimer: null,
  };
  _renderDiagStep();
}

/* ---- Step renderer ---- */
function _renderDiagStep() {
  const container = document.getElementById('diag-container');
  if (!container) return;

  switch (_diagState.step) {
    case 'form':    container.innerHTML = _diagFormHTML();    _attachDiagFormListeners();    break;
    case 'verify':  container.innerHTML = _diagVerifyHTML();  _attachDiagVerifyListeners();  break;
    case 'loading': container.innerHTML = _diagLoadingHTML(); _animateDiagLoading(); break;
    case 'result':  container.innerHTML = _diagResultHTML();  _attachDiagResultListeners();  break;
  }
}

/* ---- Step indicator ---- */
function _stepIndicator(active) {
  const steps = [
    { key: 'form',   label: 'Dados',       icon: 'ph-globe'           },
    { key: 'verify', label: 'E-mail',      icon: 'ph-envelope-simple' },
    { key: 'result', label: 'Resultado',   icon: 'ph-chart-bar'       },
  ];
  const activeIdx = steps.findIndex(s => s.key === active);
  return `
    <div class="tool-steps">
      ${steps.map((s, i) => `
        <div class="tool-step ${i < activeIdx ? 'tool-step--done' : ''} ${i === activeIdx ? 'tool-step--active' : ''}">
          <div class="tool-step__icon">
            ${i < activeIdx ? '<i class="ph ph-check-bold"></i>' : `<i class="ph ${s.icon}"></i>`}
          </div>
          <span>${s.label}</span>
        </div>
        ${i < steps.length - 1 ? `<div class="tool-step__line ${i < activeIdx ? 'tool-step__line--done' : ''}"></div>` : ''}
      `).join('')}
    </div>
  `;
}

/* ==========================================
   STEP 1 — FORM
   ========================================== */

function _diagFormHTML() {
  return `
    <div class="tool-card-page">
      ${_stepIndicator('form')}

      <div class="tool-card-page__header">
        <div class="tool-card-page__icon">
          <i class="ph ph-magnifying-glass-plus"></i>
        </div>
        <h1 class="tool-card-page__title">Diagnóstico de Presença Digital</h1>
        <p class="tool-card-page__desc">
          Informe o site a ser analisado e seu e-mail para receber o código de acesso.
          O relatório inclui dados de velocidade, SEO, acessibilidade, concorrentes locais e potencial de mercado.
        </p>
      </div>

      <div class="tool-card-page__notice">
        <i class="ph ph-warning"></i>
        <p>O diagnóstico é gerado por automação e pode exigir validação manual. Recomenda-se sempre verificar os dados no contexto real do negócio.</p>
      </div>

      ${_diagState.error ? `<div class="tool-error"><i class="ph ph-x-circle"></i> ${_diagState.error}</div>` : ''}

      <form id="diag-form" class="tool-form" novalidate>
        <div class="tool-form__field">
          <label for="diag-url">URL da landing page a analisar</label>
          <div class="tool-form__input-wrap">
            <i class="ph ph-globe"></i>
            <input
              type="url"
              id="diag-url"
              name="url"
              placeholder="https://seusite.com.br"
              value="${_diagState.url}"
              autocomplete="url"
              required
            />
          </div>
          <span class="tool-form__hint">Inclua https:// ou http://</span>
        </div>

        <div class="tool-form__row">
          <div class="tool-form__field">
            <label for="diag-nicho">Nicho / Segmento</label>
            <div class="tool-form__input-wrap">
              <i class="ph ph-tag"></i>
              <input
                type="text"
                id="diag-nicho"
                name="nicho"
                placeholder="Ex: Clínica odontológica"
                value="${_diagState.nicho}"
                required
              />
            </div>
          </div>

          <div class="tool-form__field">
            <label for="diag-cidade">Cidade</label>
            <div class="tool-form__input-wrap">
              <i class="ph ph-map-pin"></i>
              <input
                type="text"
                id="diag-cidade"
                name="cidade"
                placeholder="Ex: Rio de Janeiro"
                value="${_diagState.cidade}"
                required
              />
            </div>
          </div>
        </div>

        <div class="tool-form__field">
          <label for="diag-email">Seu e-mail</label>
          <div class="tool-form__input-wrap">
            <i class="ph ph-envelope-simple"></i>
            <input
              type="email"
              id="diag-email"
              name="email"
              placeholder="voce@empresa.com"
              value="${_diagState.email}"
              autocomplete="email"
              required
            />
          </div>
          <span class="tool-form__hint">Enviaremos um código de 6 dígitos para confirmar seu acesso.</span>
        </div>

        <button type="submit" class="btn btn--primary btn--full" id="diag-submit">
          <i class="ph ph-paper-plane-tilt"></i> Enviar código de acesso
        </button>

        <p class="tool-form__terms">
          Ao continuar, você concorda que seu e-mail será usado apenas para controle de acesso.
          Limite: 1 diagnóstico por dia.
        </p>
      </form>
    </div>
  `;
}

function _attachDiagFormListeners() {
  const form   = document.getElementById('diag-form');
  const submit = document.getElementById('diag-submit');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url    = document.getElementById('diag-url').value.trim();
    const nicho  = document.getElementById('diag-nicho').value.trim();
    const cidade = document.getElementById('diag-cidade').value.trim();
    const email  = document.getElementById('diag-email').value.trim();

    // Basic validation
    if (!url || !url.startsWith('http')) {
      _setDiagState({ error: 'Informe uma URL válida (começando com https:// ou http://).' });
      _renderDiagStep();
      return;
    }
    if (!nicho) {
      _setDiagState({ error: 'Informe o nicho ou segmento do negócio.' });
      _renderDiagStep();
      return;
    }
    if (!cidade) {
      _setDiagState({ error: 'Informe a cidade.' });
      _renderDiagStep();
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      _setDiagState({ error: 'Informe um e-mail válido.' });
      _renderDiagStep();
      return;
    }

    submit.disabled = true;
    submit.innerHTML = '<i class="ph ph-circle-notch ph-spin"></i> Enviando...';

    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_code', email }),
      });
      const data = await res.json();

      if (!res.ok) {
        _setDiagState({ error: data.error || 'Não foi possível enviar o código. Tente novamente.' });
        _renderDiagStep();
        return;
      }

      _setDiagState({ url, nicho, cidade, email, error: '', step: 'verify', resendCooldown: 60 });
      _renderDiagStep();
      _startResendTimer();

    } catch {
      _setDiagState({ error: 'Erro de conexão. Verifique sua internet e tente novamente.' });
      _renderDiagStep();
    }
  });
}

/* ==========================================
   STEP 2 — VERIFY
   ========================================== */

function _diagVerifyHTML() {
  const masked = _diagState.email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c);
  const canResend = _diagState.resendCooldown <= 0;

  return `
    <div class="tool-card-page">
      ${_stepIndicator('verify')}

      <div class="tool-card-page__header">
        <div class="tool-card-page__icon tool-card-page__icon--verify">
          <i class="ph ph-envelope-open"></i>
        </div>
        <h1 class="tool-card-page__title">Verifique seu e-mail</h1>
        <p class="tool-card-page__desc">
          Enviamos um código de <strong>6 dígitos</strong> para <strong>${masked}</strong>.
          Verifique sua caixa de entrada (e o spam).
        </p>
      </div>

      ${_diagState.error ? `<div class="tool-error"><i class="ph ph-x-circle"></i> ${_diagState.error}</div>` : ''}

      <form id="verify-form" class="tool-form" novalidate>
        <div class="tool-form__field">
          <label for="diag-code">Código de verificação</label>
          <div class="tool-form__input-wrap">
            <i class="ph ph-password"></i>
            <input
              type="text"
              id="diag-code"
              name="code"
              placeholder="000000"
              maxlength="6"
              inputmode="numeric"
              pattern="[0-9]{6}"
              autocomplete="one-time-code"
              required
            />
          </div>
        </div>

        <button type="submit" class="btn btn--primary btn--full" id="verify-submit">
          <i class="ph ph-check-circle"></i> Confirmar e iniciar análise
        </button>

        <div class="tool-form__resend">
          <button type="button" id="resend-btn" class="tool-form__resend-btn ${canResend ? '' : 'disabled'}" ${canResend ? '' : 'disabled'}>
            ${canResend
              ? '<i class="ph ph-arrow-clockwise"></i> Reenviar código'
              : `<i class="ph ph-clock"></i> Reenviar em ${_diagState.resendCooldown}s`
            }
          </button>
          <button type="button" id="back-btn" class="tool-form__back-btn">
            <i class="ph ph-arrow-left"></i> Alterar e-mail
          </button>
        </div>
      </form>
    </div>
  `;
}

function _attachDiagVerifyListeners() {
  const form         = document.getElementById('verify-form');
  const submitBtn    = document.getElementById('verify-submit');
  const resendBtn    = document.getElementById('resend-btn');
  const backBtn      = document.getElementById('back-btn');
  const codeInput    = document.getElementById('diag-code');

  // Auto-format: digits only, max 6
  codeInput?.addEventListener('input', () => {
    codeInput.value = codeInput.value.replace(/\D/g, '').slice(0, 6);
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = codeInput.value.trim();
    if (code.length !== 6) {
      _setDiagState({ error: 'O código deve ter 6 dígitos.' });
      _renderDiagStep();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="ph ph-circle-notch ph-spin"></i> Verificando...';

    _setDiagState({ step: 'loading', error: '' });
    _renderDiagStep();

    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run',
          email:  _diagState.email,
          code,
          url:    _diagState.url,
          nicho:  _diagState.nicho,
          cidade: _diagState.cidade,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        _setDiagState({ step: 'verify', error: data.error || 'Código inválido ou expirado. Tente novamente.' });
        _renderDiagStep();
        return;
      }

      // Parse result: n8n may return array [{...}] or object {...}
      let parsedData = null;
      let fallbackHtml = '';
      const raw = data.result ?? data.html ?? null;
      if (raw !== null && typeof raw === 'object') {
        parsedData = Array.isArray(raw) ? (raw[0] || null) : raw;
      } else if (typeof raw === 'string') {
        try {
          const parsed = JSON.parse(raw);
          parsedData = Array.isArray(parsed) ? (parsed[0] || null) : parsed;
        } catch { fallbackHtml = raw; }
      }
      _setDiagState({ step: 'result', resultHtml: fallbackHtml, resultData: parsedData });
      _renderDiagStep();

    } catch {
      _setDiagState({ step: 'verify', error: 'Erro de conexão. Tente novamente.' });
      _renderDiagStep();
    }
  });

  resendBtn?.addEventListener('click', async () => {
    if (_diagState.resendCooldown > 0) return;
    resendBtn.disabled = true;
    resendBtn.innerHTML = '<i class="ph ph-circle-notch ph-spin"></i> Enviando...';

    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_code', email: _diagState.email }),
      });
      const data = await res.json();

      if (!res.ok) {
        _setDiagState({ error: data.error || 'Não foi possível reenviar o código.' });
      } else {
        _setDiagState({ error: '', resendCooldown: 60 });
        _startResendTimer();
      }
    } catch {
      _setDiagState({ error: 'Erro ao reenviar. Tente novamente.' });
    }
    _renderDiagStep();
  });

  backBtn?.addEventListener('click', () => {
    if (_diagState.resendTimer) clearInterval(_diagState.resendTimer);
    _setDiagState({ step: 'form', error: '', resendCooldown: 0 });
    _renderDiagStep();
  });
}

function _startResendTimer() {
  if (_diagState.resendTimer) clearInterval(_diagState.resendTimer);
  _diagState.resendTimer = setInterval(() => {
    _diagState.resendCooldown = Math.max(0, _diagState.resendCooldown - 1);
    // Update button text in-place without full re-render
    const btn = document.getElementById('resend-btn');
    if (btn) {
      if (_diagState.resendCooldown <= 0) {
        clearInterval(_diagState.resendTimer);
        btn.disabled = false;
        btn.classList.remove('disabled');
        btn.innerHTML = '<i class="ph ph-arrow-clockwise"></i> Reenviar código';
      } else {
        btn.innerHTML = `<i class="ph ph-clock"></i> Reenviar em ${_diagState.resendCooldown}s`;
      }
    }
  }, 1000);
}

/* ==========================================
   STEP 3 — LOADING
   ========================================== */

function _diagLoadingHTML() {
  return `
    <div class="tool-card-page tool-card-page--loading">
      <div class="tool-loading">
        <div class="tool-loading__orb"></div>
        <h2 class="tool-loading__title">Analisando seu site</h2>
        <p class="tool-loading__sub">Isso pode levar até 30 segundos.<br>Coletando dados de velocidade, SEO e concorrentes...</p>
        <div class="tool-loading__steps">
          <div class="tool-loading__item active" id="lstep-1">
            <i class="ph ph-circle-notch ph-spin"></i>
            <span>Google PageSpeed Insights</span>
          </div>
          <div class="tool-loading__item" id="lstep-2">
            <i class="ph ph-circle-notch"></i>
            <span>SEO &amp; Acessibilidade</span>
          </div>
          <div class="tool-loading__item" id="lstep-3">
            <i class="ph ph-circle-notch"></i>
            <span>Concorrentes no Google Maps</span>
          </div>
          <div class="tool-loading__item" id="lstep-4">
            <i class="ph ph-circle-notch"></i>
            <span>Estimativa de potencial de mercado</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================
   LOADING ANIMATION
   ========================================== */

function _animateDiagLoading() {
  const delaysMs = [0, 8000, 18000, 30000];
  delaysMs.forEach((delay, i) => {
    setTimeout(() => {
      const item = document.getElementById(`lstep-${i + 1}`);
      if (!item) return;
      item.classList.add('active');
      const icon = item.querySelector('i.ph');
      if (icon) {
        icon.classList.remove('ph-circle-notch');
        icon.classList.add('ph-circle-notch', 'ph-spin');
      }
    }, delay);
  });
}

/* ==========================================
   STEP 4 — RESULT
   ========================================== */

function _scoreColor(score) {
  if (score >= 70) return '#22C55E';
  if (score >= 40) return '#F97316';
  return '#EF4444';
}

function _scoreLabel(score) {
  if (score >= 70) return 'Bom';
  if (score >= 40) return 'Atenção';
  return 'Crítico';
}

function _urgencyColor(level) {
  const map = { 'CRÍTICO': '#EF4444', 'ALTO': '#F97316', 'MÉDIO': '#EAB308', 'BAIXO': '#22C55E' };
  return map[(level || '').toUpperCase()] || '#A855F7';
}

function _priorColor(p) {
  if ((p || '').toLowerCase() === 'alta')   return { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' };
  if ((p || '').toLowerCase() === 'média')  return { color: '#F97316', bg: 'rgba(249,115,22,0.1)' };
  return                                           { color: '#EAB308', bg: 'rgba(234,179,8,0.1)' };
}

function _fmtBRL(v) {
  return v != null ? 'R$ ' + Number(v).toLocaleString('pt-BR') : '—';
}

function _scoreCircle(score, label, big = false) {
  const r     = big ? 48 : 38;
  const sw    = big ? 9  : 7;
  const circ  = 2 * Math.PI * r;
  const pct   = score != null ? Math.max(0, Math.min(100, score)) : 0;
  const offset = circ * (1 - pct / 100);
  const color  = _scoreColor(score ?? 0);
  return `
    <div class="diag-score-card ${big ? 'diag-score-card--big' : ''}">
      <svg class="diag-score-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="${r}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${sw}"/>
        <circle cx="50" cy="50" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}"
          stroke-linecap="round"
          stroke-dasharray="${circ.toFixed(1)}"
          stroke-dashoffset="${offset.toFixed(1)}"
          transform="rotate(-90 50 50)"
          class="diag-score-arc"
        />
        <text x="50" y="54" text-anchor="middle" dominant-baseline="middle"
          font-size="${big ? 24 : 20}" font-weight="700" fill="#fff" font-family="Arial,sans-serif">${score ?? '—'}</text>
      </svg>
      <span class="diag-score-label">${label}</span>
      <span class="diag-score-tag" style="color:${color}">${score != null ? _scoreLabel(score) : ''}</span>
    </div>
  `;
}

function _metricStatus(status) {
  if (status === 'good')  return { icon: 'ph-check-circle', color: '#22C55E' };
  if (status === 'ok')    return { icon: 'ph-minus-circle', color: '#F97316' };
  return                         { icon: 'ph-x-circle',     color: '#EF4444' };
}

function _severityBadge(severity) {
  const map = {
    high:   { label: 'Crítico', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
    medium: { label: 'Médio',   color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
    low:    { label: 'Baixo',   color: '#EAB308', bg: 'rgba(234,179,8,0.1)' },
  };
  const s = map[severity] || map.low;
  return `<span class="diag-issue-badge" style="color:${s.color};background:${s.bg}">${s.label}</span>`;
}

function _diagResultHTML() {
  const d = _diagState.resultData;

  // ---- Fallback: raw HTML from n8n ----
  if (!d) {
    return `
      <div class="tool-card-page tool-card-page--result">
        ${_diagResultHeader()}
        <div class="tool-result__disclaimer"><i class="ph ph-warning"></i>
          <p>Este relatório é gerado por automação. Os dados incluem estimativas e devem ser validados manualmente.</p>
        </div>
        <div class="tool-result__content">${_diagState.resultHtml}</div>
        ${_diagResultCTA()}
      </div>
    `;
  }

  const scores  = d.scores  || {};
  const maps    = d.mapsData || {};
  const est     = d.estimativaFinanceira || {};
  const bom     = d.bom  || [];
  const ruim    = d.ruim || [];
  const psi     = d.psiData || {};

  const urgColor  = _urgencyColor(scores.nivelUrgencia);
  const nome      = d.nomeEscritorio || d.siteData?.title || _diagState.url;

  // ---- Score circles data ----
  const scoreCards = [
    { value: scores.notaGeral,    label: 'Geral',       big: true },
    { value: scores.notaTecnica,  label: 'Técnico'  },
    { value: scores.notaSeoLocal, label: 'SEO Local' },
    { value: scores.notaConversao,label: 'Conversão' },
  ].filter(s => s.value != null);

  // ---- PSI metrics ----
  const psiMetrics = [
    { label: 'First Contentful Paint', value: psi.fcp,  ms: psi.fcpMs,  score: psi.fcpScore  },
    { label: 'Largest Contentful Paint', value: psi.lcp, ms: psi.lcpMs, score: psi.lcpScore  },
    { label: 'Total Blocking Time',    value: psi.tbt,  ms: psi.tbtMs,  score: psi.tbtScore  },
    { label: 'Cumulative Layout Shift',value: psi.cls,  ms: psi.clsValue, score: psi.clsScore },
    { label: 'Speed Index',            value: psi.si,   ms: psi.siMs },
  ].filter(m => m.value && m.value !== 'N/A');

  const hasPsi = psiMetrics.length > 0 && !psi.error;

  return `
    <div class="tool-card-page tool-card-page--result">
      ${_diagResultHeader()}

      <!-- URGENCY BANNER -->
      <div class="diag-urgency-banner" style="border-color:${urgColor}33;background:${urgColor}11">
        <span class="diag-urgency-dot" style="background:${urgColor}"></span>
        <div>
          <strong style="color:${urgColor}">Nível de Urgência: ${scores.nivelUrgencia || '—'}</strong>
          ${nome ? `<p>${nome}</p>` : ''}
        </div>
        <div class="diag-lead-badge" style="background:${urgColor}22;border-color:${urgColor}44">
          <span>${d.leadEmoji || ''} ${d.leadScore || ''}</span>
        </div>
      </div>

      <!-- SCORES -->
      ${scoreCards.length ? `
        <div class="diag-section">
          <h2 class="diag-section__title"><i class="ph ph-chart-bar"></i> Pontuações</h2>
          <div class="diag-scores-legend">
            <span class="diag-legend-item"><span class="diag-legend-dot" style="background:#EF4444"></span>0–39 Crítico</span>
            <span class="diag-legend-item"><span class="diag-legend-dot" style="background:#F97316"></span>40–69 Atenção</span>
            <span class="diag-legend-item"><span class="diag-legend-dot" style="background:#22C55E"></span>70–100 Bom</span>
          </div>
          <div class="diag-scores-grid diag-scores-grid--4">
            ${scoreCards.map(s => _scoreCircle(s.value, s.label, s.big)).join('')}
          </div>
        </div>
      ` : ''}

      <!-- MATURITY + POTENTIAL -->
      ${(d.maturidadeDigital != null || d.potencialFinanceiro != null) ? `
        <div class="diag-section">
          <h2 class="diag-section__title"><i class="ph ph-trend-up"></i> Maturidade &amp; Potencial</h2>
          <div class="diag-duo-cards">
            ${d.maturidadeDigital != null ? `
              <div class="diag-duo-card">
                <span class="diag-duo-card__label">Maturidade Digital</span>
                <div class="diag-duo-card__bar-wrap">
                  <div class="diag-duo-card__bar" style="width:${d.maturidadeDigital}%;background:${_scoreColor(d.maturidadeDigital)}"></div>
                </div>
                <span class="diag-duo-card__value" style="color:${_scoreColor(d.maturidadeDigital)}">${d.maturidadeDigital}/100 — ${d.nivelMaturidade || ''}</span>
              </div>
            ` : ''}
            ${d.potencialFinanceiro != null ? `
              <div class="diag-duo-card">
                <span class="diag-duo-card__label">Potencial Financeiro</span>
                <div class="diag-duo-card__bar-wrap">
                  <div class="diag-duo-card__bar" style="width:${d.potencialFinanceiro}%;background:${_scoreColor(d.potencialFinanceiro)}"></div>
                </div>
                <span class="diag-duo-card__value" style="color:${_scoreColor(d.potencialFinanceiro)}">${d.potencialFinanceiro}/100 — ${d.nivelPotencial || ''}</span>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}

      <!-- FINANCIAL OPPORTUNITY -->
      ${est.oportunidadeMesMin ? `
        <div class="diag-section">
          <h2 class="diag-section__title"><i class="ph ph-currency-circle-dollar"></i> Oportunidade Estimada</h2>
          <div class="diag-finance-grid">
            <div class="diag-finance-card diag-finance-card--highlight">
              <span class="diag-finance-label">Por mês (estimativa)</span>
              <span class="diag-finance-value">${_fmtBRL(est.oportunidadeMesMin)} – ${_fmtBRL(est.oportunidadeMesMax)}</span>
            </div>
            <div class="diag-finance-card">
              <span class="diag-finance-label">Ticket médio</span>
              <span class="diag-finance-value diag-finance-value--sm">${est.ticketMedio || '—'}</span>
            </div>
            <div class="diag-finance-card">
              <span class="diag-finance-label">Buscas/mês estimadas</span>
              <span class="diag-finance-value diag-finance-value--sm">${est.buscasMes != null ? est.buscasMes.toLocaleString('pt-BR') : '—'}</span>
            </div>
            <div class="diag-finance-card">
              <span class="diag-finance-label">Leads estimados/mês</span>
              <span class="diag-finance-value diag-finance-value--sm">${est.leadsEstimados ?? '—'}</span>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- PROBLEMS -->
      ${ruim.length ? `
        <div class="diag-section">
          <h2 class="diag-section__title"><i class="ph ph-warning-circle"></i> Problemas Encontrados <span class="diag-count-badge diag-count-badge--red">${ruim.length}</span></h2>
          <div class="diag-issues-list">
            ${ruim.map(issue => {
              const p = _priorColor(issue.prior);
              return `
                <div class="diag-issue-item">
                  <div class="diag-issue-head">
                    <span class="diag-issue-badge" style="color:${p.color};background:${p.bg}">${issue.prior || 'Baixa'}</span>
                    <strong>${issue.item}</strong>
                  </div>
                  ${issue.desc ? `<p class="diag-issue-detail">${issue.desc}</p>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- POSITIVES -->
      ${bom.length ? `
        <div class="diag-section">
          <h2 class="diag-section__title"><i class="ph ph-check-circle"></i> Pontos Positivos <span class="diag-count-badge diag-count-badge--green">${bom.length}</span></h2>
          <ul class="diag-positives-list">
            ${bom.map(b => `<li><i class="ph ph-check-fat"></i><div><strong>${b.item}</strong>${b.desc ? ` — <span>${b.desc}</span>` : ''}</div></li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- PSI METRICS -->
      ${hasPsi ? `
        <div class="diag-section">
          <h2 class="diag-section__title"><i class="ph ph-gauge"></i> PageSpeed Insights</h2>
          <div class="diag-metrics-grid">
            ${psiMetrics.map(m => {
              const color = m.score >= 0.9 ? '#22C55E' : m.score >= 0.5 ? '#F97316' : '#EF4444';
              return `
                <div class="diag-metric-card">
                  <i class="ph ph-timer" style="color:${color}"></i>
                  <div class="diag-metric-info">
                    <span class="diag-metric-label">${m.label}</span>
                    <span class="diag-metric-value" style="color:${color}">${m.value}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- MAPS / COMPETITORS -->
      ${maps.totalCompetitors ? `
        <div class="diag-section">
          <h2 class="diag-section__title"><i class="ph ph-map-pin"></i> Mercado Local (Google Maps)</h2>
          <div class="diag-finance-grid">
            <div class="diag-finance-card">
              <span class="diag-finance-label">Concorrentes no Maps</span>
              <span class="diag-finance-value diag-finance-value--sm">${maps.totalCompetitors}</span>
            </div>
            <div class="diag-finance-card">
              <span class="diag-finance-label">Rating médio</span>
              <span class="diag-finance-value diag-finance-value--sm">⭐ ${maps.avgRating ?? '—'}</span>
            </div>
            <div class="diag-finance-card">
              <span class="diag-finance-label">Mediana de reviews</span>
              <span class="diag-finance-value diag-finance-value--sm">${maps.medianReviews ?? '—'}</span>
            </div>
            <div class="diag-finance-card">
              <span class="diag-finance-label">Sem site</span>
              <span class="diag-finance-value diag-finance-value--sm" style="color:#22C55E">${maps.withoutWebsite ?? '—'} oportunidade${(maps.withoutWebsite || 0) !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      ` : ''}

      ${_diagResultCTA()}
    </div>
  `;
}

function _diagResultHeader() {
  return `
    <div class="tool-result__header">
      <div class="tool-result__badge"><i class="ph ph-check-circle"></i> Análise concluída</div>
      <h1 class="tool-result__title">Diagnóstico de Presença Digital</h1>
      <p class="tool-result__sub">Resultado para: <strong>${_diagState.url}</strong> &nbsp;·&nbsp; ${_diagState.nicho} &nbsp;·&nbsp; ${_diagState.cidade}</p>
      <div class="tool-result__actions">
        <button id="diag-print" class="btn btn--outline btn--sm">
          <i class="ph ph-printer"></i> Imprimir / Salvar PDF
        </button>
        <a href="/ferramentas/diagnostico" class="btn btn--ghost btn--sm" data-route="/ferramentas/diagnostico">
          <i class="ph ph-arrow-clockwise"></i> Nova análise
        </a>
      </div>
    </div>
  `;
}

function _diagResultCTA() {
  return `
    <div class="tool-result__cta">
      <h2>Quer resolver o que foi encontrado?</h2>
      <p>Posso implementar as melhorias identificadas no diagnóstico para o seu site.</p>
      <a href="/contato" class="btn btn--primary" data-route="/contato">
        <i class="ph ph-handshake"></i> Falar com Ivie
      </a>
    </div>
  `;
}

function _attachDiagResultListeners() {
  document.getElementById('diag-print')?.addEventListener('click', () => {
    window.print();
  });
}
