/* =============================================
   DIAGNÓSTICO — Steps 1, 2 e 3
   Form, Verificação de e-mail e Loading.
   Depende de: _ds, _setDS, _renderDS (state)
               _t (i18n)
   ============================================= */

/* ── Indicador de steps ──────────────────────── */
function _steps(active) {
  const list = [
    { k: 'form',   l: _t('steps.form'),   i: 'ph-globe'           },
    { k: 'verify', l: _t('steps.verify'), i: 'ph-envelope-simple' },
    { k: 'result', l: _t('steps.result'), i: 'ph-chart-bar'       },
  ];
  const ai = list.findIndex(s => s.k === active);
  return `<div class="tool-steps">${list.map((s, i) => `
    <div class="tool-step${i < ai ? ' tool-step--done' : ''}${i === ai ? ' tool-step--active' : ''}">
      <div class="tool-step__icon">${i < ai
        ? '<i class="ph ph-check-bold"></i>'
        : `<i class="ph ${s.i}"></i>`
      }</div>
      <span>${s.l}</span>
    </div>${i < list.length - 1
      ? `<div class="tool-step__line${i < ai ? ' tool-step__line--done' : ''}"></div>`
      : ''
    }
  `).join('')}</div>`;
}

/* ===== STEP 1: FORMULÁRIO ============================= */
function _formHTML() {
  return `<div class="tool-card-page">
    ${_steps('form')}
    <div class="tool-card-page__header">
      <h1 class="tool-card-page__title">${_t('form.title')}</h1>
    </div>
    <div class="diag-trust-badges">
      <span><i class="ph ph-check-circle"></i> ${_t('form.badges.free')}</span>
      <span><i class="ph ph-clock"></i> ${_t('form.badges.time')}</span>
    </div>
    ${_ds.error ? `<div class="tool-error"><i class="ph ph-x-circle"></i> ${_ds.error}</div>` : ''}
    <div class="tool-form-card">
      <form id="diag-form" class="tool-form" novalidate>

        <div class="tool-form-section">
          <h3 class="tool-form-section__title"><i class="ph ph-globe"></i> ${_t('form.sections.site')}</h3>
          <div class="tool-form-field">
            <label for="d-url" class="tool-form-label">${_t('form.fields.url')}</label>
            <div class="tool-form-input-wrap">
              <i class="ph ph-globe"></i>
              <input type="url" id="d-url" class="tool-form-input"
                placeholder="${_t('form.placeholders.url')}"
                value="${_ds.url}" required>
            </div>
            <span class="tool-form-hint">${_t('form.hints.url')}</span>
          </div>
        </div>

        <div class="tool-form-section">
          <h3 class="tool-form-section__title"><i class="ph ph-building"></i> ${_t('form.sections.business')}</h3>
          <div class="tool-form-row">
            <div class="tool-form-field">
              <label for="d-nicho" class="tool-form-label">${_t('form.fields.niche')}</label>
              <div class="tool-form-input-wrap">
                <i class="ph ph-tag"></i>
                <input type="text" id="d-nicho" class="tool-form-input"
                  placeholder="${_t('form.placeholders.niche')}"
                  value="${_ds.nicho}" required>
              </div>
            </div>
            <div class="tool-form-field">
              <label for="d-cidade" class="tool-form-label">${_t('form.fields.city')}</label>
              <div class="tool-form-input-wrap">
                <i class="ph ph-map-pin"></i>
                <input type="text" id="d-cidade" class="tool-form-input"
                  placeholder="${_t('form.placeholders.city')}"
                  value="${_ds.cidade}" required>
              </div>
            </div>
          </div>
        </div>

        <div class="tool-form-section">
          <h3 class="tool-form-section__title"><i class="ph ph-envelope-simple"></i> ${_t('form.sections.contact')}</h3>
          <div class="tool-form-field">
            <label for="d-email" class="tool-form-label">${_t('form.fields.email')}</label>
            <div class="tool-form-input-wrap">
              <i class="ph ph-envelope-simple"></i>
              <input type="email" id="d-email" class="tool-form-input"
                placeholder="${_t('form.placeholders.email')}"
                value="${_ds.email}" required>
            </div>
            <span class="tool-form-hint">${_t('form.hints.email')}</span>
          </div>
        </div>

        <div class="tool-form-actions">
          <button type="submit" class="btn btn--primary btn--full btn--lg" id="diag-submit">
            <i class="ph ph-paper-plane-tilt"></i> ${_t('form.submit')}
          </button>
          <p class="tool-form-terms">${_t('form.terms')}</p>
        </div>

      </form>
    </div>
  </div>`;
}

