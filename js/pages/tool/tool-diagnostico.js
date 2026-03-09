/* =============================================
   TOOL: DIAGNÓSTICO DE PRESENÇA DIGITAL
   Entry point principal — estado e orquestração.

   Arquivos relacionados (carregados antes deste):
     js/pages/tool/diagnostico-i18n.js       ← textos / i18n
     js/pages/tool/tool-diagnostico-helpers.js ← funções puras
     js/pages/tool/tool-diagnostico-steps.js  ← steps 1-2-3
     js/pages/tool/tool-diagnostico-result.js ← relatório
   ============================================= */

/* â”€â”€ Estado global da ferramenta â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
let _ds = {
  step:          'form',
  url:           '',
  nicho:         '',
  cidade:        '',
  email:         '',
  error:         '',
  resultHtml:    '',
  resultData:    null,
  resendCooldown: 0,
  resendTimer:   null,
};

function _setDS(patch) {
  Object.assign(_ds, patch);
}

/* â”€â”€ Shell da pÃ¡gina (renderizado pelo router) â”€â”€ */
function renderToolDiagnostico() {
  return `<section class="tool-page">
    <div id="diag-container"></div>
  </section>`;
}

/* â”€â”€ InicializaÃ§Ã£o / reset â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function initToolDiagnostico() {
  if (_ds.resendTimer) clearInterval(_ds.resendTimer);
  _ds = {
    step: 'form', url: '', nicho: '', cidade: '', email: '',
    error: '', resultHtml: '', resultData: null, resendCooldown: 0, resendTimer: null,
  };
  _renderDS();
}

/* â”€â”€ Orquestrador de renderizaÃ§Ã£o â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function _renderDS() {
  const container = document.getElementById('diag-container');
  if (!container) return;
  const steps = {
    form:    () => { container.innerHTML = _formHTML();    _formListeners();    },
    verify:  () => { container.innerHTML = _verifyHTML();  _verifyListeners();  },
    loading: () => { container.innerHTML = _loadingHTML(); _loadingAnim();      },
    result:  () => { container.innerHTML = _resultHTML();  _resultListeners();  },
  };
  (steps[_ds.step] || steps.form)();
}

