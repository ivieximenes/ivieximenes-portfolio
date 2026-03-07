/* =============================================
   TOOL: DIAGNÓSTICO DE PRESENÇA DIGITAL
   ============================================= */
let _ds = {
  step:'form', url:'', nicho:'', cidade:'', email:'',
  error:'', resultHtml:'', resultData:null,
  resendCooldown:0, resendTimer:null,
};
function _setDS(p){Object.assign(_ds,p);}

function renderToolDiagnostico(){
  return `<section class="tool-page">
    <div class="tool-page__back">
      <a href="/ferramentas" class="tool-page__back-link" data-route="/ferramentas">
        <i class="ph ph-arrow-left"></i> Ferramentas
      </a>
    </div>
    <div id="diag-container"></div>
  </section>`;
}

function initToolDiagnostico(){
  if(_ds.resendTimer) clearInterval(_ds.resendTimer);
  _ds={step:'form',url:'',nicho:'',cidade:'',email:'',error:'',resultHtml:'',resultData:null,resendCooldown:0,resendTimer:null};
  _renderDS();
}

function _renderDS(){
  const c=document.getElementById('diag-container');
  if(!c) return;
  const m={
    form:   ()=>{c.innerHTML=_formHTML();   _formListeners();  },
    verify: ()=>{c.innerHTML=_verifyHTML(); _verifyListeners();},
    loading:()=>{c.innerHTML=_loadingHTML();_loadingAnim();    },
    result: ()=>{c.innerHTML=_resultHTML(); _resultListeners();},
  };
  (m[_ds.step]||m.form)();
}

/* ---- Steps indicator ---- */
function _steps(active){
  const list=[{k:'form',l:'Dados',i:'ph-globe'},{k:'verify',l:'E-mail',i:'ph-envelope-simple'},{k:'result',l:'Relatório',i:'ph-chart-bar'}];
  const ai=list.findIndex(s=>s.k===active);
  return `<div class="tool-steps">${list.map((s,i)=>`
    <div class="tool-step${i<ai?' tool-step--done':''}${i===ai?' tool-step--active':''}">
      <div class="tool-step__icon">${i<ai?'<i class="ph ph-check-bold"></i>':`<i class="ph ${s.i}"></i>`}</div>
      <span>${s.l}</span>
    </div>${i<list.length-1?`<div class="tool-step__line${i<ai?' tool-step__line--done':''}"></div>`:''}
  `).join('')}</div>`;
}

/* ===== STEP 1: FORM ===== */
function _formHTML(){
  return `<div class="tool-card-page">
    ${_steps('form')}
    <div class="tool-card-page__header">
      <div class="tool-card-page__icon"><i class="ph ph-magnifying-glass-plus"></i></div>
      <h1 class="tool-card-page__title">Diagnóstico de Presença Digital</h1>
      <p class="tool-card-page__desc">Analise velocidade, SEO, segurança e potencial de mercado do seu site — relatório completo e automatizado, grátis.</p>
    </div>
    <div class="diag-trust-badges">
      <span><i class="ph ph-check-circle"></i> Gratuito</span>
      <span><i class="ph ph-clock"></i> ~2 minutos</span>
      <span><i class="ph ph-shield-check"></i> Sem compromisso</span>
    </div>
    ${_ds.error?`<div class="tool-error"><i class="ph ph-x-circle"></i> ${_ds.error}</div>`:''}
    <div class="tool-form-card">
      <form id="diag-form" class="tool-form" novalidate>
        <div class="tool-form-section">
          <h3 class="tool-form-section__title"><i class="ph ph-globe"></i> Informações do Site</h3>
          <div class="tool-form-field">
            <label for="d-url" class="tool-form-label">URL do site</label>
            <div class="tool-form-input-wrap">
              <i class="ph ph-globe"></i>
              <input type="url" id="d-url" class="tool-form-input" placeholder="https://seusite.com.br" value="${_ds.url}" required>
            </div>
            <span class="tool-form-hint">Inclua https:// ou http://</span>
          </div>
        </div>
        <div class="tool-form-section">
          <h3 class="tool-form-section__title"><i class="ph ph-building"></i> Dados do Negócio</h3>
          <div class="tool-form-row">
            <div class="tool-form-field">
              <label for="d-nicho" class="tool-form-label">Nicho / Segmento</label>
              <div class="tool-form-input-wrap">
                <i class="ph ph-tag"></i>
                <input type="text" id="d-nicho" class="tool-form-input" placeholder="Ex: Clínica odontológica" value="${_ds.nicho}" required>
              </div>
            </div>
            <div class="tool-form-field">
              <label for="d-cidade" class="tool-form-label">Cidade</label>
              <div class="tool-form-input-wrap">
                <i class="ph ph-map-pin"></i>
                <input type="text" id="d-cidade" class="tool-form-input" placeholder="Ex: Rio de Janeiro" value="${_ds.cidade}" required>
              </div>
            </div>
          </div>
        </div>
        <div class="tool-form-section">
          <h3 class="tool-form-section__title"><i class="ph ph-envelope-simple"></i> Contato</h3>
          <div class="tool-form-field">
            <label for="d-email" class="tool-form-label">Seu e-mail</label>
            <div class="tool-form-input-wrap">
              <i class="ph ph-envelope-simple"></i>
              <input type="email" id="d-email" class="tool-form-input" placeholder="voce@empresa.com" value="${_ds.email}" required>
            </div>
            <span class="tool-form-hint">Enviaremos um código para confirmar o acesso.</span>
          </div>
        </div>
        <div class="tool-form-actions">
          <button type="submit" class="btn btn--primary btn--full btn--lg" id="diag-submit">
            <i class="ph ph-paper-plane-tilt"></i> Analisar gratuitamente
          </button>
          <p class="tool-form-terms">Limite: 1 diagnóstico gratuito por dia. Dados usados apenas para controle de acesso.</p>
        </div>
      </form>
    </div>
  </div>`;
}

function _formListeners(){
  document.getElementById('diag-form')?.addEventListener('submit', async e=>{
    e.preventDefault();
    const url=document.getElementById('d-url').value.trim();
    const nicho=document.getElementById('d-nicho').value.trim();
    const cidade=document.getElementById('d-cidade').value.trim();
    const email=document.getElementById('d-email').value.trim();
    if(!url||!url.startsWith('http')){_setDS({error:'Informe uma URL válida (https://...).'});_renderDS();return;}
    if(!nicho){_setDS({error:'Informe o nicho do negócio.'});_renderDS();return;}
    if(!cidade){_setDS({error:'Informe a cidade.'});_renderDS();return;}
    if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){_setDS({error:'Informe um e-mail válido.'});_renderDS();return;}
    const btn=document.getElementById('diag-submit');
    btn.disabled=true; btn.innerHTML='<i class="ph ph-circle-notch ph-spin"></i> Enviando...';
    try{
      const r=await fetch('/api/diagnostico',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'send_code',email})});
      const d=await r.json();
      if(!r.ok){_setDS({error:d.error||'Não foi possível enviar o código.'});_renderDS();return;}
      _setDS({url,nicho,cidade,email,error:'',step:'verify',resendCooldown:60});
      _renderDS(); _startResendTimer();
    }catch{_setDS({error:'Erro de conexão. Tente novamente.'});_renderDS();}
  });
}

