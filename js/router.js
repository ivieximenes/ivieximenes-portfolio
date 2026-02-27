/* =============================================
   ROUTER — Hash-based SPA Router
   ============================================= */

const routes = {
  '/':          { render: renderHome,     init: initHome     },
  '/sobre':     { render: renderSobre,    init: initSobre    },
  '/servicos':  { render: renderServicos, init: initServicos },
  '/projetos':  { render: renderProjetos, init: initProjetos },
  '/curriculo': { render: renderCurriculo,init: initCurriculo},
  '/contrate':  { render: renderContrate, init: initContrate },
  '/contato':   { render: renderContato,  init: initContato  },
};

function getRoute() {
  const hash = window.location.hash;
  if (!hash || hash === '#') return '/';
  return hash.replace('#', '') || '/';
}

function navigate() {
  const path  = getRoute();
  const route = routes[path] || routes['/'];
  const app   = document.getElementById('app');

  // Fade out
  app.style.opacity = '0';
  app.style.transform = 'translateY(8px)';
  app.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

  setTimeout(() => {
    app.innerHTML = route.render();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Fade in
    app.style.opacity = '1';
    app.style.transform = 'translateY(0)';

    // Run page init
    if (typeof route.init === 'function') route.init();

    // Update active nav link
    if (typeof updateActiveLink === 'function') updateActiveLink(path);

    // Scroll reveal
    initScrollReveal();

  }, 200);
}

function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
}

function initRouter() {
  window.addEventListener('hashchange', navigate);
  navigate(); // initial load
}
