/* =============================================
   TOOL: DIAGNÃ“STICO DE PRESENÃ‡A DIGITAL
   Step machine: form â†’ verify â†’ loading â†’ result
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
   STEP 1 â€” FORM
   ========================================== */

function _diagFormHTML() {
  return `
    <div class="tool-card-page">
      ${_stepIndicator('form')}

      <div class="tool-card-page__header">
        <div class="tool-card-page__icon">
          <i class="ph ph-magnifying-glass-plus"></i>
        </div>
        <h1 class="tool-card-page__title">DiagnÃ³stico de PresenÃ§a Digital</h1>
        <p class="tool-card-page__desc">
          Informe o site a ser analisado e seu e-mail para receber o cÃ³digo de acesso.
          O relatÃ³rio inclui dados de velocidade, SEO, acessibilidade, concorrentes locais e potencial de mercado.
        </p>
      </div>

      <div class="tool-card-page__notice">
        <i class="ph ph-warning"></i>
        <p>O diagnÃ³stico Ã© gerado por automaÃ§Ã£o e pode exigir validaÃ§Ã£o manual. Recomenda-se sempre verificar os dados no contexto real do negÃ³cio.</p>
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
                placeholder="Ex: ClÃ­nica odontolÃ³gica"
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
          <span class="tool-form__hint">Enviaremos um cÃ³digo de 6 dÃ­gitos para confirmar seu acesso.</span>
        </div>

        <button type="submit" class="btn btn--primary btn--full" id="diag-submit">
          <i class="ph ph-paper-plane-tilt"></i> Enviar cÃ³digo de acesso
        </button>

        <p class="tool-form__terms">
          Ao continuar, vocÃª concorda que seu e-mail serÃ¡ usado apenas para controle de acesso.
          Limite: 1 diagnÃ³stico por dia.
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
      _setDiagState({ error: 'Informe uma URL vÃ¡lida (comeÃ§ando com https:// ou http://).' });
      _renderDiagStep();
      return;
    }
    if (!nicho) {
      _setDiagState({ error: 'Informe o nicho ou segmento do negÃ³cio.' });
      _renderDiagStep();
      return;
    }
    if (!cidade) {
      _setDiagState({ error: 'Informe a cidade.' });
      _renderDiagStep();
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      _setDiagState({ error: 'Informe um e-mail vÃ¡lido.' });
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
        _setDiagState({ error: data.error || 'NÃ£o foi possÃ­vel enviar o cÃ³digo. Tente novamente.' });
        _renderDiagStep();
        return;
      }

      _setDiagState({ url, nicho, cidade, email, error: '', step: 'verify', resendCooldown: 60 });
      _renderDiagStep();
      _startResendTimer();

    } catch {
      _setDiagState({ error: 'Erro de conexÃ£o. Verifique sua internet e tente novamente.' });
      _renderDiagStep();
    }
  });
}

/* ==========================================
   STEP 2 â€” VERIFY
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
          Enviamos um cÃ³digo de <strong>6 dÃ­gitos</strong> para <strong>${masked}</strong>.
          Verifique sua caixa de entrada (e o spam).
        </p>
      </div>

      ${_diagState.error ? `<div class="tool-error"><i class="ph ph-x-circle"></i> ${_diagState.error}</div>` : ''}

      <form id="verify-form" class="tool-form" novalidate>
        <div class="tool-form__field">
          <label for="diag-code">CÃ³digo de verificaÃ§Ã£o</label>
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
          <i class="ph ph-check-circle"></i> Confirmar e iniciar anÃ¡lise
        </button>

        <div class="tool-form__resend">
          <button type="button" id="resend-btn" class="tool-form__resend-btn ${canResend ? '' : 'disabled'}" ${canResend ? '' : 'disabled'}>
            ${canResend
              ? '<i class="ph ph-arrow-clockwise"></i> Reenviar cÃ³digo'
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
      _setDiagState({ error: 'O cÃ³digo deve ter 6 dÃ­gitos.' });
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
        _setDiagState({ step: 'verify', error: data.error || 'CÃ³digo invÃ¡lido ou expirado. Tente novamente.' });
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
      _setDiagState({ step: 'verify', error: 'Erro de conexÃ£o. Tente novamente.' });
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
        _setDiagState({ error: data.error || 'NÃ£o foi possÃ­vel reenviar o cÃ³digo.' });
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
        btn.innerHTML = '<i class="ph ph-arrow-clockwise"></i> Reenviar cÃ³digo';
      } else {
        btn.innerHTML = `<i class="ph ph-clock"></i> Reenviar em ${_diagState.resendCooldown}s`;
      }
    }
  }, 1000);
}

/* ==========================================
   STEP 3 â€” LOADING
   ========================================== */

function _diagLoadingHTML() {
  return `
    <div class="tool-card-page tool-card-page--loading">
      <div class="tool-loading">
        <div class="tool-loading__orb"></div>
        <h2 class="tool-loading__title">Analisando seu site</h2>
        <p class="tool-loading__sub">Isso pode levar atÃ© 30 segundos.<br>Coletando dados de velocidade, SEO e concorrentes...</p>
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
   STEP 4 â€” RESULT
   ========================================== */

function _scoreColor(score) {
  if (score >= 70) return '#22C55E';
  if (score >= 40) return '#F97316';
  return '#EF4444';
}

function _scoreLabel(score) {
  if (score >= 70) return 'Bom';
  if (score >= 40) return 'AtenÃ§Ã£o';
  return 'CrÃ­tico';
}

function _urgencyColor(level) {
  const map = { 'CRÃTICO': '#EF4444', 'ALTO': '#F97316', 'MÃ‰DIO': '#EAB308', 'BAIXO': '#22C55E' };
  return map[(level || '').toUpperCase()] || '#A855F7';
}

function _priorColor(p) {
  if ((p || '').toLowerCase() === 'alta')   return { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' };
  if ((p || '').toLowerCase() === 'mÃ©dia')  return { color: '#F97316', bg: 'rgba(249,115,22,0.1)' };
  return                                           { color: '#EAB308', bg: 'rgba(234,179,8,0.1)' };
}

function _fmtBRL(v) {
  return v != null ? 'R$ ' + Number(v).toLocaleString('pt-BR') : 'â€”';
}


/* ==========================================
   RESULT â€” HELPERS
   ========================================== */

function _diagScrollTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 20;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: y, behavior: prefersReduced ? 'auto' : 'smooth' });
}

