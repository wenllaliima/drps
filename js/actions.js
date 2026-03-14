function buildActPanel(){
  const inst=INSTRUMENTS[G.inst];
  const relevantF=[...new Set(ALIB.map(a=>a.f))].filter(f=>f<inst.factors.length);
  document.getElementById('act-filter').innerHTML=`<button class="af-btn active" onclick="filtAct('all',this)">Todos</button>`+relevantF.map(f=>`<button class="af-btn" onclick="filtAct(${f},this)">${inst.factors[f]?.name||'Fator '+f}</button>`).join('');
  renderActs('all');
}
function filtAct(f,btn){document.querySelectorAll('.af-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderActs(f);}
function renderActs(filter){
  const inst=INSTRUMENTS[G.inst];
  const topF=G.factorScores.map((s,i)=>({s,i})).sort((a,b)=>b.s-a.s).slice(0,4).map(x=>x.i);
  const list=filter==='all'?ALIB:ALIB.filter(a=>a.f===filter);
  document.getElementById('act-list').innerHTML=list.map(a=>{
    const gi=ALIB.indexOf(a);const isSel=selActs.has(gi);
    const isSug=topF.includes(a.f)&&a.lv==='baixa'&&a.f<inst.factors.length;
    const lvc=a.lv==='baixa'?'lv-b':a.lv==='média'?'lv-m':'lv-a';
    const fn=inst.factors[a.f]?.name||'Fator '+(a.f+1);
    return `<div class="action-item ${isSel?'selected':''}" id="ai-${gi}" onclick="togAct(${gi})"><div class="action-check">✓</div><div class="a-risk">${fn}${isSug?' ★ SUGERIDA':''}</div><div class="a-type">${a.type} · Para: ${a.target}</div><div class="a-title">${a.title}</div><div class="a-desc">${a.desc}</div><span class="a-level ${lvc}">Complexidade: ${a.lv.charAt(0).toUpperCase()+a.lv.slice(1)}</span>${isSug?`<div class="a-sug">★ Score: ${pct(G.factorScores[a.f])}</div>`:''}</div>`;
  }).join('');
}
function togAct(idx){if(selActs.has(idx))selActs.delete(idx);else selActs.add(idx);const el=document.getElementById('ai-'+idx);if(el)el.classList.toggle('selected',selActs.has(idx));buildReport();}

async function generateSectorActionPlan(){
  const inst=INSTRUMENTS[G.inst];
  const sectors=Object.keys(G.sectorScores||{});
  const area=document.getElementById('ai-plan-area');
  const btn=document.getElementById('ai-plan-btn');

  if(!sectors.length){
    area.innerHTML='<p style="color:#f87171;font-size:12px">⚠️ Setor não detectado na planilha.</p>';
    return;
  }

  // Ask for API key if not stored
  let apiKey = sessionStorage.getItem('drps_groq_key')||'';
  if(!apiKey){
    area.innerHTML=`
      <div style="background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.3);border-radius:8px;padding:12px 14px;font-size:12px;color:var(--tx);line-height:1.6">
        <div style="font-weight:700;color:#fbbf24;margin-bottom:6px">🔑 Chave de API Groq necessária</div>
        <div style="color:var(--mu);margin-bottom:9px;font-size:11px">A geração por IA requer uma chave da API Groq (gratuita). Ela fica salva <strong>apenas nesta sessão</strong> e não é enviada para nenhum servidor além da Groq.</div>
        <div style="display:flex;gap:8px;align-items:center">
          <input id="api-key-input" type="password" placeholder="sk-ant-..."
            style="flex:1;background:var(--sf);border:1px solid var(--bd);border-radius:6px;padding:7px 10px;color:var(--tx);font-family:'DM Mono',monospace;font-size:11px"
            onkeydown="if(event.key==='Enter')confirmApiKey()">
          <button class="bs p" onclick="confirmApiKey()" style="padding:7px 14px;font-size:11px">Confirmar</button>
        </div>
        <div style="font-size:10px;color:var(--mu);margin-top:7px">
          Obtenha sua chave <strong>gratuitamente</strong> em <a href="https://console.groq.com" target="_blank" style="color:var(--ac)">console.groq.com</a>
        </div>
      </div>`;
    return;
  }

  btn.disabled=true; btn.textContent='⏳ Gerando…';
  area.innerHTML='<div style="text-align:center;padding:18px;color:var(--mu);font-size:12px">🤖 Analisando perfil de risco por setor…</div>';

  const sectorSummary=sectors.map(s=>{
    const sc=G.sectorScores[s];
    const top3=sc.map((v,i)=>({v:v??0,n:inst.factors[i]?.name||'F'+(i+1)}))
               .sort((a,b)=>b.v-a.v).slice(0,3);
    return `${s} (N=${G.demo.setor[s]||0}): ${top3.map(x=>`${x.n} ${x.v.toFixed(1)}%`).join(', ')}`;
  }).join('\n');

  const ramo = G.meta.ramo || 'não informado';
  const prompt=`Você é especialista em saúde ocupacional, riscos psicossociais e NR-1.

Empresa: ${G.meta.empresa} | Unidade: ${G.meta.unidade} | Instrumento: ${inst.name}
Ramo/Setor de atuação da empresa: ${ramo}
Respondentes: ${G.n} | Período: ${G.meta.periodo}

PERFIL DE RISCO POR SETOR (score 0-100%, maior = mais risco):
${sectorSummary}

SCORES GERAIS:
${inst.factors.map((f,i)=>`${f.name}: ${G.factorScores[i].toFixed(1)}%`).join('\n')}

INSTRUÇÕES CRÍTICAS PARA O PLANO DE AÇÃO:
- A empresa atua no ramo: ${ramo}. Leve isso em conta em TODAS as ações.
- Alguns riscos são INERENTES ao ramo (ex: Baixo Controle é estrutural em Construção Civil, Exigências Emocionais são estruturais em Saúde). Para esses, NÃO proponha eliminar o risco, mas sim MITIGAR o impacto e aumentar a resiliência/recursos dos trabalhadores.
- Indique explicitamente quando um risco é inerente ao setor e ajuste a ação de acordo.
- As ações devem ser VIÁVEIS para o ramo (ex: em Construção Civil, evite ações que exijam pausas longas ou salas de descanso que o canteiro não tem; em Saúde, considere turnos e plantões).
- Seja específico: mencione o ramo e o setor da empresa nas descrições das ações.

Para cada setor:
1. Identifique 2-3 principais fatores de risco (indique se é inerente ao ramo)
2. Proponha 3 intervenções VIÁVEIS e ESPECÍFICAS para aquele setor e ramo
3. Prazo: Imediato (0-30 dias), Curto prazo (1-3 meses) ou Médio prazo (3-6 meses)
4. Responsável: Liderança / RH / SST / Psicólogo / Gestão

Responda APENAS com JSON válido, sem nenhum texto antes ou depois:
{
  "setores": [
    {
      "nome": "Nome do Setor",
      "n": número,
      "media_risco": número,
      "principais_riscos": ["Fator A - XX%", "Fator B - XX%"],
      "acoes": [
        {
          "titulo": "Título objetivo",
          "descricao": "Descrição concreta para este setor específico",
          "prazo": "Imediato",
          "responsavel": "Quem executa",
          "justificativa": "Por que esta ação para este setor"
        }
      ]
    }
  ]
}`;

  try{
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer '+apiKey
      },
      body:JSON.stringify({
        model:'llama-3.3-70b-versatile',
        max_tokens:4000,
        temperature:0.4,
        messages:[
          {role:'system',content:'Você é especialista em saúde ocupacional, riscos psicossociais e NR-1. Responda APENAS com JSON válido, sem nenhum texto antes ou depois.'},
          {role:'user',content:prompt}
        ]
      })
    });

    if(!resp.ok){
      const err=await resp.json().catch(()=>({error:{message:resp.statusText}}));
      const msg=err?.error?.message||resp.statusText;
      if(resp.status===401){
        sessionStorage.removeItem('drps_groq_key');
        throw new Error('Chave de API inválida. Clique em "Gerar Plano por IA" novamente para inserir uma chave válida.');
      }
      throw new Error(msg);
    }

    const data=await resp.json();
    const text=data.choices?.[0]?.message?.content||'';
    const clean=text.replace(/```json|```/g,'').trim();
    sectorActions=JSON.parse(clean);
    renderSectorActionPlan();
    buildReport();

  }catch(err){
    area.innerHTML=`<div style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:11px 14px;font-size:12px;color:#f87171;line-height:1.6">
      <strong>⚠️ Erro:</strong> ${err.message}
    </div>`;
  }finally{
    btn.disabled=false; btn.textContent='🤖 Gerar Plano por IA';
  }
}

