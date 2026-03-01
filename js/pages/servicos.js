/* =============================================
   SERVIÇOS PAGE — Grouped by category
   ============================================= */

const servicoCategories = [
  {
    title: 'Desenvolvimento',
    subtitle: 'Sites, sistemas e aplicações sob medida.',
    items: [
      {
        icon: 'ph-devices',
        title: 'Aplicações Web',
        desc:  'Sistemas corporativos, plataformas e dashboards desenvolvidos com Java, Angular, React e Node.js.',
      },
      {
        icon: 'ph-code',
        title: 'APIs e Backends',
        desc:  'Desenvolvimento de APIs REST, microsserviços e integrações entre sistemas legados e modernos.',
      },
      {
        icon: 'ph-globe-hemisphere-west',
        title: 'Landing Pages e Sites',
        desc:  'Criação de landing pages e sites institucionais com design responsivo e otimizado para conversão.',
      },
    ],
  },
  {
    title: 'Automação & Inteligência Artificial',
    subtitle: 'Processos automatizados, chatbots e IA aplicada.',
    items: [
      {
        icon: 'ph-flow-arrow',
        title: 'Automação de Processos',
        desc:  'Fluxos inteligentes com n8n. Integre ferramentas, APIs e processos empresariais com eficiência.',
      },
      {
        icon: 'ph-brain',
        title: 'Engenharia de Prompts',
        desc:  'Prompts otimizados para LLMs. Extraia o máximo de GPT-4, Claude, Llama e outros modelos.',
      },
      {
        icon: 'ph-chat-circle-dots',
        title: 'Chatbots e Agentes IA',
        desc:  'Atendimento automatizado via WhatsApp e Telegram com agentes inteligentes e qualificação de leads.',
      },
      {
        icon: 'ph-chart-line-up',
        title: 'Gestor Financeiro',
        desc:  'Dashboards e relatórios automáticos integrados a ferramentas de contabilidade e faturamento.',
      },
    ],
  },
  {
    title: 'Integrações & Ferramentas',
    subtitle: 'Conecte seus sistemas e elimine tarefas manuais.',
    items: [
      {
        icon: 'ph-plugs-connected',
        title: 'Integração de Ferramentas',
        desc:  'Notion, Coda, Figma, Google Workspace (Mail, Calendar, Sheets, Drive), Jira e mais.',
      },
      {
        icon: 'ph-microphone',
        title: 'Conexão com Alexa',
        desc:  'Skills e integrações com voz. Automatize sua casa ou negócio com comandos personalizados.',
      },
      {
        icon: 'ph-calendar-check',
        title: 'Agendamento Inteligente',
        desc:  'Integração com Google Calendar, Calendly e outras plataformas para gestão automática de agenda.',
      },
      {
        icon: 'ph-map-pin',
        title: 'Gerador de Leads',
        desc:  'Prospecção automatizada de empresas e contatos a partir de buscas no Google Maps.',
      },
    ],
  },
];

function renderServicos() {
  const sectionsHTML = servicoCategories.map(cat => `
    <div class="servicos-section reveal">
      <div class="servicos-section__header">
        <h3 class="servicos-section__title">${cat.title}</h3>
        <p class="servicos-section__subtitle">${cat.subtitle}</p>
      </div>
      <div class="servicos-grid">
        ${cat.items.map(s => `
          <div class="servico-card">
            <i class="ph ${s.icon} servico-card__icon"></i>
            <h4 class="servico-card__title">${s.title}</h4>
            <p class="servico-card__desc">${s.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  return `
    <section class="servicos page">
      <div class="container">
        <div class="page__header">
          <span class="section-label">O que eu faço</span>
          <h2>Serviços</h2>
          <p>Desenvolvimento, automação, inteligência artificial e integrações para pessoas e empresas.</p>
        </div>
        ${sectionsHTML}
      </div>
    </section>
  `;
}

function initServicos() {}