/* ---- Tab switcher ---- */
function _switchDiagTab(tabId) {
    document.querySelectorAll('.dr-tab').forEach(t => t.classList.remove('dr-tab--active'));
    document.querySelectorAll('.dr-tab-panel').forEach(p => { p.style.display = 'none'; });
    const btn = document.querySelector(`.dr-tab[data-tab="${tabId}"]`);
    const panel = document.getElementById('dr-panel-' + tabId);
    if (btn) btn.classList.add('dr-tab--active');
    if (panel) panel.style.display = 'block';
}

function _psiColor(v) {
    if (v >= 90) return '#22C55E';
    if (v >= 50) return '#F97316';
    return '#EF4444';
}

function _mdToHtml(text) {
    if (!text) return '';
    let t = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    t = t.replace(/```[\w]*\r?\n([\s\S]*?)```/g, '</p><pre class="dr-code"><code>$1</code></pre><p>');
    t = t.replace(/`([^`\n]+)`/g, '<code class="dr-icode">$1</code>');
    t = t.replace(/^### (.+)$/gm, '</p><h4 class="dr-h4">$1</h4><p>');
    t = t.replace(/^## (.+)$/gm, '</p><h3 class="dr-h3">$1</h3><p>');
    t = t.replace(/^# (.+)$/gm, '</p><h2 class="dr-h2">$1</h2><p>');
    t = t.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/\r?\n\r?\n/g, '</p><p>');
    t = t.replace(/\r?\n/g, '<br>');
    return '<div class="dr-prose"><p>' + t + '</p></div>';
}

/* ---- Parse scoring rubric strings ---- */
function _parseScoreRubric(detailStr) {
    if (!detailStr) return [];
    return detailStr.split(' | ').map(part => {
        const m = part.match(/^\+(\d+)\s+(.+)$/);
        return m ? { pts: parseInt(m[1], 10), label: m[2].trim() } : null;
    }).filter(Boolean);
}

/* ---- Persuasive issue card ---- */
function _persuasiveIssueCard(item) {
    const p = _priorColor(item.prior);
    return `
    <div class="dr-issue dr-issue--expanded">
      <div class="dr-issue__header">
        <span class="dr-issue__pri" style="color:${p.color};background:${p.bg}">${item.prior || 'Baixa'}</span>
        <strong>${item.item}</strong>
      </div>
      ${item.desc ? `
      <div class="dr-issue__detail">
        <div class="dr-issue__row">
          <i class="ph ph-warning-circle" aria-hidden="true" style="color:#EF4444"></i>
          <div><span class="dr-issue__tag">Problema</span><p>${item.desc}</p></div>
        </div>
        <div class="dr-issue__row">
          <i class="ph ph-trend-up" aria-hidden="true" style="color:#22C55E"></i>
          <div><span class="dr-issue__tag">BenefÃ­cio ao corrigir</span><p>${_getIssueBenefit(item.item)}</p></div>
        </div>
        <div class="dr-issue__row">
          <i class="ph ph-chart-line-up" aria-hidden="true" style="color:var(--accent-purple)"></i>
          <div><span class="dr-issue__tag">Impacto no negÃ³cio</span><p>${_getIssueImpact(item.item)}</p></div>
        </div>
      </div>` : ''}
    </div>`;
}

/* ---- Persuasive positive card ---- */
function _persuasivePositiveCard(item) {
    return `
    <li class="dr-positive--expanded">
      <div class="dr-positive__header">
        <i class="ph ph-check-fat" aria-hidden="true"></i>
        <strong>${item.item}</strong>
      </div>
      ${item.desc ? `
      <div class="dr-positive__detail">
        <div class="dr-issue__row">
          <i class="ph ph-seal-check" aria-hidden="true" style="color:#22C55E"></i>
          <div><span class="dr-issue__tag">Por que isso importa</span><p>${item.desc}</p></div>
        </div>
        <div class="dr-issue__row">
          <i class="ph ph-star" aria-hidden="true" style="color:var(--accent-purple)"></i>
          <div><span class="dr-issue__tag">Vantagem competitiva</span><p>${_getPositiveBenefit(item.item)}</p></div>
        </div>
      </div>` : ''}
    </li>`;
}

/* ---- Benefit/Impact generators ---- */
function _getIssueBenefit(name) {
    const n = (name || '').toLowerCase();
    if (n.includes('meta desc')) return 'Uma meta description otimizada aumenta o CTR nos resultados do Google, atraindo mais visitantes qualificados sem custo adicional com anÃºncios.';
    if (n.includes('h1')) return 'Corrigir a hierarquia de H1 ajuda o Google a entender o tema principal da pÃ¡gina, melhorando o posicionamento para palavras-chave relevantes.';
    if (n.includes('canonical')) return 'A tag canonical consolida a autoridade da pÃ¡gina em uma Ãºnica URL, evitando que o Google divida o "crÃ©dito" entre versÃµes duplicadas.';
    if (n.includes('schema')) return 'Com Schema Markup, seu site pode aparecer com rich snippets (estrelas, FAQ, horÃ¡rios) no Google, ocupando mais espaÃ§o visual e se destacando dos concorrentes.';
    if (n.includes('alt')) return 'Imagens com ALT descritivo aparecem no Google Imagens e melhoram a acessibilidade â€” critÃ©rio cada vez mais valorizado pelo algoritmo do Google.';
    if (n.includes('nap')) return 'NAP consistente (Nome, EndereÃ§o, Telefone) Ã© um dos trÃªs principais fatores de ranqueamento no Google Maps, fundamental para captar clientes locais.';
    if (n.includes('cidade') || n.includes('nicho')) return 'Incluir cidade e nicho no title Ã© a otimizaÃ§Ã£o on-page mais impactante para SEO local. Sem isso, o Google nÃ£o associa seu site Ã  busca regional.';
    if (n.includes('script')) return 'Reduzir scripts bloqueantes melhora o Core Web Vitals (LCP, FCP), fatores diretos de ranqueamento desde 2021 (Google Page Experience Update).';
    if (n.includes('robots')) return 'O robots.txt orienta os bots sobre quais pÃ¡ginas indexar, evitando desperdÃ­cio de crawl budget e garantindo que pÃ¡ginas importantes sejam rastreadas.';
    if (n.includes('sitemap')) return 'O sitemap.xml acelera a indexaÃ§Ã£o de novas pÃ¡ginas pelo Google em atÃ© 4x (dados do Google Search Console), essencial apÃ³s atualizaÃ§Ãµes.';
    if (n.includes('header') || n.includes('seguranÃ§a')) return 'Headers de seguranÃ§a protegem contra ataques XSS e clickjacking. Navegadores modernos sinalizam sites inseguros, reduzindo a confianÃ§a.';
    return 'Resolver este problema pode melhorar diretamente seu posicionamento nos resultados de busca e a experiÃªncia do visitante.';
}

function _getIssueImpact(name) {
    const n = (name || '').toLowerCase();
    if (n.includes('meta desc')) return 'Cada visitante que nÃ£o clica por falta de descriÃ§Ã£o atraente Ã© um potencial cliente perdido para um concorrente com presenÃ§a digital melhor otimizada.';
    if (n.includes('h1')) return 'MÃºltiplos H1 confundem os motores de busca â€” seu site pode ranquear para termos genÃ©ricos ao invÃ©s das palavras-chave que trazem clientes.';
    if (n.includes('canonical')) return 'Sem canonical, o Google pode classificar uma versÃ£o menos otimizada da sua pÃ¡gina, reduzindo sua visibilidade para buscas relevantes.';
    if (n.includes('schema')) return 'Concorrentes com rich snippets ocupam atÃ© 2x mais espaÃ§o visual nos resultados do Google, naturalmente atraindo mais cliques.';
    if (n.includes('alt')) return 'AlÃ©m do impacto em SEO, a falta de ALT pode gerar problemas legais de acessibilidade (WCAG) e afasta visitantes com deficiÃªncia visual.';
    if (n.includes('nap')) return 'Sem NAP completo, o Google nÃ£o pode validar a localizaÃ§Ã£o do negÃ³cio, prejudicando o posicionamento no Google Maps.';
    if (n.includes('cidade') || n.includes('nicho')) return 'Quando alguÃ©m busca pelo seu serviÃ§o na sua cidade, seu site compete com concorrentes que jÃ¡ usam essas palavras-chave. Sem elas no title, seu site fica invisÃ­vel.';
    if (n.includes('script')) return 'Sites lentos tÃªm atÃ© 32% mais chance de perder visitantes (Google/SOASTA, 2017). Cada segundo de atraso afeta a taxa de conversÃ£o.';
    if (n.includes('robots')) return 'Sem orientaÃ§Ã£o de crawl, o Google pode gastar budget rastreando pÃ¡ginas irrelevantes (admin, login) ao invÃ©s do conteÃºdo que atrai clientes.';
    if (n.includes('sitemap')) return 'Sem sitemap, novas pÃ¡ginas podem levar semanas para aparecer no Google, mantendo conteÃºdo desatualizado nos resultados.';
    if (n.includes('header') || n.includes('seguranÃ§a')) return 'O selo "NÃ£o seguro" no navegador pode afastar imediatamente visitantes, especialmente em serviÃ§os que exigem confianÃ§a.';
    return 'Ignorar esse problema pode resultar em menos visibilidade online e perda de oportunidades para concorrentes mais bem posicionados.';
}

function _getPositiveBenefit(name) {
    const n = (name || '').toLowerCase();
    if (n.includes('https')) return 'Seu site jÃ¡ atende ao fator de ranqueamento de seguranÃ§a do Google, transmitindo confianÃ§a imediata ao visitante.';
    if (n.includes('celular') || n.includes('mobile')) return 'Com o Mobile-First Indexing do Google, ter um site responsivo Ã© essencial. VocÃª estÃ¡ Ã  frente de concorrentes com layouts fixos.';
    if (n.includes('whatsapp')) return 'O WhatsApp Ã© o canal preferido por 9 em cada 10 brasileiros. Ter um botÃ£o direto facilita a conversÃ£o imediata do visitante em contato.';
    return 'Este Ã© um diferencial competitivo que posiciona seu site Ã  frente de concorrentes que ainda nÃ£o implementaram essa melhoria.';
}

function _navGauge(score, label, href) {
    const r = 34, sw = 5, circ = 2 * Math.PI * r;
    const pct = Math.max(0, Math.min(100, score ?? 0));
    const off = circ * (1 - pct / 100);
    const col = _scoreColor(score ?? 0);
    return `
    <a class="dr-nav__card" href="#${href}" onclick="event.preventDefault();_diagScrollTo('${href}');" aria-label="Ver seÃ§Ã£o ${label}" role="link" tabindex="0">
      <svg viewBox="0 0 80 80" class="dr-nav__svg" aria-hidden="true">
        <circle cx="40" cy="40" r="${r}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${sw}"/>
        <circle cx="40" cy="40" r="${r}" fill="none" stroke="${col}" stroke-width="${sw}"
          stroke-linecap="round" stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"
          transform="rotate(-90 40 40)" class="dr-nav__arc"/>
        <text x="40" y="40" text-anchor="middle" dominant-baseline="central"
          font-size="18" font-weight="700" fill="${col}" font-family="system-ui">${score ?? 'â€”'}</text>
      </svg>
      <span class="dr-nav__label">${label}</span>
      <span class="dr-nav__tag" style="color:${col}">${score != null ? _scoreLabel(score) : ''}</span>
      <i class="ph ph-caret-down dr-nav__arrow" aria-hidden="true"></i>
    </a>`;
}

function _dc(icon, label, value, status) {
    return `<div class="dr-card ${status || ''}"><span class="dr-card__key"><i class="ph ${icon}" aria-hidden="true"></i>${label}</span><span class="dr-card__val">${value}</span></div>`;
}

/* ==========================================
   STEP 4 â€” RESULT (full-page anchored layout)
   ========================================== */

function _diagResultHTML() {
    const d = _diagState.resultData;
    if (!d) {
        return `<div class="dr-wrap">${_diagResultHeader()}<div class="tool-result__disclaimer"><i class="ph ph-warning" aria-hidden="true"></i><p>Este relatÃ³rio Ã© gerado por automaÃ§Ã£o.</p></div><div class="tool-result__content">${_diagState.resultHtml}</div>${_diagResultCTA(0, '', '')}</div>`;
    }

    const hrd = d.htmlReportData || {};
    const sc = d.scores || {};
    const maps = d.mapsData || {};
    const bom = hrd.bom || []; const ruim = hrd.ruim || [];
    const psi = d.psiData || hrd.psi || {};
    const seoF = d.seoFilesData || hrd.seoFiles || {};
    const secH = d.securityHeaders || hrd.secHeaders || {};
    const sd = d.siteData || hrd.sd || {};
    const h = sd.headings || {}; const img = sd.images || {};
    const contact = sd.contact || {}; const schema = sd.schema || {};
    const conv = sd.conversion || {}; const links = sd.links || {};
    const tech = sd.technology || {}; const kw = sd.keywords || {};
    const nome = d.nomeEscritorio || sd.title || '';
    const urgCol = _urgencyColor(sc.nivelUrgencia);
    const hasPsi = !psi.error;
    const Y = '<span class="c-ok">Sim</span>'; const N = '<span class="c-fail">NÃ£o</span>';
    const P = '<span class="c-ok">Presente</span>'; const A = '<span class="c-fail">Ausente</span>';

    const psiArr = [
        { l: 'Performance', v: psi.performanceScore, i: 'ph-gauge' },
        { l: 'SEO', v: psi.seoScore, i: 'ph-magnifying-glass' },
        { l: 'Acessibilidade', v: psi.accessibilityScore, i: 'ph-eye' },
        { l: 'Boas PrÃ¡ticas', v: psi.bestPracticesScore, i: 'ph-check-square' },
    ];
    const cwv = [
        { l: 'FCP', v: psi.fcp, s: psi.fcpScore }, { l: 'LCP', v: psi.lcp, s: psi.lcpScore },
        { l: 'TBT', v: psi.tbt, s: psi.tbtScore }, { l: 'CLS', v: psi.cls, s: psi.clsScore },
        { l: 'SI', v: psi.si, s: null }, { l: 'TTI', v: psi.tti, s: null },
    ].filter(m => m.v && m.v !== 'N/A');
    const shDefs = [
        { k: 'hsts', l: 'HSTS', d: 'ForÃ§a HTTPS' }, { k: 'xframe', l: 'X-Frame-Options', d: 'Anti-clickjacking' },
        { k: 'csp', l: 'CSP', d: 'Anti-XSS' }, { k: 'xctype', l: 'X-Content-Type', d: 'Anti-MIME sniffing' },
        { k: 'ref', l: 'Referrer-Policy', d: 'Controla referÃªncia' },
    ];

    return `
  <div class="dr-wrap">
    ${_diagResultHeader()}
    <div class="dr-banner" style="--uc:${urgCol}">
      <span class="dr-banner__dot"></span>
      <div class="dr-banner__body">
        <strong>UrgÃªncia: ${sc.nivelUrgencia || 'â€”'}</strong>
        ${nome ? `<span>${nome}</span>` : ''}
      </div>
      <span class="dr-banner__lead">${d.leadEmoji || ''} ${d.leadScore || ''}</span>
    </div>

    <nav class="dr-nav" aria-label="PontuaÃ§Ãµes por categoria">
      ${_navGauge(sc.notaGeral, 'Geral', 'dr-sec-problemas')}
      ${_navGauge(sc.notaTecnica, 'TÃ©cnico', 'dr-sec-tecnico')}
      ${_navGauge(sc.notaSeoLocal, 'SEO Local', 'dr-sec-seo')}
      ${_navGauge(sc.notaConversao, 'ConversÃ£o', 'dr-sec-conversao')}
    </nav>

    <div class="dr-pills" role="navigation" aria-label="NavegaÃ§Ã£o rÃ¡pida">
      <a href="#dr-sec-lighthouse" onclick="event.preventDefault();_diagScrollTo('dr-sec-lighthouse');"><i class="ph ph-gauge" aria-hidden="true"></i>Lighthouse</a>
      <a href="#dr-sec-mercado"    onclick="event.preventDefault();_diagScrollTo('dr-sec-mercado');"><i class="ph ph-map-pin" aria-hidden="true"></i>Mercado</a>
      <a href="#dr-sec-seguranca"  onclick="event.preventDefault();_diagScrollTo('dr-sec-seguranca');"><i class="ph ph-shield" aria-hidden="true"></i>SeguranÃ§a</a>
      <a href="#dr-sec-auditoria"  onclick="event.preventDefault();_diagScrollTo('dr-sec-auditoria');"><i class="ph ph-robot" aria-hidden="true"></i>Auditoria IA</a>
    </div>

    ${(d.maturidadeDigital != null || d.potencialMercado != null) ? `
    <div class="dr-bars">
      ${d.maturidadeDigital != null ? `<div class="dr-bar-item"><div class="dr-bar-head"><span>Maturidade Digital</span><strong style="color:${_scoreColor(d.maturidadeDigital)}">${d.maturidadeDigital}/100 â€” ${d.nivelMaturidade || ''}</strong></div><div class="dr-bar-track"><div class="dr-bar-fill" style="width:${d.maturidadeDigital}%;background:${_scoreColor(d.maturidadeDigital)}"></div></div></div>` : ''}
      ${d.potencialMercado != null ? `<div class="dr-bar-item"><div class="dr-bar-head"><span>Potencial de Mercado</span><strong style="color:${_scoreColor(d.potencialMercado)}">${d.potencialMercado}/100 â€” ${d.nivelPotencial || ''}</strong></div><div class="dr-bar-track"><div class="dr-bar-fill" style="width:${d.potencialMercado}%;background:${_scoreColor(d.potencialMercado)}"></div></div></div>` : ''}
    </div>` : ''}

    <div class="dr-tabs" role="tablist">
      <button class="dr-tab dr-tab--active" data-tab="simple" role="tab" onclick="_switchDiagTab('simple')"><i class="ph ph-list-checks" aria-hidden="true"></i> VisÃ£o Geral</button>
      <button class="dr-tab" data-tab="tech" role="tab" onclick="_switchDiagTab('tech')"><i class="ph ph-wrench" aria-hidden="true"></i> AnÃ¡lise TÃ©cnica</button>
    </div>

    <div id="dr-panel-simple" class="dr-tab-panel" style="display:block">
      <section class="dr-sec" id="dr-sec-lighthouse">
        <h2 class="dr-sec__h"><i class="ph ph-gauge" aria-hidden="true"></i>PontuaÃ§Ãµes Lighthouse <span class="dr-muted-inline">(Google PSI API)</span></h2>
        ${hasPsi ? `
        <div class="dr-psi">${psiArr.map(c => { const v = c.v ?? 0, col = _psiColor(v); return `<div class="dr-psi__card"><i class="ph ${c.i}" style="color:${col}" aria-hidden="true"></i><span class="dr-psi__score" style="color:${col}">${v}</span><span class="dr-psi__label">${c.l}</span><div class="dr-psi__bar" role="progressbar" aria-valuenow="${Math.min(100, v)}" aria-valuemin="0" aria-valuemax="100"><div style="width:${Math.min(100, v)}%;background:${col}"></div></div></div>`; }).join('')}</div>
        ${cwv.length ? `<h3 class="dr-sub"><i class="ph ph-timer" aria-hidden="true"></i>Core Web Vitals</h3><div class="dr-cwv">${cwv.map(m => { const col = m.s != null ? (m.s >= 0.9 ? '#22C55E' : m.s >= 0.5 ? '#F97316' : '#EF4444') : '#A8A8C0'; return `<div class="dr-cwv__item"><span class="dr-cwv__label">${m.l}</span><span class="dr-cwv__val" style="color:${col}">${m.v}</span></div>`; }).join('')}</div>` : ''}
        ` : `<div class="dr-empty"><i class="ph ph-warning" aria-hidden="true"></i>${psi.error ? 'Erro Lighthouse â€” URL invÃ¡lida ou inacessÃ­vel.' : 'Dados nÃ£o disponÃ­veis.'}</div>`}
      </section>

      <section class="dr-sec" id="dr-sec-problemas">
        ${ruim.length ? `
        <h2 class="dr-sec__h"><i class="ph ph-warning-circle" aria-hidden="true"></i>Problemas Identificados <span class="dr-badge dr-badge--red">${ruim.length}</span></h2>
        <p class="dr-muted"><i class="ph ph-info" aria-hidden="true"></i> Cada item abaixo representa uma oportunidade de melhoria com impacto direto na captaÃ§Ã£o de clientes.</p>
        <div class="dr-issues">${ruim.map(i => _persuasiveIssueCard(i)).join('')}</div>` : ''}
        ${bom.length ? `
        <h2 class="dr-sec__h" style="margin-top:${ruim.length ? '2rem' : '0'}"><i class="ph ph-check-circle" aria-hidden="true"></i>Pontos Fortes <span class="dr-badge dr-badge--green">${bom.length}</span></h2>
        <p class="dr-muted"><i class="ph ph-info" aria-hidden="true"></i> Estes itens jÃ¡ contribuem para o posicionamento e credibilidade do seu site.</p>
        <ul class="dr-positives">${bom.map(b => _persuasivePositiveCard(b)).join('')}</ul>` : ''}
        ${!ruim.length && !bom.length ? '<p class="dr-empty">Nenhum item catalogado.</p>' : ''}
      </section>

      <section class="dr-sec" id="dr-sec-conversao">
        <h2 class="dr-sec__h"><i class="ph ph-cursor-click" aria-hidden="true"></i>ConversÃ£o</h2>
        <div class="dr-grid">
          ${_dc('ph-clipboard', 'FormulÃ¡rios', conv.totalForms || 0, conv.totalForms > 0 ? 'ok' : 'fail')}
          ${_dc('ph-hand-pointing', 'CTAs de aÃ§Ã£o', conv.actionCtas?.length || 0, conv.actionCtas?.length > 0 ? 'ok' : 'fail')}
          ${_dc('ph-star', 'Prova social', conv.hasSocialProof ? P : A, conv.hasSocialProof ? 'ok' : 'fail')}
          ${_dc('ph-map', 'Maps embed', conv.hasMapsEmbed ? P : '<span class="c-warn">Ausente</span>', conv.hasMapsEmbed ? 'ok' : 'warn')}
          ${_dc('ph-link', 'Links internos', links.internal || 0, '')}
          ${_dc('ph-arrow-square-out', 'Links externos', links.external || 0, '')}
        </div>
      </section>

      <section class="dr-sec" id="dr-sec-mercado">
        <h2 class="dr-sec__h"><i class="ph ph-users-three" aria-hidden="true"></i>Mercado &amp; ConcorrÃªncia <span class="dr-muted-inline">(Google Maps API)</span></h2>
        ${maps.totalCompetitors ? `
        <div class="dr-fin">
          <div class="dr-fin__sm"><span>Concorrentes</span><strong>${maps.totalCompetitors}</strong></div>
          <div class="dr-fin__sm"><span>Rating mÃ©dio</span><strong>${maps.avgRating ?? 'â€”'}</strong></div>
          <div class="dr-fin__sm"><span>Mediana reviews</span><strong>${maps.medianReviews ?? 'â€”'}</strong></div>
          <div class="dr-fin__sm" style="border-color:rgba(34,197,94,.25)"><span>Sem site</span><strong class="c-ok">${maps.withoutWebsite ?? 'â€”'}</strong></div>
          <div class="dr-fin__sm"><span>Com site</span><strong>${maps.withWebsite ?? 'â€”'}</strong></div>
        </div>
        ${maps.withoutWebsite > 0 ? `<p class="dr-insight"><i class="ph ph-lightbulb" aria-hidden="true"></i> <strong>${maps.withoutWebsite}</strong> concorrentes na sua regiÃ£o ainda nÃ£o tÃªm site â€” uma janela de oportunidade significativa para quem atua com presenÃ§a digital otimizada.</p>` : ''}
        ${maps.totalCompetitors > 0 ? `<p class="dr-insight"><i class="ph ph-chart-pie" aria-hidden="true"></i> Com <strong>${maps.totalCompetitors}</strong> concorrentes e rating mÃ©dio de <strong>${maps.avgRating}</strong>, a exigÃªncia de qualidade Ã© alta. Destaque-se com mais avaliaÃ§Ãµes e SEO local otimizado.</p>` : ''}
        ` : '<p class="dr-empty">Dados de mercado indisponÃ­veis.</p>'}
        ${d.marketAnalysis || d.uxAudit ? `<details class="dr-collapse"><summary><i class="ph ph-caret-right" aria-hidden="true"></i>AnÃ¡lise de Mercado detalhada (IA)</summary>${_mdToHtml(d.marketAnalysis || d.uxAudit)}</details>` : ''}
      </section>

      <section class="dr-sec" id="dr-sec-rubrica">
        <h2 class="dr-sec__h"><i class="ph ph-calculator" aria-hidden="true"></i>Como Calculamos sua Nota</h2>
        <p class="dr-muted"><i class="ph ph-info" aria-hidden="true"></i> Nota Geral = 0.4 Ã— TÃ©cnica + 0.3 Ã— SEO Local + 0.3 Ã— ConversÃ£o</p>
        <div class="dr-scoring">
          ${['TÃ©cnica', 'SEO Local', 'ConversÃ£o'].map((dim, idx) => {
        const nota = [sc.notaTecnica, sc.notaSeoLocal, sc.notaConversao][idx];
        const peso = ['40%', '30%', '30%'][idx];
        const detail = [sc.detalheTecnica, sc.detalheSeoLocal, sc.detalheConversao][idx];
        const items = _parseScoreRubric(detail);
        const col = _scoreColor(nota ?? 0);
        return `
              <div class="dr-scoring__block">
                <div class="dr-scoring__head">
                  <span>${dim} <small>(peso ${peso})</small></span>
                  <strong style="color:${col}">${nota ?? 'â€”'}/100</strong>
                </div>
                ${items.length ? `<div class="dr-scoring__items">${items.map(it => `
                  <div class="dr-scoring__item">
                    <span class="dr-scoring__pts ${it.pts > 0 ? 'ok' : 'zero'}">${it.pts > 0 ? '+' + it.pts : '0'}</span>
                    <span>${it.label}</span>
                  </div>
                `).join('')}</div>` : ''}
              </div>`;
    }).join('')}
        </div>
      </section>
    </div>

    <div id="dr-panel-tech" class="dr-tab-panel" style="display:none">
      <section class="dr-sec" id="dr-sec-tecnico">
        <h2 class="dr-sec__h"><i class="ph ph-code" aria-hidden="true"></i>AnÃ¡lise TÃ©cnica</h2>
        <h3 class="dr-sub"><i class="ph ph-globe" aria-hidden="true"></i>Meta &amp; Estrutura</h3>
        <div class="dr-grid">
          ${_dc('ph-lock', 'HTTPS', sd.isHttps ? Y : N, sd.isHttps ? 'ok' : 'fail')}
          ${_dc('ph-device-mobile', 'Viewport', sd.hasViewport ? P : A, sd.hasViewport ? 'ok' : 'fail')}
          ${_dc('ph-text-t', 'Charset', sd.charset || A, sd.charset ? 'ok' : 'fail')}
          ${_dc('ph-link', 'Canonical', sd.canonical ? P : A, sd.canonical ? 'ok' : 'fail')}
          ${_dc('ph-tag', 'Title', sd.titleLength > 0 ? sd.titleLength + ' chars' : A, sd.titleLength > 0 ? 'ok' : 'fail')}
          ${_dc('ph-text-align-left', 'Meta Desc', sd.metaDescLength > 0 ? sd.metaDescLength + ' chars' : A, sd.metaDescLength > 0 ? 'ok' : 'fail')}
        </div>
        <h3 class="dr-sub"><i class="ph ph-text-h" aria-hidden="true"></i>Headings &amp; ConteÃºdo</h3>
        <div class="dr-grid">
          ${_dc('ph-text-h-one', 'H1', h.h1Count > 0 ? h.h1Count + ' encontrado(s)' : A, h.h1Count > 0 ? 'ok' : 'fail')}
          ${_dc('ph-text-h-two', 'H2', (h.h2Count || 0) + ' encontrado(s)', '')}
          ${_dc('ph-tree-structure', 'Hierarquia', h.isHierarchical ? '<span class="c-ok">Correta</span>' : '<span class="c-fail">Incorreta</span>', h.isHierarchical ? 'ok' : 'fail')}
          ${_dc('ph-file-text', 'Palavras', (sd.text?.totalWords || 0) + ((sd.text?.totalWords || 0) < 300 ? ' <span class="c-fail">(min 300)</span>' : ''), (sd.text?.totalWords || 0) >= 300 ? 'ok' : 'fail')}
          ${_dc('ph-map-pin', 'MenÃ§Ãµes cidade', (sd.text?.cityMentions || 0) + 'x', (sd.text?.cityMentions || 0) > 0 ? 'ok' : 'fail')}
        </div>
        <h3 class="dr-sub"><i class="ph ph-image" aria-hidden="true"></i>Imagens</h3>
        <div class="dr-grid">
          ${_dc('ph-images', 'Total', img.total || 0, '')}
          ${_dc('ph-subtitles', 'Com ALT', `${img.withAlt || 0}/${img.total || 0} (${img.altPercentage || 0}%)`, img.total > 0 && img.withAlt === img.total ? 'ok' : img.withoutAlt > 0 ? 'fail' : '')}
          ${_dc('ph-x', 'Sem ALT', img.withoutAlt || 0, (img.withoutAlt || 0) === 0 && (img.total || 0) > 0 ? 'ok' : (img.withoutAlt || 0) > 0 ? 'fail' : '')}
        </div>
        <h3 class="dr-sub"><i class="ph ph-wrench" aria-hidden="true"></i>Tecnologia</h3>
        <div class="dr-grid">
          ${_dc('ph-toolbox', 'Construtor', tech.possibleBuilder || 'NÃ£o identificado', '')}
          ${_dc('ph-film-script', 'Iframes', tech.iframeCount || 0, '')}
          ${tech.builders?.length ? _dc('ph-stack', 'Detectado', tech.builders.join(', '), '') : ''}
        </div>
      </section>

      <section class="dr-sec" id="dr-sec-seo">
        <h2 class="dr-sec__h"><i class="ph ph-map-pin" aria-hidden="true"></i>SEO Local</h2>
        <h3 class="dr-sub"><i class="ph ph-phone" aria-hidden="true"></i>Contato &amp; NAP</h3>
        <div class="dr-grid">
          ${_dc('ph-phone', 'Telefone', contact.phones?.length ? contact.phones.join(', ') : A, contact.phones?.length ? 'ok' : 'fail')}
          ${_dc('ph-cursor-click', 'Tel. clicÃ¡vel', contact.hasClickablePhone ? Y : N, contact.hasClickablePhone ? 'ok' : 'fail')}
          ${_dc('ph-whatsapp-logo', 'WhatsApp', contact.hasWhatsApp ? P : A, contact.hasWhatsApp ? 'ok' : 'fail')}
          ${_dc('ph-map-trifold', 'NAP completo', contact.hasNAP ? '<span class="c-ok">Completo</span>' : '<span class="c-fail">Incompleto</span>', contact.hasNAP ? 'ok' : 'fail')}
        </div>
        <h3 class="dr-sub"><i class="ph ph-code-block" aria-hidden="true"></i>Schema &amp; Keywords</h3>
        <div class="dr-grid">
          ${_dc('ph-brackets-curly', 'Schema', schema.found ? `<span class="c-ok">${schema.types?.join(', ') || 'Encontrado'}</span>` : N, schema.found ? 'ok' : 'fail')}
          ${_dc('ph-storefront', 'LocalBusiness', schema.hasLocalBusiness ? Y : N, schema.hasLocalBusiness ? 'ok' : 'fail')}
          ${_dc('ph-tag', 'Nicho no tÃ­tulo', kw.nichoInTitle ? Y : N, kw.nichoInTitle ? 'ok' : 'fail')}
          ${_dc('ph-map-pin', 'Cidade no tÃ­tulo', kw.cidadeInTitle ? Y : N, kw.cidadeInTitle ? 'ok' : 'fail')}
          ${_dc('ph-text-h-one', 'Nicho no H1', kw.nichoInH1 ? Y : N, kw.nichoInH1 ? 'ok' : 'fail')}
          ${_dc('ph-map-pin', 'Cidade no H1', kw.cidadeInH1 ? Y : N, kw.cidadeInH1 ? 'ok' : 'fail')}
        </div>
      </section>

      <section class="dr-sec" id="dr-sec-seguranca">
        <h2 class="dr-sec__h"><i class="ph ph-shield" aria-hidden="true"></i>SeguranÃ§a &amp; Rastreamento</h2>
        <div class="dr-split">
          <div>
            <h3 class="dr-sub"><i class="ph ph-robot" aria-hidden="true"></i>Rastreamento</h3>
            <div class="dr-checks">
              <div class="dr-check ${seoF.hasRobots ? 'ok' : 'fail'}"><i class="ph ${seoF.hasRobots ? 'ph-check-circle' : 'ph-x-circle'}" aria-hidden="true"></i><div><strong>robots.txt</strong><span>${seoF.hasRobots ? 'Presente' : 'Ausente'}</span></div></div>
              <div class="dr-check ${seoF.hasSitemap ? 'ok' : 'fail'}"><i class="ph ${seoF.hasSitemap ? 'ph-check-circle' : 'ph-x-circle'}" aria-hidden="true"></i><div><strong>sitemap.xml</strong><span>${seoF.hasSitemap ? 'Presente Â· ' + (seoF.sitemapUrlCount || 0) + ' URLs' : 'Ausente'}</span></div></div>
            </div>
          </div>
          <div>
            <h3 class="dr-sub"><i class="ph ph-lock" aria-hidden="true"></i>Headers <span class="dr-pill" style="background:${(secH.securityScore || 0) >= 4 ? 'rgba(34,197,94,.12)' : 'rgba(239,68,68,.12)'};color:${(secH.securityScore || 0) >= 4 ? '#22C55E' : '#EF4444'}">${secH.securityScore ?? 0}/${secH.maxScore ?? 5}</span></h3>
            <div class="dr-checks">
              ${shDefs.map(sh => { const ok = !!(secH[sh.k] || secH[sh.l]); return `<div class="dr-check ${ok ? 'ok' : 'fail'}"><i class="ph ${ok ? 'ph-check-circle' : 'ph-x-circle'}" aria-hidden="true"></i><div><strong>${sh.l}</strong><span>${sh.d}</span></div></div>`; }).join('')}
            </div>
          </div>
        </div>
      </section>

      <section class="dr-sec" id="dr-sec-auditoria">
        <h2 class="dr-sec__h"><i class="ph ph-robot" aria-hidden="true"></i>Auditoria IA</h2>
        ${d.technicalAudit ? `<details class="dr-collapse"><summary><i class="ph ph-caret-right" aria-hidden="true"></i>Auditoria TÃ©cnica SEO</summary>${_mdToHtml(d.technicalAudit)}</details>` : ''}
        ${d.contentAudit ? `<details class="dr-collapse"><summary><i class="ph ph-caret-right" aria-hidden="true"></i>Posicionamento &amp; ConversÃ£o</summary>${_mdToHtml(d.contentAudit)}</details>` : ''}
        ${d.scoringRaw ? `<details class="dr-collapse"><summary><i class="ph ph-caret-right" aria-hidden="true"></i>UX &amp; Acessibilidade</summary>${_mdToHtml(d.scoringRaw)}</details>` : ''}
      </section>
    </div>

    ${_diagResultCTA(ruim.length, sc.nivelUrgencia, sc.notaGeral)}
  </div>`;
}

function _diagResultHeader() {
    return `
    <header class="dr-header">
      <span class="dr-header__badge"><i class="ph ph-check-circle" aria-hidden="true"></i> AnÃ¡lise concluÃ­da</span>
      <h1 class="dr-header__title">DiagnÃ³stico de PresenÃ§a Digital</h1>
      <p class="dr-header__meta"><strong>${_diagState.url}</strong> Â· ${_diagState.nicho} Â· ${_diagState.cidade}</p>
      <div class="dr-header__actions">
        <button id="diag-print" class="btn btn--outline btn--sm"><i class="ph ph-printer" aria-hidden="true"></i> Imprimir PDF</button>
        <a href="/ferramentas/diagnostico" class="btn btn--ghost btn--sm" data-route="/ferramentas/diagnostico"><i class="ph ph-arrow-clockwise" aria-hidden="true"></i> Nova anÃ¡lise</a>
      </div>
    </header>`;
}

function _diagResultCTA(issueCount, urgencia, notaGeral) {
    const urgUpper = (urgencia || '').toUpperCase();
    const isCritical = urgUpper === 'CRÃTICO' || urgUpper === 'ALTO';
    const headline = isCritical
        ? 'Seu site precisa de atenÃ§Ã£o imediata'
        : (notaGeral != null && notaGeral < 50)
            ? 'HÃ¡ oportunidades importantes aqui'
            : 'Quer levar seus resultados ao prÃ³ximo nÃ­vel?';
    const subtext = isCritical
        ? `Identificamos <strong>${issueCount || 'vÃ¡rios'} problemas</strong> que afetam diretamente sua visibilidade no Google e a captaÃ§Ã£o de novos clientes. Quanto mais tempo essas questÃµes permanecem sem soluÃ§Ã£o, mais oportunidades sÃ£o direcionadas aos seus concorrentes.`
        : `Mesmo com pontos positivos, existem ${issueCount ? `<strong>${issueCount} melhorias</strong>` : 'melhorias'} que podem aumentar significativamente sua presenÃ§a nos resultados de busca e a taxa de conversÃ£o do seu site.`;
    return `
    <div class="dr-cta">
      <h2>${headline}</h2>
      <p>${subtext}</p>
      <a href="/contato" class="btn btn--primary" data-route="/contato"><i class="ph ph-handshake" aria-hidden="true"></i> Falar com Ivie</a>
    </div>`;
}

function _attachDiagResultListeners() {
    document.getElementById('diag-print')?.addEventListener('click', () => window.print());
    document.querySelectorAll('.dr-pills a').forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
            const href = pill.getAttribute('href')?.replace('#', '');
            if (!href) return;
            const techSections = ['dr-sec-tecnico', 'dr-sec-seo', 'dr-sec-seguranca', 'dr-sec-auditoria'];
            if (techSections.includes(href)) {
                _switchDiagTab('tech');
            } else {
                _switchDiagTab('simple');
            }
            setTimeout(() => _diagScrollTo(href), 100);
        });
    });
}
