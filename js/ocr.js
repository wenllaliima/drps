async function processPdfOcr(file,apiKey){
  if(typeof pdfjsLib==='undefined')throw new Error('PDF.js não carregado');
  pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const buf=await file.arrayBuffer();
  const pdf=await pdfjsLib.getDocument({data:buf}).promise;
  const images=[];
  for(let p=1;p<=Math.min(pdf.numPages,8);p++){
    const page=await pdf.getPage(p);
    const vp=page.getViewport({scale:1.5});
    const canvas=document.createElement('canvas');
    canvas.width=vp.width;canvas.height=vp.height;
    await page.render({canvasContext:canvas.getContext('2d'),viewport:vp}).promise;
    images.push(canvas.toDataURL('image/jpeg',0.8).split(',')[1]);
  }
  if(!images.length)throw new Error('PDF sem páginas');
  const resp=await fetch('https://api.groq.com/openai/v1/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey},
    body:JSON.stringify({
      model:'meta-llama/llama-4-scout-17b-16e-instruct',
      max_tokens:1000,temperature:0.1,
      messages:[
        {role:'system',content:'Você é OCR para formulários psicossociais. Responda APENAS com JSON válido.'},
        {role:'user',content:[
          {type:'text',text:`Extraia as respostas deste formulário COPSOQ II preenchido à mão.
Likert: Nunca=1,Raramente=2,Às vezes=3,Muitas vezes=4,Sempre=5. Sim/Não: 1/0. Escala 0-10: número. Não marcado: null.
JSON: {"fonte":"pdf","empresa":null,"setor":null,"funcao":null,"nps":null,"q10":null,"q11":null,"q12":null,"q13":null,"q14":null,"q15":null,"q16":null,"q17":null,"q18":null,"q19":null,"q20":null,"q21":null,"q22":null,"q23":null,"q24":null,"q25":null,"q26":null,"q27":null,"q28":null,"q29":null,"q30":null,"q31":null,"q32":null,"q33":null,"q34":null,"q35":null,"q36":null,"q37":null,"q38":null,"q39":null,"q40":null,"q41":null,"q42":null,"q43":null,"q44":null,"q45":null,"q46":null,"q47":null,"q48":null,"q49":null,"q50":null}`},
          ...images.map(b=>({type:'image_url',image_url:{url:`data:image/jpeg;base64,${b}`}}))
        ]}
      ]
    })
  });
  if(!resp.ok){
    const e=await resp.json().catch(()=>({error:{message:resp.statusText}}));
    if(resp.status===401)sessionStorage.removeItem('drps_groq_key');
    throw new Error(e?.error?.message||resp.statusText);
  }
  const data=await resp.json();
  return JSON.parse((data.choices?.[0]?.message?.content||'').replace(/```json|```/g,'').trim());
}
