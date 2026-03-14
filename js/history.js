// ═══════ HISTORY DB INIT ════════════════════════════════════════════════════
try{historyDB=JSON.parse(localStorage.getItem('drps_hist')||'[]');}catch(e){historyDB=[];}
function saveHistory(){try{localStorage.setItem('drps_hist',JSON.stringify(historyDB));}catch(e){}}

// ═══════ HISTORY FUNCTIONS ══════════════════════════════════════════════════
function saveToHistory(){
  if(!G.meta)return;
  const entry={
    id:Date.now(),
    empresa:G.meta.empresa,unidade:G.meta.unidade,periodo:G.meta.periodo,
    inst:G.inst,n:G.n,
    avgScore:avg(G.factorScores).toFixed(1),
    topFactor:INSTRUMENTS[G.inst].factors[G.factorScores.indexOf(Math.max(...G.factorScores))]?.name||'—',
    nps:G.nps.score.toFixed(1),
    timestamp:new Date().toLocaleString('pt-BR'),
    data:JSON.parse(JSON.stringify({G,fontes:[...fontes],selActs:[...selActs]}))
  };
  historyDB.unshift(entry);
  if(historyDB.length>50)historyDB.pop();
  saveHistory();
  buildHistView();
  alert('Relatório salvo no histórico! ✓');
}

function buildHistView(){
  const el=document.getElementById('hist-list');
  if(!historyDB.length){el.innerHTML=`<div class="hist-empty">📂 Nenhum relatório salvo ainda.<br><span style="font-size:11px">Use o botão "💾 Salvar" para guardar o relatório atual.</span></div>`;return;}
  el.innerHTML=historyDB.map(h=>`
    <div class="hist-card">
      <div class="hist-info">
        <div class="hist-title">${h.empresa} · ${h.unidade}</div>
        <div class="hist-meta">${h.periodo} · ${INSTRUMENTS[h.inst]?.short||h.inst} · ${h.n} respondentes · ${h.timestamp}</div>
      </div>
      <div class="hist-scores">
        <div class="hist-score-item" style="color:${+h.avgScore<50?'#10b981':+h.avgScore<75?'#f59e0b':'#ef4444'}">Média: ${h.avgScore}%</div>
        <div class="hist-score-item" style="color:#10b981">NPS: ${h.nps}</div>
      </div>
      <div class="hist-acts">
        <button class="hist-btn" onclick="loadFromHistory(${h.id})">↩ Carregar</button>
        <button class="hist-btn del" onclick="deleteFromHistory(${h.id})">✕</button>
      </div>
    </div>`).join('');
}

function loadFromHistory(id){
  const entry=historyDB.find(h=>h.id===id);
  if(!entry)return;
  G=entry.data.G;
  fontes=entry.data.fontes;
  selActs=new Set(entry.data.selActs);
  INST=G.inst;
  document.getElementById('upl').style.display='none';
  document.getElementById('app').style.display='block';
  document.getElementById('nav-inst').textContent=INSTRUMENTS[G.inst]?.short||G.inst;
  document.getElementById('nav-meta').textContent=`${G.meta.empresa} · ${G.meta.unidade} · ${G.meta.periodo} · ${G.n} respondentes`;
  buildDash();buildFat();buildDemo();buildFontesEd();buildActPanel();buildReport();buildHistView();buildTemplateGrid();
  switchTab('dash');
}

function deleteFromHistory(id){
  if(!confirm('Excluir este relatório do histórico?'))return;
  historyDB=historyDB.filter(h=>h.id!==id);
  saveHistory();buildHistView();
}

function clearHistory(){
  if(!confirm('Excluir TODOS os relatórios salvos?'))return;
  historyDB=[];saveHistory();buildHistView();
}
