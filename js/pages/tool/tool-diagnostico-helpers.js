/* =============================================
   DIAGNÓSTICO — Funções auxiliares puras
   Sem dependência de estado (_ds) ou textos i18n.
   ============================================= */

/* ── Cores por score / urgência ─────────────── */
function _scoreColor(s) {
  return s >= 70 ? '#22C55E' : s >= 40 ? '#F97316' : '#EF4444';
}
function _scoreLabel(s) {
  return s >= 70 ? 'Bom' : s >= 40 ? 'Atenção' : 'Crítico';
}
function _urgColor(l) {
  const m = { 'CRÍTICO': '#EF4444', 'CRITICO': '#EF4444', 'ALTO': '#F97316', 'MÉDIO': '#EAB308', 'MEDIO': '#EAB308', 'BAIXO': '#22C55E' };
  return m[(l || '').toUpperCase()] || '#A855F7';
}
function _urgBg(l) {
  const m = { 'CRÍTICO': 'rgba(239,68,68,.10)', 'CRITICO': 'rgba(239,68,68,.10)', 'ALTO': 'rgba(249,115,22,.10)', 'MÉDIO': 'rgba(234,179,8,.10)', 'MEDIO': 'rgba(234,179,8,.10)', 'BAIXO': 'rgba(34,197,94,.10)' };
  return m[(l || '').toUpperCase()] || 'rgba(168,85,247,.10)';
}
function _priorColor(p) {
  const l = (p || '').toLowerCase();
  if (l === 'alta')        return { c: '#EF4444', b: 'rgba(239,68,68,.10)' };
  if (l.startsWith('m'))  return { c: '#F97316', b: 'rgba(249,115,22,.10)' };
  return                         { c: '#EAB308', b: 'rgba(234,179,8,.10)' };
}

/* ── Core Web Vitals — thresholds ───────────── */
function _cwvIsGood(type, val) {
  const n = parseFloat(val) || 0;
  if (type === 'cls') return n <= 0.1;
  if (type === 'lcp') return n <= 2.5;
  if (type === 'fcp') return n <= 1.8;
  if (type === 'tbt') return n <= 200;
  return false;
}

/* ── Tab switching ──────────────────────────── */
function _switchTab(id) {
  document.querySelectorAll('.dr-tab').forEach(t => t.classList.remove('dr-tab--active'));
  document.querySelectorAll('.dr-tab-panel').forEach(p => p.classList.add('dr-tab-panel--hidden'));
  const btn   = document.querySelector(`.dr-tab[data-tab="${id}"]`);
  const panel = document.getElementById('drp-' + id);
  if (btn)   btn.classList.add('dr-tab--active');
  if (panel) panel.classList.remove('dr-tab-panel--hidden');
}

/* ── Markdown → HTML simples ────────────────── */
function _md2html(text) {
  if (!text) return '';
  const blockTags = (text.match(/<(?:p|div|section|article|h[1-6]|ul|ol|blockquote)[^>]*>/gi) || []).length;
  if (blockTags >= 3) return text;
  return text
    .replace(/^#### (.+)$/gm,  '<h4>$1</h4>')
    .replace(/^### (.+)$/gm,   '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,    '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,     '<h1>$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g,     '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,         '<em>$1</em>')
    .replace(/`([^`]+)`/g,         '<code>$1</code>')
    .replace(/^---+$/gm,       '<hr>')
    .replace(/^[*-] (.+)$/gm,  '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>(\n|$))+/g, '<ul>$&</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^> (.+)$/gm,     '<blockquote>$1</blockquote>')
    .split(/\n\n+/)
    .map(block => {
      block = block.trim();
      if (!block) return '';
      if (/^<(h[1-4]|ul|ol|blockquote|hr|div|li)/.test(block)) return block;
      return `<p>${block.replace(/\n/g, ' ')}</p>`;
    })
    .join('\n');
}

/* ── Parse top concorrentes de markdown ─────── */
function _parseTopCompetitors(text) {
  if (!text) return [];
  const re = /\d+\.\s+\*\*(.+?)\*\*\s*\n\s*-\s*Rating:\s*([\d.]+)\s*\n\s*-\s*Reviews:\s*(\d+)/g;
  const out = [];
  let m;
  while ((m = re.exec(text)) !== null && out.length < 5) {
    out.push({ name: m[1].trim(), rating: parseFloat(m[2]), reviews: parseInt(m[3]) });
  }
  return out;
}

/* ── Inicializar Chart.js radar ─────────────── */
function _initCharts(pnt, psi) {
  const canvas = document.getElementById('dr-radar-chart');
  if (!canvas) return;

  const data = [
    Math.max(0, Math.min(100, pnt.seo_local       ?? 0)),
    Math.max(0, Math.min(100, psi?.acessibilidade  ?? 50)),
    Math.max(0, Math.min(100, pnt.conversao        ?? 0)),
    Math.max(0, Math.min(100, pnt.tecnica          ?? 0)),
  ];

  const doRender = () => {
    if (!window.Chart) return;

    // choose colors depending on light/dark theme so chart stays legible
    const theme = document.documentElement.getAttribute('data-theme') ||
                  (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    const lightMode = theme === 'light';

    // define palette separately for light/dark, boosting opacity for light theme
    const mainBorder = lightMode ? '#5B21B6' : '#9234EA';
    // dark mode: make fill more opaque and lighten contrast outlines
    const mainBg     = lightMode ? 'rgba(91,33,182,0.45)' : 'rgba(146,52,234,0.35)';
    const contrastBorder = lightMode ? 'rgba(50,50,50,0.7)' : 'rgba(255,255,255,0.35)';
    const contrastBg     = lightMode ? 'rgba(50,50,50,0.25)' : 'rgba(255,255,255,0.15)';
    const contrastPoint  = lightMode ? 'rgba(50,50,50,0.7)' : 'rgba(255,255,255,0.35)';

    new window.Chart(canvas, {
      type: 'radar',
      data: {
        labels:   ['SEO Local', 'UX / Acess.', 'Conversão', 'Performance'],
        datasets: [
          {
            label:           'Seu Site',
            data,
            backgroundColor: mainBg,
            borderColor:     mainBorder,
            borderWidth:     2.5,
            pointBackgroundColor: mainBorder,
            pointRadius:     4,
            pointHoverRadius:6,
          },
          {
            label:           'Concorrente Médio',
            data:            [60, 60, 60, 60],
            backgroundColor: contrastBg,
            borderColor:     contrastBorder,
            borderWidth:     1.5,
            pointBackgroundColor: contrastPoint,
            pointRadius:     3,
          },
        ],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: true,
        scales: {
          r: {
            min: 0, max: 100,
            ticks:        { display: false, stepSize: 25 },
            grid:         { color: lightMode ? '#0000001a' : 'rgba(255,255,255,0.07)' },
            angleLines:   { color: lightMode ? '#0000001a' : 'rgba(255,255,255,0.07)' },
            pointLabels:  { color: lightMode ? '#333' : 'rgba(255,255,255,0.72)', font: { size: 11, weight: '700' }, padding: 10 },
          },
        },
        plugins:   { legend: { display: false } },
        animation: { duration: 1200, easing: 'easeInOutQuart' },
      },
    });
  };

  if (typeof Chart !== 'undefined') {
    doRender();
  } else {
    const s = document.createElement('script');
    s.src     = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    s.onload  = doRender;
    document.head.appendChild(s);
  }
}
