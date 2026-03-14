// ═══════ UPLOAD SCREEN ════════════════════════════════════════════════════════

function selectInst(id, el){
  INST = id;
  const btn = (el && el.closest) ? el.closest('.inst-btn') : el;
  document.querySelectorAll('.inst-btn').forEach(b => b.classList.remove('sel'));
  if(btn) btn.classList.add('sel');
}

function loadLogo(input){
  const f=input.files[0]; if(!f)return;
  const r=new FileReader();
  r.onload=e=>{
    logoDataUrl=e.target.result;
    const prev=document.getElementById('logo-preview');
    prev.innerHTML=`<img src="${logoDataUrl}" style="max-width:100%;max-height:100%;object-fit:contain">`;
  };
  r.readAsDataURL(f);
}

function checkAdesao(){
  const total=parseInt(document.getElementById('f-total').value)||0;
  const resp=parseInt(document.getElementById('f-resp').value)||0;
  document.getElementById('adesao-warn').style.display=(total>0&&resp>0&&resp/total<0.3)?'block':'none';
}

function acceptXlsx(f){
  upFile=f;
  document.getElementById('xlsx-icon').textContent='✅';
  document.getElementById('xlsx-p1').innerHTML=`<strong>${f.name}</strong>`;
  document.getElementById('xlsx-p2').textContent=(f.size/1024).toFixed(0)+' KB · pronto';
  updateBtnGo();
}

function addPdfFiles(files){
  for(const f of files){
    if(f.type==='application/pdf'&&!pdfFiles.find(p=>p.name===f.name)) pdfFiles.push(f);
  }
  renderPdfList(); updateBtnGo();
}

function removePdf(name){
  pdfFiles=pdfFiles.filter(f=>f.name!==name);
  renderPdfList(); updateBtnGo();
}

function renderPdfList(){
  const badge=document.getElementById('pdf-badge');
  const list=document.getElementById('pdf-list');
  if(!pdfFiles.length){list.innerHTML='';badge.style.display='none';return;}
  badge.textContent=`${pdfFiles.length} PDF${pdfFiles.length>1?'s':''} selecionado${pdfFiles.length>1?'s':''}`;
  badge.style.display='inline';
  document.getElementById('pdf-p1').innerHTML=`<strong>${pdfFiles.length} PDF${pdfFiles.length>1?'s':''}</strong> — clique para adicionar mais`;
  list.innerHTML=pdfFiles.map(f=>`
    <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.25);border-radius:6px;padding:6px 10px;margin-top:4px">
      <span style="font-size:11px">📄 ${f.name} <span style="color:var(--mu)">(${(f.size/1024).toFixed(0)} KB)</span></span>
      <button onclick="removePdf(this.dataset.n)" data-n="${f.name}" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:13px;padding:0 4px">✕</button>
    </div>`).join('');
}

function updateBtnGo(){
  const btn=document.getElementById('btn-go');
  const has=upFile||pdfFiles.length>0;
  btn.disabled=!has;
  if(!has) btn.textContent='↑ Selecione planilha ou PDFs para continuar';
  else if(upFile&&pdfFiles.length) btn.textContent=`→ Analisar planilha + ${pdfFiles.length} PDF${pdfFiles.length>1?'s':''}`;
  else if(upFile) btn.textContent='→ Analisar planilha';
  else btn.textContent=`→ Processar ${pdfFiles.length} PDF${pdfFiles.length>1?'s':''} via OCR`;
}

