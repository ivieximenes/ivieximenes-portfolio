/* =============================================
   THEME — Dark / Light Mode Toggle
   ============================================= */

function initTheme() {
  const html        = document.documentElement;
  const btn         = document.getElementById('themeToggle');
  const icon        = document.getElementById('themeIcon');
  const saved       = localStorage.getItem('theme') || 'dark';

  applyTheme(saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    icon.className = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
  }
}
