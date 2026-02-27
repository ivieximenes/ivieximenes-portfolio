/* =============================================
   CONTRATE PAGE — Pricing / Hire Me
   ============================================= */

const pricingPlans = [
  {
    id:       'freelance',
    title:    'Freelance / Sob Demanda',
    price:    'Por hora',
    desc:     'Ideal para ajustes rápidos, manutenções ou automações pontuais.',
    featured: false,
    features: [
      'Ajustes no front-end/back-end',
      'Criação de automações no n8n',
      'Integrações de API',
      'Suporte técnico',
    ],
  },
  {
    id:       'completo',
    title:    'Projeto Completo',
    price:    'Preço Fixo',
    desc:     'Do planejamento ao deploy. Perfeito para novos aplicativos, sites e plataformas.',
    featured: true,
    features: [
      'Design de Interface (UI/UX)',
      'Desenvolvimento Front-end',
      'Desenvolvimento Back-end',
      'Banco de dados',
      'Deploy e configuração de infra',
    ],
  },
  {
    id:       'consultoria',
    title:    'Consultoria IA & Automação',
    price:    'A Combinar',
    desc:     'Consultoria estratégica para otimizar os processos da sua empresa.',
    featured: false,
    features: [
      'Análise de processos',
      'Engenharia de Prompts (LLMs)',
      'Arquitetura de soluções',
      'Treinamento de equipe',
    ],
  },
];

function renderContrate() {
  const cardsHTML = pricingPlans.map(plan => `
    <div class="pricing-card ${plan.featured ? 'featured' : ''} reveal">
      ${plan.featured ? '<div class="pricing-ribbon">Recomendado</div>' : ''}
      <h3 class="pricing-card__title">${plan.title}</h3>
      <p class="pricing-card__price">${plan.price}</p>
      <p class="pricing-card__desc">${plan.desc}</p>
      <ul class="pricing-card__features">
        ${plan.features.map(f => `
          <li class="pricing-feature">
            <i class="ph ph-check-circle"></i>
            <span>${f}</span>
          </li>
        `).join('')}
      </ul>
      <a href="#/contato" class="btn ${plan.featured ? 'btn--primary' : 'btn--outline'}">
        Solicitar Orçamento
      </a>
    </div>
  `).join('');

  return `
    <section class="contrate page">
      <div class="container">
        <div class="page__header">
          <h2>Vamos trabalhar juntos ?</h2>
          
        </div>
        <div class="pricing-grid">${cardsHTML}</div>
      </div>
    </section>
  `;
}

function initContrate() {}
