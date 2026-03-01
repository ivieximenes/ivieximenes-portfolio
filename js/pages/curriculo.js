/* =============================================
   CURRÍCULO PAGE — Timeline with accordion arrows
   ============================================= */

const DEVICON_CV = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';

const cvExperience = [
  {
    title:   'Desenvolvedora Full Stack',
    company: 'Sodexo / Pluxee',
    period:  '',
    type:    'Experiência Profissional',
    stack:   [
      { name: 'Java',    icon: 'java/java-original.svg'       },
      { name: 'Angular', icon: 'angular/angular-original.svg' },
    ],
    bullets: [
      'Desenvolvimento Full Stack utilizando Java e Angular.',
      'Atuação em modernização de sistemas legados em Java, migrando para arquitetura frontend moderna.',
      'Criação e manutenção de testes unitários (JUnit, TestNG, Jasmine).',
      'Integração entre frontend, backend e serviços externos.',
      'Colaboração próxima com times de negócio e QA, garantindo qualidade contínua das entregas.',
    ],
  },
  {
    title:   'Desenvolvedora Full Stack',
    company: 'Meta Serviços em Informática',
    period:  'Alocada na NIO (Antiga Oi)',
    type:    'Experiência Profissional',
    stack:   [
      { name: 'Java',       icon: 'java/java-original.svg'             },
      { name: 'JavaScript', icon: 'javascript/javascript-original.svg' },
    ],
    bullets: [
      'Desenvolvimento e manutenção de aplicações web utilizando Java, JavaScript e Lumis Portal.',
      'Participação ativa na definição de escopo, backlog, desenvolvimento e entrega em produção.',
    ],
  },
  {
    title:   'Desenvolvedora Full Stack',
    company: 'Lumis EIP / Lumis Portal',
    period:  'aprox. 8 anos',
    type:    'Experiência Profissional',
    stack:   [
      { name: 'Java',          icon: 'java/java-original.svg'                       },
      { name: 'JavaScript',    icon: 'javascript/javascript-original.svg'           },
      { name: 'Hibernate',     icon: 'hibernate/hibernate-original.svg'             },
      { name: 'Oracle',        icon: 'oracle/oracle-original.svg'                   },
      { name: 'MySQL',         icon: 'mysql/mysql-original.svg'                     },
      { name: 'Elasticsearch', icon: 'elasticsearch/elasticsearch-original.svg'     },
    ],
    bullets: [
      'Atuação de longo prazo em projetos corporativos de grande porte, utilizando Lumis Portal (EIP/CRM).',
      'Desenvolvimento e manutenção de aplicações web com Java, JavaScript, XML, XSL, Maven e Hibernate.',
      'Integração com bancos de dados Oracle e MySQL, além de uso de Elasticsearch para buscas e indexação.',
      'Atuação em grandes portais institucionais, com múltiplas integrações entre sistemas internos e externos.',
      'Experiência com versionamento (Git, SVN), Jira e servidores de aplicação Tomcat.',
      'Trabalho alocado em clientes: Pluxee (Antiga Sodexo Benefícios), SulAmérica Seguros, Aliansce Shopping, CNSEG.',
    ],
  },
  {
    title:   'Desenvolvedora Siebel',
    company: 'Accenture do Brasil',
    period:  'Projeto Oi',
    type:    'Experiência Profissional',
    stack:   [
      { name: 'Java', icon: 'java/java-original.svg' },
    ],
    bullets: [
      'Atuação em projeto corporativo de grande porte no setor de telecomunicações.',
      'Desenvolvimento e manutenção de soluções utilizando Siebel.',
      'Integração com sistemas legados e bases corporativas.',
    ],
  },
  {
    title:   'Desenvolvedora Backend',
    company: 'DashTI',
    period:  '',
    type:    'Experiência Profissional',
    stack:   [
      { name: 'Java', icon: 'java/java-original.svg' },
    ],
    bullets: [
      'Desenvolvimento de aplicações utilizando Java.',
      'Atuação em projetos corporativos com Vignette (CRM / CMS).',
      'Manutenção evolutiva e corretiva de sistemas legados.',
    ],
  },
  {
    title:   'Desenvolvedora Full Stack',
    company: 'Mittech Soluções',
    period:  '',
    type:    'Experiência Profissional',
    stack:   [
      { name: 'Java',      icon: 'java/java-original.svg'           },
      { name: 'Hibernate', icon: 'hibernate/hibernate-original.svg' },
    ],
    bullets: [
      'Desenvolvimento de rotinas administrativas em Java.',
      'Utilização dos frameworks Hibernate e EJB 3.',
      'Criação e manutenção de relatórios gerenciais utilizando iReport.',
      'Integração com bases de dados relacionais.',
      'Atuação em sistemas corporativos voltados a processos internos.',
      'Clientes: Previ, SHV, Fapes, Supergasbras.',
    ],
  },
  {
    title:   'Desenvolvedora Backend',
    company: 'Fattoria Web',
    period:  'Alocação no CREA-RJ',
    type:    'Experiência Profissional',
    stack:   [
      { name: 'Java',      icon: 'java/java-original.svg'           },
      { name: 'Hibernate', icon: 'hibernate/hibernate-original.svg' },
    ],
    bullets: [
      'Desenvolvimento de sistema web de grande porte para órgão público, com alto volume de regras de negócio.',
      'Atuação com Java, utilizando EJB 3.0, Struts 1.3 e Hibernate.',
      'Criação e manutenção de relatórios com Jasper Reports.',
      'Utilização do JBoss como servidor de aplicação.',
      'Atuação em manutenção evolutiva e corretiva, garantindo estabilidade e confiabilidade do sistema.',
      'Trabalho em ambiente corporativo estruturado, com foco em qualidade, performance e segurança.',
    ],
  },
  {
    title:   'Empreendedora — Programa PAFE',
    company: 'Startup Rio 2019 / FAPERJ',
    period:  '2019',
    type:    'Experiência Profissional',
    stack:   [],
    bullets: [
      'Participação com projeto \'Rei da Mesa\' selecionado entre até 100 propostas para o programa.',
      'Validação de ideia e produto.',
      'Modelagem e estruturação de plano de negócios.',
      'Técnicas de gestão e estratégia.',
    ],
  },
  {
    title:   'Automação de processos e IA',
    company: 'Projetos Pessoais',
    period:  '',
    type:    'Experiência Profissional',
    stack:   [
      { name: 'React', icon: 'react/react-original.svg' },
    ],
    bullets: [
      'Desenvolvimento de fluxos de automação com n8n, integrando APIs, bancos de dados e serviços externos.',
      'Criação de soluções com Inteligência Artificial, incluindo uso de LLMs e automação de processos.',
      'Implementação de servidores MCP (Model Context Protocol), estruturando integração entre modelos de linguagem e fontes externas de dados.',
      'Desenvolvimento de interfaces frontend utilizando React para consumo de APIs e visualização de dados.',
      'Integração entre frontend, backend e automações, com foco em eficiência, escalabilidade e redução de tarefas manuais.',
    ],
  },
];


