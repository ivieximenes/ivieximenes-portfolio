/* =============================================
   FERRAMENTAS PAGE — Listing of free tools
   ============================================= */

const ferramentasData = [
  {
    id:       'diagnostico',
    icon:     'ph-magnifying-glass-plus',
    title:    'Diagnóstico de Presença Digital',
    desc:     'Analisa o seu site e gera um relatório completo com dados de velocidade, SEO, acessibilidade, concorrentes locais e estimativas financeiras de mercado.',
    tags:     ['PageSpeed', 'SEO', 'Google Maps', 'Concorrência'],
    status:   'disponivel',
    href:     '/ferramentas/diagnostico',
    note:     'Verificação por e-mail · 1 uso grátis por dia',
  },
  {
    id:       'gerador-leads',
    icon:     'ph-map-pin',
    title:    'Gerador de Leads Locais',
    desc:     'Encontra empresas do seu nicho em uma região específica no Google Maps, extrai dados de contato e gera uma lista pronta para prospecção.',
    tags:     ['Google Maps', 'Leads', 'Prospecção'],
    status:   'breve',
    href:     null,
    note:     'Em breve',
  },
  {
    id:       'analisador-prompt',
    icon:     'ph-brain',
    title:    'Analisador de Prompts IA',
    desc:     'Avalia a qualidade do seu prompt para modelos de linguagem (GPT, Claude, Gemini) e sugere melhorias para obter resultados mais precisos.',
    tags:     ['IA', 'Prompts', 'LLM'],
    status:   'breve',
    href:     null,
    note:     'Em breve',
  },
];

function renderFerramentas() {
  const cards = ferramentasData.map(tool => {
    const isAvailable = tool.status === 'disponivel';
    return `
      <div class="tool-card reveal ${isAvailable ? 'tool-card--active' : 'tool-card--soon'}">
        <div class="tool-card__icon">
          <i class="ph ${tool.icon}"></i>
        </div>
        <div class="tool-card__body">
          <div class="tool-card__top">
            <h2 class="tool-card__title">${tool.title}</h2>
            <span class="tool-card__badge ${isAvailable ? 'tool-card__badge--active' : 'tool-card__badge--soon'}">
              ${isAvailable ? '<i class="ph ph-check-circle"></i> Disponível' : '<i class="ph ph-clock"></i> Em breve'}
            </span>
          </div>
          <p class="tool-card__desc">${tool.desc}</p>
          <div class="tool-card__tags">
            ${tool.tags.map(t => `<span class="tool-card__tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="tool-card__footer">
          <span class="tool-card__note"><i class="ph ph-info"></i> ${tool.note}</span>
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
          <h1 class="ferramentas-page__title">Teste na prática.<br>Veja o resultado.</h1>
          <p class="ferramentas-page__subtitle">
            Ferramentas desenvolvidas com os mesmos fluxos que entrego para clientes.
            Experimente gratuitamente — basta confirmar seu e-mail.
          </p>
        </div>
      </div>

      <div class="ferramentas-page__info reveal">
        <i class="ph ph-shield-check"></i>
        <p>Para evitar abusos, as ferramentas exigem verificação por e-mail e têm limite de 1 uso por dia. Seus dados não são compartilhados com terceiros.</p>
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
