/* =============================================
  ROUTER — History API SPA Router (sem hash)
  ============================================= */

const BASE_TITLE = 'Ivie Ximenes — Sênior Full Stack Developer';

const routes = {
  '/':                         { render: renderHome,             init: initHome,             title: `Home | ${BASE_TITLE}`                      },
  '/sobre':                    { render: renderSobre,            init: initSobre,            title: `Sobre | ${BASE_TITLE}`                     },
  '/servicos':                 { render: renderServicos,         init: initServicos,         title: `Serviços | ${BASE_TITLE}`                  },
  '/projetos':                 { render: renderProjetos,         init: initProjetos,         title: `Projetos | ${BASE_TITLE}`                  },
  '/curriculo':                { render: renderCurriculo,        init: initCurriculo,        title: `Currículo | ${BASE_TITLE}`                 },
  '/contato':                  { render: renderContato,          init: initContato,          title: `Contato | ${BASE_TITLE}`                   },
  '/contrate':                 { render: renderContrate,         init: initContrate,         title: `Contrate | ${BASE_TITLE}`                  },
  '/ferramentas':              { render: renderFerramentas,      init: initFerramentas,      title: `Ferramentas Gratuitas | ${BASE_TITLE}`     },
  '/ferramentas/diagnostico':  { render: renderToolDiagnostico,  init: initToolDiagnostico,  title: `Diagnóstico Digital | ${BASE_TITLE}`       },
  '/cookies': {
    // renderCookies is defined in js/pages/cookies.js.  If for any reason the
    // script fails to load (syntax error, network error, etc.) we still want the
    // router to boot without throwing a ReferenceError.  The safe getter below
    // checks for the existence of the function at runtime.
    render: () => {
      if (typeof renderCookies === 'function') return renderCookies();
      // fallback minimal content so the SPA doesn't completely break
      return `<section class="cookies page"><div class="container"><p>Carregando política de cookies...</p></div></section>`;
    },
    init: null,
    title: `Política de Cookies | ${BASE_TITLE}`
  }
};

// Dummy implementations to avoid ReferenceError (replace with real ones)
function renderContrate() {
  return '<section class="contrate"><h2>Contrate</h2><p>Página de contratação em construção.</p></section>';
}
function initContrate() {
  // Inicialização da página Contrate
}
function getRoute() {
  const p = window.location.pathname;
  if (routes[p]) return p;
  // Dynamic routes
  if (p.match(/^\/ferramentas\/.+/))   return '/ferramentas/diagnostico';
  // Fallback
  return '/';
}

function goTo(path) {
  history.pushState(null, '', path);
  navigate();
}

function navigate() {
  const path  = getRoute();
  const route = routes[path] || routes['/'];
  const app   = document.getElementById('app');

  // Fade out
  app.style.opacity    = '0';
  app.style.transform  = 'translateY(8px)';
  app.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

  setTimeout(() => {
    app.innerHTML = route.render();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Fade in
    app.style.opacity   = '1';
    app.style.transform = 'translateY(0)';

    // Run page init
    if (typeof route.init === 'function') route.init();

    // Update active nav link
    if (typeof updateActiveLink === 'function') updateActiveLink(path);

    // Scroll reveal
    initScrollReveal();

    // ---- Analytics: Virtual Pageview ----
    // Atualiza o título ANTES de disparar o evento
    document.title = route.title || document.title;
    // Aguarda o DOM estar pronto para garantir que o título está correto
    setTimeout(() => {
      const pageTitle    = document.title;
      const pagePath     = path;
      const cleanLocation = window.location.origin + pagePath;

      // GA4 — pageview virtual a cada navegação (sem hash, path limpo)
      if (typeof gtag === 'function') {
        gtag('event', 'page_view', {
          page_title:    pageTitle,
          page_path:     pagePath,
          page_location: cleanLocation,
        });
      }

      // GTM — dataLayer para captura via Tag Manager
      if (window.dataLayer) {
        window.dataLayer.push({
          event:         'virtualPageview',
          page_path:     pagePath,
          page_title:    pageTitle,
          page_location: cleanLocation,
        });
      }
    }, 0);
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
  // Intercepta cliques em links internos para navegação SPA
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    // Ignora links externos, âncoras puras e mailto/tel
    if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    e.preventDefault();
    goTo(href);
  });

  // Botão voltar/avançar do navegador
  window.addEventListener('popstate', navigate);

  navigate(); // carregamento inicial
}