// Mapeamento de empresas para ícones (SVG ou devicon)
const COMPANY_ICONS = {
  'Sodexo / Pluxee': 'img/logo-pluxee.png',
  'Meta Serviços em Informática': 'img/logo-nio.svg',
  'Lumis EIP / Lumis Portal': 'img/logo-lumis.png',
  'Accenture do Brasil': 'img/logo-accenture.png',
  'DashTI': 'img/logo-dashti.svg',
  'Mittech Soluções': 'img/logo-mittech.svg',
  'Fattoria Web': 'img/logo-fattoriaweb.svg',
  'Startup Rio 2019 / FAPERJ': '',
  'Projetos Pessoais': '',
  'Unigranrio': 'img/logo-unigranrio.webp',
  'Scrum Study': 'img/logo-scrumstudy.png',
};

const cvEducation = [
  {
    title:  'Sistemas de Informação',
    school: 'Universidade do Grande Rio — 2014',
    company: 'Unigranrio',
  },
  {
    title:  'Scrum Fundamentals Certified (SFC)',
    school: 'Credential ID: 855545',
    company: 'Scrum Study',
  },
];

function renderTimelineItem(entry, i) {
  const badgesHTML = entry.stack.length
    ? `<div class="badge-row">
        ${entry.stack.map(s => `
          <span class="tech-badge">
            <img src="${DEVICON_CV}${s.icon}" alt="${s.name}" onerror="this.style.display='none'">
            ${s.name}
          </span>`).join('')}
       </div>`
    : '';

  const bulletsHTML = entry.bullets.map(b => `<li>${b}</li>`).join('');

  // Logo inline ao lado do nome da empresa
  const iconPath = COMPANY_ICONS[entry.company] || '';
  const inlineLogoHTML = iconPath
    ? `<img src="${iconPath}" alt="${entry.company}" class="company-inline-icon" data-company="${entry.company}" onerror="this.style.display='none'">`
    : '';

  const periodHTML = entry.period
    ? `<div class="timeline-period">${entry.period}</div>`
    : '';

  return `
    <div class="timeline-item" data-cv-index="${i}">
      <div class="timeline-card">
        <div class="timeline-header">
          <div class="timeline-meta">
            <div class="timeline-company">${inlineLogoHTML}${entry.company}</div>
            <div class="timeline-title">${entry.title}</div>
            ${periodHTML}
            ${badgesHTML}
          </div>
          <i class="ph ph-caret-down timeline-chevron"></i>
        </div>
        <div class="timeline-body">
          <div class="timeline-divider"></div>
          <ul>${bulletsHTML}</ul>
        </div>
      </div>
    </div>
  `;
}


function renderCurriculo() {
  const timelineHTML = cvExperience.map(renderTimelineItem).join('');

  // Renderiza o ícone da empresa em formato badge padronizado
  const eduHTML = cvEducation.map(e => {
    const iconPath = COMPANY_ICONS[e.company] || '';
    const inlineLogoHTML = iconPath
      ? `<img src="${iconPath}" alt="${e.company}" class="company-inline-icon" data-company="${e.company}" onerror="this.style.display='none'">`
      : '';
    return `
      <div class="edu-card reveal">
        <div class="edu-card__title">${inlineLogoHTML}${e.title}</div>
        <div class="edu-card__sub">${e.school}</div>
      </div>
    `;
  }).join('');

  return `
    <section class="curriculo page">
      <div class="container">
        <div class="curriculo__top">
          <h2>Currículo</h2>
          <a href="pdf/cv_ivieximenes_ 2026.pdf" class="btn btn--outline" download="cv_ivieximenes_2026.pdf">
            <i class="ph ph-download-simple"></i> Download CV
          </a>
        </div>

        <p class="cv-section-title">Experiência Profissional</p>
        <div class="timeline">${timelineHTML}</div>

        <p class="cv-section-title">Formação</p>
        <div class="edu-cards">${eduHTML}</div>
      </div>
    </section>
  `;
}

function initCurriculo() {
  // Timeline accordion — one open at a time, arrow rotates
  document.querySelectorAll('.timeline-header').forEach(header => {
    header.addEventListener('click', () => {
      const item   = header.closest('.timeline-item');
      const isOpen = item.classList.contains('open');
      const allItems = document.querySelectorAll('.timeline-item');

      allItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}
