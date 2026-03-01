/* =============================================
   PROJETOS — Dados / Content
   Separado do código de renderização para
   facilitar manutenção e futura i18n.
   ============================================= */

/* ---- Ícones reutilizáveis ---- */
const TECH = {
  react:      { name: 'React',       icon: 'react/react-original.svg'                },
  reactNative:{ name: 'React Native',       icon: 'react/react-original.svg'                },
  angular:      { name: 'Angular',       icon: 'angular/angular-original.svg'                },
  nodejs:     { name: 'Node.js',     icon: 'nodejs/nodejs-original.svg'              },
  firebase:   { name: 'Firebase',    icon: 'firebase/firebase-original.svg'          },
  javascript: { name: 'JavaScript',  icon: 'javascript/javascript-original.svg'      },
  typescript: { name: 'TypeScript',  icon: 'typescript/typescript-original.svg'      },
  html5:      { name: 'HTML5',       icon: 'html5/html5-original.svg'                },
  css3:       { name: 'CSS3',        icon: 'css3/css3-original.svg'                  },
  figma:      { name: 'Figma',       icon: 'figma/figma-original.svg'                },
  spring:     { name: 'Spring',      icon: 'spring/spring-original.svg'              },
  java:       { name: 'Java',        icon: 'java/java-original.svg'                  },
  mysql:       { name: 'MySQL',        icon: 'mysql/mysql-original.svg'              },
  oracle:       { name: 'Oracle',        icon: 'oracle/oracle-original.svg'              },
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
    id: 'nio',
    title: 'Nio internet',
    category: ['web'],
    desc: 'Portal corporativo e sistema de atendimento para provedor de internet.',
    image: 'img/projects/niointernet.png',
    tech: [TECH.java, TECH.lumis, TECH.mysql, TECH.javascript, TECH.html5, TECH.css3 ],
    demo:   null,
    source: null,
  },
  {
    id: 'pluxee-clientes',
    title: 'Portal Pluxee Brasil',
    category: ['web'],
    desc: 'Portal institucional, portal de autoatendimento para clientes e portal de empresas, com gerenciamento de benefícios e serviços.',
    image: 'img/projects/pluxee.png',
    tech: [TECH.angular, TECH.java, TECH.javascript, TECH.html5, TECH.css3],
    demo: 'https://clientes.pluxee.com.br/',
    source: null,
  },
  {
    id: 'sodexo-clientes',
    title: 'Portal Sodexo Brasil',
    category: ['web'],
    desc: 'Portal institucional, portal de autoatendimento para clientes e portal de empresas, com gerenciamento de benefícios e serviços.',
    image: 'img/projects/sodexo.jpg',
    tech: [TECH.java, TECH.lumis, TECH.javascript, TECH.html5, TECH.css3],
    demo: 'https://clientes.sodexo.com.br/',
    source: null,
  },
  {
    id: 'sulamerica-clientes',
    title: 'Portal SulAmérica clientes',
    category: ['web'],
    desc: 'Portal institucional e portal de autoatendimento para clientes, com gerenciamento de benefícios e serviços.',
    image: 'img/projects/sulamerica.jpg',
    tech: [TECH.java, TECH.lumis, TECH.javascript, TECH.html5, TECH.css3],
    demo: 'https://clientes.sulamerica.com.br/',
    source: null,
  },
  {
    id: 'reidamesa',
    title: 'Rei da mesa',
    category: ['mobile'],
    desc: 'App de divisão de conta com promoções regionais e gamificação (Startup Rio 2019 / FAPERJ).',
    image: 'img/projects/startuprio.png',
    tech: [ TECH.reactNative],
    demo:   null,
    source: null,
  },
  {
    id: 'flowhub',
    title: 'FlowHub',
    category: ['automacao'],
    desc: 'Plataforma de automação inteligente com IA para orquestração de fluxos.',
    image: 'img/projects/flowhub.png',
    tech: [ TECH.n8n, TECH.react, TECH.nodejs ],
    demo:   null,
    source: null,
  },
  {
    id: 'gestor-financeiro',
    title: 'Gestor financeiro',
    category: ['web', 'automacao'],
    desc: 'Automação de controle financeiro com IA, Google Sheets e dashboard web gerado dinamicamente via n8n. As informações são recebidas através de um webhook e podem ser enviadas por mensagem de áudio, texto ou imagem de notas fiscais pelo Telegram, WhatsApp ou dispositivos Alexa.',
    image: 'img/projects/gestor-financeiro.png',
    tech: [ TECH.n8n, TECH.openai, TECH.javascript ],
    demo:   null,
    source: null,
    details: {
      summary: 'Solução de automação desenvolvida com n8n, integrada ao Google Sheets e à OpenAI (LLM), com o objetivo de realizar controle financeiro automatizado e geração de insights inteligentes sobre receitas e despesas. As informações são recebidas através de um webhook e podem ser enviadas por mensagem de áudio, texto ou imagem de notas fiscais pelo Telegram, WhatsApp ou dispositivos Alexa.',
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
              ],
            },
          ],
        },
      ],
      techStack: [
        {
          category: '🔧 Orquestração',
          items: [ TECH.n8n, TECH.redis ],
          notes: ['Workflows', 'Subworkflows', 'Code nodes (JS)'],
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
    id: 'mdass',
    title: 'MDASS Landing Page',
    category: ['web'],
    desc: 'Implementação HTML/CSS/JS de landing page com design externo altamente otimizado.',
    image: 'img/projects/mdass.png',
    tech: [ TECH.html5, TECH.css3, TECH.javascript ],
    demo:   null,
    source: null,
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
