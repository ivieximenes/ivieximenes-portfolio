/* =============================================
   ROUTER — Hash-based SPA Router
   ============================================= */

const BASE_TITLE = 'Ivie Ximenes — Sênior Full Stack Developer';

const routes = {
  '/':          { render: renderHome,      init: initHome,      title: `Home | ${BASE_TITLE}`      },
  '/sobre':     { render: renderSobre,     init: initSobre,     title: `Sobre | ${BASE_TITLE}`     },
  '/servicos':  { render: renderServicos,  init: initServicos,  title: `Serviços | ${BASE_TITLE}`  },
  '/projetos':  { render: renderProjetos,  init: initProjetos,  title: `Projetos | ${BASE_TITLE}`  },
  '/curriculo': { render: renderCurriculo, init: initCurriculo, title: `Currículo | ${BASE_TITLE}`  },
  '/contato':   { render: renderContato,   init: initContato,   title: `Contato | ${BASE_TITLE}`   },
  '/contrate':  { render: renderContrate,  init: initContrate,  title: `Contrate | ${BASE_TITLE}`  },
};

// Dummy implementations to avoid ReferenceError (replace with real ones)
function renderContrate() {
  return '<section class="contrate"><h2>Contrate</h2><p>Página de contratação em construção.</p></section>';
}
function initContrate() {
  // Inicialização da página Contrate
}
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

    // ---- Analytics: Virtual Pageview ----
    // Atualiza o título da aba/documento com o título da rota atual
    document.title = route.title || document.title;
    const pageTitle = document.title;
    const pagePath  = path === '/' ? '/' : path;

    const cleanLocation = window.location.origin + pagePath;

    // GA4 — envia pageview virtual a cada navegação
    if (typeof gtag === 'function') {
      gtag('event', 'page_view', {
        page_title:    pageTitle,
        page_path:     pagePath,
        page_location: cleanLocation,
      });
    }

    // GTM — empurra evento no dataLayer para captura via Tag Manager
    if (window.dataLayer) {
      window.dataLayer.push({
        event:         'virtualPageview',
        page_path:     pagePath,
        page_title:    pageTitle,
        page_location: cleanLocation,
      });
    }

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
