/* =============================================
   CHAT WIDGET — Assistente IX
   Comunicação via n8n Webhook
   ============================================= */

const CHAT_WEBHOOK = 'https://flowhub-n8n-webhook.easypanel.ivieximenes.cloud/webhook/portalcontact';

// Gera um session ID único por visita
const CHAT_SESSION_ID = 'sess_' + Math.random().toString(36).slice(2, 11);

(function () {
  // ---- Injetar HTML do widget ----
  const widgetHTML = `
    <!-- Tooltip de boas-vindas -->
    <div class="chat-greeting" id="chatGreeting">
      <button class="chat-greeting__close" id="chatGreetingClose" aria-label="Fechar">×</button>
      <p>Olá, sou a assistente <strong>Aria</strong>. Que bom ter você aqui! Como posso ajudar? 😊</p>
    </div>

    <!-- Chat Trigger Button -->
    <button class="chat-trigger" id="chatTrigger" aria-label="Abrir assistente Aria">
      <span class="chat-trigger__initials">IX</span>
      <i class="ph ph-x chat-trigger__close"></i>
    </button>

    <!-- Chat Window -->
    <div class="chat-window" id="chatWindow" role="dialog" aria-label="Chat com assistente">
      <div class="chat-header">
        <div class="chat-header__avatar">IX</div>
        <div class="chat-header__info">
          <div class="chat-header__name">Aria</div>
          <div class="chat-header__status">Online agora</div>
        </div>
      </div>

      <div class="chat-messages" id="chatMessages"></div>

      <div class="chat-input-area">
        <textarea
          id="chatInput"
          class="chat-input"
          placeholder="Digite sua mensagem..."
          rows="1"
          maxlength="500"
          aria-label="Mensagem"
        ></textarea>
        <button class="chat-send" id="chatSend" aria-label="Enviar">
          <i class="ph ph-paper-plane-tilt"></i>
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', widgetHTML);

  // ---- Referências ----
  const trigger       = document.getElementById('chatTrigger');
  const window_       = document.getElementById('chatWindow');
  const messages      = document.getElementById('chatMessages');
  const input         = document.getElementById('chatInput');
  const sendBtn       = document.getElementById('chatSend');
  const greeting      = document.getElementById('chatGreeting');
  const greetingClose = document.getElementById('chatGreetingClose');

  let isOpen    = false;
  let isBusy    = false;
  let welcomed  = false;

  // ---- Fechar o tooltip de boas-vindas ----
  function hideGreeting() {
    greeting.classList.remove('is-visible');
    greeting.classList.add('is-hidden');
  }

  greetingClose.addEventListener('click', (e) => {
    e.stopPropagation();
    hideGreeting();
  });

  // ---- Utilitários ----
  function now() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function scrollToBottom() {
    messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
  }

  function appendBubble(text, role) {
    const div = document.createElement('div');
    div.className = `chat-bubble chat-bubble--${role === 'user' ? 'user' : 'bot'}`;
    div.textContent = text;
    messages.appendChild(div);
    scrollToBottom();
    return div;
  }

  function appendTime(label) {
    const div = document.createElement('div');
    div.className = 'chat-bubble--time';
    div.textContent = label;
    messages.appendChild(div);
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'chat-typing';
    el.id = 'chatTyping';
    el.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(el);
    scrollToBottom();
  }

  function removeTyping() {
    const el = document.getElementById('chatTyping');
    if (el) el.remove();
  }

  // ---- Mensagem de boas-vindas (ao abrir o chat) ----
  function showWelcome() {
    if (welcomed) return;
    welcomed = true;
    setTimeout(() => {
      appendBubble('Olá, sou a assistente Aria. Que bom ter você aqui! Como posso ajudar? 😊', 'bot');
      appendTime(now());
    }, 350);
  }

  // ---- Auto-show tooltip ao carregar a página ----
  setTimeout(() => {
    if (!isOpen) {
      greeting.classList.add('is-visible');
    }
  }, 1200);

  // ---- Toggle do chat ----
  trigger.addEventListener('click', () => {
    hideGreeting();
    isOpen = !isOpen;
    trigger.classList.toggle('is-open', isOpen);
    window_.classList.toggle('is-open', isOpen);
    if (isOpen) {
      showWelcome();
      setTimeout(() => input.focus(), 300);
    }
  });

  // ---- Enviar mensagem ----
  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isBusy) return;

    isBusy = true;
    sendBtn.disabled = true;
    input.value = '';
    input.style.height = 'auto';

    appendBubble(text, 'user');
    appendTime(now());
    showTyping();

    try {
      const res = await fetch(CHAT_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message:   text,
          sessionId: CHAT_SESSION_ID,
          source:    'portfolio-chat',
        }),
      });

      removeTyping();

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      // Suporta diferentes formatos de resposta do n8n
      const reply =
        data?.output       ||
        data?.message      ||
        data?.reply        ||
        data?.text         ||
        data?.response     ||
        (Array.isArray(data) && (data[0]?.output || data[0]?.message || data[0]?.text)) ||
        'Recebi sua mensagem! Em breve entraremos em contato. 😊';

      appendBubble(reply, 'bot');
      appendTime(now());

    } catch (err) {
      removeTyping();
      appendBubble('Ops! Não consegui conectar agora. Tente novamente ou use o WhatsApp. 😕', 'bot');
      appendTime(now());
      console.warn('[Chat] Erro ao contatar webhook:', err);
    }

    isBusy = false;
    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener('click', sendMessage);

  // Enter para enviar, Shift+Enter para nova linha
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize do textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (isOpen && !window_.contains(e.target) && !trigger.contains(e.target)) {
      isOpen = false;
      trigger.classList.remove('is-open');
      window_.classList.remove('is-open');
    }
  });

})();
