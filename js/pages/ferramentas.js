/* =============================================
   FERRAMENTAS PAGE — Listing of free tools
   ============================================= */

const ferramentasData = [
  {
    id:       'diagnostico',
    icon:     'ph-magnifying-glass-plus',
    title:    'Diagnóstico de Presença Digital',
    desc:     'Analisa o seu site e gera um relatório utilizando IA, APIs oficiais e insights técnicos.',
    tags:     ['PageSpeed', 'SEO', 'Google Maps', 'IA'],
    status:   'disponivel',
    href:     '/ferramentas/diagnostico',
    note:     'Verificação por e-mail. Limite de 1 diagnóstico.',
  },
];

function renderFerramentas() {
  const cards = ferramentasData.map(tool => {
    const isAvailable = tool.status === 'disponivel';
    // Adiciona badge "Em testes" apenas para a ferramenta de diagnóstico
    const badge = tool.id === 'diagnostico'
      ? `<span class="tool-card__badge tool-card__badge--testes">Em testes</span>`
      : '';
    return `
      <div class="tool-card reveal ${isAvailable ? 'tool-card--active' : 'tool-card--soon'}">
        ${badge}
        <div class="tool-card__body">
          <div class="tool-card__top">
            <div class="tool-card__title-area">
              <div class="tool-card__icon">
                <i class="ph ${tool.icon}"></i>
              </div>
              <h2 class="tool-card__title">${tool.title}</h2>
            </div>
          </div>
          <p class="tool-card__desc">${tool.desc}</p>
          <div class="tool-card__tags">
            ${tool.tags.map(t => `<span class="tool-card__tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="tool-card__footer">
          ${isAvailable
            ? `<a href="${tool.href}" class="btn btn--primary btn--sm" data-route="${tool.href}">
                <i class="ph ph-play-circle"></i> Testar grátis
               </a>`
            : `<button class="btn btn--outline btn--sm" disabled>Em breve</button>`
          }
        </div>
      </div>
    `;
  }).join('');

  return `
    <section class="ferramentas-page">
      <div class="ferramentas-page__hero">
        <div class="ferramentas-page__hero-inner">
          <p class="section-eyebrow">Ferramentas gratuitas</p>
          <h1 class="ferramentas-page__title">Demonstrações interativas.</h1>
        </div>
      </div>

      <div class="ferramentas-page__info reveal">
        <i class="ph ph-shield-check"></i>
        <p>As ferramentas exigem verificação por e-mail e têm limite de uso.</p>
      </div>

      <div class="ferramentas-page__grid">
        ${cards}
      </div>
    </section>
  `;
}

function initFerramentas() {
  initScrollReveal();
}
