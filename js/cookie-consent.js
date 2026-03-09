/* =============================================
   COOKIE CONSENT BANNER — custom notice replacing Cookiebot
   =============================================

   Este script exibe um banner de consentimento de cookies e permite ao usuário alterar suas preferências a qualquer momento pelo botão fixo no rodapé.
*/

(function () {
  const STORAGE_KEY = 'cookieConsent';

  function hasConsent() {
    return localStorage.getItem(STORAGE_KEY) === 'accepted';
  }

  function hasRejected() {
    return localStorage.getItem(STORAGE_KEY) === 'rejected';
  }

  function saveConsent() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
  }

  function saveRejection() {
    localStorage.setItem(STORAGE_KEY, 'rejected');
  }

  function removeConsent() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function createBanner() {
    // Remove banner se já existir
    const oldBanner = document.getElementById('cookie-banner');
    if (oldBanner) oldBanner.remove();

    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-popup">
        <div class="cookie-popup__text">
          Este site utiliza cookies para melhorar sua experiência, personalizar conteúdo e analisar o tráfego.<br>
          Você pode aceitar ou rejeitar o uso de cookies conforme nossa <a href="/cookies" target="_blank" rel="noopener" style="text-decoration:underline;">Política de Cookies</a>.<br>
          Suas preferências podem ser alteradas a qualquer momento pelo botão de cookie no rodapé.
        </div>
        <div class="cookie-popup__actions">
          <button id="cookie-accept">Aceitar todos</button>
          <button id="cookie-reject">Rejeitar</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
    document.getElementById('cookie-accept').addEventListener('click', () => {
      saveConsent();
      banner.remove();
      showSettingsButton();
      // Aqui você pode ativar scripts de tracking se desejar
    });
    document.getElementById('cookie-reject').addEventListener('click', () => {
      saveRejection();
      banner.remove();
      showSettingsButton();
      // Aqui você pode bloquear scripts de tracking se desejar
    });
  }

  function showSettingsButton() {
    if (document.getElementById('cookie-settings-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'cookie-settings-btn';
    btn.title = 'Configurações de Cookies';
    btn.style.position = 'fixed';
    btn.style.left = '18px';
    btn.style.bottom = '18px';
    btn.style.zIndex = '9999';
    btn.style.background = 'none';
    btn.style.border = 'none';
    btn.style.padding = '0';
    btn.style.margin = '0';
    btn.style.cursor = 'pointer';
    btn.style.width = '48px';
    btn.style.height = '48px';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.boxShadow = 'none';
    btn.style.opacity = '0.85';
    btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
    btn.addEventListener('mouseleave', () => btn.style.opacity = '0.85');
    btn.innerHTML = `
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#f5c16c"/>
        <ellipse cx="13" cy="15" rx="2" ry="2" fill="#b97a3a"/>
        <ellipse cx="25" cy="13" rx="1.5" ry="1.5" fill="#b97a3a"/>
        <ellipse cx="20" cy="25" rx="2" ry="1.5" fill="#b97a3a"/>
        <ellipse cx="27" cy="22" rx="1.2" ry="1.2" fill="#b97a3a"/>
      </svg>
    `;
    btn.addEventListener('click', () => {
      removeConsent();
      createBanner();
    });
    document.body.appendChild(btn);
  }

  function hideSettingsButton() {
    const btn = document.getElementById('cookie-settings-btn');
    if (btn) btn.remove();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!hasConsent() && !hasRejected()) {
      createBanner();
    } else {
      showSettingsButton();
    }
  });
})();
