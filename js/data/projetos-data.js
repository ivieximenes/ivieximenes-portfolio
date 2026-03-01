/* =============================================
   PROJETOS — Dados / Content
   Separado do código de renderização para
   facilitar manutenção e futura i18n.
   ============================================= */

/* ---- Ícones reutilizáveis ---- */
const TECH = {
  react:      { name: 'React',       icon: 'react/react-original.svg'                },
  nodejs:     { name: 'Node.js',     icon: 'nodejs/nodejs-original.svg'              },
  firebase:   { name: 'Firebase',    icon: 'firebase/firebase-original.svg'          },
  javascript: { name: 'JavaScript',  icon: 'javascript/javascript-original.svg'      },
  typescript: { name: 'TypeScript',  icon: 'typescript/typescript-original.svg'      },
  html5:      { name: 'HTML5',       icon: 'html5/html5-original.svg'                },
  css3:       { name: 'CSS3',        icon: 'css3/css3-original.svg'                  },
  figma:      { name: 'Figma',       icon: 'figma/figma-original.svg'                },
  spring:     { name: 'Spring',      icon: 'spring/spring-original.svg'              },
  java:       { name: 'Java',        icon: 'java/java-original.svg'                  },
  // Locais (não estão no devicons)
  n8n:        { name: 'n8n',         icon: 'img/logo-n8n.svg',    local: true },
  openai:     { name: 'OpenAI',      icon: 'img/logo-openai.svg', local: true },
  lumis:      { name: 'Lumisportal', icon: 'img/logo-lumis.png',  local: true },
  redis:      { name: 'Redis',       icon: 'img/logo-redis.svg',  local: true },
};

/* ---- Filtros ---- */
const projectFilters = [
  { key: 'todos',     label: 'Todos'     },
  { key: 'web',       label: 'Web'       },
  { key: 'mobile',    label: 'Mobile'    },
  { key: 'automacao', label: 'Automação' },
];

/* ---- Empresas / Clientes ---- */
const clientCompanies = [
  { name: 'Accenture', logo: 'img/logo-accenture.png' },
  { name: 'Pluxee',    logo: 'img/logo-pluxee.png'    },
  { name: 'Nio / Oi', logo: 'img/logo-nio.svg'       },
  { name: 'Lumis',    logo: 'img/logo-lumis.png'     },
];

/* ---- Projetos ---- */
const projects = [
  {
    id: 'gestor-financeiro',
    title: 'Gestor Financeiro',
    category: ['web', 'automacao'],
    desc: 'Automação de controle financeiro com IA, Google Sheets e dashboard web gerado dinamicamente via n8n. As informações são recebidas através de um webhook e podem ser enviadas por mensagem de áudio, texto ou imagem de notas fiscais pelo Telegram, WhatsApp ou dispositivos Alexa.',
    image: 'img/projects/gestor-financeiro.png',
    tech: [ TECH.n8n, TECH.openai, TECH.javascript ],
    demo:   null,
    source: 'https://github.com/ivieximenes',
    details: {
      summary: 'Automação de controle financeiro com n8n + OpenAI, integrada ao Google Sheets, capaz de registrar e analisar transações via áudio, texto ou imagem por Telegram, WhatsApp e Alexa.',
      images: [
        'img/projects/gestor-financeiro.png',
      ],
      features: [
        'Automação do controle financeiro (registro e organização de transações)',
        'Classificação inteligente de dados via IA',
        'Consultas financeiras em linguagem natural',
        'Dashboard web dinâmico com indicadores e gráficos',
      ],
      sections: [
        {
          icon: '🧠',
          title: 'Arquitetura da Solução',
          items: [
            {
              subtitle: 'A solução é composta por dois subworkflows principais dentro do n8n, interconectados para realizar as seguintes funções:',
              bullets: [
                'Workflow principal no n8n (processamento e orquestração)',
                'Redis para gerenciamento de estado/memória',
                'Google Sheets como base de dados',
                'OpenAI LLM para interpretação e respostas inteligentes',
                'Subworkflow com Webhook para geração do dashboard web',
              ],
            }
          ],
        },
        {
          icon: '🎯',
          title: 'Diferenciais Técnicos',
          items: [
            {
              bullets: [
                'Arquitetura modular com separação de responsabilidades',
                'Uso prático de LLM aplicado a dados estruturados',
                'Automação com lógica personalizada',
                'Dashboard dinâmico gerado via automação',
                'Integração entre IA + planilha + visualização web',
                'Projeto deployado e funcional em ambiente real',
              ],
            },
          ],
        },
      ],
      techStack: [
        {
          category: '🔧 Orquestração',
          items: [ TECH.n8n, TECH.redis ],
          notes: ['Workflows', 'Subworkflows', 'Webhooks', 'Code nodes (JS)', 'Gerenciamento de estado'],
        },
        {
          category: '🤖 IA',
          items: [ TECH.openai ],
          notes: ['Classificação de transações', 'Respostas inteligentes'],
        },
        {
          category: '🌐 Frontend',
          items: [ TECH.javascript, TECH.html5, TECH.css3 ],
          notes: ['Dashboard gerado via n8n', 'Chart.js'],
        },
      ],
    },
  },
  {
    id: 'nio',
    title: 'Nio Internet',
    category: ['web'],
    desc: 'Portal corporativo e sistema de atendimento para provedor de internet.',
    image: 'img/projects/niointernet.png',
    tech: [ TECH.react, TECH.nodejs, TECH.firebase ],
    demo:   null,
    source: 'https://github.com/ivieximenes',
  },
  {
    id: 'flowhub',
    title: 'FlowHub',
    category: ['automacao'],
    desc: 'Plataforma de automação inteligente com IA. Criação de fluxos complexos para empresas.',
    image: 'img/projects/flowhub.png',
    tech: [ TECH.n8n, TECH.react, TECH.nodejs ],
    demo:   null,
    source: 'https://github.com/ivieximenes',
  },
  {
    id: 'mdass',
    title: 'MDASS Landing Page',
    category: ['web'],
    desc: 'Implementação HTML/CSS/JS de landing page com design externo altamente otimizado.',
    image: 'img/projects/mdass.png',
    tech: [ TECH.html5, TECH.css3, TECH.javascript ],
    demo:   'https://portal.mdass.com.br/formulario/',
    source: 'https://github.com/ivieximenes',
  },
  {
    id: 'reidamesa',
    title: 'Rei da Mesa',
    category: ['mobile'],
    desc: 'App de divisão de conta com promoções regionais e gamificação (Startup Rio 2019 / FAPERJ).',
    image: 'img/projects/startuprio.png',
    tech: [ TECH.react, TECH.firebase, TECH.figma ],
    demo:   null,
    source: 'https://github.com/ivieximenes',
  },
  {
    id: '',
    title: 'Novos projetos em breve...',
    category: ['todos'],
    desc: '',
    image: null,
    tech: [],
    demo:   null,
    source: null,
    placeholder: true,
  },
];