function _formListeners() {
  document.getElementById('diag-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const url    = document.getElementById('d-url').value.trim();
    const nicho  = document.getElementById('d-nicho').value.trim();
    const cidade = document.getElementById('d-cidade').value.trim();
    const email  = document.getElementById('d-email').value.trim();

    if (!url || !url.startsWith('http')) {
      _setDS({ error: _t('form.errors.url') }); _renderDS(); return;
    }
    if (!nicho) { _setDS({ error: _t('form.errors.niche') }); _renderDS(); return; }
    if (!cidade){ _setDS({ error: _t('form.errors.city')  }); _renderDS(); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      _setDS({ error: _t('form.errors.email') }); _renderDS(); return;
    }

    const btn = document.getElementById('diag-submit');
    btn.disabled = true;
    btn.innerHTML = _t('form.sending');

    try {
      const r = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_code', email }),
      });
      const d = await r.json();
      if (!r.ok) { _setDS({ error: d.error || _t('form.errors.send') }); _renderDS(); return; }
      _setDS({ url, nicho, cidade, email, error: '', step: 'verify', resendCooldown: 60 });
      _renderDS();
      _startResendTimer();
    } catch {
      _setDS({ error: _t('form.errors.conn') }); _renderDS();
    }
  });
}

/* ===== STEP 2: VERIFICAÇÃO DE E-MAIL =================== */
function _verifyHTML() {
  const masked = _ds.email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c);
  const canResend = _ds.resendCooldown <= 0;

  return `<div class="tool-card-page">
    ${_steps('verify')}
    <div class="tool-card-page__header">
      <h1 class="tool-card-page__title">${_t('verify.title')}</h1>
      <p class="tool-card-page__desc">${_t('verify.descTpl', { masked })}</p>
    </div>
    ${_ds.error ? `<div class="tool-error"><i class="ph ph-x-circle"></i> ${_ds.error}</div>` : ''}
    <form id="verify-form" class="tool-form" novalidate>
      <div class="tool-form__field">
        <label for="d-code">${_t('verify.field')}</label>
        <div class="tool-form__input-wrap">
          <i class="ph ph-password"></i>
          <input type="text" id="d-code"
            placeholder="${_t('verify.placeholder')}"
            maxlength="6" inputmode="numeric" pattern="[0-9]{6}"
            autocomplete="one-time-code" required>
        </div>
      </div>
      <button type="submit" class="btn btn--primary btn--full" id="verify-submit">
        <i class="ph ph-check-circle"></i> ${_t('verify.submit')}
      </button>
      <div class="tool-form__resend">
        <button type="button" id="resend-btn"
          class="tool-form__resend-btn${canResend ? '' : ' disabled'}"
          ${canResend ? '' : 'disabled'}>
          ${canResend
            ? _t('verify.resend')
            : _t('verify.resendIn', { n: _ds.resendCooldown })
          }
        </button>
        <button type="button" id="back-btn" class="tool-form__back-btn">
          ${_t('verify.back')}
        </button>
      </div>
    </form>
  </div>`;
}

