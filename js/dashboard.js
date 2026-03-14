function buildDash(){
  const inst=INSTRUMENTS[G.inst];
  const topF=inst.factors[G.factorScores.indexOf(Math.max(...G.factorScores))]?.name||'—';
  const avgAll=avg(G.factorScores);

  // Adesão banner
  const banner=document.getElementById('adesao-banner');
  if(G.meta.totalRef>0&&G.meta.adesaoPct<30){
    banner.style.display='block';
    banner.innerHTML=`⚠️ <strong>Baixa Adesão de Respondentes:</strong> ${G.n} de ${G.meta.totalRef} colaboradores responderam (${G.meta.adesaoPct.toFixed(1)}%). Taxa abaixo de 30% pode gerar viés na análise. Os resultados devem ser interpretados com cautela.`;
  } else banner.style.display='none';

  const kpis=[
    {l:'Respondentes',v:G.n,s:G.meta.totalRef>0?`de ${G.meta.totalRef} · ${G.meta.adesaoPct.toFixed(0)}% adesão`:'Total avaliados',c:'#4f8ef7'},
    {l:'NPS Interno',v:G.nps.score.toFixed(1),s:G.nps.score>=75?'Excelência ✓':G.nps.score>=50?'Qualidade':'Melhoria',c:'#10b981'},
    {l:'Promotores',v:G.nps.pro,s:(G.n?(G.nps.pro/G.n*100).toFixed(0):0)+'%',c:'#22c55e'},
    {l:'Maior Risco',v:pct(Math.max(...G.factorScores)),s:topF,c:rc(Math.max(...G.factorScores))},
    {l:'Média Geral',v:pct(avgAll),s:classif(avgAll)+' · '+sevEng(avgAll),c:rc(avgAll)},
  ];
  document.getElementById('kpi-row').innerHTML=kpis.map(k=>`<div class="kpi" style="--kc:${k.c}"><div class="kl">${k.l}</div><div class="kv">${k.v}</div><div class="ks">${k.s}</div></div>`).join('');

  const srt=G.factorScores.map((s,i)=>({s,i})).sort((a,b)=>b.s-a.s);
  dc('bar');charts['bar']=new Chart(document.getElementById('ch-bar').getContext('2d'),{
    type:'bar',
    data:{labels:srt.map(x=>inst.factors[x.i].name),datasets:[{data:srt.map(x=>+x.s.toFixed(1)),backgroundColor:srt.map(x=>rc(x.s)+'99'),borderColor:srt.map(x=>rc(x.s)),borderWidth:1,borderRadius:4}]},
    options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#111827',borderColor:'#1e2d45',borderWidth:1,callbacks:{label:c=>` ${c.raw.toFixed(1)}%`}}},scales:{x:{max:100,grid:{color:'rgba(255,255,255,.05)'},ticks:{color:'#6b7fa3',font:{size:10},callback:v=>v+'%'},border:{color:'transparent'}},y:{grid:{display:false},ticks:{color:'#c8ccd8',font:{size:10}},border:{color:'transparent'}}}}
  });

  dc('nps');charts['nps']=new Chart(document.getElementById('ch-nps').getContext('2d'),{
    type:'doughnut',data:{labels:['Detratores','Neutros','Promotores'],datasets:[{data:[G.nps.det,G.nps.neu,G.nps.pro],backgroundColor:['#ef444488','#f59e0b88','#22c55e88'],borderColor:['#ef4444','#f59e0b','#22c55e'],borderWidth:2}]},
    options:{cutout:'68%',responsive:true,maintainAspectRatio:true,plugins:{legend:{display:false},tooltip:{backgroundColor:'#111827',borderColor:'#1e2d45',borderWidth:1}}}
  });
  document.getElementById('npsnm').textContent=G.nps.score.toFixed(1);
  document.getElementById('npsrows').innerHTML=[{l:'Promotores (9–10)',n:G.nps.pro,c:'#22c55e'},{l:'Neutros (7–8)',n:G.nps.neu,c:'#f59e0b'},{l:'Detratores (0–6)',n:G.nps.det,c:'#ef4444'}].map(r=>`<div class="nps-row"><div style="display:flex;align-items:center;gap:7px"><span style="width:8px;height:8px;border-radius:50%;background:${r.c};display:inline-block"></span><span style="font-size:11px">${r.l}</span></div><span style="font-family:'DM Mono',monospace;font-size:11px;font-weight:600;color:${r.c}">${r.n} · ${G.nps.total?(r.n/G.nps.total*100).toFixed(0):0}%</span></div>`).join('');

  const setE=Object.entries(G.demo.setor).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const sP=['#4f8ef7','#7c5cfc','#22c55e','#06b6d4','#f59e0b','#ec4899','#10b981','#f97316'];
  dc('set');charts['set']=new Chart(document.getElementById('ch-set').getContext('2d'),{
    type:'bar',data:{labels:setE.map(s=>s[0]),datasets:[{data:setE.map(s=>s[1]),backgroundColor:sP.map(c=>c+'99'),borderColor:sP,borderWidth:1,borderRadius:4}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:'#6b7fa3',font:{size:9}},border:{color:'transparent'}},y:{grid:{color:'rgba(255,255,255,.05)'},ticks:{color:'#6b7fa3',font:{size:9}},border:{color:'transparent'}}}}
  });

  document.getElementById('dimgrid').innerHTML=G.dimScores.map((s,i)=>{const d=INSTRUMENTS[G.inst].dimensions[i];return`<div class="dim-card" style="--dc:${d.color}"><div class="dn">${d.name}</div><div class="da">${d.abbr}</div><div class="dv">${pct(s)}</div><div class="dbb"><div class="dbf" style="width:${Math.min(s,100)}%"></div></div><div class="dd">${d.desc}</div><div style="margin-top:7px"><span class="bdg ${bc(s)}">${classif(s)}</span></div></div>`;}).join('');
}

