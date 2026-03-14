// ═══════ NAVIGATION ═════════════════════════════════════════════
function switchTab(name){
  const map={dash:'panel-dash',fat:'panel-fat',demo:'panel-demo',fontes:'panel-fontes',acoes:'panel-acoes',rel:'panel-rel',hist:'panel-hist'};

  document.querySelectorAll('.tab').forEach((t,i)=>t.classList.toggle('active',names[i]===name));
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.getElementById(map[name]).classList.add('active');
  if(name==='rel'){buildReport();buildTemplateGrid();}
  if(name==='hist')buildHistView();
}

function backToUpload(){
  document.getElementById('app').style.display='none';
  document.getElementById('upl').style.display='flex';
  drop.querySelector('.drop-icon').textContent='📊';
  drop.querySelector('p').innerHTML='<strong>Clique para selecionar</strong> ou arraste aqui';
  document.getElementById('btn-go').disabled=true;document.getElementById('btn-go').textContent='↑ Selecione um arquivo para continuar';
  upFile=null;
}

function printReport(){
  // Build the print zone with the report content
  const rb=document.getElementById('rep-body');
  const pz=document.getElementById('print-zone');
  pz.innerHTML=`<div class="rep-body" style="max-width:100%;border-radius:0;box-shadow:none">${rb.innerHTML}</div>`;
  window.print();
  setTimeout(()=>{pz.innerHTML='';},2000);
}

// ═══════ DOM READY — initialise upload listeners ════════════════
initUpload();
