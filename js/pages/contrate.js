/* =============================================
   CONTRATE PAGE — Hire Me
   ============================================= */

const pricingPlans = [
  {
    id:       'demanda',
    title:    'Sob Demanda',
    price:    'Por hora',
    desc:     'Para tarefas pontuais, ajustes, automações ou suporte técnico contínuo.',
    featured: false,
    features: [
      'Ajustes e melhorias front-end/back-end',
      'Automações com n8n e IA',
      'Integrações de API',
      'Chatbots e agentes inteligentes',
      'Suporte técnico',
    ],
  },
  {
    id:       'dedicado',
    title:    'Projeto Dedicado',
    price:    'Preço Fixo',
    desc:     'Do levantamento de requisitos ao deploy — ideal para novos sistemas, sites e plataformas.',
    featured: false,
    features: [
      'Levantamento de requisitos',
      'Design de Interface (UI/UX)',
      'Desenvolvimento Full Stack',
      'Banco de dados e infraestrutura',
      'Acompanhamento pós-entrega',
    ],
  },
  {
    id:       'consultoria',
    title:    'Consultoria Técnica',
    price:    'A Combinar',
    desc:     'Análise estratégica para otimizar processos, arquitetura e uso de IA na sua empresa.',
    featured: false,
    features: [
      'Análise de processos e arquitetura',
      'Engenharia de Prompts (LLMs)',
      'Modernização de sistemas legados',
      'Mentoria e treinamento de equipe',
    ],
  },
];

function renderContrate() {
  const cardsHTML = pricingPlans.map(plan => `
    <div class="pricing-card reveal">
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
      <a href="#/contato" class="btn btn--outline">
        Vamos conversar
      </a>
    </div>
  `).join('');

  return `
    <section class="contrate page">
      <div class="container">
        <div class="page__header">
          <h2>Vamos trabalhar juntos?</h2>
        </div>
        <div class="pricing-grid">${cardsHTML}</div>
      </div>
    </section>
  `;
}

function initContrate() {}
