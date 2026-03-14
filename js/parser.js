function parseXlsxRows(rows, extraPdfRows=[]){
  const hdrs=rows[0].map(h=>String(h).toLowerCase().trim());
  const data=rows.slice(1).filter(r=>r.some(c=>c!==''));

  // Pre-process: convert text health-scale answers to numeric (e.g. COPSOQ "Em geral, sente que sua saúde é?")
  const healthTextMap={'excelente':5,'muito boa':4,'muito bom':4,'boa':3,'bom':3,'razoável':2,'razoavel':2,'ruim':1,'péssima':1,'pessima':1};
  data.forEach(row=>{
    for(let i=0;i<row.length;i++){
      if(typeof row[i]==='string'){
        const lc=row[i].trim().toLowerCase();
        if(healthTextMap[lc]!==undefined) row[i]=healthTextMap[lc];
      }
    }
  });
  const inst=INSTRUMENTS[INST];

  // Auto-detect NPS
  let npsCol=hdrs.findIndex(h=>h.includes('0 a 10')||(h.includes('indica')&&h.includes('empresa'))||h.includes('recomendaria'));
  // Auto-detect setor
  let setorCol=hdrs.findIndex(h=>h.includes('setor')||h.includes('sector'));

  // Auto-detect question columns
  let qCols=[];
  for(let q=1;q<=inst.nQuestions;q++){
    const idx=hdrs.findIndex(h=>h.trim().match(new RegExp('^'+q+'[.\s]')));
    if(idx>=0)qCols.push(idx);
  }
  // Fallback: find consecutive numeric cols
  if(qCols.length<inst.nQuestions){
    const numCols=hdrs.map((_,i)=>{
      const vals=data.slice(0,15).map(r=>parseFloat(r[i])).filter(v=>!isNaN(v)&&v>=1&&v<=5);
      return vals.length>=5?i:-1;
    }).filter(i=>i>=0);
    if(numCols.length>=inst.nQuestions){
      for(let s=0;s<=numCols.length-inst.nQuestions;s++){
        const sl=numCols.slice(s,s+inst.nQuestions);
        if(sl.every((v,i)=>i===0||v===sl[i-1]+1)){qCols=sl;break;}
      }
      if(qCols.length<inst.nQuestions)qCols=numCols.slice(0,inst.nQuestions);
    }
  }
  // NPS fallback — look for col with values 0-10 (not restricted to 1-5)
  if(npsCol<0){
    npsCol=hdrs.findIndex((_,i)=>{
      if(qCols.includes(i))return false;
      const vals=data.slice(0,Math.min(data.length,20)).map(r=>parseFloat(r[i])).filter(v=>!isNaN(v));
      if(vals.length<2)return false;
      // Must have some values outside 1-5 range (otherwise it's a Likert col) OR all 0-10
      const has0to10=vals.every(v=>v>=0&&v<=10);
      const hasOutside15=vals.some(v=>v<1||v>5);
      return has0to10&&(hasOutside15||vals.some(v=>v===0));
    });
  }
  // Last resort: scan all cols for 0-10 range including 0s and values >5
  if(npsCol<0){
    npsCol=hdrs.findIndex((_,i)=>{
      if(qCols.includes(i))return false;
      const vals=data.map(r=>parseFloat(r[i])).filter(v=>!isNaN(v)&&v>=0&&v<=10);
      return vals.length>=Math.max(2,data.length*0.5);
    });
  }
  // Setor fallback
  if(setorCol<0){setorCol=hdrs.findIndex((_,i)=>{
    if(i<1||qCols.includes(i)||i===npsCol)return false;
    const vals=data.slice(0,5).map(r=>String(r[i]));
    return vals.every(v=>isNaN(parseFloat(v))&&v.length>2);
  });}

  let notice='';
  if(qCols.length<inst.nQuestions)notice+=`⚠️ Encontradas ${qCols.length}/${inst.nQuestions} perguntas. `;
  if(npsCol<0)notice+='⚠️ NPS não detectado. ';
  if(setorCol<0)notice+='⚠️ Setor não detectado. ';
  if(notice){
    const n=document.getElementById('col-notice');
    n.innerHTML=notice+`<br><span style="font-size:10px">Dica: verifique se o instrumento selecionado corresponde ao formulário enviado. Detectadas ${qCols.length} colunas de questões.</span>`;
    n.style.display='block';
  } else {
    const n=document.getElementById('col-notice');
    n.style.display='none';
  }

  // Compute factor scores (riskInverted: fatores protetores COPSOQ III são invertidos)
  const factorScores=inst.factors.map(f=>{
    const vals=f.qs.flatMap(qi=>{
      const ci=qCols[qi];
      return ci!==undefined?data.map(r=>parseFloat(r[ci])).filter(v=>!isNaN(v)&&v>=1&&v<=5):[];
    });
    if(!vals.length)return 0;
    const m=avg(vals);
    // Special: scale10 = questão com escala 0-10 (ex: saúde geral Q50)
    if(f.scale10){
      const vals10=f.qs.flatMap(qi=>{
        const ci=qCols[qi];
        return ci!==undefined?data.map(r=>parseFloat(r[ci])).filter(v=>!isNaN(v)&&v>=0&&v<=10):[];
      });
      if(!vals10.length)return 0;
      const raw10=(avg(vals10)/10)*100;
      return f.riskInverted?Math.max(0,Math.round((100-raw10)*10)/10):Math.round(raw10*10)/10;
    }
    // Special: binary questions (Sim=1/Não=0) — treated as 0 or 100
    // Detect if values are mostly 0/1 (binary) vs 1-5 (Likert)
    const isBinary=vals.length>0&&vals.every(v=>v===0||v===1);
    let raw;
    if(isBinary){
      raw=avg(vals)*100; // 0=nenhum sim, 100=todos sim
    } else {
      raw=inst.scoring==='copsoq'?(m-1)*25:(m-1)/4*100;
    }
    // Fatores protetores (riskInverted): escore bruto alto = proteção → invertemos para mostrar risco residual
    return (f.riskInverted)?Math.max(0,Math.round((100-raw)*10)/10):Math.round(raw*10)/10;
  });

  const dimScores=inst.dimensions.map(d=>avg(d.factors.map(fi=>factorScores[fi])));

  // NPS
  const npsVals=npsCol>=0?data.map(r=>parseFloat(r[npsCol])).filter(v=>!isNaN(v)&&v>=0&&v<=10):[];
  const nd=npsVals.filter(v=>v<=6).length,nn=npsVals.filter(v=>v>=7&&v<=8).length,np=npsVals.filter(v=>v>=9).length;
  const ns=npsVals.length?(np-nd)/npsVals.length*100:0;

  function cntCol(ci){if(ci<0)return{};const m={};data.forEach(r=>{const v=String(r[ci]).trim();if(v&&v!=='undefined'&&v!=='')m[v]=(m[v]||0)+1;});return m;}
  const faixaC=hdrs.findIndex(h=>h.includes('faixa')||h.includes('idade'));
  const sexoC=hdrs.findIndex(h=>h.includes('sexo')||h.includes('gênero')||h.includes('genero'));
  const civilC=hdrs.findIndex(h=>h.includes('estado civil')||h.includes('civil'));
  const escolC=hdrs.findIndex(h=>h.includes('escolaridade')||h.includes('escolar'));

  const totalRef=parseInt(document.getElementById('f-total').value)||0;
  const adesaoPct=totalRef>0?data.length/totalRef*100:100;

  document.getElementById('f-resp').value=data.length;
  checkAdesao();

  // ── Merge PDF OCR rows into data array ────────────────────────────────────
  // pdfRows are JSON objects {setor, nps, q10...q50}
  // Convert them to synthetic xlsx-style rows and append to data
  if(extraPdfRows && extraPdfRows.length){
    const pdfQKeys=['q10','q11','q12','q13','q14','q15','q16','q17','q18','q19',
                    'q20','q21','q22','q23','q24','q25','q26','q27','q28','q29',
                    'q30','q31','q32','q33','q34','q35','q36','q37','q38','q39',
                    'q40','q41','q42','q43','q44','q45','q46','q47','q48','q49','q50'];
    extraPdfRows.forEach(pr=>{
      // Build a synthetic row that matches the detected column structure
      // We'll append these as pseudo-rows at the END of data after parsing
      // But we need them to fit qCols — so we create a row array large enough
      const synRow=new Array(Math.max(...qCols)+50).fill('');
      // Fill question values
      pdfQKeys.forEach((qk,idx)=>{
        const v=pr[qk];
        if(v!==null&&v!==undefined&&v!==''){
          // Find the qCols index for this question position
          if(idx<qCols.length) synRow[qCols[idx]]=Number(v);
        }
      });
      // Fill NPS and setor at their detected columns
      if(npsCol>=0 && pr.nps!=null) synRow[npsCol]=Number(pr.nps);
      if(setorCol>=0 && pr.setor) synRow[setorCol]=pr.setor;
      data.push(synRow);
    });
    console.log(`Merged ${extraPdfRows.length} PDF rows into dataset. Total: ${data.length}`);
  }

  // Compute per-sector factor scores
  const sectorData={};
  if(setorCol>=0){
    data.forEach(row=>{
      const s=String(row[setorCol]).trim();
      if(!s||s==='undefined')return;
      if(!sectorData[s])sectorData[s]=[];
      sectorData[s].push(row);
    });
  }
  const sectorScores={};
  Object.entries(sectorData).forEach(([setor,rows])=>{
    sectorScores[setor]=inst.factors.map(f=>{
      const vals=f.qs.flatMap(qi=>{
        const ci=qCols[qi];
        return ci!==undefined?rows.map(r=>parseFloat(r[ci])).filter(v=>!isNaN(v)&&v>=1&&v<=5):[];
      });
      if(!vals.length)return null;
      const m=avg(vals);
      const raw=inst.scoring==='copsoq'?(m-1)*25:(m-1)/4*100;
      return (f.riskInverted)?Math.max(0,Math.round((100-raw)*10)/10):Math.round(raw*10)/10;
    });
  });

  G={
    meta:{
      empresa:document.getElementById('f-emp').value||'N/D',
      ramo:document.getElementById('f-ramo').value||'',
      unidade:document.getElementById('f-uni').value||'N/D',
      periodo:document.getElementById('f-per').value||'N/D',
      avaliador:document.getElementById('f-ava').value||'N/D',
      psi:document.getElementById('f-psi').value||'N/D',
      totalRef, adesaoPct
    },
    inst: INST,
    n:data.length,factorScores,dimScores,
    nps:{det:nd,neu:nn,pro:np,score:ns,total:npsVals.length},
    demo:{setor:cntCol(setorCol),faixa:cntCol(faixaC),sexo:cntCol(sexoC),civil:cntCol(civilC),escol:cntCol(escolC)},
    sectorScores,
    logo: logoDataUrl,
    timestamp: new Date().toISOString(),
    pdfCount: extraPdfRows ? extraPdfRows.length : 0,
    xlsxCount: rows.length > 1 ? rows.length - 1 : 0
  };

  fontes=[...inst.defaultFontes];
  selActs.clear();
  const topF=factorScores.map((s,i)=>({s,i})).sort((a,b)=>b.s-a.s).slice(0,4).map(x=>x.i);
  ALIB.forEach((_,idx)=>{if(topF.includes(ALIB[idx].f)&&ALIB[idx].lv==='baixa')selActs.add(idx);});

  buildApp();
}


