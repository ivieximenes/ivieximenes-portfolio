/* =============================================
   PROJETOS PAGE — Renderização
   Os dados estão em js/data/projetos-data.js
   ============================================= */

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';

/* ---- Utilitário: badge de tecnologia com ícone ---- */
function techBadgeHTML(t) {
  const src = t.local ? t.icon : DEVICON_BASE + t.icon;
  return `<span class="tech-badge">
      <img src="${src}" alt="${t.name}" onerror="this.style.display='none'">
      ${t.name}
    </span>`;
}

/* ---- Card do projeto ---- */
function renderProjetoCard(p) {
  const imageArea = p.image
    ? `<div class="project-card__image">
         <img src="${p.image}" alt="${p.title}" loading="lazy">
       </div>`
    : `<div class="project-card__image-placeholder"><i class="ph ph-image"></i></div>`;

  const techBadges = p.tech.map(techBadgeHTML).join('');

  const detailsBtn = p.details
    ? `<button class="project-link project-link--details" data-project-id="${p.id}">
         <i class="ph ph-eye"></i> Ver Projeto
       </button>`
    : `<span class="project-link" style="opacity:0.35;cursor:not-allowed">
         <i class="ph ph-eye"></i> Ver Projeto
       </span>`;

  const sourceBtn = p.source
    ? `<a href="${p.source}" target="_blank" rel="noopener" class="project-link">
         <i class="ph ph-github-logo"></i> Source
       </a>`
    : `<span class="project-link" style="opacity:0.35;cursor:not-allowed">
         <i class="ph ph-github-logo"></i> Source
       </span>`;

  return `
    <div class="project-card reveal" data-category="${p.category.join(',')}"
         ${p.placeholder ? 'style="opacity:0.55"' : ''}>
      ${imageArea}
      <div class="project-card__body">
        ${p.placeholder ? '<span class="placeholder-notice">Em breve</span>' : ''}
        <h3 class="project-card__title">${p.title}</h3>
        <p class="project-card__desc">${p.desc}</p>
        ${techBadges ? `<div class="badge-row">${techBadges}</div>` : ''}
        <div class="project-card__links">
          ${detailsBtn}
          ${sourceBtn}
        </div>
      </div>
    </div>`;
}

/* ---- Modal do projeto ---- */
function renderProjectModal(p) {
  const d = p.details;
  if (!d) return '';

  /* Galeria */
  const imagesHTML = d.images && d.images.length ? `
    <div class="pmodal__gallery">
      ${d.images.map((src, i) => `
        <div class="pmodal__gallery-item ${i === 0 ? 'active' : ''}">
          <img src="${src}" alt="${p.title} screenshot ${i + 1}" loading="lazy">
        </div>`).join('')}
      ${d.images.length > 1 ? `
        <div class="pmodal__gallery-nav">
          ${d.images.map((_, i) => `
            <button class="pmodal__dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></button>`).join('')}
        </div>` : ''}
    </div>` : '';

  /* Features */
  const featuresHTML = d.features && d.features.length ? `
    <ul class="pmodal__features">
      ${d.features.map(f => `<li><i class="ph ph-check-circle"></i> ${f}</li>`).join('')}
    </ul>` : '';

  /* Seções de arquitetura */
  const sectionsHTML = d.sections ? d.sections.map(s => `
    <div class="pmodal__section">
      <h4 class="pmodal__section-title">${s.icon} ${s.title}</h4>
      ${s.items.map(item => `
        ${item.subtitle ? `<p class="pmodal__subsection">${item.subtitle}</p>` : ''}
        <ul class="pmodal__bullets">
          ${item.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>`).join('')}
    </div>`).join('') : '';

  /* Tech stack com ícones */
  const techHTML = d.techStack && d.techStack.length ? `
    <div class="pmodal__section">
      <h4 class="pmodal__section-title">🛠️ Tecnologias Utilizadas</h4>
      <div class="pmodal__tech-stack">
        ${d.techStack.map(g => `
          <div class="pmodal__tech-group">
            <span class="pmodal__tech-category">${g.category}</span>
            <div class="badge-row">
              ${g.items.map(techBadgeHTML).join('')}
            </div>
            ${g.notes && g.notes.length ? `
              <ul class="pmodal__tech-notes">
                ${g.notes.map(n => `<li>${n}</li>`).join('')}
              </ul>` : ''}
          </div>`).join('')}
      </div>
    </div>` : '';

  const catsHTML = p.category.map(c => `<span class="pmodal__cat">${c}</span>`).join('');

  return `
    <div class="pmodal" id="pmodal-${p.id}" role="dialog" aria-modal="true" aria-label="${p.title}">
      <div class="pmodal__backdrop" data-close-modal></div>
      <div class="pmodal__box">
        <button class="pmodal__close" data-close-modal aria-label="Fechar">
          <i class="ph ph-x"></i>
        </button>
        <div class="pmodal__content">
          ${imagesHTML}
          <div class="pmodal__header">
            <h3 class="pmodal__title">${p.title}</h3>
            <div class="pmodal__cats">${catsHTML}</div>
          </div>
          <p class="pmodal__summary">${d.summary}</p>
          ${featuresHTML}
          ${sectionsHTML}
          ${techHTML}
        </div>
      </div>
    </div>`;
}

/* ---- Página principal ---- */
function renderProjetos() {
  const filterBtns = projectFilters.map(f => `
    <button class="tab-btn ${f.key === 'todos' ? 'active' : ''}" data-filter="${f.key}">
      ${f.label}
    </button>`).join('');

  const logosStrip = clientCompanies.map(c => `
    <div class="clients-logo-item">
      <img src="${c.logo}" alt="${c.name}">
    </div>`).join('');

  const cardsHTML  = projects.map(renderProjetoCard).join('');
  const modalsHTML = projects.filter(p => p.details).map(renderProjectModal).join('');

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
    ${modalsHTML}`;
}

/* ---- Inicialização ---- */
function initProjetos() {
  const grid = document.querySelector('.projetos-grid');
  const btns = document.querySelectorAll('[data-filter]');

  /* Filtros */
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      grid.querySelectorAll('.project-card').forEach(card => {
        const cats = card.getAttribute('data-category').split(',');
        card.classList.toggle('hidden', filter !== 'todos' && !cats.includes(filter));
      });
    });
  });

  /* Modais — abrir */
  document.querySelectorAll('.project-link--details').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(`pmodal-${btn.getAttribute('data-project-id')}`);
      if (!modal) return;
      modal.classList.add('open');
      document.body.classList.add('modal-open');

      /* Galeria */
      const dots  = modal.querySelectorAll('.pmodal__dot');
      const items = modal.querySelectorAll('.pmodal__gallery-item');
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const idx = parseInt(dot.getAttribute('data-idx'));
          items.forEach((item, i) => item.classList.toggle('active', i === idx));
          dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        });
      });
    });
  });

  /* Modais — fechar clique */
  document.addEventListener('click', e => {
    if (e.target.closest('[data-close-modal]') || e.target.hasAttribute('data-close-modal')) {
      document.querySelectorAll('.pmodal.open').forEach(m => m.classList.remove('open'));
      document.body.classList.remove('modal-open');
    }
  });

  /* Modais — fechar Esc */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.pmodal.open').forEach(m => m.classList.remove('open'));
      document.body.classList.remove('modal-open');
    }
  });
}
