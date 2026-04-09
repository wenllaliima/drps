// ═══════ STATE ════════════════════════════════════════════════════════════════
let G={}, INST='aot', fontes=[], selActs=new Set(), charts={},
    logoDataUrl='', historyDB=[], reportDate='', sectorActions={},
    activeTemplate='ambrac', clinicName='', pdfFiles=[], pdfRows=[],
    upFile=null;

const avg=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
const classif=s=>s<50?'BAIXO':s<75?'MODERADO':'ALTO';
const sevEng=s=>s<10?'Insignificante':s<30?'Baixa':s<50?'Moderada':s<70?'Alta':'Grave';
const rc=s=>s<50?'#10b981':s<75?'#f59e0b':'#ef4444';
const bc=s=>s<50?'bl':s<75?'bm':'bh';
const rb=s=>s<50?'rb-lo':s<75?'rb-mo':'rb-hi';
const pct=v=>v.toFixed(1)+'%';
function dc(id){if(charts[id]){charts[id].destroy();delete charts[id]}}