async function runAnalysis(){
  if(!upFile&&!pdfFiles.length)return;
  const btn=document.getElementById('btn-go');
  btn.disabled=true; pdfRows=[]; let xlsxRows=[];
  if(upFile){
    btn.textContent='📊 Lendo planilha…';
    try{
      const buf=await upFile.arrayBuffer();
      const wb=XLSX.read(buf,{type:'array'});
      const sn=wb.SheetNames.includes('FORM')?'FORM':wb.SheetNames[0];
      xlsxRows=XLSX.utils.sheet_to_json(wb.Sheets[sn],{header:1,defval:''});
    }catch(err){alert('Erro ao ler planilha: '+err.message);btn.disabled=false;updateBtnGo();return;}
  }
  if(pdfFiles.length){
    const apiKey=sessionStorage.getItem('drps_groq_key')||'';
    if(!apiKey){btn.disabled=false;updateBtnGo();showOcrKeyPrompt();return;}
    const statusEl=document.getElementById('ocr-status');
    const progressEl=document.getElementById('ocr-progress');
    statusEl.style.display='block'; progressEl.innerHTML='';
    for(let i=0;i<pdfFiles.length;i++){
      btn.textContent=`🔍 OCR ${i+1}/${pdfFiles.length}…`;
      progressEl.innerHTML+=`<div>📄 ${pdfFiles[i].name} — processando…</div>`;
      try{
        const row=await processPdfOcr(pdfFiles[i],apiKey);
        if(row){pdfRows.push(row);progressEl.innerHTML+=`<div style="color:#34d399">✓ ${pdfFiles[i].name}</div>`;}
      }catch(e){progressEl.innerHTML+=`<div style="color:#f87171">✗ ${pdfFiles[i].name}: ${e.message}</div>`;}
    }
    statusEl.style.display='none';
  }
  btn.textContent='⚙️ Calculando…';
  if(xlsxRows.length) parseXlsxRows(xlsxRows,pdfRows);
  else if(pdfRows.length) parsePdfOnly(pdfRows);
  else{alert('Nenhum dado válido encontrado.');btn.disabled=false;updateBtnGo();}
}

function showOcrKeyPrompt(){
  const n=document.getElementById('col-notice');
  n.style.display='block';
  n.innerHTML=`<div style="font-weight:700;color:#fbbf24;margin-bottom:6px">🔑 Chave Groq para OCR</div>
    <div style="display:flex;gap:8px;margin-bottom:6px">
      <input id="ocr-key-inp" type="password" placeholder="gsk_..."
        style="flex:1;background:var(--sf);border:1px solid var(--bd);border-radius:6px;padding:7px 10px;color:var(--tx);font-family:'DM Mono',monospace;font-size:11px"
        onkeydown="if(event.key==='Enter')confirmOcrKey()">
      <button class="bs p" onclick="confirmOcrKey()" style="padding:7px 14px;font-size:11px">Confirmar</button>
    </div>
    <a href="https://console.groq.com" target="_blank" style="color:var(--ac);font-size:10px">Obter chave gratuita em console.groq.com</a>`;
}

function confirmOcrKey(){
  const v=document.getElementById('ocr-key-inp')?.value?.trim();
  if(!v||v.length<20){alert('Chave inválida.');return;}
  sessionStorage.setItem('drps_groq_key',v);
  document.getElementById('col-notice').style.display='none';
  runAnalysis();
}

function initUpload(){
  const xlsxDrop=document.getElementById('drop');
  const xlsxFi=document.getElementById('fi');
  upFile=null;

  xlsxDrop.addEventListener('dragover',e=>{e.preventDefault();xlsxDrop.classList.add('drag')});
  xlsxDrop.addEventListener('dragleave',()=>xlsxDrop.classList.remove('drag'));
  xlsxDrop.addEventListener('drop',e=>{
    e.preventDefault();xlsxDrop.classList.remove('drag');
    if(e.dataTransfer.files[0]) acceptXlsx(e.dataTransfer.files[0]);
  });
  xlsxFi.addEventListener('change',e=>{if(e.target.files[0]) acceptXlsx(e.target.files[0]);});

  const pdfDrop=document.getElementById('pdf-drop');
  const pdfFi=document.getElementById('pdf-fi');

  pdfDrop.addEventListener('dragover',e=>{e.preventDefault();pdfDrop.classList.add('drag')});
  pdfDrop.addEventListener('dragleave',()=>pdfDrop.classList.remove('drag'));
  pdfDrop.addEventListener('drop',e=>{
    e.preventDefault();pdfDrop.classList.remove('drag');
    addPdfFiles(e.dataTransfer.files);
  });
  pdfFi.addEventListener('change',e=>{addPdfFiles(e.target.files);e.target.value='';});
}