/* ===== STEP 2: VERIFY ===== */
function _verifyHTML(){
  const masked=_ds.email.replace(/(.{2})(.*)(@.*)/,(_,a,b,c)=>a+'*'.repeat(b.length)+c);
  const ok=_ds.resendCooldown<=0;
  return `<div class="tool-card-page">
    ${_steps('verify')}
    <div class="tool-card-page__header">
      <div class="tool-card-page__icon tool-card-page__icon--verify"><i class="ph ph-envelope-open"></i></div>
      <h1 class="tool-card-page__title">Verifique seu e-mail</h1>
      <p class="tool-card-page__desc">Enviamos um código de <strong>6 dígitos</strong> para <strong>${masked}</strong>. Verifique caixa de entrada e spam.</p>
    </div>
    ${_ds.error?`<div class="tool-error"><i class="ph ph-x-circle"></i> ${_ds.error}</div>`:''}
    <form id="verify-form" class="tool-form" novalidate>
      <div class="tool-form__field">
        <label for="d-code">Código de verificação</label>
        <div class="tool-form__input-wrap"><i class="ph ph-password"></i>
          <input type="text" id="d-code" placeholder="000000" maxlength="6" inputmode="numeric" pattern="[0-9]{6}" autocomplete="one-time-code" required>
        </div>
      </div>
      <button type="submit" class="btn btn--primary btn--full" id="verify-submit">
        <i class="ph ph-check-circle"></i> Confirmar e iniciar análise
      </button>
      <div class="tool-form__resend">
        <button type="button" id="resend-btn" class="tool-form__resend-btn${ok?'':' disabled'}" ${ok?'':'disabled'}>
          ${ok?'<i class="ph ph-arrow-clockwise"></i> Reenviar código':`<i class="ph ph-clock"></i> Reenviar em ${_ds.resendCooldown}s`}
        </button>
        <button type="button" id="back-btn" class="tool-form__back-btn">
          <i class="ph ph-arrow-left"></i> Alterar e-mail
        </button>
      </div>
    </form>
  </div>`;
}

function _verifyListeners(){
  const ci=document.getElementById('d-code');
  ci?.addEventListener('input',()=>{ci.value=ci.value.replace(/\D/g,'').slice(0,6);});
  document.getElementById('verify-form')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const code=ci.value.trim();
    if(code.length!==6){_setDS({error:'O código deve ter 6 dígitos.'});_renderDS();return;}
    const btn=document.getElementById('verify-submit');
    btn.disabled=true; btn.innerHTML='<i class="ph ph-circle-notch ph-spin"></i> Verificando...';
    _setDS({step:'loading',error:''}); _renderDS();
    try{
      const r=await fetch('/api/diagnostico',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action:'run',email:_ds.email,code,url:_ds.url,nicho:_ds.nicho,cidade:_ds.cidade})});
      const data=await r.json();
      if(!r.ok){_setDS({step:'verify',error:data.error||'Código inválido ou expirado.'});_renderDS();return;}
      let parsedData=null, fallbackHtml='';
      const raw=data.result??data.html??null;
      if(raw!==null&&typeof raw==='object'){
        parsedData=Array.isArray(raw)?(raw[0]||null):raw;
      }else if(typeof raw==='string'){
        try{const p=JSON.parse(raw);parsedData=Array.isArray(p)?(p[0]||null):p;}
        catch{fallbackHtml=raw;}
      }
      _setDS({step:'result',resultHtml:fallbackHtml,resultData:parsedData}); _renderDS();
    }catch{_setDS({step:'verify',error:'Erro de conexão. Tente novamente.'});_renderDS();}
  });
  document.getElementById('resend-btn')?.addEventListener('click',async()=>{
    if(_ds.resendCooldown>0) return;
    const btn=document.getElementById('resend-btn');
    btn.disabled=true; btn.innerHTML='<i class="ph ph-circle-notch ph-spin"></i> Enviando...';
    try{
      const r=await fetch('/api/diagnostico',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'send_code',email:_ds.email})});
      const d=await r.json();
      if(!r.ok){_setDS({error:d.error||'Não foi possível reenviar.'});}
      else{_setDS({error:'',resendCooldown:60});_startResendTimer();}
    }catch{_setDS({error:'Erro ao reenviar.'});}
    _renderDS();
  });
  document.getElementById('back-btn')?.addEventListener('click',()=>{
    if(_ds.resendTimer) clearInterval(_ds.resendTimer);
    _setDS({step:'form',error:'',resendCooldown:0}); _renderDS();
  });
}

function _startResendTimer(){
  if(_ds.resendTimer) clearInterval(_ds.resendTimer);
  _ds.resendTimer=setInterval(()=>{
    _ds.resendCooldown=Math.max(0,_ds.resendCooldown-1);
    const b=document.getElementById('resend-btn');
    if(!b) return;
    if(_ds.resendCooldown<=0){
      clearInterval(_ds.resendTimer);
      b.disabled=false; b.classList.remove('disabled');
      b.innerHTML='<i class="ph ph-arrow-clockwise"></i> Reenviar código';
    }else{
      b.innerHTML=`<i class="ph ph-clock"></i> Reenviar em ${_ds.resendCooldown}s`;
    }
  },1000);
}

/* ===== STEP 3: LOADING ===== */
function _loadingHTML(){
  return `<div class="tool-card-page tool-card-page--loading">
    <div class="tool-loading">
      <div class="tool-loading__orb"></div>
      <h2 class="tool-loading__title">Analisando seu site</h2>
      <p class="tool-loading__sub">Aguarde até 90 segundos. Consultando múltiplas fontes.</p>
      <div class="tool-loading__steps">
        ${['Google PageSpeed Insights','SEO técnico e robots/sitemap','Concorrentes no Google Maps','Análise de mercado com IA','Gerando relatório personalizado']
          .map((l,i)=>`<div class="tool-loading__item" id="ls${i}"><i class="ph ph-circle-notch"></i><span>${l}</span></div>`)
          .join('')}
      </div>
    </div>
  </div>`;
}

function _loadingAnim(){
  [0,8000,18000,35000,55000].forEach((d,i)=>{
    setTimeout(()=>{
      const el=document.getElementById('ls'+i);
      if(!el) return;
      el.classList.add('active');
      const ic=el.querySelector('i');
      if(ic) ic.className='ph ph-circle-notch ph-spin';
    },d);
  });
}

/* ===== HELPERS ===== */
function _scoreColor(s){return s>=70?'#22C55E':s>=40?'#F97316':'#EF4444';}
function _scoreLabel(s){return s>=70?'Bom':s>=40?'Atenção':'Crítico';}
function _urgColor(l){const m={'CRÍTICO':'#EF4444','CRITICO':'#EF4444','ALTO':'#F97316','MÉDIO':'#EAB308','MEDIO':'#EAB308','BAIXO':'#22C55E'};return m[(l||'').toUpperCase()]||'#A855F7';}
function _urgBg(l){const m={'CRÍTICO':'rgba(239,68,68,.10)','CRITICO':'rgba(239,68,68,.10)','ALTO':'rgba(249,115,22,.10)','MÉDIO':'rgba(234,179,8,.10)','MEDIO':'rgba(234,179,8,.10)','BAIXO':'rgba(34,197,94,.10)'};return m[(l||'').toUpperCase()]||'rgba(168,85,247,.10)';}
function _priorColor(p){const l=(p||'').toLowerCase();if(l==='alta')return{c:'#EF4444',b:'rgba(239,68,68,.10)'};if(l.startsWith('m'))return{c:'#F97316',b:'rgba(249,115,22,.10)'};return{c:'#EAB308',b:'rgba(234,179,8,.10)'};}

