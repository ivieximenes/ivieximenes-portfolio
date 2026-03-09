/* =============================================
   MAIN — Bootstrap
   ============================================= */

(function () {
  // stub de segurança para evitar a exceção "fbq is not defined" quando o
  // Gerenciador de Tags (GTM) executa um evento antes do pixel do Facebook ser
  // carregado. O stub imita a API básica e armazena chamadas em fila.
  window.fbq = window.fbq || function() {
    (window.fbq.queue = window.fbq.queue || []).push(arguments);
  };
  window.fbq.queue = window.fbq.queue || [];

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
      switch (eventName) {
        case 'form_submit':
          // treat any completed form as a lead conversion
          fbq('track', 'Lead', params);
          break;
        case 'download_cv':
          fbq('track', 'Lead', { content_name: 'CV', ...params });
          break;
        case 'whatsapp_click':
          fbq('track', 'Contact', params);
          break;
        case 'chat_open':
          fbq('trackCustom', eventName, params);
          break;
        default:
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
