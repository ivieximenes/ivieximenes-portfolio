/* =============================================
   CURRÍCULO PAGE — Timeline with accordion arrows
   ============================================= */

const DEVICON_CV = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';

const cvExperience = [
  {
    title:   'Desenvolvedora Full Stack Pleno',
    company: 'Nio / Oi',
    period:  '2013 – 2017',
    type:    'Experiência Profissional',
    stack:   [
      { name: 'Java',       icon: 'java/java-original.svg'             },
      { name: 'Hibernate',  icon: 'hibernate/hibernate-original.svg'   },
      { name: 'JavaScript', icon: 'javascript/javascript-original.svg' },
      { name: 'MySQL',      icon: 'mysql/mysql-original.svg'           },
    ],
    bullets: [
      'Desenvolvimento de aplicações web corporativas com Java EE e Hibernate.',
      'Criação de APIs REST integradas a sistemas de terceiros (SOAP e REST).',
      'Manutenção e evolução de sistemas legados com modernização de módulos críticos.',
      'Desenvolvimento de interfaces responsivas com HTML5, CSS3 e JavaScript puro.',
    ],
  },
  {
    title:   'Desenvolvedora Full Stack Sênior',
    company: 'Sodexo / Pluxee',
    period:  '2021 – Presente',
    type:    'Experiência Profissional',
    stack:   [
      { name: 'Java',       icon: 'java/java-original.svg'             },
      { name: 'Spring',     icon: 'spring/spring-original.svg'         },
      { name: 'React',      icon: 'react/react-original.svg'           },
      { name: 'Angular',    icon: 'angular/angular-original.svg'       },
      { name: 'Oracle',     icon: 'oracle/oracle-original.svg'         },
      { name: 'Docker',     icon: 'docker/docker-original.svg'         },
    ],
    bullets: [
      'Desenvolvimento de soluções Full Stack em Java/Spring Boot e React/Angular para plataforma de benefícios corporativos.',
      'Arquitetura e implementação de microsserviços com Spring Cloud, Kafka e Docker.',
      'Otimização de bases Oracle com ganhos de até 40% em performance de queries críticas.',
      'Liderança técnica de squad multidisciplinar com entregas ágeis (Scrum/SAFe).',
      'Integração de fluxos automatizados via n8n e APIs REST com parceiros externos.',
    ],
  },
  {
    title:   'Desenvolvedora Full Stack Pleno',
    company: 'Lumis',
    period:  '2013 – 2017',
    type:    'Experiência Profissional',
    stack:   [
      { name: 'Java',       icon: 'java/java-original.svg'             },
      { name: 'Hibernate',  icon: 'hibernate/hibernate-original.svg'   },
      { name: 'JavaScript', icon: 'javascript/javascript-original.svg' },
      { name: 'MySQL',      icon: 'mysql/mysql-original.svg'           },
    ],
    bullets: [
      'Desenvolvimento de aplicações web corporativas com Java EE e Hibernate.',
      'Criação de APIs REST integradas a sistemas de terceiros (SOAP e REST).',
      'Manutenção e evolução de sistemas legados com modernização de módulos críticos.',
      'Desenvolvimento de interfaces responsivas com HTML5, CSS3 e JavaScript puro.',
    ],
  },
  {
    title:   'Desenvolvedora Full Stack Sênior',
    company: 'Accenture',
    period:  '2017 – 2021',
    type:    'Experiência Profissional',
    stack:   [
      { name: 'Java',       icon: 'java/java-original.svg'             },
      { name: 'Spring',     icon: 'spring/spring-original.svg'         },
      { name: 'Angular',    icon: 'angular/angular-original.svg'       },
      { name: 'TypeScript', icon: 'typescript/typescript-original.svg' },
      { name: 'Jenkins',    icon: 'jenkins/jenkins-original.svg'       },
    ],
    bullets: [
      'Atuação em projetos estratégicos para clientes dos setores financeiro e de telecomunicações.',
      'Desenvolvimento de sistemas corporativos com Java EE / Spring e Angular (v2+).',
      'Implementação de pipelines CI/CD com Jenkins, GitLab e Azure DevOps.',
      'Condução de code reviews e mentoria técnica de desenvolvedores juniores.',
      'Participação em POCs de modernização de sistemas legados para arquitetura de microsserviços.',
    ],
  },
  {
    title:   'Desenvolvedora Full Stack',
    company: 'Dash TI',
    period:  '2010 – 2013',
    type:    'Experiência Profissional',
    stack:   [
      { name: 'Java',   icon: 'java/java-original.svg'    },
      { name: 'Oracle', icon: 'oracle/oracle-original.svg' },
      { name: 'Git',    icon: 'git/git-original.svg'      },
    ],
    bullets: [
      'Desenvolvimento e manutenção de sistemas internos de gestão de seguros em Java.',
      'Escrita de procedures e consultas SQL otimizadas em Oracle Database.',
      'Suporte e manutenção evolutiva em ambiente de missão crítica e alta disponibilidade.',
    ],
  },
  ,
  {
    title:   'Desenvolvedora Full Stack',
    company: 'Mittech',
    period:  '2010 – 2013',
    type:    'Experiência Profissional',
    stack:   [
      { name: 'Java',   icon: 'java/java-original.svg'    },
      { name: 'Oracle', icon: 'oracle/oracle-original.svg' },
      { name: 'Git',    icon: 'git/git-original.svg'      },
    ],
    bullets: [
      'Desenvolvimento e manutenção de sistemas internos de gestão de seguros em Java.',
      'Escrita de procedures e consultas SQL otimizadas em Oracle Database.',
      'Suporte e manutenção evolutiva em ambiente de missão crítica e alta disponibilidade.',
    ],
  },
  {
    title:   'Desenvolvedora Full Stack',
    company: 'FattoriaWEB',
    period:  '2010 – 2013',
    type:    'Experiência Profissional',
    stack:   [
      { name: 'Java',   icon: 'java/java-original.svg'    },
      { name: 'Oracle', icon: 'oracle/oracle-original.svg' },
      { name: 'Git',    icon: 'git/git-original.svg'      },
    ],
    bullets: [
      'Desenvolvimento e manutenção de sistemas internos de gestão de seguros em Java.',
      'Escrita de procedures e consultas SQL otimizadas em Oracle Database.',
      'Suporte e manutenção evolutiva em ambiente de missão crítica e alta disponibilidade.',
    ],
  },
  {
    title:   'Desenvolvedora Front-end',
    company: 'Odontolife',
    period:  '2010 – 2013',
    type:    'Experiência Profissional',
    stack:   [
      { name: 'Java',   icon: 'java/java-original.svg'    },
      { name: 'Oracle', icon: 'oracle/oracle-original.svg' },
      { name: 'Git',    icon: 'git/git-original.svg'      },
    ],
    bullets: [
      'Desenvolvimento e manutenção de sistemas internos de gestão de seguros em Java.',
      'Escrita de procedures e consultas SQL otimizadas em Oracle Database.',
      'Suporte e manutenção evolutiva em ambiente de missão crítica e alta disponibilidade.',
    ],
  },
];


