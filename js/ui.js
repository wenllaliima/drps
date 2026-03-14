// ═══════ APP BUILDER ════════════════════════════════════════════
function buildApp(){
  document.getElementById('upl').style.display='none';
  document.getElementById('app').style.display='block';
  const inst=INSTRUMENTS[G.inst];
  document.getElementById('nav-inst').textContent=inst.short;
  document.getElementById('nav-meta').textContent=`${G.meta.empresa}${G.meta.ramo?' ('+G.meta.ramo+')':''} · ${G.meta.unidade} · ${G.meta.periodo} · ${G.n} respondentes`;
  buildDash();buildFat();buildDemo();buildFontesEd();buildActPanel();buildReport();buildHistView();buildTemplateGrid();
}

function buildFontesEd(){
  const inst=INSTRUMENTS[G.inst];
  const srt=G.factorScores.map((s,i)=>({s,i})).sort((a,b)=>b.s-a.s);
  document.getElementById('fontes-ed').innerHTML=srt.map(({s,i})=>`<div class="fe"><div class="fe-f">${inst.factors[i].name} <span style="font-size:10px;color:var(--mu);font-weight:400">${pct(s)} · ${classif(s)} · ${sevEng(s)}</span></div><div class="fe-lbl">Fonte Geradora (destaque amarelo no relatório)</div><textarea class="fe-inp" rows="2" onchange="updFonte(${i},this.value)">${fontes[i]||''}</textarea></div>`).join('');
}

function updFonte(i,v){fontes[i]=v;const c=document.getElementById('fc-'+i);if(c)c.textContent=v;buildReport();}

function buildTemplateGrid(){
  const grid = document.getElementById('tpl-grid');
  if(!grid) return;
  grid.innerHTML = Object.values(TEMPLATES).map(t=>`
    <button class="tpl-btn bs o" data-tpl="${t.id}" onclick="selectTemplate('${t.id}')"
      style="display:flex;align-items:center;gap:7px;padding:6px 11px;font-size:11px;border:2px solid ${t.id===activeTemplate?'var(--ac)':'var(--bd)'};transition:all .2s">
      <span style="width:16px;height:16px;border-radius:3px;background:${t.preview};flex-shrink:0;display:inline-block"></span>
      ${t.label}
    </button>`).join('');
}

function selectTemplate(id){
  activeTemplate = id;
  saveClinicPref();
  buildTemplateGrid();
  buildReport();
}

function saveClinicPref(){
  if(!clinicName) return;
  try{
    const prefs = JSON.parse(localStorage.getItem('drps_clinic_prefs')||'{}');
    prefs[clinicName] = {template: activeTemplate, updatedAt: new Date().toISOString()};
    localStorage.setItem('drps_clinic_prefs', JSON.stringify(prefs));
  }catch(e){}
}

function loadClinicPref(name){
  if(!name) return;
  try{
    const prefs = JSON.parse(localStorage.getItem('drps_clinic_prefs')||'{}');
    if(prefs[name]?.template){
      activeTemplate = prefs[name].template;
      buildTemplateGrid();
    }
  }catch(e){}
}