function _switchTab(id){
  document.querySelectorAll('.dr-tab').forEach(t=>t.classList.remove('dr-tab--active'));
  document.querySelectorAll('.dr-tab-panel').forEach(p=>{p.style.display='none';});
  const b=document.querySelector(`.dr-tab[data-tab="${id}"]`);
  const p=document.getElementById('drp-'+id);
  if(b) b.classList.add('dr-tab--active');
  if(p) p.style.display='block';
}

/* ---- Converter Markdown para HTML ---- */
function _md2html(text){
  if(!text) return '';
  const blockTags=(text.match(/<(?:p|div|section|article|h[1-6]|ul|ol|blockquote)[^>]*>/gi)||[]).length;
  if(blockTags>=3) return text;
  return text
    .replace(/^#### (.+)$/gm,'<h4>$1</h4>')
    .replace(/^### (.+)$/gm,'<h3>$1</h3>')
    .replace(/^## (.+)$/gm,'<h2>$1</h2>')
    .replace(/^# (.+)$/gm,'<h1>$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/^---+$/gm,'<hr>')
    .replace(/^[*-] (.+)$/gm,'<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>(\n|$))+/g,'<ul>$&</ul>')
    .replace(/^\d+\. (.+)$/gm,'<li>$1</li>')
    .replace(/^> (.+)$/gm,'<blockquote>$1</blockquote>')
    .split(/\n\n+/).map(block=>{
      block=block.trim();
      if(!block) return '';
      if(/^<(h[1-4]|ul|ol|blockquote|hr|div|li)/.test(block)) return block;
      return `<p>${block.replace(/\n/g,' ')}</p>`;
    }).join('\n');
}

/* ---- Parse top competitors from analise_mercado markdown ---- */
function _parseTopCompetitors(text){
  if(!text) return [];
  const re=/\d+\.\s+\*\*(.+?)\*\*\s*\n\s*-\s*Rating:\s*([\d.]+)\s*\n\s*-\s*Reviews:\s*(\d+)/g;
  const out=[];
  let m;
  while((m=re.exec(text))!==null&&out.length<5){
    out.push({name:m[1].trim(),rating:parseFloat(m[2]),reviews:parseInt(m[3])});
  }
  return out;
}

/* ---- Inicializar Chart.js radar ---- */
function _initCharts(pnt,psi){
  const canvas=document.getElementById('dr-radar-chart');
  if(!canvas) return;
  const data=[
    Math.max(0,Math.min(100,pnt.seo_local??0)),
    Math.max(0,Math.min(100,psi?.acessibilidade??50)),
    Math.max(0,Math.min(100,pnt.conversao??0)),
    Math.max(0,Math.min(100,pnt.tecnica??0)),
  ];
  const doRender=()=>{
    if(!window.Chart) return;
    new window.Chart(canvas,{
      type:'radar',
      data:{
        labels:['SEO Local','UX / Acess.','Conversão','Performance'],
        datasets:[
          {
            label:'Seu Site',
            data,
            backgroundColor:'rgba(146,52,234,0.22)',
            borderColor:'#9234EA',
            borderWidth:2.5,
            pointBackgroundColor:'#9234EA',
            pointRadius:4,
            pointHoverRadius:6,
          },
          {
            label:'Concorrente Médio',
            data:[60,60,60,60],
            backgroundColor:'rgba(200,200,220,0.08)',
            borderColor:'rgba(200,200,220,0.40)',
            borderWidth:1.5,
            pointBackgroundColor:'rgba(200,200,220,0.40)',
            pointRadius:3,
          },
        ]
      },
      options:{
        responsive:true,
        maintainAspectRatio:true,
        scales:{r:{
          min:0,max:100,
          ticks:{display:false,stepSize:25},
          grid:{color:'rgba(255,255,255,0.07)'},
          angleLines:{color:'rgba(255,255,255,0.07)'},
          pointLabels:{color:'rgba(255,255,255,0.72)',font:{size:11,weight:'700'},padding:10}
        }},
        plugins:{legend:{display:false}},
        animation:{duration:1200,easing:'easeInOutQuart'}
      }
    });
  };
  if(typeof Chart!=='undefined'){doRender();}
  else{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    s.onload=doRender;
    document.head.appendChild(s);
  }
}

/* ===== RESULT HTML ===== */
function _resultHTML(){
  const raw=_ds.resultData;

  /* Fallback quando não há dados estruturados */
  if(!raw) return `<div class="dr-wrap dr-disclaimer-wrap">
    <header class="dr-header dr-header--simple">
      <span class="dr-header__badge"><i class="ph ph-check-circle"></i> Análise concluída</span>
      <h1 class="dr-header__title">Diagnóstico de Presença Digital</h1>
      <p class="dr-header__meta"><strong>${_ds.url}</strong></p>
      <div class="dr-print-buttons">
        <button id="diag-print-client" class="dr-print-btn"><i class="ph ph-user"></i> PDF Visão do Cliente</button>
        <button id="diag-print-tech" class="dr-print-btn"><i class="ph ph-wrench"></i> PDF Relatório Técnico</button>
      </div>
    </header>
    <div class="tool-result__disclaimer"><i class="ph ph-warning"></i>
      <p>Relatório gerado por automação. Os dados refletem o estado atual do site.</p></div>
    <div class="tool-result__content">${_ds.resultHtml}</div>
  </div>`;

  const report=raw.auditReport||raw;
  const meta=report.metadata||{};
  const pnt=report.pontuacao||{};
  const relTec=report.relatorio_tecnico||{};
  const relCli=report.relatorio_cliente||{};
  const sum=relCli.sumario_executivo||{};
  const uc=_urgColor(pnt.nivel_urgencia), ub=_urgBg(pnt.nivel_urgencia);
  const dateStr=meta.dataAnalise?new Date(meta.dataAnalise).toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'}):'';

  return `<div class="dr-wrap">

    <header class="dr-header">
      <div class="dr-header__left">
        <div class="dr-hero-badge"><span class="dr-hero-badge__dot"></span> ANÁLISE EM TEMPO REAL</div>
        <h1 class="dr-header__title">Diagnóstico de<br>Presença Digital</h1>
        <p class="dr-header__desc">Análise técnica completa: performance, SEO e conversão estratégica para o seu negócio. Inteligência artificial e ferramentas líderes de mercado para mapear cada falha do funil digital.</p>
        <div class="dr-header__metas">
          <div class="dr-header__meta-item">
            <i class="ph ph-link"></i>
            <span>URL Analisada</span>
            <strong>${meta.url||_ds.url}</strong>
          </div>
          ${dateStr?`<div class="dr-header__meta-item">
            <i class="ph ph-calendar"></i>
            <span>Data da Análise</span>
            <strong>${dateStr}</strong>
          </div>`:''}
        </div>
        ${sum.frase_resumo?`<blockquote class="dr-header__quote">"${sum.frase_resumo}"</blockquote>`:''}
        <div class="dr-header__chips">
          ${(sum.total_problemas_criticos||0)>0?`<span class="dr-hero__chip dr-hero__chip--bad"><i class="ph ph-warning"></i> ${sum.total_problemas_criticos} problema${sum.total_problemas_criticos>1?'s':''}</span>`:''}
          ${pnt.lead_score?`<span class="dr-hero__chip" style="background:${ub};color:${uc};border-color:${uc}55"><i class="ph ph-fire"></i> ${pnt.lead_emoji||''} ${pnt.lead_score}</span>`:''}
        </div>
      </div>
      <div class="dr-header__right">
        <div class="dr-header__stack-box">
          <h3 class="dr-header__stack-title"><i class="ph ph-cpu"></i> Stack Tecnológica</h3>
          <div class="dr-stack-grid">
            <div class="dr-stack-item"><i class="ph ph-gauge"></i><span>Google PageSpeed</span></div>
            <div class="dr-stack-item"><i class="ph ph-magnifying-glass"></i><span>Lighthouse v10</span></div>
            <div class="dr-stack-item"><i class="ph ph-brain"></i><span>OpenAI Engine</span></div>
            <div class="dr-stack-item"><i class="ph ph-map-pin"></i><span>Maps Places API</span></div>
          </div>
        </div>
        <div class="dr-header__actions">
          <div class="dr-print-buttons">
            <button id="diag-print-client" class="dr-print-btn"><i class="ph ph-user"></i> PDF Visão do Cliente</button>
            <button id="diag-print-tech" class="dr-print-btn"><i class="ph ph-wrench"></i> PDF Relatório Técnico</button>
          </div>
          <a href="/ferramentas/diagnostico" class="btn btn--ghost btn--sm" data-route="/ferramentas/diagnostico">
            <i class="ph ph-arrow-clockwise"></i> Nova análise</a>
        </div>
      </div>
    </header>

    <div class="dr-banner" style="border-color:${uc};background:${ub}">
      <span class="dr-banner__dot" style="background:${uc};box-shadow:0 0 8px ${uc}40"></span>
      <div class="dr-banner__body">
        <strong>Urgência: ${pnt.nivel_urgencia||'—'}</strong>
        <span>${pnt.nivel_urgencia&&(pnt.nivel_urgencia.toUpperCase().includes('CRÍT')||pnt.nivel_urgencia.toUpperCase()==='ALTO')
          ?'Ação imediata recomendada — o site está perdendo oportunidades diariamente.'
          :'Melhorias identificadas que podem maximizar os resultados online.'}</span>
      </div>
      <span class="dr-banner__lead" style="border-color:${uc};color:${uc}">${pnt.lead_emoji||''} ${pnt.lead_score||''}</span>
    </div>

    <div class="dr-tabs" role="tablist">
      <button class="dr-tab dr-tab--active" data-tab="cliente" role="tab" onclick="_switchTab('cliente')">
        <i class="ph ph-user"></i> Visão do Cliente</button>
      <button class="dr-tab" data-tab="tech" role="tab" onclick="_switchTab('tech')">
        <i class="ph ph-wrench"></i> Análise Técnica</button>
    </div>

    <div id="drp-cliente" class="dr-tab-panel" style="display:block">
      ${_tabCliente(pnt,relCli,meta,relTec)}
    </div>
    <div id="drp-tech" class="dr-tab-panel" style="display:none">
      ${_tabTech(relTec,pnt,meta)}
    </div>

    ${_cta(relCli.problemas||[],pnt)}
  </div>`;
}

/* ---- Tab Cliente ---- */
function _tabCliente(pnt,relCli,meta,relTec){
  const probs=relCli.problemas||[];
  const fortes=relCli.pontos_fortes||[];
  const mercado=relCli.contexto_mercado||{};
  const psi=relCli.pagespeed_simplificado||{};
  const recos=relCli.recomendacoes_prioritarias||[];
  return [
    _scoreCards(pnt,psi),
    _problemsVitals(probs,psi),
    fortes.length?_fortes(fortes):'',
    mercado.total_concorrentes?_competitiveSection(pnt,psi,mercado,relTec):'',
    _implementationPlan(probs),
    recos.length?_recos(recos):'',
    pnt.maturidade_score!=null||pnt.potencial_score!=null?_maturityBars(pnt):'',
  ].join('');
}

/* ---- 4 Score Cards horizontais ---- */
function _scoreCards(pnt,psi){
  const uc=_urgColor(pnt.nivel_urgencia),ub=_urgBg(pnt.nivel_urgencia);
  const cards=[
    {l:'Score Geral',  v:pnt.geral??0,     icon:'ph-star',         unit:'',  sub:'de 100 pontos'},
    {l:'SEO Local',    v:pnt.seo_local??0,  icon:'ph-map-pin',      unit:'%', sub:'relevância local'},
    {l:'Performance',  v:pnt.tecnica??0,    icon:'ph-gauge',        unit:'%', sub:'velocidade & técnica'},
    {l:'Conversão',    v:pnt.conversao??0,  icon:'ph-cursor-click', unit:'%', sub:'potencial de leads'},
  ];
  return `<section class="dr-sec dr-sec--scores">
    <div class="dr-score-cards">
      ${cards.map((c,i)=>{
        const col=_scoreColor(c.v);
        return `<div class="dr-score-card-v2">
          <div class="dr-score-card-v2__header">
            <span class="dr-score-card-v2__icon" style="background:${col}20;color:${col}"><i class="ph ${c.icon}"></i></span>
            <span class="dr-score-card-v2__label">${c.l}</span>
          </div>
          <div class="dr-score-card-v2__value" style="color:${col}">${c.v}<small>${c.unit}</small></div>
          <div class="dr-score-card-v2__sub">${c.sub}</div>
          <div class="dr-score-card-v2__bar-track">
            <div class="dr-score-card-v2__bar-fill" style="width:${c.v}%;background:${col}"></div>
          </div>
          ${i===0&&pnt.nivel_urgencia?`<span class="dr-score-card-v2__badge" style="background:${ub};color:${uc};border:1px solid ${uc}44">${pnt.nivel_urgencia}</span>`:''}
        </div>`;
      }).join('')}
    </div>
  </section>`;
}

/* ---- Problemas em accordion (1º aberto) + Core Web Vitals ---- */
function _problemsVitals(probs,psi){
  if(!probs.length) return '';
  const shown=probs.slice(0,4),hiddenCount=probs.length-4;
  const score=_ds.resultData?.auditReport?.pontuacao?.geral??0;
  const cwv=[
    {l:'LCP (Largest Contentful Paint)',v:psi.lcp,good:false},
    {l:'FCP (First Contentful Paint)',v:psi.fcp,good:false},
    {l:'TBT (Total Blocking Time)',v:psi.tbt,good:false},
    {l:'CLS (Cumulative Layout Shift)',v:psi.cls,good:true},
  ].filter(c=>c.v!=null&&c.v!=='N/A'&&c.v!==undefined);

  const card=(prob,isFirst)=>{
    const pc=_priorColor(prob.prioridade);
    return `<div class="dr-accordion-item${isFirst?' dr-accordion-item--open':''}">
      <button class="dr-accordion-btn" onclick="this.parentElement.classList.toggle('dr-accordion-item--open')">
        <div class="dr-accordion-btn__left">
          <i class="ph ph-warning-circle" style="color:${pc.c}"></i>
          <span>${prob.titulo}</span>
        </div>
        <i class="ph ph-caret-down dr-accordion-caret"></i>
      </button>
      <div class="dr-accordion-body">
        <p>${prob.descricao}</p>
        ${prob.beneficio_de_resolver?`<div class="dr-accordion-gain"><i class="ph ph-arrow-up-right"></i> ${prob.beneficio_de_resolver}</div>`:''}
        ${prob.custo_de_nao_resolver?`<div class="dr-accordion-risk"><i class="ph ph-trend-down"></i> ${prob.custo_de_nao_resolver}</div>`:''}
        ${prob.fonte?`<p class="dr-source-block"><i class="ph ph-book-open"></i> Fonte: ${prob.fonte}</p>`:''}
      </div>
    </div>`;
  };

  return `<section class="dr-sec">
    <div class="dr-two-col">
      <div class="dr-two-col__main">
        <div class="dr-two-col__head">
          <h2 class="dr-sec__h" style="margin:0"><i class="ph ph-warning-octagon"></i> Problemas Críticos</h2>
          <span class="dr-badge dr-badge--red">${probs.length} alertas</span>
        </div>
        <div class="dr-accordion">${shown.map((p,i)=>card(p,i===0)).join('')}</div>
        ${hiddenCount>0?`<div class="dr-problems-cta">
          <div>
            <p class="dr-problems-cta__title">Existem mais <strong>${hiddenCount} problemas técnicos</strong> identificados.</p>
            <p class="dr-problems-cta__sub">Sua pontuação de ${score}/100 é impactada por falhas ocultas no código.</p>
          </div>
          <a href="https://wa.me/5521999999999" target="_blank" rel="noopener" class="btn btn--primary btn--sm">
            <i class="ph ph-rocket-launch"></i> Solicitar Consultoria
          </a>
        </div>`:''}
      </div>
      ${cwv.length?`<div class="dr-two-col__aside">
        <h2 class="dr-sec__h"><i class="ph ph-timer"></i> Core Web Vitals</h2>
        ${cwv.map(c=>{
          const val=parseFloat(c.v)||0;
          let good=c.good;
          if(c.l.includes('CLS')) good=val<=0.1;
          else if(c.l.includes('LCP')) good=val<=2.5;
          else if(c.l.includes('FCP')) good=val<=1.8;
          else if(c.l.includes('TBT')) good=val<=200;
          const col=good?'#22C55E':'#F97316';
          const pct=good?20:78;
          return `<div class="dr-vital-item">
            <div class="dr-vital-item__head"><span>${c.l}</span><span style="color:${col};font-weight:700">${c.v}</span></div>
            <div class="dr-vital-item__bar"><div style="width:${pct}%;background:${col}"></div></div>
            <p class="dr-vital-item__status" style="color:${col}">${good?'✓ BOM':'⚠ PRECISA MELHORAR'}</p>
          </div>`;
        }).join('')}
        ${psi.performance!=null?`<div class="dr-psi-mini">
          ${[{l:'Perf.',v:psi.performance},{l:'SEO',v:psi.seo_lighthouse},{l:'Acess.',v:psi.acessibilidade},{l:'Práticas',v:psi.melhores_praticas}]
          .map(c=>{const v=c.v??0,cc=_scoreColor(v);return `<div class="dr-psi-mini__item" style="border-color:${cc}33">
            <span class="dr-psi-mini__val" style="color:${cc}">${v}</span>
            <span class="dr-psi-mini__label">${c.l}</span>
          </div>`;}).join('')}
        </div>`:''}
        ${psi.frase_performance?`<div class="dr-insight" style="margin-top:.75rem"><i class="ph ph-info"></i><span>${psi.frase_performance}</span></div>`:''}
      </div>`:''}
    </div>
  </section>`;
}

/* ---- Análise Competitiva: radar Chart.js + tabela top 5 ---- */
function _competitiveSection(pnt,psi,mercado,relTec){
  const competitors=relTec?_parseTopCompetitors(relTec.analise_mercado||''):[];
  const maxReviews=competitors.reduce((mx,c)=>Math.max(mx,c.reviews),1);
  const total=mercado.total_concorrentes||0,sem=mercado.sem_site||0,rating=mercado.rating_medio??0;

  return `<section class="dr-sec">
    <h2 class="dr-sec__h"><i class="ph ph-users-three"></i> Análise Competitiva</h2>
    <p class="dr-muted"><i class="ph ph-info"></i> Como você se posiciona em relação ao mercado local de ${_ds.nicho||'seu nicho'} em ${_ds.cidade||'sua cidade'}.</p>
    <div class="dr-competitive">
      <div class="dr-competitive__chart">
        <canvas id="dr-radar-chart" width="300" height="300"></canvas>
        <div class="dr-competitive__legend">
          <span><em class="dr-legend-dot" style="background:#9234EA"></em> Seu Site</span>
          <span><em class="dr-legend-dot" style="background:rgba(200,200,220,0.5)"></em> Concorrente Médio</span>
        </div>
      </div>
      <div class="dr-competitive__data">
        ${competitors.length?`<h3 class="dr-sub"><i class="ph ph-ranking"></i> Top Concorrentes</h3>
        <div class="dr-comp-table">
          ${competitors.map(c=>{
            const pct=Math.round((c.reviews/maxReviews)*100);
            return `<div class="dr-comp-row">
              <div class="dr-comp-row__info">
                <span class="dr-comp-row__name">${c.name}</span>
                <span class="dr-comp-row__rating">⭐ ${c.rating}</span>
              </div>
              <div class="dr-comp-row__bar-wrap">
                <div class="dr-comp-row__bar-track"><div style="width:${pct}%;background:rgba(146,52,234,0.65)"></div></div>
                <span class="dr-comp-row__reviews">${c.reviews} reviews</span>
              </div>
            </div>`;
          }).join('')}
        </div>`:''}
        ${total?`<div class="dr-competitive__stats">
          <div class="dr-competitive__stat"><span class="dr-competitive__stat-val">${total}</span><span>Concorrentes</span></div>
          <div class="dr-competitive__stat"><span class="dr-competitive__stat-val" style="color:#22C55E">${sem}</span><span>Sem site</span></div>
          ${rating?`<div class="dr-competitive__stat"><span class="dr-competitive__stat-val" style="color:#F97316">⭐${rating}</span><span>Rating médio</span></div>`:''}
        </div>`:''}
        ${sem>0?`<div class="dr-insight"><i class="ph ph-lightbulb"></i><span>
          <strong>${sem} concorrente${sem>1?'s':''}</strong> na sua região ainda não ${sem>1?'têm':'tem'} site — oportunidade real para quem investe em presença digital otimizada.
        </span></div>`:''}
        ${mercado.fonte?`<p class="dr-source-block"><i class="ph ph-book-open"></i> ${mercado.fonte}</p>`:''}
      </div>
    </div>
  </section>`;
}

/* ---- Plano de implementação ---- */
function _implementationPlan(probs){
  const phases=[
    {n:1,badge:'PRIORIDADE CRÍTICA',bc:'#EF4444',title:'Correção Técnica',desc:'Tags HTML, Meta Description, Schema Markup, Sitemap e erros críticos imediatos.',active:true},
    {n:2,badge:'PRIORIDADE ALTA',bc:'#22C55E',title:'Performance & SEO Local',desc:'Velocidade, Title Tag com cidade e nicho, robots.txt e HTTPS.',active:false},
    {n:3,badge:'PRIORIDADE MÉDIA',bc:'#F97316',title:'Conteúdo & Conversão',desc:'Prova social, CTAs otimizados e conteúdo localizado para maior relevância.',active:false},
    {n:4,badge:'MANUTENÇÃO',bc:'rgba(255,255,255,0.4)',title:'Escala & CRO',desc:'Testes A/B, expansão de autoridade de marca e monitoramento de resultados.',active:false},
  ];
  return `<section class="dr-sec">
    <h2 class="dr-sec__h" style="justify-content:center"><i class="ph ph-steps"></i> Plano de Implementação</h2>
    <p class="dr-muted" style="justify-content:center;margin-bottom:1.5rem"><i class="ph ph-info"></i> Sequência estratégica recomendada para maximizar resultados.</p>
    <div class="dr-plan-grid">
      ${phases.map(ph=>`<div class="dr-plan-card${ph.active?' dr-plan-card--active':''}">
        <div class="dr-plan-card__num" style="background:${ph.active?'var(--accent-purple)':ph.bc+'20'};color:${ph.active?'#fff':ph.bc}">${ph.n}</div>
        <div class="dr-plan-card__badge" style="color:${ph.bc}">${ph.badge}</div>
        <h4 class="dr-plan-card__title">${ph.title}</h4>
        <p class="dr-plan-card__desc">${ph.desc}</p>
      </div>`).join('')}
    </div>
  </section>`;
}

function _maturityBars(pnt){
  if(pnt.maturidade_score==null&&pnt.potencial_score==null) return '';
  const bar=(label,score,desc,nota)=>`<div class="dr-bar-item">
    <div class="dr-bar-head"><span>${label}</span><strong style="color:${_scoreColor(score)}">${score}/100${desc?' — '+desc:''}</strong></div>
    <div class="dr-bar-track"><div class="dr-bar-fill" style="width:${score}%;background:${_scoreColor(score)}"></div></div>
    ${nota?`<p class="dr-bar-note">${nota}</p>`:''}
  </div>`;
  return `<section class="dr-sec">
    <h2 class="dr-sec__h"><i class="ph ph-trend-up"></i> Posição Digital</h2>
    <div class="dr-bars">
      ${pnt.maturidade_score!=null?bar('Maturidade Digital',pnt.maturidade_score,pnt.maturidade_digital,'Nível de otimização técnica e presença digital.'):''}
      ${pnt.potencial_score!=null?bar('Potencial de Mercado',pnt.potencial_score,pnt.potencial_mercado,'Oportunidade de mercado na região e nicho analisados.'):''}
    </div>
    ${pnt.base_calculo?`<p class="dr-source-block" style="margin-top:.75rem"><i class="ph ph-calculator"></i> ${pnt.base_calculo}</p>`:''}
  </section>`;
}

function _fortes(list){
  return `<section class="dr-sec">
    <h2 class="dr-sec__h"><i class="ph ph-check-circle"></i> Pontos Fortes<span class="dr-badge dr-badge--green">${list.length}</span></h2>
    <div class="dr-fortes-grid">
      ${list.map(f=>{
        if(typeof f==='string') return `<div class="dr-forte-card"><i class="ph ph-check-fat"></i><span>${f}</span></div>`;
        return `<div class="dr-forte-card"><div class="dr-forte-card__top"><i class="ph ph-check-fat"></i><strong>${f.titulo||f.item||''}</strong></div>${f.descricao?`<p>${f.descricao}</p>`:''}</div>`;
      }).join('')}
    </div>
  </section>`;
}

function _recos(list){
  if(!list||!list.length) return '';
  return `<section class="dr-sec">
    <h2 class="dr-sec__h"><i class="ph ph-list-checks"></i> Oportunidades Estratégicas</h2>
    <p class="dr-muted"><i class="ph ph-info"></i> Estratégias baseadas em análise de concorrência, performance e mercado.</p>
    <ol class="dr-reco-list">
      ${list.map((r,i)=>{
        const text=typeof r==='string'?r:(r.text||r.acao||String(r));
        return `<li class="dr-reco-item"><span class="dr-reco-num">${i+1}</span><p>${text}</p></li>`;
      }).join('')}
    </ol>
  </section>`;
}

/* ---- Tab Técnica ---- */
function _tabTech(relTec,pnt,meta){
  const psi=relTec.pagespeed||{};
  const dados=relTec.dados_site||{};
  const seo=relTec.seo_files||{};
  const sec=relTec.security_headers||{};
  const dmkt=relTec.dados_mercado||{};

  const ok=(v)=>v?'<span class="c-ok">✓ Sim</span>':'<span class="c-fail">✗ Não</span>';
  const pr=(v)=>v?'<span class="c-ok">✓ Presente</span>':'<span class="c-fail">✗ Ausente</span>';

  const h=dados.headings||{};
  const img=dados.images||{};
  const contact=dados.contact||{};
  const schema=dados.schema||{};
  const conv=dados.conversion||{};
  const links=dados.links||{};
  const tech=dados.technology||{};
  const perf=dados.performance||{};

  const cwv=[
    {l:'FCP',v:psi.fcp},{l:'LCP',v:psi.lcp},{l:'TBT',v:psi.tbt},
    {l:'CLS',v:psi.cls},{l:'Speed Index',v:psi.speed_index},{l:'TTI',v:psi.tti},
  ].filter(m=>m.v&&m.v!=='N/A');

  const shList=[
    {k:'has_hsts',l:'HSTS',d:'Força HTTPS'},
    {k:'has_x_frame_options',l:'X-Frame-Options',d:'Anti-clickjacking'},
    {k:'has_csp',l:'Content-Security-Policy',d:'Anti-XSS'},
    {k:'has_x_content_type',l:'X-Content-Type-Options',d:'Anti-MIME sniffing'},
    {k:'has_referrer_policy',l:'Referrer-Policy',d:'Controle de referência'},
    {k:'has_permissions_policy',l:'Permissions-Policy',d:'Controle de APIs'},
  ];

  const table=(rows)=>`<div class="dr-table-wrap"><table class="dr-table"><tbody>
    ${rows.filter(Boolean).map(([k,v,note])=>`<tr>
      <td class="dr-table__key">${k}</td>
      <td class="dr-table__val">${v}</td>
      ${note!==undefined?`<td class="dr-table__note">${note||''}</td>`:''}
    </tr>`).join('')}
  </tbody></table></div>`;

  const sec_total=shList.filter(s=>sec[s.k]).length;

  const scoringData=relTec.scoring_detalhado||relTec.scoring||pnt.scoring_detalhado||{};
  const scoringEntries=Object.entries(scoringData).filter(([,v])=>v!=null);
  const scoringSection=scoringEntries.length?`<section class="dr-sec">
    <h2 class="dr-sec__h"><i class="ph ph-calculator"></i> Scoring Detalhado</h2>
    <div class="dr-scoring">
      ${scoringEntries.map(([cat,data])=>{
        let score=0,maxScore=100;
        if(typeof data==='number'){score=data;maxScore=100;}
        else if(typeof data==='object'){
          score=data.score??data.pontuacao??data.valor??0;
          maxScore=data.maxScore??data.max??data.total??100;
        }
        const pct=maxScore>0?Math.round(score/maxScore*100):0;
        const col=_scoreColor(pct);
        const label=cat.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
        return `<div class="dr-scoring__row">
          <span class="dr-scoring__label">${label}</span>
          <div class="dr-scoring__bar"><div style="width:${pct}%;background:${col}"></div></div>
          <span class="dr-scoring__val" style="color:${col}">${score}/${maxScore}</span>
        </div>`;
      }).join('')}
    </div>
  </section>`:'';

  return `
    <section class="dr-sec">
      <h2 class="dr-sec__h"><i class="ph ph-magnifying-glass"></i> Metodologia de Análise</h2>
      <div class="dr-prose-block">
        <p><strong>Google Maps Places API:</strong> Mapeamos concorrentes locais, avaliações e presença digital.</p>
        <p><strong>Google PageSpeed Insights API v5:</strong> Métricas de performance, SEO, acessibilidade e boas práticas.</p>
        <p><strong>OpenAI:</strong> Análises estratégicas, recomendações e diagnósticos de conteúdo.</p>
        <p><strong>Scraping HTML:</strong> Dados técnicos, estrutura on-page, segurança e conversão.</p>
        <p><strong>Security Headers:</strong> Verificação de cabeçalhos de segurança HTTP.</p>
      </div>
    </section>

    <section class="dr-sec">
      <h2 class="dr-sec__h"><i class="ph ph-gauge"></i> Google PageSpeed — Dados Completos</h2>
      ${!psi.error&&psi.performance!=null?`
      <div class="dr-psi">
        ${[{l:'Performance',v:psi.performance,i:'ph-gauge'},{l:'SEO',v:psi.seo,i:'ph-magnifying-glass'},{l:'Acessibilidade',v:psi.acessibilidade,i:'ph-eye'},{l:'Boas Práticas',v:psi.melhores_praticas,i:'ph-check-square'}]
          .map(c=>{const v=c.v??0,col=_scoreColor(v);return `<div class="dr-psi__card">
            <i class="ph ${c.i}" style="color:${col}"></i>
            <span class="dr-psi__score" style="color:${col}">${v}</span>
            <span class="dr-psi__label">${c.l}</span>
            <div class="dr-psi__bar"><div style="width:${Math.min(100,v)}%;background:${col}"></div></div>
          </div>`;}).join('')}
      </div>
      ${cwv.length?`<h3 class="dr-sub"><i class="ph ph-timer"></i> Core Web Vitals</h3>
      <div class="dr-cwv">${cwv.map(m=>`<div class="dr-cwv__item">
        <span class="dr-cwv__label">${m.l}</span><span class="dr-cwv__val">${m.v}</span>
      </div>`).join('')}</div>`:''}
      ${psi.tamanho_pagina_kb!=null?table([
        ['Tamanho da página',psi.tamanho_pagina_kb+' KB'],
        psi.numero_requisicoes!=null?['Requisições HTTP',psi.numero_requisicoes]:null,
        psi.servidor!=null?['Servidor',psi.servidor]:null,
        psi.protocolo!=null?['Protocolo',psi.protocolo]:null,
      ]):''}`
      :`<div class="dr-notice-warn"><i class="ph ph-warning"></i> ${psi.error||'Dados do PageSpeed não disponíveis.'}</div>`}
      <p class="dr-source-block"><i class="ph ph-book-open"></i> Fonte: Google PageSpeed Insights API</p>
    </section>

    <section class="dr-sec">
      <h2 class="dr-sec__h"><i class="ph ph-file-code"></i> Arquivos SEO</h2>
      ${table([
        ['robots.txt',pr(seo.robots_txt_exists),'Permite ou bloqueia indexação'],
        ['sitemap.xml',pr(seo.sitemap_exists),'Facilita descoberta de páginas'],
        ['HTTPS ativo',ok(seo.https_active),'Segurança e ranking no Google'],
        seo.canonical_url?['Canonical URL',`<code class="dr-icode">${seo.canonical_url}</code>`,'']:null,
        seo.meta_robots?['Meta robots',`<code class="dr-icode">${seo.meta_robots}</code>`,'']:null,
        seo.lang?['Idioma',seo.lang,'']:null,
        seo.structured_data_types&&seo.structured_data_types.length?['Schema.org',seo.structured_data_types.join(', '),'']:null,
      ])}
      <p class="dr-source-block"><i class="ph ph-book-open"></i> Fonte: Análise direta do site</p>
    </section>

    ${dados.title||h.h1Count!=null?`<section class="dr-sec">
      <h2 class="dr-sec__h"><i class="ph ph-code"></i> Estrutura On-Page</h2>
      ${table([
        dados.title?['Title',`<code class="dr-icode">${dados.title}</code>`,dados.title_length!=null?dados.title_length+' chars':'']:null,
        dados.meta_description?['Meta description',`<code class="dr-icode">${dados.meta_description.slice(0,80)}${dados.meta_description.length>80?'…':''}</code>`,dados.meta_description_length!=null?dados.meta_description_length+' chars':'']:null,
        h.h1Count!=null?['Tags H1',h.h1Count,'Ideal: apenas 1']:null,
        h.h2Count!=null?['Tags H2',h.h2Count,'']:null,
        h.isHierarchical!=null?['Hierarquia de headings',ok(h.isHierarchical),'']:null,
        img.totalImages!=null?['Total de imagens',img.totalImages,'']:null,
        img.imagesWithoutAlt!=null?['Imagens sem alt',img.imagesWithoutAlt,img.imagesWithoutAlt>0?'<span class="c-fail">Problema de acessibilidade</span>':'<span class="c-ok">OK</span>']:null,
        img.imagesWithLazyLoad!=null?['Lazy load',img.imagesWithLazyLoad+' imagens','']:null,
        links.internalLinks!=null?['Links internos',links.internalLinks,'']:null,
        links.externalLinks!=null?['Links externos',links.externalLinks,'']:null,
        links.brokenLinks!=null?['Links quebrados',links.brokenLinks,links.brokenLinks>0?'<span class="c-fail">Problema</span>':'<span class="c-ok">OK</span>']:null,
        perf.hasCssMinification!=null?['CSS minificado',ok(perf.hasCssMinification),'']:null,
        perf.hasJsMinification!=null?['JS minificado',ok(perf.hasJsMinification),'']:null,
        perf.hasGzip!=null?['Compressão Gzip/Brotli',ok(perf.hasGzip),'']:null,
        tech.cms?['CMS detectado',tech.cms,'']:null,
        tech.framework?['Framework',tech.framework,'']:null,
      ])}
    </section>`:''}

    ${contact.hasPhone!=null||conv.hasCTA!=null?`<section class="dr-sec">
      <h2 class="dr-sec__h"><i class="ph ph-phone"></i> Conversão e Contato</h2>
      ${table([
        contact.hasPhone!=null?['Telefone visível',ok(contact.hasPhone),'']:null,
        contact.hasWhatsApp!=null?['WhatsApp',ok(contact.hasWhatsApp),'']:null,
        contact.hasEmail!=null?['E-mail de contato',ok(contact.hasEmail),'']:null,
        contact.hasAddress!=null?['Endereço',ok(contact.hasAddress),'']:null,
        conv.hasCTA!=null?['Botão CTA',ok(conv.hasCTA),'Ex: "Fale conosco", "Solicite orçamento"']:null,
        conv.hasForm!=null?['Formulário de contato',ok(conv.hasForm),'']:null,
        schema.hasLocalBusiness!=null?['Schema LocalBusiness',ok(schema.hasLocalBusiness),'Dados estruturados para SEO local']:null,
        schema.hasOpenGraph!=null?['Open Graph (redes sociais)',ok(schema.hasOpenGraph),'']:null,
      ])}
    </section>`:''}

    <section class="dr-sec">
      <h2 class="dr-sec__h"><i class="ph ph-shield-check"></i> Cabeçalhos de Segurança
        <span class="dr-badge" style="background:${_scoreColor(Math.round(sec_total/shList.length*100))}22;color:${_scoreColor(Math.round(sec_total/shList.length*100))}">${sec_total}/${shList.length}</span>
      </h2>
      <div class="dr-sec-grid">
        ${shList.map(s=>{
          const has=!!sec[s.k];
          return `<div class="dr-sec-item ${has?'dr-sec-item--ok':'dr-sec-item--fail'}">
            <div class="dr-sec-item__icon"><i class="ph ${has?'ph-shield-check':'ph-shield-warning'}"></i></div>
            <div><strong>${s.l}</strong><span>${s.d}</span></div>
          </div>`;
        }).join('')}
      </div>
      <p class="dr-source-block"><i class="ph ph-book-open"></i> Fonte: HTTP Headers Analysis</p>
    </section>

    ${dmkt.total_concorrentes!=null?`<section class="dr-sec">
      <h2 class="dr-sec__h"><i class="ph ph-map-trifold"></i> Dados de Mercado
        <span class="dr-muted-inline">Google Maps Places API</span></h2>
      ${table([
        ['Concorrentes mapeados',dmkt.total_concorrentes,''],
        dmkt.concorrentes_com_site!=null?['Com website',dmkt.concorrentes_com_site,'']:null,
        dmkt.concorrentes_sem_site!=null?['Sem website',dmkt.concorrentes_sem_site,'']:null,
        dmkt.percentual_sem_site!=null?['% sem website',dmkt.percentual_sem_site+'%','']:null,
        dmkt.media_avaliacoes!=null?['Avaliações médias',dmkt.media_avaliacoes,'']:null,
        dmkt.raio_busca_km!=null?['Raio de busca',dmkt.raio_busca_km+' km','']:null,
      ])}
      <p class="dr-source-block"><i class="ph ph-book-open"></i> Fonte: Google Maps Places API</p>
    </section>`:''}

    ${scoringSection}

    ${relTec.auditoria_tecnica&&typeof relTec.auditoria_tecnica==='string'?`<section class="dr-sec">
      <h2 class="dr-sec__h"><i class="ph ph-file-text"></i> Diagnóstico Técnico</h2>
      <div class="dr-prose-block dr-content-rendered">${_md2html(relTec.auditoria_tecnica)}</div>
    </section>`:''}
    ${relTec.auditoria_conteudo&&typeof relTec.auditoria_conteudo==='string'?`<section class="dr-sec">
      <h2 class="dr-sec__h"><i class="ph ph-article"></i> Diagnóstico de Conteúdo</h2>
      <div class="dr-prose-block dr-content-rendered">${_md2html(relTec.auditoria_conteudo)}</div>
    </section>`:''}
    ${relTec.auditoria_ux&&typeof relTec.auditoria_ux==='string'?`<section class="dr-sec">
      <h2 class="dr-sec__h"><i class="ph ph-cursor-click"></i> Diagnóstico de UX</h2>
      <div class="dr-prose-block dr-content-rendered">${_md2html(relTec.auditoria_ux)}</div>
    </section>`:''}
    ${relTec.analise_mercado&&typeof relTec.analise_mercado==='string'?`<section class="dr-sec">
      <h2 class="dr-sec__h"><i class="ph ph-buildings"></i> Análise de Mercado Detalhada</h2>
      <div class="dr-prose-block dr-content-rendered">${_md2html(relTec.analise_mercado)}</div>
    </section>`:''}
  `;
}

/* ---- CTA com foto da Ivie ---- */
function _cta(probs,pnt){
  const altos=(probs||[]).filter(p=>(p.prioridade||'').toLowerCase()==='alta').length;
  const urgente=(pnt.nivel_urgencia||'').toUpperCase().includes('CRÍT')||(pnt.nivel_urgencia||'').toUpperCase()==='ALTO';
  const score=pnt.geral??0;
  return `<div class="dr-cta-footer">
    <div class="dr-cta-footer__badge"><i class="ph ph-star"></i> Especialista em Presença Digital</div>
    <h2 class="dr-cta-footer__title">Seu site está <span>perdendo clientes</span> todos os dias.</h2>
    <p class="dr-cta-footer__sub">
      Este diagnóstico mostra apenas a superfície. Vamos transformar esses <strong>${score} pontos</strong> em uma máquina de conversão?
      ${urgente&&altos>0?` Identifiquei <strong>${altos} problema${altos>1?'s':''} de alta prioridade</strong> que custam clientes ao seu negócio diariamente.`:''}
    </p>
    <div class="dr-cta-footer__body">
      <div class="dr-cta-footer__profile">
        <img src="/img/ivieximenes.jpg" alt="Ivie Ximenes — Especialista em Estratégia Digital" class="dr-cta-footer__photo">
        <div class="dr-cta-footer__profile-info">
          <strong class="dr-cta-footer__profile-name">Ivie Ximenes</strong>
          <span class="dr-cta-footer__profile-role">Especialista em Estratégia Digital &amp; Auditoria de Performance</span>
          <div class="dr-cta-footer__social">
            <a href="https://wa.me/5521999999999?text=Ol%C3%A1%20Ivie!%20Fiz%20o%20diagn%C3%B3stico%20do%20meu%20site%20e%20gostaria%20de%20conversar%20sobre%20as%20melhorias."
               target="_blank" rel="noopener" class="dr-social-btn dr-social-btn--wa" title="WhatsApp">
              <i class="ph ph-whatsapp-logo"></i>
            </a>
            <a href="https://www.linkedin.com/in/ivieximenes/"
               target="_blank" rel="noopener" class="dr-social-btn dr-social-btn--li" title="LinkedIn">
              <i class="ph ph-linkedin-logo"></i>
            </a>
            <a href="https://instagram.com/ivieximenes"
               target="_blank" rel="noopener" class="dr-social-btn dr-social-btn--ig" title="Instagram">
              <i class="ph ph-instagram-logo"></i>
            </a>
          </div>
        </div>
      </div>
      <div class="dr-cta-footer__actions">
        <a href="https://wa.me/5521999999999?text=Ol%C3%A1%20Ivie!%20Gostaria%20de%20solicitar%20uma%20consultoria."
           target="_blank" rel="noopener" class="btn btn--primary dr-cta-btn--main">
          <i class="ph ph-rocket-launch"></i> SOLICITAR CONSULTORIA
        </a>
        <a href="/projetos" class="btn btn--ghost dr-cta-btn--secondary" data-route="/projetos">
          Ver Case de Sucesso
        </a>
      </div>
    </div>
    <p class="dr-cta-footer__fine">
      <i class="ph ph-lock"></i> Seus dados são usados apenas para este diagnóstico. Sem spam, sem compromisso. Respondo em até 24h úteis.
    </p>
  </div>`;
}

/* ---- Result listeners ---- */
function _resultListeners(){
  document.getElementById('diag-print-tech')?.addEventListener('click',()=>_printReport('tech'));
  document.getElementById('diag-print-client')?.addEventListener('click',()=>_printReport('cliente'));

  /* Init radar chart após DOM render */
  const raw=_ds.resultData;
  const report=raw?.auditReport||raw;
  if(report){
    const pnt=report.pontuacao||{};
    const relCli=report.relatorio_cliente||{};
    const psi=relCli.pagespeed_simplificado||{};
    setTimeout(()=>_initCharts(pnt,psi),150);
  }

  document.querySelectorAll('[data-route]').forEach(el=>{
    el.addEventListener('click',e=>{
      e.preventDefault();
      const route=el.getAttribute('data-route');
      if(route==='/ferramentas/diagnostico'){
        if(_ds.resendTimer) clearInterval(_ds.resendTimer);
        initToolDiagnostico();
      }else if(window.router?.navigate){
        window.router.navigate(route);
      }
    });
  });
}

/* ---- Print Report — mostra apenas o painel correto ---- */
function _printReport(type){
  const clientPanel=document.getElementById('drp-cliente');
  const techPanel=document.getElementById('drp-tech');
  const ctaEl=document.querySelector('.dr-cta-footer');

  const prevClient=clientPanel?.style.display||'block';
  const prevTech=techPanel?.style.display||'none';
  const prevCta=ctaEl?.style.display||'';

  if(type==='cliente'){
    if(clientPanel) clientPanel.style.display='block';
    if(techPanel)   techPanel.style.display='none';
    if(ctaEl)       ctaEl.style.display='block';
  }else{
    if(clientPanel) clientPanel.style.display='none';
    if(techPanel)   techPanel.style.display='block';
    if(ctaEl)       ctaEl.style.display='none';
  }

  window.print();

  setTimeout(()=>{
    if(clientPanel) clientPanel.style.display=prevClient;
    if(techPanel)   techPanel.style.display=prevTech;
    if(ctaEl)       ctaEl.style.display=prevCta;
  },1000);
}