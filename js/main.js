/* =============================================
   MAIN — Bootstrap
   ============================================= */

(function () {
  // Ensure a hash exists so the router always has a route to render
  if (!window.location.hash || window.location.hash === '#') {
    window.location.hash = '#/';
  }

  // Boot all modules
  initTheme();
  initNav();
  initRouter();

  // === EVENTOS DE MARKETING DIGITAL ===
  function fireAllTrackingEvents(eventName, params = {}) {
    // Google Tag Manager (dataLayer)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...params });

    // Google Analytics 4 (gtag)
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }

    // Facebook Pixel
    if (typeof fbq === 'function') {
      if (eventName === 'download_cv' || eventName === 'form_submit' || eventName === 'whatsapp_click' || eventName === 'chat_open') {
        fbq('trackCustom', eventName, params);
      }
    }
  }

  // Download CV
  document.querySelectorAll('.btn--outline[href$=".pdf"]').forEach(btn => {
    btn.addEventListener('click', () => {
      fireAllTrackingEvents('download_cv', { label: btn.href });
    });
  });

  // Envio de formulário
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
      fireAllTrackingEvents('form_submit', { form_id: form.id || null });
    });
  });

  // Clique em WhatsApp
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(link => {
    link.addEventListener('click', () => {
      fireAllTrackingEvents('whatsapp_click', { label: link.href });
    });
  });

  // Clique no chat
  document.querySelectorAll('.chat-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      fireAllTrackingEvents('chat_open');
    });
  });
})();