// ─── SECTOR SCORES TABLE FOR REPORT ──────────────────────────────────────────
function buildSectorReportHtml(){
  const inst=INSTRUMENTS[G.inst];
  if(!G.sectorScores||!Object.keys(G.sectorScores).length)return '';
  const sectors=Object.keys(G.sectorScores).sort((a,b)=>(G.demo.setor[b]||0)-(G.demo.setor[a]||0));
  const factors=inst.factors;
  const gAvg=G.factorScores;

  // Abbreviate factor names to max 10 chars for column headers
  const abbr=n=>{
    const map={
      'Excesso de Demandas':'Exc.Dem','Ociosidade':'Ociosid.','Baixo Controle':'B.Contr.',
      'Falta de Apoio':'F.Apoio','Baixa Clareza':'B.Clareza','Conflitos e más relações':'Conflitos',
      'Falta de reconhecimento':'F.Reconh.','Injustiça no trabalho':'Injustiça',
      'Má Gestão de Mudanças':'Gestão Mud.','Problemas de comunicação':'P.Comun.',
      'Assédio':'Assédio','Violência e agressão':'Violência',
      'Satisfação com o Trabalho e Autoeficácia':'Satisf./AE','Saúde e Bem-Estar':'Saúde',
      'Demandas e Conflito Trabalho-Vida':'Dem.Conf.','Influência no Trabalho':'Influência',
      'Senso de Comunidade e Significado':'Comunidade','Reconhecimento e Qualidade da Liderança':'Reconh./Lid.',
      'Insegurança no Trabalho':'Insegurança',
    };
    return map[n]||n.substring(0,10);
  };

  // Build ONE table per chunk of factors (max 8 per table) so it fits on print
  const CHUNK=8;
  let html='';

  for(let start=0;start<factors.length;start+=CHUNK){
    const chunk=factors.slice(start,start+CHUNK);
    const chunkIdx=chunk.map((_,ci)=>start+ci);

    const thCols=chunk.map((f,ci)=>{
      const v=gAvg[start+ci];
      const bg=v<50?'rgba(16,185,129,.15)':v<75?'rgba(245,158,11,.15)':'rgba(239,68,68,.15)';
      return`<th style="text-align:center;font-size:9px;padding:5px 3px;font-weight:700;background:${bg};min-width:56px;border-right:1px solid rgba(255,255,255,.1)">${abbr(f.name)}</th>`;
    }).join('');

    const rows=sectors.map(s=>{
      const sc=G.sectorScores[s]||[];
      const n=G.demo.setor[s]||0;
      const pctN=G.n>0?(n/G.n*100).toFixed(0):0;
      const chunkVals=chunkIdx.map(ci=>sc[ci]??null);
      const valid=chunkVals.filter(v=>v!==null);
      const avgS=valid.length?valid.reduce((a,b)=>a+b,0)/valid.length:0;
      const cols=chunkVals.map(v=>{
        if(v===null)return`<td style="text-align:center;color:#aaa;font-size:10px;border-right:1px solid #f1f5f9">—</td>`;
        const bg=v<50?'#f0fdf4':v<75?'#fefce8':'#fef2f2';
        const cl=v<50?'#15803d':v<75?'#854d0e':'#991b1b';
        return`<td style="text-align:center;background:${bg};font-family:monospace;font-size:10px;font-weight:700;color:${cl};border-right:1px solid #e5e7eb">${v.toFixed(1)}</td>`;
      }).join('');
      const avgBg=avgS<50?'#dcfce7':avgS<75?'#fef9c3':'#fee2e2';
      const avgCl=avgS<50?'#15803d':avgS<75?'#854d0e':'#991b1b';
      return`<tr>
        <td style="font-weight:600;font-size:10px;padding:5px 8px;border-bottom:1px solid #f1f5f9;white-space:nowrap;border-right:1px solid #e5e7eb">${s}</td>
        <td style="text-align:center;font-family:monospace;font-size:9px;color:#64748b;padding:5px 4px;border-bottom:1px solid #f1f5f9;border-right:1px solid #e5e7eb">${n}·${pctN}%</td>
        ${cols}
        <td style="text-align:center;background:${avgBg};font-family:monospace;font-size:10px;font-weight:700;color:${avgCl};border-left:2px solid #cbd5e1">${avgS.toFixed(1)}</td>
      </tr>`;
    }).join('');

    const geralCols=chunkIdx.map(ci=>{
      const v=gAvg[ci];
      const bg=v<50?'#166534':v<75?'#78350f':'#7f1d1d';
      const cl=v<50?'#86efac':v<75?'#fde68a':'#fca5a5';
      return`<td style="text-align:center;background:${bg};font-family:monospace;font-size:10px;font-weight:700;color:${cl};border-right:1px solid rgba(255,255,255,.1)">${v.toFixed(1)}</td>`;
    }).join('');
    const avgGeral=chunkIdx.reduce((s,ci)=>s+gAvg[ci],0)/chunkIdx.length;
    const avgGeralBg=avgGeral<50?'#166534':avgGeral<75?'#78350f':'#7f1d1d';
    const avgGeralCl=avgGeral<50?'#86efac':avgGeral<75?'#fde68a':'#fca5a5';

    const chunkLabel=factors.length>CHUNK?` — Fatores ${start+1} a ${Math.min(start+CHUNK,factors.length)}`:'';
    html+=`
    <div style="margin-bottom:14px;break-inside:avoid">
      ${chunkLabel?`<div style="font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Parte ${Math.floor(start/CHUNK)+1}${chunkLabel}</div>`:''}
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #e2e8f0">
          <thead>
            <tr style="background:#0d2137;color:#fff">
              <th style="text-align:left;padding:6px 8px;font-size:9px;white-space:nowrap;border-right:1px solid rgba(255,255,255,.1)">Setor</th>
              <th style="text-align:center;padding:6px 4px;font-size:9px;white-space:nowrap;border-right:1px solid rgba(255,255,255,.1)">N · %</th>
              ${thCols}
              <th style="text-align:center;padding:6px 4px;font-size:9px;border-left:2px solid rgba(255,255,255,.2)">Média</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr style="background:#0d2137">
              <td style="font-weight:700;font-size:9px;color:#8dc63f;padding:5px 8px;border-right:1px solid rgba(255,255,255,.1)">GERAL</td>
              <td style="text-align:center;font-family:monospace;font-size:9px;color:#94a3b8;padding:5px 4px;border-right:1px solid rgba(255,255,255,.1)">${G.n}·100%</td>
              ${geralCols}
              <td style="text-align:center;background:${avgGeralBg};font-family:monospace;font-size:10px;font-weight:700;color:${avgGeralCl};border-left:2px solid rgba(255,255,255,.2)">${avgGeral.toFixed(1)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`;
  }

  return`<div style="margin:14px 0">${html}<div style="font-size:9px;color:#888;margin-top:4px">🟢 &lt;50% BAIXO · 🟡 50–74% MODERADO · 🔴 ≥75% ALTO</div></div>`;
}

function buildReport(){
  const incD=document.getElementById('inc-dash')?.checked!==false;
  // Sync date field
  const rdEl=document.getElementById('rep-date');
  if(rdEl && !rdEl.value && G.meta?.periodo) { rdEl.value=G.meta.periodo; reportDate=G.meta.periodo; }
  const inst=INSTRUMENTS[G.inst];
  const srt=G.factorScores.map((s,i)=>({s,i})).sort((a,b)=>b.s-a.s);
  const allLow=G.factorScores.every(s=>s<50);
  const setorLines=Object.entries(G.demo.setor).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}: ${v} (${(v/G.n*100).toFixed(0)}%)`).join(' · ');
  const mainSet=Object.entries(G.demo.setor).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k])=>k).join(', ');

  // Adesão warning HTML
  const adesaoHtml=G.meta.totalRef>0&&G.meta.adesaoPct<30?`<div style="background:#fff5f5;border-left:4px solid #e53e3e;padding:12px 16px;border-radius:0 8px 8px 0;margin:14px 0;font-size:12px;color:#c53030;line-height:1.7"><strong>⚠️ Nota Metodológica — Baixa Adesão de Respondentes</strong><br>De um total de <strong>${G.meta.totalRef} colaboradores</strong>, apenas <strong>${G.n} responderam (${G.meta.adesaoPct.toFixed(1)}%)</strong>. Taxa de resposta inferior a 30% pode introduzir viés de seleção nos resultados, comprometendo a representatividade da amostra. Os resultados devem ser interpretados com cautela e utilizados como indicativo preliminar, sendo recomendável nova aplicação para confirmação dos achados.</div>`:''

  // Logo HTML
  const logoHtml=G.logo?`<img src="${G.logo}" style="max-height:52px;max-width:140px;object-fit:contain">`:`<div style="font-size:10px;font-weight:700;color:#8dc63f;letter-spacing:1px">AMBRAC</div>`;
  const ambrLogoHtml=`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">${logoHtml}<div style="font-size:9px;color:rgba(255,255,255,.4);text-align:right">${inst.short}<br>Medicina e Segurança do Trabalho</div></div>`;

  const dimRows=G.dimScores.map((s,i)=>{const d=inst.dimensions[i];return`<tr><td><strong>${d.name}</strong> (${d.abbr})</td><td style="font-weight:700;color:${s<50?'#15803d':s<75?'#854d0e':'#991b1b'};font-family:monospace">${pct(s)}</td><td><span class="rbdg ${rb(s)}">${classif(s)}</span></td><td style="font-size:11px;color:#555;font-style:italic">${d.desc}</td></tr>`;}).join('');
  const fatRows=srt.map(({s,i})=>`<tr><td><strong>${inst.factors[i].name}</strong></td><td style="color:#888;font-size:10px">${inst.factors[i].qs.map(q=>`Q${q+1}`).join(',')}</td><td style="font-weight:700;color:${s<50?'#15803d':s<75?'#854d0e':'#991b1b'};font-family:monospace">${pct(s)}</td><td><span class="rbdg ${rb(s)}">${classif(s)}</span></td><td style="font-size:10px;font-weight:600;color:${s<50?'#15803d':s<75?'#854d0e':'#991b1b'}">${sevEng(s)}</td><td style="font-size:11px;font-style:italic;color:#555;background:#fffde7;border-left:3px solid #f59e0b">${fontes[i]||'—'}</td></tr>`).join('');

  const selA=[...selActs].map(i=>ALIB[i]);
  const byF={};selA.forEach(a=>{if(!byF[a.f])byF[a.f]=[];byF[a.f].push(a);});
  const actsHtml=selA.length>0?Object.entries(byF).sort((a,b)=>G.factorScores[b[0]]-G.factorScores[a[0]]).map(([f,acts])=>`<div style="margin-bottom:14px"><div style="font-weight:700;font-size:12px;color:#0d2137;margin-bottom:6px;padding:4px 0;border-bottom:1px solid #e5e7eb">${inst.factors[f]?.name||'Fator '+(+f+1)} — <span style="font-family:monospace">${pct(G.factorScores[f])}</span> <span class="rbdg ${rb(G.factorScores[f])}">${classif(G.factorScores[f])}</span></div>${acts.map(a=>`<div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:6px;padding:9px 12px;margin-bottom:5px;border-left:3px solid ${rc(G.factorScores[a.f])}"><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#64748b;margin-bottom:2px">${a.type} · ${a.target} · Complexidade: ${a.lv}</div><div style="font-size:12px;font-weight:600;color:#1e293b;margin-bottom:2px">${a.title}</div><div style="font-size:11px;color:#555">${a.desc}</div></div>`).join('')}</div>`).join(''):`<p style="font-size:12px;color:#888;font-style:italic">Acesse a aba Ações para selecionar intervenções.</p>`;

  // DASHBOARD para impressão
  const dashHtml=incD?`<div style="padding:26px 42px;border-bottom:1px solid #eee" class="pb"><div style="font-family:'Syne',sans-serif;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:#0d2137;border-bottom:3px solid #8dc63f;padding-bottom:7px;margin-bottom:16px;display:inline-block">DASHBOARD — VISÃO GERAL</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:9px;margin-bottom:16px">${[{l:'Respondentes',v:G.n,s:G.meta.totalRef>0?`de ${G.meta.totalRef} · ${G.meta.adesaoPct.toFixed(0)}%`:'Total',c:'#1565C0'},{l:'NPS',v:G.nps.score.toFixed(1),s:G.nps.score>=75?'Excelência':G.nps.score>=50?'Qualidade':'Melhoria',c:'#2E7D32'},{l:'Promotores',v:G.nps.pro,s:(G.n?(G.nps.pro/G.n*100).toFixed(0):0)+'%',c:'#1B5E20'},{l:'Maior Risco',v:pct(Math.max(...G.factorScores)),s:inst.factors[G.factorScores.indexOf(Math.max(...G.factorScores))]?.name||'—',c:G.factorScores.some(s=>s>=75)?'#B71C1C':G.factorScores.some(s=>s>=50)?'#E65100':'#1B5E20'},{l:'Média Geral',v:pct(avg(G.factorScores)),s:classif(avg(G.factorScores)),c:G.factorScores.some(s=>s>=75)?'#B71C1C':G.factorScores.some(s=>s>=50)?'#E65100':'#1B5E20'}].map(k=>`<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;padding:11px 13px;border-top:3px solid ${k.c}"><div style="font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px">${k.l}</div><div style="font-family:monospace;font-size:20px;font-weight:500;color:${k.c};line-height:1">${k.v}</div><div style="font-size:10px;color:#888;margin-top:3px">${k.s}</div></div>`).join('')}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:14px"><div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;padding:13px"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#475569;margin-bottom:9px">Score por Fator</div>${srt.map(({s,i})=>`<div style="display:grid;grid-template-columns:130px 1fr 50px 64px;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid #f1f5f9"><div style="font-size:10px">${inst.factors[i].name}</div><div style="background:#e2e8f0;border-radius:2px;height:5px"><div style="width:${Math.min(s,100)}%;height:5px;border-radius:2px;background:${s<50?'#10b981':s<75?'#f59e0b':'#ef4444'}"></div></div><div style="font-size:10px;font-weight:700;text-align:right;color:${s<50?'#15803d':s<75?'#854d0e':'#991b1b'};font-family:monospace">${pct(s)}</div><span style="display:inline-block;padding:1px 5px;border-radius:20px;font-size:9px;font-weight:700;background:${s<50?'#dcfce7':s<75?'#fef9c3':'#fee2e2'};color:${s<50?'#15803d':s<75?'#854d0e':'#991b1b'}">${classif(s)}</span></div>`).join('')}</div><div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;padding:13px"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#475569;margin-bottom:9px">NPS Interno</div><div style="text-align:center;padding:12px;background:#eff6ff;border-radius:6px;margin-bottom:10px"><div style="font-size:26px;font-weight:700;color:#1e40af;font-family:monospace">${G.nps.score.toFixed(1)}</div><div style="font-size:11px;color:#1e40af">${G.nps.score>=75?'EXCELÊNCIA ✓':G.nps.score>=50?'QUALIDADE':'MELHORIA'}</div></div>${[{l:'Promotores (9–10)',n:G.nps.pro,bg:'#f0fdf4',c:'#15803d'},{l:'Neutros (7–8)',n:G.nps.neu,bg:'#fefce8',c:'#854d0e'},{l:'Detratores (0–6)',n:G.nps.det,bg:'#fef2f2',c:'#991b1b'}].map(r=>`<div style="display:flex;align-items:center;justify-content:space-between;background:${r.bg};padding:7px 11px;border-radius:6px;margin-bottom:5px"><span style="font-size:11px;font-weight:600;color:${r.c}">${r.l}</span><span style="font-size:13px;font-weight:700;color:${r.c};font-family:monospace">${r.n} · ${G.nps.total?(r.n/G.nps.total*100).toFixed(0):0}%</span></div>`).join('')}<div style="margin-top:10px"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#475569;margin-bottom:7px">Por Setor</div>${Object.entries(G.demo.setor).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>`<div style="display:flex;align-items:center;gap:6px;padding:3px 0"><div style="font-size:10px;width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${k}</div><div style="flex:1;background:#e2e8f0;border-radius:2px;height:4px"><div style="width:${G.n?v/G.n*100:0}%;height:4px;border-radius:2px;background:#3b82f6"></div></div><div style="font-size:10px;font-family:monospace;color:#64748b;width:28px;text-align:right">${v}</div></div>`).join('')}</div></div></div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#475569;margin-bottom:7px">Score por Dimensão</div><div style="display:grid;grid-template-columns:repeat(${Math.min(inst.dimensions.length,3)},1fr);gap:9px">${G.dimScores.map((s,i)=>{const d=inst.dimensions[i];return`<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;padding:11px;border-left:3px solid ${d.color}"><div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#64748b;margin-bottom:2px">${d.abbr}</div><div style="font-family:monospace;font-size:16px;font-weight:500;color:${d.color};margin-bottom:2px">${pct(s)}</div><div style="font-size:9px;color:#475569;margin-bottom:4px">${d.name}</div><div style="background:#e2e8f0;border-radius:2px;height:3px;margin-bottom:4px"><div style="width:${Math.min(s,100)}%;height:3px;border-radius:2px;background:${d.color}"></div></div><span style="display:inline-block;padding:1px 5px;border-radius:10px;font-size:9px;font-weight:700;background:${s<50?'#dcfce7':s<75?'#fef9c3':'#fee2e2'};color:${s<50?'#15803d':s<75?'#854d0e':'#991b1b'}">${classif(s)}</span></div>`;}).join('')}</div></div>`:''

  const sigParts=G.meta.psi.split('·');
  const sigName=sigParts[0].trim();
  const sigCrp=sigParts.slice(1).join('·').trim();
  // Use editable report date if set, otherwise fallback to periodo
  const repDateDisplay = reportDate || G.meta.periodo;

    // ── Build data object for template ────────────────────────────────────────
  const tplData = {
    G, inst, srt, fontes, dimRows, fatRows,
    actsHtml, sectorTableHtml: buildSectorReportHtml(),
    sectorPlanHtml: sectorActionPlanHtml(),
    dashHtml, adesaoHtml, logoHtml, sigName, sigCrp, repDateDisplay, allLow,
    setorLines, mainSet, pct, avg, classif, rc, rb,
    ambrLogoHtml
  };
  const tpl = TEMPLATES[activeTemplate] || TEMPLATES.ambrac;
  document.getElementById('rep-body').innerHTML = tpl.buildHtml(tplData);

  // sync template grid highlight
  document.querySelectorAll('.tpl-btn').forEach(b=>{
    b.style.border = b.dataset.tpl===activeTemplate ? '2px solid var(--ac)' : '2px solid var(--bd)';
  });
}
