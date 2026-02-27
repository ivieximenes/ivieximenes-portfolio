/* =============================================
   HOME PAGE
   ============================================= */

function renderHome() {
  return `
    <section class="home">
      <div class="home__orb home__orb--1"></div>
      <div class="home__orb home__orb--2"></div>
      <div class="home__content">
        <p class="home__eyebrow">Olá, eu sou</p>
        <h1 class="home__name">Ivie Ximenes</h1>
        <p class="home__role">Sênior Full Stack Developer</p>
        <p class="home__subtitle">
          Criando software do início ao fim... backend, frontend,
          integrações e automação com IA. 
        </p>
        <div class="home__ctas">
          <a href="#/projetos" class="btn btn--primary">
            <i class="ph ph-folder-open"></i> Ver Projetos
          </a>
          <a href="#/contrate" class="btn btn--outline">
            <i class="ph ph-handshake"></i> Vamos trabalhar juntos ?
          </a>
        </div>
      </div>
    </section>
  `;
}

function initHome() {
  // Animations are CSS-driven; nothing extra needed
}