function parsePdfOnly(rows){
  if(!rows.length){alert('Nenhuma resposta extraída dos PDFs.');document.getElementById('btn-go').disabled=false;updateBtnGo();return;}
  // Build a synthetic xlsx-style dataset where:
  // Col 0: timestamp (dummy)
  // Col 1: empresa
  // Col 2: data
  // Col 3: setor   ← will be auto-detected as setor
  // Col 4: funcao
  // Col 5: NPS (0-10) ← auto-detected as NPS
  // Col 6-46: q10–q50 (41 numeric questions)
  const hdr=['Carimbo','Empresa','Data','Setor','Função',
    'NPS (0-10)',
    'Q10','Q11','Q12','Q13','Q14','Q15','Q16','Q17','Q18','Q19',
    'Q20','Q21','Q22','Q23','Q24','Q25','Q26','Q27','Q28','Q29',
    'Q30','Q31','Q32','Q33','Q34','Q35','Q36','Q37','Q38','Q39',
    'Q40','Q41','Q42','Q43','Q44','Q45','Q46','Q47','Q48','Q49','Q50'];
  const dataRows=rows.map(r=>[
    new Date().toISOString(),
    r.empresa||'',r.data||'',r.setor||'',r.funcao||'',
    r.nps??'',
    r.q10??'',r.q11??'',r.q12??'',r.q13??'',r.q14??'',
    r.q15??'',r.q16??'',r.q17??'',r.q18??'',r.q19??'',
    r.q20??'',r.q21??'',r.q22??'',r.q23??'',r.q24??'',
    r.q25??'',r.q26??'',r.q27??'',r.q28??'',r.q29??'',
    r.q30??'',r.q31??'',r.q32??'',r.q33??'',r.q34??'',
    r.q35??'',r.q36??'',r.q37??'',r.q38??'',r.q39??'',
    r.q40??'',r.q41??'',r.q42??'',r.q43??'',r.q44??'',
    r.q45??'',r.q46??'',r.q47??'',r.q48??'',r.q49??'',r.q50??''
  ]);
  // Force copsoq2a selection
  INST='copsoq2a';
  document.querySelectorAll('.inst-btn').forEach(b=>{
    b.classList.toggle('sel', b.getAttribute('onclick')?.includes('copsoq2a'));
  });
  parseXlsxRows([hdr,...dataRows],[]);
}
