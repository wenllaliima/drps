// ── SHARED SECTION BUILDER (content identical, colors parametric) ──────────
function _commonSections(d, headColor, accentColor, noteBg, opts={}) {
  const {G,inst,srt,fontes,dimRows,fatRows,actsHtml,sectorTableHtml,unitTableHtml,
         sectorPlanHtml,dashHtml,adesaoHtml,sigName,sigCrp,repDateDisplay,
         allLow,setorLines,pct,avg,classif,rc,rb} = d;
  const th=`background:${headColor};color:#fff`;
  const noNps=G.inst==='copsoq3'; // used for NPS section
  const hasUnit=!!(unitTableHtml&&unitTableHtml.trim());

  // Dynamic section numbering
  let _s=2;
  if(!noNps)_s++;
  const snDim=++_s, snFat=++_s;
  const snSetor=opts.noSetor?null:++_s;
  const snUnit=(hasUnit&&!opts.noSetor)?++_s:null;
  const snPlano=++_s, snConc=++_s;

  if(G.n===0) return `
<div class="pb"></div>
<div class="rep-sec" style="padding:52px 44px;text-align:center">
  <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;background:#fef9c3;border:2px solid #fde047;border-radius:50%;font-size:28px;margin-bottom:20px">⚠️</div>
  <div style="font-size:20px;font-weight:800;color:${headColor};margin-bottom:12px">Ausência de Adesão à Pesquisa</div>
  <div style="font-size:13px;line-height:1.9;color:#374151;max-width:520px;margin:0 auto 28px">
    Não foram registradas respostas ao instrumento <strong>${inst.name}</strong> no período de referência.<br>
    Em razão da <strong>ausência de adesão</strong>, não foi possível realizar o levantamento e a análise
    dos fatores de risco psicossocial para esta unidade.
  </div>
  <div style="background:#fefce8;border:2px solid #fde047;border-radius:10px;padding:20px 28px;display:inline-block;text-align:left;max-width:500px;margin-bottom:40px">
    <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:#713f12;margin-bottom:12px">Recomendações</div>
    <ul style="font-size:12px;color:#713f12;line-height:2.1;padding-left:18px;margin:0">
      <li>Reforçar a comunicação sobre a importância da participação</li>
      <li>Verificar a acessibilidade e disponibilidade do formulário ao público-alvo</li>
      <li>Considerar a reaplicação da pesquisa em novo período</li>
      <li>Registrar a impossibilidade de coleta no <strong>PGR (NR-1)</strong> como não conformidade de gestão</li>
    </ul>
  </div>
  <div style="font-size:12px;color:#64748b;font-style:italic;margin-bottom:52px">Brasília/DF, ${repDateDisplay}.</div>
  <div style="width:260px;border-top:2px solid #1e293b;padding-top:10px;text-align:center;margin:0 auto">
    <div style="font-size:13px;font-weight:800;color:#1e293b">${sigName}</div>
    <div style="font-size:11px;color:#475569;margin-top:2px;font-weight:500">${sigCrp}</div>
    <div style="font-size:11px;color:#475569;margin-top:1px">${G.meta.avaliador}</div>
  </div>
</div>`;

  const npsHtml=`
<div class="nps-grid">
  ${[{l:'Promotores (9–10)',n:G.nps.pro,bg:'#f0fdf4',c:'#166534',b:'#86efac'},{l:'Neutros (7–8)',n:G.nps.neu,bg:'#fefce8',c:'#713f12',b:'#fde047'},{l:'Detratores (0–6)',n:G.nps.det,bg:'#fef2f2',c:'#7f1d1d',b:'#fca5a5'}]
    .map(r=>`<div class="nps-cell" style="background:${r.bg}">
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:${r.c};margin-bottom:6px">${r.l}</div>
      <div style="font-family:monospace;font-size:26px;font-weight:800;color:${r.c}">${r.n}</div>
      <div style="font-size:11px;font-weight:600;color:${r.c};opacity:.7;margin-top:3px">${G.n?(r.n/G.n*100).toFixed(1):0}%</div>
    </div>`).join('')}
</div>
<div style="text-align:center;padding:12px 16px;background:${noteBg};border-radius:8px;border:1px solid ${headColor}22;margin-top:10px">
  <span style="font-size:22px;font-weight:800;color:${headColor};font-family:monospace">NPS = ${G.nps.score.toFixed(1)}</span>
  <span style="font-size:12px;font-weight:600;color:${headColor};margin-left:12px;opacity:.8">${G.nps.score>=75?'— ZONA DE EXCELÊNCIA ✓':G.nps.score>=50?'— ZONA DE QUALIDADE':'— ZONA DE MELHORIA'}</span>
</div>`;

  return `
<div class="pb"></div>
<div class="rep-sec">
  <span class="rst">1. Objetivo</span>
  <p class="rtx">Avaliar a percepção dos colaboradores sobre os fatores psicossociais no trabalho, identificando perigos à saúde mental e subsidiando o <strong>PGR (NR-1)</strong>.</p>
  ${adesaoHtml}
</div>

<div class="rep-sec">
  <span class="rst">2. Metodologia</span>
  <table class="rtable">
    <tr><th style="${th};width:160px">Campo</th><th style="${th}">Informação</th></tr>
    <tr><td><strong>Empresa / Unidade</strong></td><td>${G.meta.empresa} · ${G.meta.unidade}</td></tr>
    ${G.meta.ramo?`<tr><td><strong>Ramo de atuação</strong></td><td>${G.meta.ramo}</td></tr>`:''}
    <tr><td><strong>Período</strong></td><td>${G.meta.periodo}</td></tr>
    <tr><td><strong>Colaboradores (ref.)</strong></td><td>${G.meta.totalRef>0?G.meta.totalRef:'N/D'}</td></tr>
    <tr><td><strong>Respondentes</strong></td><td>${G.n}${G.meta.totalRef>0?` — ${G.meta.adesaoPct.toFixed(1)}% de adesão`:''}</td></tr>
    <tr><td><strong>Instrumento</strong></td><td>${inst.name}</td></tr>
    <tr><td><strong>Aplicação</strong></td><td>${G.meta.pdfCount>0&&G.meta.xlsxCount>0?`Híbrida — ${G.meta.xlsxCount} via Google Forms (online) + ${G.meta.pdfCount} via formulário físico digitalizado`:G.meta.pdfCount>0?`Formulário físico digitalizado (${G.meta.pdfCount} respondente${G.meta.pdfCount>1?'s':''})`:'Virtual — formulário online, anônimo e voluntário'}</td></tr>
    <tr><td><strong>Responsável técnico</strong></td><td>${G.meta.psi}</td></tr>
    <tr><td style="vertical-align:top"><strong>Setores</strong></td><td style="padding:4px 8px">${setorLines||'N/D'}</td></tr>
  </table>
  <div class="rnote"><strong>Fórmula de cálculo:</strong> ${inst.formulaNote}</div>
</div>

${noNps?'':`<div class="rep-sec">
  <span class="rst">3. NPS Interno</span>
  ${npsHtml}
</div>`}

<div class="rep-sec">
  <span class="rst">${snDim}. Resultados por Dimensão</span>
  <table class="rtable"><thead><tr>
    <th style="${th}">Dimensão</th><th style="${th}">Score</th><th style="${th}">Classificação</th><th style="${th}">Descrição</th>
  </tr></thead><tbody>${dimRows}</tbody></table>
</div>

<div class="rep-sec">
  <span class="rst">${snFat}. Resultados por Fator</span>
  <div class="rtbl-wrap">
    <table class="rtable" style="font-size:11px"><thead><tr>
      <th style="${th}">Fator</th><th style="${th}">Quest.</th><th style="${th}">Score</th>
      <th style="${th}">Classif.</th><th style="${th}">Sever.</th>
      <th style="${th};min-width:180px;background:#fffde7;color:#713f12">Fonte Geradora</th>
    </tr></thead><tbody>${fatRows}</tbody></table>
  </div>
</div>

${opts.noSetor?'':
`<div class="rep-sec">
  <span class="rst">${snSetor}. Análise por Setor</span>
  <p class="rtx">Score de risco por fator × setor. Linha <strong>GERAL</strong> = média de todos os respondentes.</p>
  ${sectorTableHtml}
</div>`}

${(hasUnit&&!opts.noSetor)?`<div class="rep-sec">
  <span class="rst">${snUnit}. Análise por Unidade</span>
  <p class="rtx">Score de risco por fator × unidade organizacional.</p>
  ${unitTableHtml}
</div>`:''}

<div class="rep-sec">
  <span class="rst">${snPlano}. Plano de Ação</span>
  <p class="rtx">Intervenções por setor geradas com base no perfil de risco${G.meta.ramo?' e no ramo de atuação ('+G.meta.ramo+')':''}:</p>
  ${sectorPlanHtml}
  ${actsHtml?`<div style="margin-top:14px;padding:12px 14px;background:${noteBg};border-left:4px solid ${accentColor};border-radius:0 8px 8px 0;font-size:11px;color:#1e293b"><strong style="color:${headColor}">Ações complementares:</strong> ${actsHtml}</div>`:''}
</div>

<div class="rep-sec">
  <span class="rst">${snConc}. Conclusão</span>
  <p class="rtx">${allLow?'Os resultados indicam situação <strong>favorável</strong> — todos os fatores classificados como BAIXO.':'Os resultados apontam fatores que requerem atenção e intervenção planejada.'} Recomenda-se integrar os riscos identificados ao <strong>PGR (NR-1)</strong> com monitoramento periódico${G.meta.ramo?', considerando as características inerentes ao ramo de '+G.meta.ramo:''}.</p>
</div>

${opts.noSetor?'':dashHtml}

<div style="padding:40px 44px 32px;display:flex;flex-direction:column;align-items:center">
  <div style="font-size:12px;color:#64748b;font-style:italic;margin-bottom:52px;text-align:center">Brasília/DF, ${repDateDisplay}.</div>
  <div style="width:260px;border-top:2px solid #1e293b;padding-top:10px;text-align:center">
    <div style="font-size:13px;font-weight:800;color:#1e293b">${sigName}</div>
    <div style="font-size:11px;color:#475569;margin-top:2px;font-weight:500">${sigCrp}</div>
    <div style="font-size:11px;color:#475569;margin-top:1px">${G.meta.avaliador}</div>
  </div>
</div>`;
}

