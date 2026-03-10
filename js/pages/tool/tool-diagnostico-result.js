/* =============================================
   DIAGNÓSTICO — Renderização do Resultado
   Todas as seções do relatório final.
   Depende de: _ds, _t (i18n), helpers
   ============================================= */

/* ===== HTML PRINCIPAL DO RESULTADO =================== */
function _resultHTML() {
  const raw = _ds.resultData;

  /* Fallback quando não há dados estruturados */
  if (!raw) {
    return `<div class="dr-wrap dr-disclaimer-wrap">
      <header class="dr-header dr-header--simple">
        <span class="dr-header__badge"><i class="ph ph-check-circle"></i> ${_t('result.badge')}</span>
        <h1 class="dr-header__title">${_t('result.title')}</h1>
        <p class="dr-header__meta"><a href="${_ds.url}" target="_blank" rel="noopener">${_ds.url}</a></p>
        <a href="https://wa.me/5522981748083?text=gostaria%20de%20solicitar%20uma%20consultoria" target="_blank" rel="noopener" class="btn btn--primary btn--sm">
          <i class="ph ph-whatsapp-logo"></i> Receber análise especializada
        </a>
        <a href="/ferramentas/diagnostico" class="btn btn--ghost btn--sm" data-route="/ferramentas/diagnostico">
          <i class="ph ph-arrow-clockwise"></i> ${_t('result.newAnalysis')}
        </a>
      </header>
      <div class="tool-result__disclaimer">
        <i class="ph ph-warning"></i>
        <p>${_t('result.disclaimer')}</p>
      </div>
      <div class="tool-result__content">${_ds.resultHtml}</div>
    </div>`;
  }

  const report = raw.auditReport || raw;
  const meta   = report.metadata              || {};
  const pnt    = report.pontuacao             || {};
  const relTec = report.relatorio_tecnico     || {};
  const relCli = report.relatorio_cliente     || {};
  const sum    = relCli.sumario_executivo     || {};
  const uc     = _urgColor(pnt.nivel_urgencia);
  const ub     = _urgBg(pnt.nivel_urgencia);
  const dateStr = meta.dataAnalise
    ? new Date(meta.dataAnalise).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';

  const isUrgent = (pnt.nivel_urgencia || '').toUpperCase().includes('CRÍT')
                || (pnt.nivel_urgencia || '').toUpperCase() === 'ALTO';

  const stack = _t('result.stack');

  return `<div class="dr-wrap">

    <header class="dr-header">
      <div class="dr-header__left">
        <h1 class="dr-header__title">${_t('result.title')}</h1>
        <p class="dr-header__desc">${_t('result.headerDesc')}</p>
        <div class="dr-header__metas">
          <div class="dr-header__meta-item">
            <i class="ph ph-link"></i>
            <span>${_t('result.urlLabel')}</span>
            <a href="${meta.url || _ds.url}" target="_blank" rel="noopener"><strong>${meta.url || _ds.url}</strong></a>
          </div>
          ${dateStr ? `<div class="dr-header__meta-item">
            <i class="ph ph-calendar"></i>
            <span>${_t('result.dateLabel')}</span>
            <span><strong>${dateStr}</strong></span>
          </div>` : ''}
        </div>
        ${sum.frase_resumo ? `<blockquote class="dr-header__quote">"${sum.frase_resumo}"</blockquote>` : ''}
      </div>
      <div class="dr-header__right">
        <div class="dr-header__stack-box">
          <h3 class="dr-header__stack-title"><i class="ph ph-cpu"></i> ${stack.title}</h3>
          <div class="dr-stack-grid">
            ${stack.items.map(item => `
              <div class="dr-stack-item">
                <i class="ph ${item.icon}"></i>
                <span>${item.label}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="dr-header__actions">
          <a href="https://wa.me/5522981748083?text=gostaria%20de%20solicitar%20uma%20consultoria" target="_blank" rel="noopener" class="btn btn--primary btn--sm">
            <i class="ph ph-whatsapp-logo"></i> Receber análise especializada
          </a>
          <a href="/ferramentas/diagnostico" class="btn btn--ghost btn--sm" data-route="/ferramentas/diagnostico">
            <i class="ph ph-arrow-clockwise"></i> ${_t('result.newAnalysis')}
          </a>
        </div>
      </div>
    </header>

    <div class="dr-banner" style="border-color:${uc};background:${ub}">
      <span class="dr-banner__dot" style="background:${uc};box-shadow:0 0 8px ${uc}40"></span>
      <div class="dr-banner__body">
        <strong>${_t('result.urgency')}: ${pnt.nivel_urgencia || '—'}</strong>
        <span>${isUrgent
          ? _t('result.urgencyMessages.critical')
          : _t('result.urgencyMessages.default')
        }</span>
      </div>
    </div>


    <div id="drp-cliente" class="dr-tab-panel">
      ${_tabCliente(pnt, relCli, meta, relTec)}
    </div>

    ${_cta(relCli.problemas || [], pnt)}
  </div>`;
}

/* ===== RESUMO ESTRATÉGICO (IA) ======================= */
function _resumoEstrategico(text) {
  if (!text) return '';
  return `<section class="dr-sec">
    <div class="dr-resumo">
      <div class="dr-resumo__header">
        <h2 class="dr-resumo__title">${_t('resumo.title')}</h2>
        <p class="dr-resumo__sub">${_t('resumo.sub')}</p>
      </div>
      <div class="dr-resumo__body">${_md2html(text)}</div>
    </div>
  </section>`;
}

/* ===== ABA: VISÃO DO CLIENTE ========================== */
function _tabCliente(pnt, relCli, meta, relTec) {
  const probs   = relCli.problemas                   || [];
  const fortes  = relCli.pontos_fortes               || [];
  const mercado = relCli.contexto_mercado            || {};
  const psi     = relCli.pagespeed_simplificado      || {};
  const resumo  = relCli.resumo_estrategico          || '';

  return [
    _scoreCards(pnt, psi),
    resumo ? _resumoEstrategico(resumo) : '',
    _problemsVitals(pnt, probs, psi),
    fortes.length ? _fortes(fortes) : '',
    mercado.total_concorrentes ? _competitiveSection(pnt, psi, mercado, relTec) : '',
    _implementationPlan(probs),
    pnt.maturidade_score != null || pnt.potencial_score != null ? _maturityBars(pnt) : '',
  ].join('');
}

/* ── 4 Score Cards horizontais ──────────────── */
function _scoreCards(pnt, psi) {
  const uc    = _urgColor(pnt.nivel_urgencia);
  const ub    = _urgBg(pnt.nivel_urgencia);
  const defs  = _t('scores.cards');
  const vals  = [pnt.geral ?? 0, pnt.seo_local ?? 0, pnt.tecnica ?? 0, pnt.conversao ?? 0];

  return `<section class="dr-sec dr-sec--scores">
    <div class="dr-score-cards">
      ${defs.map((c, i) => {
        const v   = vals[i];
        const col = _scoreColor(v);
        return `<div class="dr-score-card-v2">
          <div class="dr-score-card-v2__header">
            <span class="dr-score-card-v2__icon" style="background:${col}20;color:${col}">
              <i class="ph ${c.icon}"></i>
            </span>
            <span class="dr-score-card-v2__label">${c.label}</span>
          </div>
          <div class="dr-score-card-v2__value" style="color:${col}">${v}<small>${c.unit}</small></div>
          <div class="dr-score-card-v2__sub">${c.sub}</div>
          <div class="dr-score-card-v2__bar-track">
            <div class="dr-score-card-v2__bar-fill" style="width:${v}%;background:${col}"></div>
          </div>
          ${i === 0 && pnt.nivel_urgencia
            ? `<span class="dr-score-card-v2__badge" style="background:${ub};color:${uc};border:1px solid ${uc}44">
                ${pnt.nivel_urgencia}
               </span>`
            : ''}
        </div>`;
      }).join('')}
    </div>
  </section>`;
}

/* ── Problemas Técnicos ─────────────────────── */
function _problemsVitals(pnt, probs, psi) {
  if (!probs.length) return '';

  const shown       = probs.slice(0, 4);
  const hiddenCount = probs.length - 4;
  const score       = pnt?.geral ?? 0;

  const accordionCard = (prob, isFirst) => {
    const pc = _priorColor(prob.prioridade);
    return `<div class="dr-accordion-item${isFirst ? ' dr-accordion-item--open' : ''}">
      <button class="dr-accordion-btn" onclick="this.parentElement.classList.toggle('dr-accordion-item--open')">
        <div class="dr-accordion-btn__left">
          <i class="ph ph-warning-circle" style="color:${pc.c}"></i>
          <span>${prob.titulo}</span>
        </div>
        <i class="ph ph-caret-down dr-accordion-caret"></i>
      </button>
      <div class="dr-accordion-body">
        <p>${prob.descricao}</p>
        ${prob.beneficio_de_resolver
          ? `<div class="dr-accordion-gain"><i class="ph ph-arrow-up-right"></i> ${prob.beneficio_de_resolver}</div>`
          : ''}
        ${prob.custo_de_nao_resolver
          ? `<div class="dr-accordion-risk"><i class="ph ph-trend-down"></i> ${prob.custo_de_nao_resolver}</div>`
          : ''}
        ${prob.fonte
          ? `<p class="dr-source-block"><i class="ph ph-book-open"></i> Fonte: ${prob.fonte}</p>`
          : ''}
      </div>
    </div>`;
  };

  return `<section class="dr-sec">
    <div class="">
      <div class="dr-two-col__main">
        <div class="dr-two-col__head">
          <h2 class="dr-sec__h dr-sec__h--no-margin">
            <i class="ph ph-warning-octagon"></i> ${_t('problems.title')}
          </h2>
          <span class="dr-badge dr-badge--red">
            ${_t('problems.countBadge', { count: probs.length })}
          </span>
        </div>
        <div class="dr-accordion">${shown.map((p, i) => accordionCard(p, i === 0)).join('')}</div>
        ${hiddenCount > 0 ? `<div class="dr-problems-cta">
          <div>
            <p class="dr-problems-cta__title">
              ${_t('problems.moreCountTpl', { count: hiddenCount })}
            </p>
            <p class="dr-problems-cta__sub">
              ${_t('problems.moreSubTpl', { score })}
            </p>
          </div>
          <a href="https://wa.me/5522981748083?text=gostaria%20de%20receber%20uma%20an%C3%A1lise%20especializada" target="_blank" rel="noopener" class="btn btn--primary btn--sm">
            <i class="ph ph-rocket-launch"></i> ${_t('problems.consultCta')}
          </a>
        </div>` : ''}
      </div>
    </div>
  </section>`;
}

/* ── Análise Competitiva: radar + tabela top 5 ─ */
function _competitiveSection(pnt, psi, mercado, relTec) {
  const competitors = relTec ? _parseTopCompetitors(relTec.analise_mercado || '') : [];
  const maxReviews  = competitors.reduce((mx, c) => Math.max(mx, c.reviews), 1);
  const total       = mercado.total_concorrentes || 0;
  const sem         = mercado.sem_site           || 0;
  const rating      = mercado.rating_medio       ?? 0;

  const plural = sem > 1 ? 's' : '';
  const verb   = sem > 1 ? 'têm' : 'tem';

  return `<section class="dr-sec">
    <h2 class="dr-sec__h"><i class="ph ph-users-three"></i> ${_t('competitive.title')}</h2>
    <p class="dr-muted">
      <i class="ph ph-info"></i>
      ${_t('competitive.descTpl', { niche: _ds.nicho || 'seu nicho', city: _ds.cidade || 'sua cidade' })}
    </p>
    <p class="dr-muted">
      <i class="ph ph-info"></i> A API do Google Maps retorna no máximo 20 resultados por consulta.
    </p>
    <div class="dr-competitive">
      <div class="dr-competitive__chart">
        <canvas id="dr-radar-chart" width="auto" height="auto"></canvas>
        <div class="dr-competitive__legend">
          <span><em class="dr-legend-dot" style="background:#9234EA"></em> ${_t('competitive.legendSelf')}</span>
          <span><em class="dr-legend-dot" style="background:rgba(200,200,220,0.5)"></em> ${_t('competitive.legendAvg')}</span>
        </div>
      </div>
      <div class="dr-competitive__data">
        ${competitors.length ? `
          <h3 class="dr-sub"><i class="ph ph-ranking"></i> ${_t('competitive.topTitle')}</h3>
          <div class="dr-comp-table">
            ${competitors.map(c => {
              const pct = Math.round((c.reviews / maxReviews) * 100);
              return `<div class="dr-comp-row">
                <div class="dr-comp-row__info">
                  <span class="dr-comp-row__name">${c.name}</span>
                  <span class="dr-comp-row__rating">⭐ ${c.rating}</span>
                </div>
                <div class="dr-comp-row__bar-wrap">
                  <div class="dr-comp-row__bar-track">
                    <div class="dr-comp-row__bar-fill" style="width:${pct}%"></div>
                  </div>
                  <span class="dr-comp-row__reviews">${c.reviews} reviews</span>
                </div>
              </div>`;
            }).join('')}
          </div>` : ''}
        ${total ? `<div class="dr-competitive__stats">
          <div class="dr-competitive__stat">
            <span class="dr-competitive__stat-val">${total}</span>
            <span>${_t('competitive.statsTotal')}</span>
          </div>
          <div class="dr-competitive__stat">
            <span class="dr-competitive__stat-val dr-competitive__stat-val--good">${sem}</span>
            <span>${_t('competitive.statsSemSite')}</span>
          </div>
          ${rating ? `<div class="dr-competitive__stat">
            <span class="dr-competitive__stat-val dr-competitive__stat-val--warn">⭐${rating}</span>
            <span>${_t('competitive.statsRating')}</span>
          </div>` : ''}
        </div>` : ''}
        ${sem !== 0 ? (() => {
            let msg;
            if (sem === 1) {
              msg = _t('competitive.opportunity1');
            } else {
              msg = _t('competitive.opportunityMany', { count: sem });
            }
            return `<div class="dr-insight"><i class="ph ph-lightbulb"></i><span>
              <strong>${msg}</strong>
            </span></div>`;
          })() : `<div class="dr-insight"><i class="ph ph-lightbulb"></i><span>
              <strong>${_t('competitive.opportunity0')}</strong>
            </span></div>`}
        ${mercado.fonte ? `<p class="dr-source-block"><i class="ph ph-book-open"></i> ${mercado.fonte}</p>` : ''}
      </div>
    </div>
  </section>`;
}

/* ── Plano de Implementação ──────────────────── */
function _implementationPlan() {
  const phases = _t('plan.phases');
  return `<section class="dr-sec">
    <h2 class="dr-sec__h dr-sec__h--center"><i class="ph ph-steps"></i> ${_t('plan.title')}</h2>
    <p class="dr-muted dr-muted--center"><i class="ph ph-info"></i> ${_t('plan.desc')}</p>
    <div class="dr-plan-grid">
      ${phases.map((ph, n) => `
        <div class="dr-plan-card${ph.active ? ' dr-plan-card--active' : ''}">
          <div class="dr-plan-card__num"
            style="background:${ph.active ? 'var(--accent-purple)' : ph.bc + '20'};color:${ph.active ? '#fff' : ph.bc}">
            ${n + 1}
          </div>
          <div class="dr-plan-card__badge" style="color:${ph.bc}">${ph.badge}</div>
          <h4 class="dr-plan-card__title">${ph.title}</h4>
          <p class="dr-plan-card__desc">${ph.desc}</p>
        </div>
      `).join('')}
    </div>
  </section>`;
}

/* ── Barras de Maturidade Digital ────────────── */
function _maturityBars(pnt) {
  if (pnt.maturidade_score == null && pnt.potencial_score == null) return '';

  const bar = (label, score, desc, nota) => `<div class="dr-bar-item">
    <div class="dr-bar-head">
      <span>${label}</span>
      <strong style="color:${_scoreColor(score)}">${score}/100${desc ? ' — ' + desc : ''}</strong>
    </div>
    <div class="dr-bar-track">
      <div class="dr-bar-fill" style="width:${score}%;background:${_scoreColor(score)}"></div>
    </div>
    ${nota ? `<p class="dr-bar-note">${nota}</p>` : ''}
  </div>`;

  return `<section class="dr-sec">
    <h2 class="dr-sec__h"><i class="ph ph-trend-up"></i> ${_t('maturity.title')}</h2>
    <div class="dr-bars">
      ${pnt.maturidade_score != null
        ? bar(_t('maturity.labelMat'), pnt.maturidade_score, pnt.maturidade_digital, _t('maturity.descMat'))
        : ''}
      ${pnt.potencial_score != null
        ? bar(_t('maturity.labelPot'), pnt.potencial_score, pnt.potencial_mercado, _t('maturity.descPot'))
        : ''}
    </div>
    ${pnt.base_calculo
      ? `<p class="dr-source-block dr-source-block--mt"><i class="ph ph-calculator"></i> ${pnt.base_calculo}</p>`
      : ''}
  </section>`;
}

/* ── Pontos Fortes ───────────────────────────── */
function _fortes(list) {
  return `<section class="dr-sec">
    <h2 class="dr-sec__h">
      <i class="ph ph-check-circle"></i> ${_t('fortes.title')}
      <span class="dr-badge dr-badge--green">${list.length}</span>
    </h2>
    <div class="dr-fortes-grid">
      ${list.map(f => {
        if (typeof f === 'string') {
          return `<div class="dr-forte-card"><i class="ph ph-check-fat"></i><span>${f}</span></div>`;
        }
        return `<div class="dr-forte-card">
          <div class="dr-forte-card__top">
            <i class="ph ph-check-fat"></i>
            <strong>${f.titulo || f.item || ''}</strong>
          </div>
          ${f.descricao ? `<p>${f.descricao}</p>` : ''}
        </div>`;
      }).join('')}
    </div>
  </section>`;
}

/* ── Oportunidades / Recomendações ───────────── */
function _recos(list) {
  if (!list || !list.length) return '';
  return `<section class="dr-sec">
    <h2 class="dr-sec__h"><i class="ph ph-list-checks"></i> ${_t('recos.title')}</h2>
    <p class="dr-muted"><i class="ph ph-info"></i> ${_t('recos.desc')}</p>
    <ol class="dr-reco-list">
      ${list.map((r, i) => {
        const text = typeof r === 'string' ? r : (r.text || r.acao || String(r));
        return `<li class="dr-reco-item">
          <span class="dr-reco-num">${i + 1}</span>
          <p>${text}</p>
        </li>`;
      }).join('')}
    </ol>
  </section>`;
}

/* ===== ABA: ANÁLISE TÉCNICA ========================== */


/* ===== CTA COM PERFIL ================================= */

// profile section of CTA footer
function _ctaProfile(profile) {
  return `<div class="dr-cta-footer__profile">
    <img src="${profile.photo}" alt="${profile.photoAlt}" class="dr-cta-footer__photo">
    <div class="dr-cta-footer__profile-info">
      <strong class="dr-cta-footer__profile-name">${profile.name}</strong>
      <span class="dr-cta-footer__profile-role">${profile.role}</span>
      <div class="dr-cta-footer__social">
        <a href="${profile.social.wa.href}" target="_blank" rel="noopener"
           class="dr-social-btn dr-social-btn--wa" title="${profile.social.wa.label}">
          <i class="ph ph-whatsapp-logo"></i>
        </a>
        <a href="${profile.social.li.href}" target="_blank" rel="noopener"
           class="dr-social-btn dr-social-btn--li" title="${profile.social.li.label}">
          <i class="ph ph-linkedin-logo"></i>
        </a>
        <a href="${profile.social.ig.href}" target="_blank" rel="noopener"
           class="dr-social-btn dr-social-btn--ig" title="${profile.social.ig.label}">
          <i class="ph ph-instagram-logo"></i>
        </a>
      </div>
    </div>
  </div>`;
}

// action buttons inside CTA footer
function _ctaActions(ctaI18n) {
  return `<div class="dr-cta-footer__actions">
    <a href="${ctaI18n.primaryHref}" target="_blank" rel="noopener"
       class="btn btn--primary dr-cta-btn--main">
      <i class="ph ph-rocket-launch"></i> ${ctaI18n.primaryBtn}
    </a>
    <a href="${ctaI18n.secondaryHref}" class="btn btn--ghost dr-cta-btn--secondary"
       data-route="${ctaI18n.secondaryHref}">
      ${ctaI18n.secondaryBtn}
    </a>
  </div>`;
}

function _cta(probs, pnt) {
  const altos   = (probs || []).filter(p => (p.prioridade || '').toLowerCase() === 'alta').length;
  const urgente = (pnt.nivel_urgencia || '').toUpperCase().includes('CRÍT')
               || (pnt.nivel_urgencia || '').toUpperCase() === 'ALTO';
  const score   = pnt.geral ?? 0;
  const profile = _t('cta.profile');
  const ctaI18n = _t('cta');

  const titleHTML = `<h2 class="dr-cta-footer__title">${ctaI18n.title}</h2>`;

  const subHTML = `<p class="dr-cta-footer__sub">
    ${_t('cta.subTpl')} <br/><br/>
    ${_t('cta.subHighTpl')}
  </p>`;

  const bodyHTML = `<div class="dr-cta-footer__body">
    ${_ctaProfile(profile)}
    ${_ctaActions(ctaI18n)}
  </div>`;

  const fineHTML = `<p class="dr-cta-footer__fine">
    <i class="ph ph-lock"></i> ${ctaI18n.fine}
  </p>`;

  return `<div class="dr-cta-footer">
    ${titleHTML}
    ${subHTML}
    ${bodyHTML}
  </div>`;
}

/* ===== LISTENERS DO RESULTADO ======================== */
function _resultListeners() {
  document.getElementById('diag-print-client')?.addEventListener('click', () => _printReport());

  /* Init radar chart após DOM render */
  const raw    = _ds.resultData;
  const report = raw?.auditReport || raw;
  if (report) {
    const pnt  = report.pontuacao              || {};
    const psi  = (report.relatorio_cliente?.pagespeed_simplificado) || {};
    setTimeout(() => _initCharts(pnt, psi), 150);
    setTimeout(() => _initPlanCarousel(), 200); // start carousel after render
  }

  document.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const route = el.getAttribute('data-route');
      if (route === '/ferramentas/diagnostico') {
        if (_ds.resendTimer) clearInterval(_ds.resendTimer);
        initToolDiagnostico();
      } else if (window.router?.navigate) {
        window.router.navigate(route);
      }
    });
  });
}

/* ─── Infinite carousel for implementation plan (mobile only) ─── */
function _initPlanCarousel() {
  const grid = document.querySelector('.dr-plan-grid');
  if (!grid) return;
  const breakpoint = 640;
  let clones = false;
  let animating = false;

  function animate() {
    if (!animating) return;
    grid.scrollLeft += 0.5;
    if (grid.scrollLeft >= grid.scrollWidth / 2) {
      grid.scrollLeft = 0;
    }
    requestAnimationFrame(animate);
  }

  function setup() {
    const w = window.innerWidth;
    if (w <= breakpoint && !clones) {
      // convert grid to flex carousel and duplicate
      grid.classList.add('plan-carousel');
      const cards = Array.from(grid.children);
      cards.forEach(c => grid.appendChild(c.cloneNode(true)));
      clones = true;
      animating = true;
      animate();
    }
    if (w > breakpoint && clones) {
      // remove clones and restore grid layout
      const total = grid.children.length;
      const original = total / 2;
      while (grid.children.length > original) grid.removeChild(grid.lastChild);
      grid.classList.remove('plan-carousel');
      clones = false;
      animating = false;
      grid.scrollLeft = 0;
    }
  }

  window.addEventListener('resize', setup);
  setup();
}


/* _printReport → tool-diagnostico-print.js */
