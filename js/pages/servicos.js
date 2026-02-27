/* =============================================
   SERVIÇOS PAGE
   ============================================= */

const servicos = [
  {
    icon: 'ph-globe-hemisphere-west', // Landing Page e Sites Institucionais
    title: 'Lading Page e Sites Institucionais',
    desc:  'Criação de landing pages e sites institucionais personalizados para sua empresa.',
  },
  {
    icon: 'ph-devices', // Desenvolvimento de Aplicações Web
    title: 'Desenvolvimento de Aplicações Web',
    desc:  'Criação de aplicativos web personalizados para atender às necessidades específicas da sua empresa.',
  },
  {
    icon: 'ph-code', // Desenvolvimento de APIs e Backends
    title: 'Desenvolvimento de APIs e Backends',
    desc:  'Criação de APIs e backends personalizados para atender às necessidades específicas da sua empresa.',
  },
  {
    icon: 'ph-flow-arrow',
    title: 'Automação',
    desc:  'Fluxos inteligentes sem código. Integre ferramentas, APIs e processos pessoais/empresariais com eficiência.',
  },
  {
    icon: 'ph-brain',
    title: 'Geração de Prompts para IA',
    desc:  'Prompts otimizados para LLMs. Extraia o máximo de GPT-4, Claude, Llama e outros modelos.',
  },
  {
    icon: 'ph-pencil-line',
    title: 'Gestor de Conteúdo',
    desc:  'Automação de publicações, agendamentos e criação de conteúdo com integração a plataformas digitais.',
  },
  {
    icon: 'ph-microphone',
    title: 'Conexão com Alexa',
    desc:  'Skills e integrações com voz. Automatize sua casa ou negócio com comandos personalizados.',
  },
  {
    icon: 'ph-chart-line-up',
    title: 'Gestor Financeiro',
    desc:  'Dashboards, relatórios automáticos e integração com ferramentas de contabilidade e faturamento.',
  },
  {
    icon: 'ph-chat-circle-dots',
    title: 'Atendimento via WhatsApp/Telegram',
    desc:  'Chatbots e agentes de IA para atendimento ao cliente, qualificação de leads e suporte técnico.',
  },
  {
    icon: 'ph-calendar-check',
    title: 'Agendamento Inteligente',
    desc:  'Integração com Google Calendar, Calendly e outras plataformas para gestão automática de agenda.',
  },
  {
    icon: 'ph-plugs-connected',
    title: 'Integração de Ferramentas',
    desc:  'Notion, Coda, Figma, Google Workspace (Mail, Calendar, Sheets, Drive), Jira e mais.',
  },
  {
    icon: 'ph-map-pin',
    title: 'Gerador de Leads com Google Maps',
    desc:  'Prospecção automatizada de empresas e contatos a partir de buscas no Google Maps.',
  },
];

function renderServicos() {
  const cardsHTML = servicos.map(s => `
    <div class="servico-card reveal">
      <i class="ph ${s.icon} servico-card__icon"></i>
      <h3 class="servico-card__title">${s.title}</h3>
      <p class="servico-card__desc">${s.desc}</p>
    </div>
  `).join('');

  return `
    <section class="servicos page">
      <div class="container">
        <div class="page__header">
          <span class="section-label">O que eu faço</span>
          <h2>Serviços</h2>
          <p>Sites, automações, integrações, inteligência artificial e atendimento digital para pessoas e empresas modernas.</p>
        </div>
        <div class="servicos-grid">${cardsHTML}</div>
      </div>
    </section>
  `;
}

function initServicos() {}