function buildFat(){
  const inst=INSTRUMENTS[G.inst];
  const srt=G.factorScores.map((s,i)=>({s,i})).sort((a,b)=>b.s-a.s);
  // Legenda específica por instrumento
  let legendHtml = `<strong style="color:#00d4aa">Fórmula:</strong> ${inst.formulaNote}`;
  if(G.inst==='copsoq3'){
    const invF = inst.factors.filter(f=>f.riskInverted).map(f=>`<strong>${f.sigla}</strong> ${f.name}`);
    const dirF = inst.factors.filter(f=>!f.riskInverted).map(f=>`<strong>${f.sigla}</strong> ${f.name}`);
    legendHtml += `<br><br><strong style="color:#f59e0b">⚑ Fatores de risco direto</strong> (escore alto = mais risco):<br>
      <span style="font-size:10px">${dirF.join(' · ')}</span>
      <br><strong style="color:#10b981">✦ Fatores protetores</strong> (escore apresentado já invertido = risco residual quando proteção é baixa):<br>
      <span style="font-size:10px">${invF.join(' · ')}</span>
      <br><em style="font-size:10px;color:#6b7fa3">Referência: ${inst.citation||''}</em>`;
  }
  document.getElementById('inst-legend').innerHTML=legendHtml;
  document.getElementById('ranking').innerHTML=srt.slice(0,6).map(({s,i},r)=>`<div class="fbar"><div class="fn"><span style="color:var(--mu);margin-right:5px;font-size:10px">${r+1}.</span>${inst.factors[i].name}</div><div class="bb"><div class="bf" style="width:${Math.min(s,100)}%;background:${rc(s)}"></div></div><div class="fp" style="color:${rc(s)}">${pct(s)}</div><span class="bdg ${bc(s)}">${classif(s)}</span></div>`).join('');
  document.getElementById('fattbody').innerHTML=srt.map(({s,i})=>{
    const f=inst.factors[i];
    const inv=f.riskInverted?' <span style="font-size:9px;color:#10b981;background:rgba(16,185,129,.12);padding:1px 5px;border-radius:10px">✦ protetor</span>':'';
    const note=f.note?`<div style="font-size:9px;color:var(--mu);margin-top:3px;font-style:italic">${f.note}</div>`:'';
    const alpha=f.alpha?`<div style="font-size:9px;color:var(--mu);margin-top:2px">α=${f.alpha}</div>`:'';
    return `<tr>
      <td><span style="font-weight:600">${f.name}</span>${inv}${alpha}</td>
      <td style="font-size:10px;color:var(--mu)">${f.qs.slice(0,5).map(q=>'Q'+(q+1)).join(',')+(f.qs.length>5?'…':'')}</td>
      <td style="color:${rc(s)};font-weight:700;font-family:'DM Mono',monospace">${pct(s)}</td>
      <td><span class="bdg ${bc(s)}">${classif(s)}</span></td>
      <td style="font-size:10px;font-weight:600;color:${rc(s)}">${sevEng(s)}</td>
      <td style="font-size:11px;color:var(--mu);font-style:italic" id="fc-${i}">${fontes[i]||''}</td>
    </tr>`;
  }).join('');
}

