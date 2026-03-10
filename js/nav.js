/* =============================================
   NAV — Active Links + Mobile Hamburger Drawer
   ============================================= */

function initNav() {
  const hamburger     = document.getElementById('hamburger');
  const drawer        = document.getElementById('drawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose   = document.getElementById('drawerClose');

  function openDrawer() {
    if (drawer) drawer.classList.add('open');
    if (drawerOverlay) drawerOverlay.classList.add('open');
    if (hamburger) hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('open');
    if (drawerOverlay) drawerOverlay.classList.remove('open');
    if (hamburger) hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // Close drawer when a link is clicked
  if (drawer) {
    drawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }
}

function updateActiveLink(path) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const route = link.getAttribute('data-route');
    link.classList.toggle('active', route === path);
  });
}
