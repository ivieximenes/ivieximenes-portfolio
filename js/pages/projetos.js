/* =============================================
   PROJETOS PAGE
   ============================================= */

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';

const projects = [
  {
    id: 'FlowHub',
    title: 'Gestor Financeiro',
    category: 'web',
    desc: 'Plataforma de automação inteligente com IA. Criação de fluxos complexos para empresas.',
    image: 'img/projects/gestor-financeiro.png',
    tech: [
      { name: 'React',    icon: 'react/react-original.svg'         },
      { name: 'Node.js',  icon: 'nodejs/nodejs-original.svg'       },
      { name: 'Firebase', icon: 'firebase/firebase-original.svg'   },
    ],
    demo:   null,
    source: 'https://github.com/ivieximenes',
  },
  {
    id: 'nio',
    title: 'Nio Internet',
    category: 'web',
    desc: 'Plataforma de automação inteligente com IA. Criação de fluxos complexos para empresas.',
    image: 'img/projects/niointernet.png',
    tech: [
      { name: 'React',    icon: 'react/react-original.svg'         },
      { name: 'Node.js',  icon: 'nodejs/nodejs-original.svg'       },
      { name: 'Firebase', icon: 'firebase/firebase-original.svg'   },
    ],
    demo:   null,
    source: 'https://github.com/ivieximenes',
  },
  {
    id: 'flowhub',
    title: 'FlowHub',
    category: 'automacao',
    desc: 'Plataforma de automação inteligente com IA. Criação de fluxos complexos para empresas.',
    image: 'img/projects/flowhub.png',
    tech: [
      { name: 'React',    icon: 'react/react-original.svg'         },
      { name: 'Node.js',  icon: 'nodejs/nodejs-original.svg'       },
      { name: 'Firebase', icon: 'firebase/firebase-original.svg'   },
    ],
    demo:   null,
    source: 'https://github.com/ivieximenes',
  },
  {
    id: 'mdass',
    title: 'MDASS Landing Page',
    category: 'web',
    desc: 'Implementação HTML/CSS/JS de landing page com design externo altamente otimizado.',
    image: 'img/projects/mdass.png',
    tech: [
      { name: 'HTML5',      icon: 'html5/html5-original.svg'          },
      { name: 'CSS3',       icon: 'css3/css3-original.svg'            },
      { name: 'JavaScript', icon: 'javascript/javascript-original.svg'},
    ],
    demo:   'https://portal.mdass.com.br/formulario/',
    source: 'https://github.com/ivieximenes',
  },
  {
    id: 'reidamesa',
    title: 'Rei da Mesa',
    category: 'mobile',
    desc: 'App de divisão de conta com promoções regionais e gamificação (Startup Rio 2019 / FAPERJ).',
    image: 'img/projects/startuprio.png',
    tech: [
      { name: 'React',    icon: 'react/react-original.svg'       },
      { name: 'Firebase', icon: 'firebase/firebase-original.svg' },
      { name: 'Figma',    icon: 'figma/figma-original.svg'       },
    ],
    demo:   null,
    source: 'https://github.com/ivieximenes',
  },
  {
    id: '',
    title: 'Novos projetos em breve...',
    category: 'todos',
    desc: '',
    image: null,
    tech: [],
    demo:   null,
    source: null,
    placeholder: true,
  },
];

const filters = [
  { key: 'todos',    label: 'Todos'    },
  { key: 'web',      label: 'Web'      },
  { key: 'mobile',   label: 'Mobile'   },
  { key: 'automacao',label: 'Automação'},
];

function renderProjetoCard(p) {
  const imageArea = p.image
    ? `<div class="project-card__image"><img src="${p.image}" alt="${p.title}" loading="lazy"></div>`
    : `<div class="project-card__image-placeholder"><i class="ph ph-image"></i></div>`;

  const techBadges = p.tech.map(t => `
    <span class="tech-badge">
      <img src="${DEVICON_BASE}${t.icon}" alt="${t.name}" onerror="this.style.display='none'">
      ${t.name}
    </span>
  `).join('');

  const links = `
    <div class="project-card__links">
      ${p.demo
        ? `<a href="${p.demo}" target="_blank" rel="noopener" class="project-link">
             <i class="ph ph-arrow-square-out"></i> Live Demo
           </a>`
        : `<span class="project-link" style="opacity:0.35;cursor:not-allowed">
             <i class="ph ph-arrow-square-out"></i> Live Demo
           </span>`}
      ${p.source
        ? `<a href="${p.source}" target="_blank" rel="noopener" class="project-link">
             <i class="ph ph-github-logo"></i> Source
           </a>`
        : `<span class="project-link" style="opacity:0.35;cursor:not-allowed">
             <i class="ph ph-github-logo"></i> Source
           </span>`}
    </div>
  `;

  return `
    <div class="project-card reveal" data-category="${p.category}"
         ${p.placeholder ? 'style="opacity:0.55"' : ''}>
      ${imageArea}
      <div class="project-card__body">
        ${p.placeholder ? '<span class="placeholder-notice">Em breve</span>' : ''}
        <h3 class="project-card__title">${p.title}</h3>
        <p class="project-card__desc">${p.desc}</p>
        ${techBadges.length ? `<div class="badge-row">${techBadges}</div>` : ''}
        ${links}
      </div>
    </div>
  `;
}

const clientCompanies = [
  { name: 'Accenture',  logo: 'img/logo-accenture.png'  },
  { name: 'Pluxee',     logo: 'img/logo-pluxee.png'     },
  { name: 'Nio / Oi',  logo: 'img/logo-nio.svg'        },
  { name: 'Lumis',     logo: 'img/logo-lumis.png'      },
];

function renderProjetos() {
  const filterBtns = filters.map(f => `
    <button class="tab-btn ${f.key === 'todos' ? 'active' : ''}" data-filter="${f.key}">
      ${f.label}
    </button>
  `).join('');

  const cardsHTML = projects.map(renderProjetoCard).join('');

  const logosStrip = clientCompanies.map(c => `
    <div class="clients-logo-item">
      <img src="${c.logo}" alt="${c.name}">
    </div>
  `).join('');

  return `
    <section class="projetos page">
      <div class="container">
        <div class="page__header">
          <span class="section-label">Portfólio</span>
          <h2>Projetos</h2>
        </div>
        <div class="clients-strip">${logosStrip}</div>
        <div class="tab-group">${filterBtns}</div>
        <div class="projetos-grid">${cardsHTML}</div>
      </div>
    </section>
  `;
}

function initProjetos() {
  const grid = document.querySelector('.projetos-grid');
  const btns = document.querySelectorAll('[data-filter]');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      grid.querySelectorAll('.project-card').forEach(card => {
        const cat = card.getAttribute('data-category');
        card.classList.toggle('hidden', filter !== 'todos' && cat !== filter);
      });
    });
  });
}