function buildDemo(){
  const p1=['#4f8ef7','#7c5cfc'],p2=['#22c55e','#4f8ef7','#f59e0b','#ef4444','#7c5cfc','#06b6d4'];
  function dBars(id,data,pal){
    const t=Object.values(data).reduce((a,b)=>a+b,0);
    document.getElementById(id).innerHTML=Object.entries(data).sort((a,b)=>b[1]-a[1]).map(([k,v],i)=>`<div class="dem"><div class="dot" style="background:${pal[i%pal.length]}"></div><div class="dlbl">${k}</div><div class="dbb2"><div class="dbf2" style="width:${t?v/t*100:0}%;background:${pal[i%pal.length]}"></div></div><div class="dpct">${v}·${t?(v/t*100).toFixed(0):0}%</div></div>`).join('');
  }
  dBars('sexbars',G.demo.sexo,p1);dBars('faixabars',G.demo.faixa,p2);dBars('escbars',G.demo.escol,p2);dBars('civbars',G.demo.civil,p2);
  dc('sex');const se=Object.entries(G.demo.sexo);charts['sex']=new Chart(document.getElementById('ch-sex').getContext('2d'),{type:'doughnut',data:{labels:se.map(s=>s[0]),datasets:[{data:se.map(s=>s[1]),backgroundColor:p1.map(c=>c+'99'),borderColor:p1,borderWidth:2}]},options:{cutout:'60%',responsive:true,maintainAspectRatio:true,plugins:{legend:{display:true,position:'bottom',labels:{color:'#e8eef8',font:{size:10}}}}}});
  dc('set2');const se2=Object.entries(G.demo.setor).sort((a,b)=>b[1]-a[1]);const sp2=['#4f8ef7','#7c5cfc','#22c55e','#06b6d4','#f59e0b','#ec4899','#10b981','#f97316','#a78bfa','#34d399'];charts['set2']=new Chart(document.getElementById('ch-set2').getContext('2d'),{type:'bar',data:{labels:se2.map(s=>s[0]),datasets:[{data:se2.map(s=>s[1]),backgroundColor:sp2.map(c=>c+'99'),borderColor:sp2,borderWidth:1,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:'#6b7fa3',font:{size:9}},border:{color:'transparent'}},y:{grid:{color:'rgba(255,255,255,.05)'},ticks:{color:'#6b7fa3',font:{size:9}},border:{color:'transparent'}}}}});
  dc('civ');const ce=Object.entries(G.demo.civil);charts['civ']=new Chart(document.getElementById('ch-civ').getContext('2d'),{type:'doughnut',data:{labels:ce.map(s=>s[0]),datasets:[{data:ce.map(s=>s[1]),backgroundColor:p2.map(c=>c+'99'),borderColor:p2,borderWidth:2}]},options:{cutout:'55%',responsive:true,maintainAspectRatio:true,plugins:{legend:{display:true,position:'bottom',labels:{color:'#e8eef8',font:{size:10},boxWidth:10}}}}});
}