// Mapeamento de empresas para ícones (SVG ou devicon)
const COMPANY_ICONS = {
  'Sodexo / Pluxee': 'img/logo-pluxee.png',
  'Accenture': 'img/logo-accenture.png',
  'Nio / Oi': 'img/logo-nio.svg', // Trabalhou na Oi (Nio)
  'Lumis': 'img/logo-lumis.png',
  'Dash TI': 'img/logo-dashti.svg',
  'Mittech': 'img/logo-mittech.svg',
  'FattoriaWEB': 'img/logo-fattoriaweb.svg',
  'Unigranrio': 'img/logo-unigranrio.webp', 
  'Scrum Study': 'img/logo-scrumstudy.png',
};

const cvEducation = [
  {
    title:  'Graduação em Sistemas de Informação',
    school: '',
    company: 'Unigranrio', 
  },
  {
    title:  'Scrum Fundamentals Certified (SFC)',
    school: '',
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

  // Renderiza ícone + nome da empresa no lugar do período, em formato badge/pill
  const iconPath = COMPANY_ICONS[entry.company] || '';
  const companyLogoHTML = iconPath
    ? `<div class="company-badge">
         <img src="${iconPath}" alt="${entry.company}" class="company-badge-icon" data-company="${entry.company}" onerror="this.style.display='none'">
         <span>${entry.company}</span>
       </div>`
    : `<div class="timeline-period">${entry.period}</div>`;

  return `
    <div class="timeline-item" data-cv-index="${i}">
      <div class="timeline-card">
        <div class="timeline-header">
          <div class="timeline-meta">
            <div class="timeline-company">${entry.company}</div>
            <div class="timeline-title">${entry.title}</div>
            ${companyLogoHTML}
          </div>
          <i class="ph ph-caret-down timeline-chevron"></i>
        </div>
        <div class="timeline-body">
          <div class="timeline-divider"></div>
          ${badgesHTML}
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
    const badgeHTML = iconPath
      ? `<div class="company-badge" style="margin-top: 0.5rem;">
           <img src="${iconPath}" alt="${e.company}" class="company-badge-icon" data-company="${e.company}" onerror="this.style.display='none'">
           <span>${e.company}</span>
         </div>`
      : '';
    return `
      <div class="edu-card reveal">
        <div class="edu-card__title">${e.title}</div>
        <div class="edu-card__sub">
          ${e.school}
          ${badgeHTML}
        </div>
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