function confirmApiKey(){
  const v=document.getElementById('api-key-input')?.value?.trim();
  if(!v||v.length<20){
    alert('Chave inválida.');
    return;
  }
  sessionStorage.setItem('drps_groq_key',v);
  document.getElementById('ai-plan-area').innerHTML='';
  generateSectorActionPlan();
}

function renderSectorActionPlan(){
  if(!sectorActions?.setores?.length)return;
  const colors=['#4f8ef7','#7c5cfc','#22c55e','#06b6d4','#f59e0b','#ec4899','#10b981','#f97316'];
  const prazoColor={'Imediato':'#ef4444','Curto prazo':'#f59e0b','Médio prazo':'#3b82f6'};
  document.getElementById('ai-plan-area').innerHTML=sectorActions.setores.map((s,si)=>`
    <div style="background:var(--sf2);border:1px solid var(--bd);border-radius:10px;padding:14px 16px;margin-bottom:10px;border-left:3px solid ${colors[si%colors.length]}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:6px">
        <div style="font-weight:700;font-size:13px;color:${colors[si%colors.length]}">${s.nome}</div>
        <div style="display:flex;gap:6px;align-items:center">
          <span style="font-size:11px;color:var(--mu)">${s.n} respondentes</span>
          <span style="font-family:'DM Mono',monospace;font-size:11px;font-weight:600;color:${s.media_risco<50?'#10b981':s.media_risco<75?'#f59e0b':'#ef4444'}">${(+s.media_risco||0).toFixed(1)}%</span>
        </div>
      </div>
      <div style="font-size:10px;color:var(--mu);margin-bottom:10px">⚑ Principais riscos: ${s.principais_riscos?.join(' · ')||'—'}</div>
      ${(s.acoes||[]).map(a=>`
        <div style="background:var(--sf);border:1px solid var(--bd);border-radius:7px;padding:10px 12px;margin-bottom:7px">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:4px;flex-wrap:wrap">
            <div style="font-size:12px;font-weight:600">${a.titulo}</div>
            <div style="display:flex;gap:5px;flex-shrink:0;flex-wrap:wrap">
              <span style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:20px;background:${(prazoColor[a.prazo]||'#3b82f6')}22;color:${prazoColor[a.prazo]||'#3b82f6'};border:1px solid ${prazoColor[a.prazo]||'#3b82f6'}44">${a.prazo}</span>
              <span style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:20px;background:rgba(0,212,170,.1);color:#00d4aa;border:1px solid rgba(0,212,170,.2)">${a.responsavel}</span>
            </div>
          </div>
          <div style="font-size:11px;color:var(--mu);line-height:1.5;margin-bottom:3px">${a.descricao}</div>
          ${a.justificativa?`<div style="font-size:10px;color:#4f8ef7;font-style:italic;margin-top:3px">💡 ${a.justificativa}</div>`:''}
        </div>`).join('')}
    </div>`).join('');
}

