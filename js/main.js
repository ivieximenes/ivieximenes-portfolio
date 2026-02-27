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
})();