function _verifyListeners() {
  const ci = document.getElementById('d-code');
  ci?.addEventListener('input', () => { ci.value = ci.value.replace(/\D/g, '').slice(0, 6); });

  document.getElementById('verify-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const code = ci.value.trim();
    if (code.length !== 6) { _setDS({ error: _t('verify.errors.code') }); _renderDS(); return; }

    const btn = document.getElementById('verify-submit');
    btn.disabled  = true;
    btn.innerHTML = _t('verify.verifying');

    _setDS({ step: 'loading', error: '' });
    _renderDS();

    try {
      const r = await fetch('/api/diagnostico', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          action: 'run',
          email:  _ds.email,
          code,
          url:    _ds.url,
          nicho:  _ds.nicho,
          cidade: _ds.cidade,
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        _setDS({ step: 'verify', error: data.error || _t('verify.errors.invalid') });
        _renderDS();
        return;
      }

      let parsedData = null, fallbackHtml = '';
      const raw = data.result ?? data.html ?? null;
      if (raw !== null && typeof raw === 'object') {
        parsedData = Array.isArray(raw) ? (raw[0] || null) : raw;
      } else if (typeof raw === 'string') {
        try {
          const p = JSON.parse(raw);
          parsedData = Array.isArray(p) ? (p[0] || null) : p;
        } catch { fallbackHtml = raw; }
      }

      _setDS({ step: 'result', resultHtml: fallbackHtml, resultData: parsedData });
      _renderDS();
    } catch {
      _setDS({ step: 'verify', error: _t('verify.errors.conn') });
      _renderDS();
    }
  });

  document.getElementById('resend-btn')?.addEventListener('click', async () => {
    if (_ds.resendCooldown > 0) return;
    const btn = document.getElementById('resend-btn');
    btn.disabled  = true;
    btn.innerHTML = _t('form.sending');
    try {
      const r = await fetch('/api/diagnostico', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'send_code', email: _ds.email }),
      });
      const d = await r.json();
      if (!r.ok) { _setDS({ error: d.error || _t('verify.errors.resendFail') }); }
      else       { _setDS({ error: '', resendCooldown: 60 }); _startResendTimer(); }
    } catch {
      _setDS({ error: _t('verify.errors.resendErr') });
    }
    _renderDS();
  });

  document.getElementById('back-btn')?.addEventListener('click', () => {
    if (_ds.resendTimer) clearInterval(_ds.resendTimer);
    _setDS({ step: 'form', error: '', resendCooldown: 0 });
    _renderDS();
  });
}

function _startResendTimer() {
  if (_ds.resendTimer) clearInterval(_ds.resendTimer);
  _ds.resendTimer = setInterval(() => {
    _ds.resendCooldown = Math.max(0, _ds.resendCooldown - 1);
    const b = document.getElementById('resend-btn');
    if (!b) return;
    if (_ds.resendCooldown <= 0) {
      clearInterval(_ds.resendTimer);
      b.disabled = false;
      b.classList.remove('disabled');
      b.innerHTML = _t('verify.resend');
    } else {
      b.innerHTML = _t('verify.resendIn', { n: _ds.resendCooldown });
    }
  }, 1000);
}

/* ===== STEP 3: LOADING ================================ */
function _loadingHTML() {
  return `<div class="tool-card-page tool-card-page--loading">
    <div class="tool-loading">
      <div class="tool-loading__orb"></div>
      <h2 class="tool-loading__title">${_t('loading.title')}</h2>
      <p class="tool-loading__sub">${_t('loading.sub')}</p>
      <div class="tool-loading__steps">
        ${_t('loading.steps').map((label, i) => `
          <div class="tool-loading__item" id="ls${i}">
            <i class="ph ph-circle-notch"></i>
            <span>${label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>`;
}

function _loadingAnim() {
  [0, 8000, 18000, 35000, 55000].forEach((delay, i) => {
    setTimeout(() => {
      const el = document.getElementById('ls' + i);
      if (!el) return;
      el.classList.add('active');
      const ic = el.querySelector('i');
      if (ic) ic.className = 'ph ph-circle-notch ph-spin';
    }, delay);
  });
}