const TEMPLATES = {

// ────────────────────────────────────────────────────────────────────────────
// T1 — AMBRAC (dark navy capa, green accent, classic)
// ────────────────────────────────────────────────────────────────────────────
ambrac: {
  id:'ambrac', label:'AMBRAC — Verde Escuro', preview:'linear-gradient(135deg,#0d2137,#1a3a5c)', accent:'#8dc63f',
  buildHtml(d){
    const {G,inst,logoHtml,sigName,sigCrp,repDateDisplay} = d;
    return `
<style>
.rbdg{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.3px}
.rb-lo{background:#dcfce7;color:#166534;border:1px solid #86efac}
.rb-mo{background:#fef9c3;color:#713f12;border:1px solid #fde047}
.rb-hi{background:#fee2e2;color:#7f1d1d;border:1px solid #fca5a5}
.rep-sec{padding:24px 44px;border-bottom:2px solid #f1f5f9}
.rst{font-family:'Syne',sans-serif;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.4px;color:#0d2137;border-bottom:3px solid #8dc63f;padding-bottom:7px;margin-bottom:16px;display:inline-block;break-after:avoid;page-break-after:avoid}
.rtx{font-size:13px;line-height:1.8;color:#1e293b;margin-bottom:12px}
.rnote{background:#f0fdf4;border-left:4px solid #8dc63f;padding:12px 16px;border-radius:0 8px 8px 0;font-size:12px;color:#166534;font-weight:500;line-height:1.6;margin:12px 0}
.rtable{width:100%;border-collapse:collapse;margin:12px 0;font-size:12px}
.rtable th{background:#0d2137;color:#fff;padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px}
.rtable td{padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#1e293b;vertical-align:top}
.rtable tr:hover td{background:#f8fafc}
.rtable tr{break-inside:avoid;page-break-inside:avoid}
.rtbl-wrap{overflow-x:auto}
.nps-grid{display:grid;grid-template-columns:repeat(3,1fr);border:2px solid #e2e8f0;border-radius:10px;overflow:hidden;margin:12px 0}
.nps-cell{padding:16px;text-align:center;border-right:1px solid #e2e8f0}
.nps-cell:last-child{border-right:none}
.pb{page-break-before:always;break-before:page}
</style>
<div style="background:linear-gradient(160deg,#0d2137 0%,#133258 50%,#0d2137 100%);padding:48px 44px;position:relative;overflow:hidden;min-height:280px;display:flex;flex-direction:column;justify-content:space-between">
  <div style="position:absolute;top:-60px;right:-60px;width:280px;height:280px;background:rgba(141,198,63,.07);border-radius:50%"></div>
  <div style="position:absolute;bottom:-40px;left:30%;width:160px;height:160px;background:rgba(141,198,63,.04);border-radius:50%"></div>
  <div style="position:relative;z-index:1">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px">
      ${logoHtml}
      <div style="text-align:right"><div style="font-size:9px;color:rgba(255,255,255,.4);letter-spacing:1px;text-transform:uppercase">${inst.short}</div><div style="font-size:9px;color:rgba(255,255,255,.3);margin-top:2px">Medicina e Seg. do Trabalho</div></div>
    </div>
    <div style="font-family:'Syne',sans-serif;font-size:42px;font-weight:800;color:#8dc63f;line-height:1;letter-spacing:-1px;margin-bottom:6px">DRPS</div>
    <div style="font-size:16px;font-weight:600;color:#fff;margin-bottom:4px">Diagnóstico de Riscos Psicossociais</div>
    <div style="font-size:11px;color:rgba(255,255,255,.5);letter-spacing:2px;text-transform:uppercase">Relatório Diagnóstico · NR-1</div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;position:relative;z-index:1;margin-top:24px">
    ${[['Empresa',G.meta.empresa],['Unidade',G.meta.unidade],['Ramo',G.meta.ramo||'—'],['Período / Elaborado por',G.meta.periodo+' · '+G.meta.avaliador]].map(([l,v])=>`<div><div style="font-size:8px;font-weight:700;color:#8dc63f;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:3px">${l}</div><div style="font-size:13px;font-weight:600;color:#fff;border-bottom:1px solid rgba(141,198,63,.3);padding-bottom:3px">${v}</div></div>`).join('')}
  </div>
</div>
<div style="height:6px;background:linear-gradient(90deg,#8dc63f 0%,#00d4aa 50%,#3b82f6 100%)"></div>
${_commonSections(d,'#0d2137','#8dc63f','#f0fdf4')}`;
  }
},

// ────────────────────────────────────────────────────────────────────────────
// T2 — CLÍNICA AZUL (white capa, deep blue, modern corporate)
// ────────────────────────────────────────────────────────────────────────────
clinica_azul: {
  id:'clinica_azul', label:'Clínica — Azul Profundo', preview:'linear-gradient(135deg,#1e3a8a,#2563eb)', accent:'#1e40af',
  buildHtml(d){
    const {G,inst,logoHtml} = d;
    return `
<style>
.rbdg{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;letter-spacing:.3px}
.rb-lo{background:#dcfce7;color:#166534;border:1px solid #86efac}
.rb-mo{background:#fef9c3;color:#713f12;border:1px solid #fde047}
.rb-hi{background:#fee2e2;color:#7f1d1d;border:1px solid #fca5a5}
.rep-sec{padding:22px 44px;border-bottom:1px solid #dbeafe}
.rst{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:#1e3a8a;border-left:5px solid #2563eb;padding:3px 0 3px 12px;margin-bottom:16px;display:block;background:linear-gradient(90deg,#eff6ff,transparent);break-after:avoid;page-break-after:avoid}
.rtx{font-size:13px;line-height:1.8;color:#1e293b;margin-bottom:12px}
.rnote{background:#eff6ff;border-left:4px solid #2563eb;padding:12px 16px;border-radius:0 8px 8px 0;font-size:12px;color:#1e3a8a;font-weight:500;line-height:1.6;margin:12px 0}
.rtable{width:100%;border-collapse:collapse;margin:12px 0;font-size:12px}
.rtable th{background:#1e3a8a;color:#fff;padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
.rtable td{padding:8px 12px;border-bottom:1px solid #dbeafe;color:#1e293b;vertical-align:top}
.rtable tr:nth-child(even) td{background:#f0f9ff}
.rtable tr{break-inside:avoid;page-break-inside:avoid}
.rtbl-wrap{overflow-x:auto}
.nps-grid{display:grid;grid-template-columns:repeat(3,1fr);border:2px solid #bfdbfe;border-radius:10px;overflow:hidden;margin:12px 0}
.nps-cell{padding:16px;text-align:center;border-right:1px solid #bfdbfe}
.nps-cell:last-child{border-right:none}
.pb{page-break-before:always;break-before:page}
</style>
<div style="background:#fff;border-bottom:none;padding:0">
  <div style="background:#1e3a8a;height:8px"></div>
  <div style="padding:36px 44px 28px">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px">
      <div>${logoHtml}</div>
      <div style="text-align:right;padding:8px 14px;background:#eff6ff;border-radius:8px;border:1px solid #bfdbfe">
        <div style="font-size:9px;font-weight:700;color:#1e3a8a;letter-spacing:.8px;text-transform:uppercase">Instrumento</div>
        <div style="font-size:12px;font-weight:700;color:#1e3a8a;margin-top:2px">${inst.short}</div>
      </div>
    </div>
    <div style="margin-bottom:24px">
      <div style="font-size:10px;font-weight:700;color:#2563eb;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">RELATÓRIO DIAGNÓSTICO · NR-1</div>
      <div style="font-size:30px;font-weight:800;color:#1e3a8a;line-height:1.15;margin-bottom:6px">Diagnóstico de<br>Riscos Psicossociais</div>
      <div style="width:60px;height:4px;background:linear-gradient(90deg,#2563eb,#60a5fa);border-radius:2px;margin-bottom:20px"></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);border:2px solid #dbeafe;border-radius:10px;overflow:hidden">
      ${[['Empresa',G.meta.empresa],['Unidade',G.meta.unidade],['Ramo',G.meta.ramo||'—'],['Elaborado por',G.meta.avaliador+' · '+G.meta.periodo]].map(([l,v],i)=>`<div style="padding:12px 14px;${i<3?'border-right:1px solid #dbeafe;':''}background:${i%2===0?'#f8faff':'#f0f6ff'}"><div style="font-size:8px;font-weight:700;color:#3b82f6;text-transform:uppercase;letter-spacing:.6px;margin-bottom:3px">${l}</div><div style="font-size:11px;font-weight:700;color:#1e3a8a">${v}</div></div>`).join('')}
    </div>
  </div>
  <div style="height:4px;background:linear-gradient(90deg,#1e3a8a,#2563eb,#60a5fa)"></div>
</div>
${_commonSections(d,'#1e3a8a','#2563eb','#eff6ff')}`;
  }
},

// ────────────────────────────────────────────────────────────────────────────
// T3 — CLÍNICA VINHO (deep burgundy, premium medical feel)
// ────────────────────────────────────────────────────────────────────────────
clinica_vinho: {
  id:'clinica_vinho', label:'Clínica — Vinho Premium', preview:'linear-gradient(135deg,#4a0e2b,#881337)', accent:'#be123c',
  buildHtml(d){
    const {G,inst,logoHtml} = d;
    return `
<style>
.rbdg{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.3px}
.rb-lo{background:#dcfce7;color:#166534;border:1px solid #86efac}
.rb-mo{background:#fef9c3;color:#713f12;border:1px solid #fde047}
.rb-hi{background:#fee2e2;color:#7f1d1d;border:1px solid #fca5a5}
.rep-sec{padding:22px 44px;border-bottom:1px solid #ffe4e6}
.rst{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:#9f1239;display:flex;align-items:center;gap:10px;margin-bottom:16px;break-after:avoid;page-break-after:avoid}
.rst::before{content:'';display:block;width:20px;height:3px;background:#be123c;border-radius:2px;flex-shrink:0}
.rtx{font-size:13px;line-height:1.8;color:#1e293b;margin-bottom:12px}
.rnote{background:#fff1f2;border-left:4px solid #be123c;padding:12px 16px;border-radius:0 8px 8px 0;font-size:12px;color:#9f1239;font-weight:500;line-height:1.6;margin:12px 0}
.rtable{width:100%;border-collapse:collapse;margin:12px 0;font-size:12px}
.rtable th{background:#4a0e2b;color:#fff;padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
.rtable td{padding:8px 12px;border-bottom:1px solid #ffe4e6;color:#1e293b;vertical-align:top}
.rtable tr:nth-child(even) td{background:#fff1f2}
.rtable tr{break-inside:avoid;page-break-inside:avoid}
.rtbl-wrap{overflow-x:auto}
.nps-grid{display:grid;grid-template-columns:repeat(3,1fr);border:2px solid #fecdd3;border-radius:10px;overflow:hidden;margin:12px 0}
.nps-cell{padding:16px;text-align:center;border-right:1px solid #fecdd3}
.nps-cell:last-child{border-right:none}
.pb{page-break-before:always;break-before:page}
</style>
<div style="background:linear-gradient(135deg,#4a0e2b 0%,#881337 60%,#be123c 100%);padding:44px;position:relative;overflow:hidden">
  <div style="position:absolute;top:-40px;right:-40px;width:200px;height:200px;border:50px solid rgba(255,255,255,.05);border-radius:50%"></div>
  <div style="position:absolute;bottom:-60px;left:-30px;width:180px;height:180px;border:40px solid rgba(255,255,255,.04);border-radius:50%"></div>
  <div style="position:relative;z-index:1">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px">
      ${logoHtml}
      <div style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:8px;padding:8px 14px;text-align:right">
        <div style="font-size:9px;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.8px">${inst.short}</div>
        <div style="font-size:9px;color:rgba(255,255,255,.4);margin-top:1px">Medicina Ocupacional</div>
      </div>
    </div>
    <div style="font-size:10px;color:rgba(255,255,255,.5);letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">RELATÓRIO DIAGNÓSTICO · NR-1</div>
    <div style="font-size:32px;font-weight:800;color:#fff;line-height:1.15;margin-bottom:20px">Diagnóstico de<br>Riscos Psicossociais</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0;border:1px solid rgba(255,255,255,.2);border-radius:8px;overflow:hidden;max-width:640px">
      ${[['Empresa',G.meta.empresa],['Ramo',G.meta.ramo||'—'],['Unidade',G.meta.unidade],['Período',G.meta.periodo+' · '+G.meta.avaliador]].map(([l,v],i)=>`<div style="padding:10px 14px;border-right:${i<3?'1px solid rgba(255,255,255,.15)':'none'}"><div style="font-size:8px;color:rgba(255,255,255,.5);letter-spacing:.8px;text-transform:uppercase;margin-bottom:2px">${l}</div><div style="font-size:11px;font-weight:700;color:#fff">${v}</div></div>`).join('')}
    </div>
  </div>
</div>
<div style="background:#4a0e2b;padding:8px 44px;display:flex;align-items:center;justify-content:space-between">
  <div style="font-size:10px;color:rgba(255,255,255,.5)">Elaborado por: <strong style="color:#fecdd3">${G.meta.avaliador}</strong></div>
  <div style="font-size:10px;color:rgba(255,255,255,.4)">${G.meta.psi}</div>
</div>
<div style="height:4px;background:linear-gradient(90deg,#be123c,#fb7185,#be123c)"></div>
${_commonSections(d,'#4a0e2b','#be123c','#fff1f2')}`;
  }
},

// ────────────────────────────────────────────────────────────────────────────
// T4 — CLÍNICA GRAFITE (slate/charcoal, ultra high contrast, print-perfect)
// ────────────────────────────────────────────────────────────────────────────
clinica_cinza: {
  id:'clinica_cinza', label:'Clínica — Grafite Alto Contraste', preview:'linear-gradient(135deg,#1e293b,#475569)', accent:'#334155',
  buildHtml(d){
    const {G,inst,logoHtml} = d;
    return `
<style>
.rbdg{display:inline-block;padding:2px 8px;border-radius:3px;font-size:10px;font-weight:700;letter-spacing:.3px}
.rb-lo{background:#dcfce7;color:#166534;border:1px solid #86efac}
.rb-mo{background:#fef9c3;color:#713f12;border:1px solid #fde047}
.rb-hi{background:#fee2e2;color:#7f1d1d;border:1px solid #fca5a5}
.rep-sec{padding:22px 44px;border-bottom:2px solid #e2e8f0}
.rst{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#475569;padding-bottom:7px;border-bottom:2px solid #1e293b;margin-bottom:16px;display:block;break-after:avoid;page-break-after:avoid}
.rtx{font-size:13px;line-height:1.8;color:#1e293b;margin-bottom:12px}
.rnote{background:#f8fafc;border:1px solid #cbd5e1;border-left:4px solid #475569;padding:12px 16px;font-size:12px;color:#1e293b;font-weight:500;line-height:1.6;margin:12px 0}
.rtable{width:100%;border-collapse:collapse;margin:12px 0;font-size:12px}
.rtable th{background:#1e293b;color:#f8fafc;padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px}
.rtable td{padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#1e293b;vertical-align:top}
.rtable tr:nth-child(even) td{background:#f8fafc}
.rtable tr{break-inside:avoid;page-break-inside:avoid}
.rtbl-wrap{overflow-x:auto}
.nps-grid{display:grid;grid-template-columns:repeat(3,1fr);border:2px solid #cbd5e1;border-radius:4px;overflow:hidden;margin:12px 0}
.nps-cell{padding:16px;text-align:center;border-right:1px solid #cbd5e1}
.nps-cell:last-child{border-right:none}
.pb{page-break-before:always;break-before:page}
</style>
<div style="background:#fff;border-top:10px solid #1e293b;padding:36px 44px 24px">
  <div style="display:flex;align-items:flex-start;justify-content:space-between;padding-bottom:20px;border-bottom:2px solid #e2e8f0;margin-bottom:22px">
    <div>${logoHtml}</div>
    <div style="text-align:right">
      <div style="font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px">Instrumento</div>
      <div style="font-size:13px;font-weight:800;color:#1e293b;margin-top:2px">${inst.short}</div>
    </div>
  </div>
  <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:22px;gap:20px">
    <div>
      <div style="font-size:9px;font-weight:700;color:#94a3b8;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:8px">RELATÓRIO TÉCNICO NR-1</div>
      <div style="font-size:28px;font-weight:800;color:#1e293b;line-height:1.2;margin-bottom:4px">Diagnóstico de<br>Riscos Psicossociais</div>
      <div style="font-size:12px;color:#475569;font-weight:500">Avaliação das condições psicossociais · ${G.meta.empresa}</div>
    </div>
    <div style="flex-shrink:0;background:#f1f5f9;border:2px solid #e2e8f0;border-radius:8px;padding:14px 18px;min-width:180px">
      <div style="font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px">Dados da Avaliação</div>
      ${[['Unidade',G.meta.unidade],['Ramo',G.meta.ramo||'—'],['Período',G.meta.periodo]].map(([l,v])=>`<div style="display:flex;justify-content:space-between;gap:8px;padding:3px 0;border-bottom:1px solid #e2e8f0"><span style="font-size:10px;color:#64748b;font-weight:500">${l}</span><span style="font-size:10px;font-weight:700;color:#1e293b;text-align:right">${v}</span></div>`).join('')}
    </div>
  </div>
  <div style="background:#1e293b;padding:10px 16px;border-radius:6px;display:flex;align-items:center;justify-content:space-between">
    <div style="font-size:10px;color:#94a3b8">Elaborado por: <strong style="color:#f8fafc">${G.meta.avaliador}</strong></div>
    <div style="font-size:10px;color:#64748b">${G.meta.psi}</div>
  </div>
</div>
${_commonSections(d,'#1e293b','#475569','#f8fafc')}`;
  }
},

// ────────────────────────────────────────────────────────────────────────────
// T5 — SIMPLIFICADO (sem análise por setor e sem dashboard)
// ────────────────────────────────────────────────────────────────────────────
simples: {
  id:'simples', label:'Simplificado — Sem Setor/Dashboard', preview:'linear-gradient(135deg,#1e293b,#475569)', accent:'#334155',
  buildHtml(d){
    const {G,inst,logoHtml} = d;
    return `
<style>
.rbdg{display:inline-block;padding:2px 8px;border-radius:3px;font-size:10px;font-weight:700;letter-spacing:.3px}
.rb-lo{background:#dcfce7;color:#166534;border:1px solid #86efac}
.rb-mo{background:#fef9c3;color:#713f12;border:1px solid #fde047}
.rb-hi{background:#fee2e2;color:#7f1d1d;border:1px solid #fca5a5}
.rep-sec{padding:22px 44px;border-bottom:2px solid #e2e8f0}
.rst{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#475569;padding-bottom:7px;border-bottom:2px solid #1e293b;margin-bottom:16px;display:block;break-after:avoid;page-break-after:avoid}
.rtx{font-size:13px;line-height:1.8;color:#1e293b;margin-bottom:12px}
.rnote{background:#f8fafc;border:1px solid #cbd5e1;border-left:4px solid #475569;padding:12px 16px;font-size:12px;color:#1e293b;font-weight:500;line-height:1.6;margin:12px 0}
.rtable{width:100%;border-collapse:collapse;margin:12px 0;font-size:12px}
.rtable th{background:#1e293b;color:#f8fafc;padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px}
.rtable td{padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#1e293b;vertical-align:top}
.rtable tr:nth-child(even) td{background:#f8fafc}
.rtable tr{break-inside:avoid;page-break-inside:avoid}
.rtbl-wrap{overflow-x:auto}
.nps-grid{display:grid;grid-template-columns:repeat(3,1fr);border:2px solid #cbd5e1;border-radius:4px;overflow:hidden;margin:12px 0}
.nps-cell{padding:16px;text-align:center;border-right:1px solid #cbd5e1}
.nps-cell:last-child{border-right:none}
.pb{page-break-before:always;break-before:page}
</style>
<div style="background:#fff;border-top:10px solid #1e293b;padding:36px 44px 24px">
  <div style="display:flex;align-items:flex-start;justify-content:space-between;padding-bottom:20px;border-bottom:2px solid #e2e8f0;margin-bottom:22px">
    <div>${logoHtml}</div>
    <div style="text-align:right">
      <div style="font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px">Instrumento</div>
      <div style="font-size:13px;font-weight:800;color:#1e293b;margin-top:2px">${inst.short}</div>
    </div>
  </div>
  <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:22px;gap:20px">
    <div>
      <div style="font-size:9px;font-weight:700;color:#94a3b8;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:8px">RELATÓRIO TÉCNICO NR-1</div>
      <div style="font-size:28px;font-weight:800;color:#1e293b;line-height:1.2;margin-bottom:4px">Diagnóstico de<br>Riscos Psicossociais</div>
      <div style="font-size:12px;color:#475569;font-weight:500">Avaliação das condições psicossociais · ${G.meta.empresa}</div>
    </div>
    <div style="flex-shrink:0;background:#f1f5f9;border:2px solid #e2e8f0;border-radius:8px;padding:14px 18px;min-width:180px">
      <div style="font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px">Dados da Avaliação</div>
      ${[['Unidade',G.meta.unidade],['Ramo',G.meta.ramo||'—'],['Período',G.meta.periodo]].map(([l,v])=>`<div style="display:flex;justify-content:space-between;gap:8px;padding:3px 0;border-bottom:1px solid #e2e8f0"><span style="font-size:10px;color:#64748b;font-weight:500">${l}</span><span style="font-size:10px;font-weight:700;color:#1e293b;text-align:right">${v}</span></div>`).join('')}
    </div>
  </div>
  <div style="background:#1e293b;padding:10px 16px;border-radius:6px;display:flex;align-items:center;justify-content:space-between">
    <div style="font-size:10px;color:#94a3b8">Elaborado por: <strong style="color:#f8fafc">${G.meta.avaliador}</strong></div>
    <div style="font-size:10px;color:#64748b">${G.meta.psi}</div>
  </div>
</div>
${_commonSections(d,'#1e293b','#475569','#f8fafc',{noSetor:true})}`;
  }
},

};
