/* =============================================
   DIAGNÓSTICO — Impressão / PDF
   Separado para garantir PDFs sem quebras e
   restauração confiável do estado visual.

   Depende de: _ds, _switchTab (helpers.js)
   Reutiliza: toda a renderização já no DOM
              (sem duplicação de HTML)
   ============================================= */

let _printState = null;

/* ── Prepara e aciona impressão ─────────────── */
function _printReport() {
  const clientPanel = document.getElementById('drp-cliente');
  const ctaEl       = document.querySelector('.dr-cta-footer');

  _printState = {
    activeTab: 'cliente',
    ctaDisplay: ctaEl ? ctaEl.style.display : '',
  };

  _captureChartForPrint();

  /* garante que o painel do cliente esteja visível */
  clientPanel?.classList.remove('dr-tab-panel--hidden');
  if (ctaEl) ctaEl.style.display = 'block';

  window.print();
}

/* ── Converte canvas do gráfico em <img> ─────── */
function _captureChartForPrint() {
  const canvas = document.getElementById('dr-radar-chart');
  if (!canvas || canvas.tagName !== 'CANVAS' || canvas.dataset.printReplaced) return;
  try {
    const dataUrl = canvas.toDataURL('image/png');
    if (!dataUrl || dataUrl === 'data:,') return;
    const img         = document.createElement('img');
    img.src           = dataUrl;
    img.className     = 'dr-chart-print-img';
    img.style.cssText = `width:${canvas.offsetWidth || 300}px;max-width:100%;display:block`;
    canvas.insertAdjacentElement('afterend', img);
    canvas.style.display         = 'none';
    canvas.dataset.printReplaced = '1';
  } catch (_) {
    /* canvas ainda não renderizado ou protegido por CORS — continua sem imagem */
  }
}

/* ── Restaura estado após fechar a janela de impressão ─ */
window.addEventListener('afterprint', () => {
  if (!_printState) return;

  /* Remove a imagem temporária e restaura o canvas original */
  document.querySelectorAll('.dr-chart-print-img').forEach(img => img.remove());
  const canvas = document.getElementById('dr-radar-chart');
  if (canvas?.dataset?.printReplaced) {
    canvas.style.display = '';
    delete canvas.dataset.printReplaced;
  }

  /* Restaura visibilidade da CTA */
  const ctaEl = document.querySelector('.dr-cta-footer');
  if (ctaEl) ctaEl.style.display = _printState.ctaDisplay;

  /* Restaura a aba que estava ativa antes da impressão */
  _switchTab(_printState.activeTab);
  _printState = null;
});
