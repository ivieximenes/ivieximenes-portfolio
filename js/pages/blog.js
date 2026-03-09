/* =============================================
   BLOG PAGE — Listing + Single Post
   ============================================= */

/* ---- Category color mapping ---- */
const CATEGORY_COLOR = {
  'SEO & Performance': 'var(--accent-purple)',
  'Automação':         'var(--accent-pink)',
  'IA & Chatbots':     '#06B6D4',
};

function categoryColor(cat) {
  return CATEGORY_COLOR[cat] || 'var(--accent-purple)';
}

/* ---- Format date to pt-BR ---- */
function formatBlogDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

/* ==========================================
   BLOG LISTING
   ========================================== */

function renderBlogList() {
  const cards = blogPosts.map(post => `
    <article class="blog-card reveal" role="article">
      <div class="blog-card__header" style="border-color:${categoryColor(post.category)}22; background: linear-gradient(135deg, ${categoryColor(post.category)}0D 0%, transparent 100%)">
        <span class="blog-card__category" style="color:${categoryColor(post.category)}; background:${categoryColor(post.category)}1A">
          ${post.category}
        </span>
        <span class="blog-card__read"><i class="ph ph-clock"></i> ${post.readTime}</span>
      </div>
      <div class="blog-card__body">
        <time class="blog-card__date" datetime="${post.date}">${formatBlogDate(post.date)}</time>
        <h2 class="blog-card__title">${post.title}</h2>
        <p class="blog-card__excerpt">${post.excerpt}</p>
      </div>
      <div class="blog-card__footer">
        <a href="/blog/${post.slug}" class="blog-card__link" data-route="/blog/${post.slug}">
          Ler post <i class="ph ph-arrow-right"></i>
        </a>
      </div>
    </article>
  `).join('');

  return `
    <section class="blog-page">
      <div class="blog-page__hero">
        <div class="blog-page__hero-inner">
          <p class="section-eyebrow">Blog</p>
          <h1 class="blog-page__title">Conteúdo sobre tecnologia,<br>automação e presença digital</h1>
          <p class="blog-page__subtitle">Artigos práticos sobre desenvolvimento, IA e como a tecnologia pode impulsionar seu negócio.</p>
        </div>
      </div>
      <div class="blog-page__grid">
        ${cards}
      </div>
    </section>
  `;
}

function initBlogList() {
  initScrollReveal();
}

/* ==========================================
   SINGLE BLOG POST
   ========================================== */

function renderBlogPost() {
  const slug = window.location.pathname.replace('/blog/', '');
  const post  = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return `
      <section class="blog-not-found">
        <div class="blog-not-found__inner">
          <i class="ph ph-file-dashed"></i>
          <h1>Post não encontrado</h1>
          <p>O artigo que você procura não existe ou foi removido.</p>
          <a href="/blog" class="btn btn--outline" data-route="/blog">← Voltar ao Blog</a>
        </div>
      </section>
    `;
  }

  const related = blogPosts.filter(p => p.slug !== slug).slice(0, 2);

  const relatedCards = related.map(p => `
    <a href="/blog/${p.slug}" class="blog-related__card" data-route="/blog/${p.slug}">
      <span class="blog-related__cat" style="color:${categoryColor(p.category)}">${p.category}</span>
      <h3 class="blog-related__title">${p.title}</h3>
      <span class="blog-related__read"><i class="ph ph-clock"></i> ${p.readTime}</span>
    </a>
  `).join('');

  return `
    <article class="blog-post">
      <div class="blog-post__header">
        <a href="/blog" class="blog-post__back" data-route="/blog">
          <i class="ph ph-arrow-left"></i> Blog
        </a>
        <div class="blog-post__meta">
          <span class="blog-post__category" style="color:${categoryColor(post.category)}; background:${categoryColor(post.category)}1A">${post.category}</span>
          <time class="blog-post__date" datetime="${post.date}">${formatBlogDate(post.date)}</time>
          <span class="blog-post__read"><i class="ph ph-clock"></i> ${post.readTime}</span>
        </div>
        <h1 class="blog-post__title">${post.title}</h1>
        <p class="blog-post__excerpt">${post.excerpt}</p>
        <div class="blog-post__author">
          <div class="blog-post__author-avatar">IX</div>
          <div>
            <strong>Ivie Ximenes</strong>
            <span>Sênior Full Stack Developer</span>
          </div>
        </div>
      </div>

      <div class="blog-post__content prose">
        ${post.content}
      </div>

      ${related.length ? `
        <div class="blog-post__related">
          <h2>Leia também</h2>
          <div class="blog-related__grid">
            ${relatedCards}
          </div>
        </div>
      ` : ''}

      <div class="blog-post__cta-box">
        <i class="ph ph-handshake"></i>
        <h3>Precisa de ajuda com tecnologia para o seu negócio?</h3>
        <p>Entre em contato e vamos conversar sobre seu projeto.</p>
        <a href="/contato" class="btn btn--primary" data-route="/contato">Falar com Ivie</a>
      </div>
    </article>
  `;
}

function initBlogPost() {
  const slug = window.location.pathname.replace('/blog/', '');
  const post  = blogPosts.find(p => p.slug === slug);
  if (post) {
    document.title = `${post.title} | Ivie Ximenes`;
  }
  initScrollReveal();
}
