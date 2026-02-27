/* =============================================
   CONTATO PAGE — Contact Form + Links
   ============================================= */

function renderContato() {
  return `
    <section class="contato page">
      <div class="container">
        <div class="page__header">
          <h2 class="contato-title">Vamos conversar</h2>
          <p>Tem um projeto em mente? Preencha o formulário ou use um dos canais abaixo.</p>
        </div>

        <form class="contact-form glass-card" id="contactForm" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="cf-name">Nome</label>
              <input class="form-input" id="cf-name" name="name" type="text"
                     placeholder="Seu nome completo" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="cf-email">E-mail</label>
              <input class="form-input" id="cf-email" name="email" type="email"
                     placeholder="seu@email.com" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="cf-subject">Assunto</label>
            <input class="form-input" id="cf-subject" name="subject" type="text"
                   placeholder="Sobre o que você quer conversar?" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="cf-message">Mensagem</label>
            <textarea class="form-textarea" id="cf-message" name="message"
                      placeholder="Conte mais sobre o seu projeto ou dúvida..." required></textarea>
          </div>

          <button type="submit" class="btn btn--primary form-submit">
            <i class="ph ph-paper-plane-tilt"></i> Enviar Mensagem
          </button>
        </form>

        <div class="contact-pills">
          <a href="mailto:ivieximenes@gmail.com"
             class="contact-pill contact-pill--email">
            <i class="ph ph-envelope"></i> E-mail
          </a>
          <a href="https://wa.me/5522981748083"
             target="_blank" rel="noopener"
             class="contact-pill contact-pill--whatsapp">
            <i class="ph ph-whatsapp-logo"></i> WhatsApp
          </a>
          <a href="https://www.linkedin.com/in/ivieximenes/"
             target="_blank" rel="noopener"
             class="contact-pill contact-pill--linkedin">
            <i class="ph ph-linkedin-logo"></i> LinkedIn
          </a>
          <a href="https://github.com/ivieximenes"
             target="_blank" rel="noopener"
             class="contact-pill contact-pill--github">
            <i class="ph ph-github-logo"></i> GitHub
          </a>
        </div>
      </div>
    </section>
  `;
}

function initContato() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.form-submit');
    const name    = form.querySelector('#cf-name').value.trim();
    const email   = form.querySelector('#cf-email').value.trim();
    const subject = form.querySelector('#cf-subject').value.trim();
    const message = form.querySelector('#cf-message').value.trim();

    if (!name || !email || !subject || !message) {
      showFormFeedback(form, 'Por favor, preencha todos os campos.', 'error');
      return;
    }

    // Build mailto link and open
    const mailto = `mailto:ivieximenes@gmail.com`
      + `?subject=${encodeURIComponent(subject)}`
      + `&body=${encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\n\n${message}`)}`;

    window.open(mailto, '_blank');

    btn.innerHTML = '<i class="ph ph-check"></i> Enviado!';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Enviar Mensagem';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

function showFormFeedback(form, msg, type) {
  let existing = form.querySelector('.form-feedback');
  if (existing) existing.remove();

  const el = document.createElement('p');
  el.className = 'form-feedback';
  el.textContent = msg;
  el.style.cssText = `
    margin-top: 0.75rem;
    font-size: 0.85rem;
    color: ${type === 'error' ? 'var(--accent-pink-2)' : '#22c55e'};
  `;
  form.appendChild(el);

  setTimeout(() => el.remove(), 4000);
}
