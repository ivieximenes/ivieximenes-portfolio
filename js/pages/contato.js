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

/* ---- Validações ---- */
const RATE_LIMIT_KEY  = 'cf_last_sent';
const RATE_LIMIT_MS   = 60 * 1000;       // 1 minuto entre envios
const MAX_ATTEMPTS_KEY = 'cf_attempts';
const MAX_ATTEMPTS    = 3;               // máx 3 envios por sessão
const BLOCK_KEY       = 'cf_blocked_until';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function sanitize(str) {
  return str.replace(/[<>"'`]/g, '').trim();
}

function getRateLimit() {
  const last    = parseInt(sessionStorage.getItem(RATE_LIMIT_KEY)  || '0');
  const attempts = parseInt(sessionStorage.getItem(MAX_ATTEMPTS_KEY) || '0');
  const blockedUntil = parseInt(sessionStorage.getItem(BLOCK_KEY) || '0');
  return { last, attempts, blockedUntil };
}

function validateForm(fields, form) {
  const { name, email, subject, message } = fields;
  clearFieldErrors(form);

  let valid = true;

  if (name.length < 3) {
    setFieldError(form, 'cf-name', 'Nome deve ter pelo menos 3 caracteres.');
    valid = false;
  }
  if (!isValidEmail(email)) {
    setFieldError(form, 'cf-email', 'Informe um e-mail válido.');
    valid = false;
  }
  if (subject.length < 5) {
    setFieldError(form, 'cf-subject', 'Assunto muito curto (mínimo 5 caracteres).');
    valid = false;
  }
  if (message.length < 20) {
    setFieldError(form, 'cf-message', 'Mensagem muito curta (mínimo 20 caracteres).');
    valid = false;
  }
  return valid;
}

function setFieldError(form, id, msg) {
  const input = form.querySelector(`#${id}`);
  if (!input) return;
  input.classList.add('form-input--error');
  const err = document.createElement('span');
  err.className = 'field-error';
  err.textContent = msg;
  err.style.cssText = 'display:block;font-size:0.78rem;color:var(--accent-pink-2);margin-top:0.25rem;';
  input.parentNode.appendChild(err);
}

function clearFieldErrors(form) {
  form.querySelectorAll('.form-input--error').forEach(el => el.classList.remove('form-input--error'));
  form.querySelectorAll('.field-error').forEach(el => el.remove());
}

function initContato() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Limpa erro de campo ao digitar
  form.addEventListener('input', (e) => {
    const input = e.target;
    input.classList.remove('form-input--error');
    const err = input.parentNode.querySelector('.field-error');
    if (err) err.remove();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn     = form.querySelector('.form-submit');
    const name    = sanitize(form.querySelector('#cf-name').value);
    const email   = sanitize(form.querySelector('#cf-email').value);
    const subject = sanitize(form.querySelector('#cf-subject').value);
    const message = sanitize(form.querySelector('#cf-message').value);

    // Validação de campos
    if (!validateForm({ name, email, subject, message }, form)) return;

    // Rate limiting
    const now = Date.now();
    const { last, attempts, blockedUntil } = getRateLimit();

    if (now < blockedUntil) {
      const mins = Math.ceil((blockedUntil - now) / 60000);
      showFormFeedback(form, `Muitas tentativas. Aguarde ${mins} minuto(s) para tentar novamente.`, 'error');
      return;
    }

    if (now - last < RATE_LIMIT_MS) {
      const secs = Math.ceil((RATE_LIMIT_MS - (now - last)) / 1000);
      showFormFeedback(form, `Aguarde ${secs} segundo(s) antes de enviar novamente.`, 'error');
      return;
    }

    if (attempts >= MAX_ATTEMPTS) {
      const blockUntil = now + 15 * 60 * 1000; // bloqueia por 15 min
      sessionStorage.setItem(BLOCK_KEY, blockUntil);
      showFormFeedback(form, 'Limite de envios atingido. Tente novamente em 15 minutos ou use o WhatsApp.', 'error');
      return;
    }

    // Envia para o webhook n8n
    btn.innerHTML = '<i class="ph ph-circle-notch"></i> Enviando...';
    btn.disabled = true;

    try {
      const res = await fetch('https://flowhub-n8n-webhook.easypanel.ivieximenes.cloud/webhook/ivieximenesform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      if (res.ok) {
        sessionStorage.setItem(RATE_LIMIT_KEY, now);
        sessionStorage.setItem(MAX_ATTEMPTS_KEY, attempts + 1);

        btn.innerHTML = '<i class="ph ph-check"></i> Mensagem enviada!';
        showFormFeedback(form, 'Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
        form.reset();
        clearFieldErrors(form);
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      console.error('Erro ao enviar para o webhook:', err);
      btn.innerHTML = '<i class="ph ph-warning"></i> Erro ao enviar';
      showFormFeedback(form, 'Falha ao enviar. Tente novamente ou entre em contato pelo WhatsApp.', 'error');
    }

    setTimeout(() => {
      btn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Enviar Mensagem';
      btn.disabled = false;
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