function sectorActionPlanHtml(){
  if(!sectorActions?.setores?.length)return'<p style="font-size:12px;color:#888;font-style:italic">Clique em "Gerar Plano por IA" na aba Ações para gerar um plano personalizado por setor.</p>';
  const prazoColor={'Imediato':'#B71C1C','Curto prazo':'#E65100','Médio prazo':'#1565C0'};
  const prazoFg={'Imediato':'#ffebee','Curto prazo':'#fff3e0','Médio prazo':'#e3f2fd'};
  return sectorActions.setores.map(s=>`
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;margin-bottom:12px;break-inside:avoid">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;border-bottom:1px solid #e2e8f0;padding-bottom:7px">
        <div style="font-weight:700;font-size:12px;color:#0d2137">${s.nome}</div>
        <div style="display:flex;gap:8px;align-items:center">
          <span style="font-size:10px;color:#64748b">${s.n} respondentes</span>
          <span style="font-family:monospace;font-size:11px;font-weight:700;color:${(+s.media_risco||0)<50?'#15803d':(+s.media_risco||0)<75?'#854d0e':'#991b1b'}">${(+s.media_risco||0).toFixed(1)}% médio</span>
        </div>
      </div>
      <div style="font-size:10px;color:#64748b;margin-bottom:9px">Maiores riscos: ${s.principais_riscos?.join(' · ')||'—'}</div>
      ${(s.acoes||[]).map(a=>`
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:9px 11px;margin-bottom:6px;border-left:3px solid ${prazoColor[a.prazo]||'#1565C0'}">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:6px;margin-bottom:4px">
            <span style="font-size:11px;font-weight:700;color:#1e293b">${a.titulo}</span>
            <div style="display:flex;gap:4px;flex-shrink:0">
              <span style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:10px;background:${prazoFg[a.prazo]||'#e3f2fd'};color:${prazoColor[a.prazo]||'#1565C0'}">${a.prazo}</span>
              <span style="font-size:9px;padding:2px 6px;border-radius:10px;background:#f1f5f9;color:#475569">${a.responsavel}</span>
            </div>
          </div>
          <div style="font-size:11px;color:#555;line-height:1.5">${a.descricao}</div>
          ${a.justificativa?`<div style="font-size:10px;color:#1565C0;font-style:italic;margin-top:3px">💡 ${a.justificativa}</div>`:''}
        </div>`).join('')}
    </div>`).join('');
}
