const INSTRUMENTS = {

  aot: {
    name: 'AOT — Avaliação da Organização do Trabalho',
    short: 'AOT/DRPS',
    nQuestions: 24,
    scoring: 'likert5_0100', // (mean-1)/4*100
    factors: [
      {name:"Excesso de Demandas",qs:[0,1]},
      {name:"Ociosidade",qs:[2,3]},
      {name:"Baixo Controle",qs:[4,5]},
      {name:"Falta de Apoio",qs:[6,7]},
      {name:"Baixa Clareza",qs:[8,9]},
      {name:"Conflitos e más relações",qs:[10,11]},
      {name:"Falta de reconhecimento",qs:[12,13]},
      {name:"Injustiça no trabalho",qs:[14,15]},
      {name:"Má Gestão de Mudanças",qs:[16,17]},
      {name:"Problemas de comunicação",qs:[18,19]},
      {name:"Assédio",qs:[20,21]},
      {name:"Violência e agressão",qs:[22,23]},
    ],
    dimensions: [
      {name:"EXIGÊNCIAS LABORAIS",abbr:"EL",factors:[0,1],color:"#4f8ef7",desc:"Carga física e mental: pressão por prazos, volume e demandas emocionais."},
      {name:"ORGANIZAÇÃO DO TRABALHO",abbr:"OTC",factors:[3,5],color:"#22c55e",desc:"Clareza de tarefas, autonomia, variedade e previsibilidade."},
      {name:"RELAÇÕES SOCIAIS",abbr:"RSL",factors:[2,4,7],color:"#7c5cfc",desc:"Qualidade das relações com colegas e líderes."},
      {name:"INTERFACE TRABALHO-INDIVÍDUO",abbr:"ITI",factors:[4],color:"#06b6d4",desc:"Equilíbrio entre trabalho e vida pessoal."},
      {name:"VALORES NO TRABALHO",abbr:"VLT",factors:[6,7],color:"#f59e0b",desc:"Alinhamento entre valores pessoais e organizacionais."},
      {name:"COMPORTAMENTOS OFENSIVOS",abbr:"CO",factors:[10,11],color:"#ec4899",desc:"Assédio, violência, discriminação ou bullying."},
    ],
    defaultFontes: [
      "Excesso de tarefas, prazos curtos, multitarefas e pressão por produtividade.",
      "Trabalho repetitivo, falta de variedade, subutilização de competências.",
      "Pouca autonomia nas decisões, ritmo imposto externamente.",
      "Dificuldade de obter apoio da chefia ou dos colegas.",
      "Descrições de cargo imprecisas, metas não comunicadas.",
      "Comunicação disfuncional, disputas interpessoais.",
      "Esforço não reconhecido, ausência de feedback positivo.",
      "Distribuição desigual de tarefas, favoritismo percebido.",
      "Mudanças sem comunicação prévia, falta de suporte na transição.",
      "Ruídos e distância física dificultam a comunicação.",
      "Comportamentos de humilhação ou discriminação no ambiente.",
      "Exposição a ameaças ou agressões no exercício das funções.",
    ],
    formulaNote: 'Score = (média − 1) ÷ 4 × 100 · Escala Likert 1–5 → 0–100% · Quanto maior, maior o risco.'
  },

  copsoq2s: {
    name: 'COPSOQ II — Versão Curta',
    short: 'COPSOQ II Curta',
    nQuestions: 40,
    scoring: 'copsoq', // score = (mean - 1) * 25 → 0-100
    factors: [
      // EXIGÊNCIAS LABORAIS — risco: score alto = maior exigência
      // Q1 (qs[1]) = "Tem tempo suficiente?" — item positivo dentro de fator de demanda → inverter individualmente
      {name:"Exigências Quantitativas",            qs:[0,1],   invertedQs:[1]},
      {name:"Ritmo de Trabalho",                   qs:[2]},
      {name:"Exigências Cognitivas",               qs:[3,4]},
      {name:"Exigências Emocionais",               qs:[5]},
      // ORGANIZAÇÃO DO TRABALHO E CONTEÚDO — protetores: score alto = menos risco
      {name:"Influência no Trabalho",              qs:[6],     riskInverted:true},
      {name:"Possibilidades de Desenvolvimento",   qs:[7,8],   riskInverted:true},
      {name:"Significado do Trabalho",             qs:[9,10],  riskInverted:true},
      {name:"Compromisso com o Local de Trabalho", qs:[11],    riskInverted:true},
      // RELAÇÕES SOCIAIS E LIDERANÇA — protetores
      {name:"Previsibilidade",                     qs:[12,13], riskInverted:true},
      {name:"Reconhecimento e Recompensas",        qs:[14,15], riskInverted:true},
      {name:"Transparência do Papel",              qs:[16],    riskInverted:true},
      {name:"Qualidade da Liderança",              qs:[17],    riskInverted:true},
      {name:"Apoio Social de Superiores",          qs:[18],    riskInverted:true},
      // INTERFACE TRABALHO-INDIVÍDUO
      {name:"Insegurança Laboral",                 qs:[19]},
      {name:"Satisfação Laboral",                  qs:[20],    riskInverted:true},
      {name:"Conflito Trabalho-Família",           qs:[21,22]},
      // VALORES NO LOCAL DE TRABALHO — protetores
      {name:"Confiança Vertical",                  qs:[23,24], riskInverted:true},
      {name:"Justiça e Respeito",                  qs:[25,26], riskInverted:true},
      {name:"Comunidade Social no Trabalho",       qs:[27],    riskInverted:true},
      // PERSONALIDADE — protetor
      {name:"Auto-Eficácia",                       qs:[28],    riskInverted:true},
      // SAÚDE E BEM-ESTAR — Saúde Geral: score alto = boa saúde = protetor; demais = risco
      {name:"Saúde Geral",                         qs:[29],    riskInverted:true},
      {name:"Stress",                              qs:[30,31]},
      {name:"Burnout",                             qs:[32,33]},
      {name:"Problemas de Sono",                   qs:[34]},
      {name:"Sintomas Depressivos",                qs:[35]},
      // COMPORTAMENTOS OFENSIVOS — risco
      {name:"Comportamentos Ofensivos",            qs:[36,37,38,39]},
    ],
    dimensions: [
      {name:"EXIGÊNCIAS LABORAIS",                abbr:"EL", factors:[0,1,2,3],         color:"#ef4444",desc:"Sobrecarga quantitativa, cognitiva, emocional e ritmo."},
      {name:"ORGANIZAÇÃO DO TRABALHO E CONTEÚDO", abbr:"OTC",factors:[4,5,6,7],         color:"#f59e0b",desc:"Influência, desenvolvimento, significado e comprometimento."},
      {name:"RELAÇÕES SOCIAIS E LIDERANÇA",       abbr:"REL",factors:[8,9,10,11,12],    color:"#3b82f6",desc:"Previsibilidade, reconhecimento, papel, liderança e apoio."},
      {name:"INTERFACE TRABALHO-INDIVÍDUO",       abbr:"ITI",factors:[13,14,15],         color:"#8b5cf6",desc:"Insegurança, satisfação e conflito trabalho-família."},
      {name:"VALORES NO LOCAL DE TRABALHO",       abbr:"VLT",factors:[16,17,18],         color:"#10b981",desc:"Confiança, justiça e comunidade organizacional."},
      {name:"PERSONALIDADE",                      abbr:"PER",factors:[19],               color:"#06b6d4",desc:"Auto-eficácia profissional."},
      {name:"SAÚDE E BEM-ESTAR",                  abbr:"SAU",factors:[20,21,22,23,24],   color:"#ec4899",desc:"Saúde geral, stress, burnout, sono e sintomas depressivos."},
      {name:"COMPORTAMENTOS OFENSIVOS",           abbr:"CO", factors:[25],               color:"#64748b",desc:"Assédio, violência e comportamentos hostis."},
    ],
    defaultFontes: [
      "Sobrecarga de tarefas e prazos apertados.",
      "Ritmo de trabalho acelerado e sem pausas.",
      "Alta demanda de concentração e memória.",
      "Exigências emocionais no contato com situações ou pessoas difíceis.",
      "Baixa autonomia e influência sobre as decisões.",
      "Poucas oportunidades de aprendizado e crescimento.",
      "Trabalho percebido como sem propósito ou importância.",
      "Baixo envolvimento e identificação com a organização.",
      "Falta de informação antecipada sobre mudanças.",
      "Esforço não reconhecido pela organização.",
      "Ambiguidade ou conflito nas responsabilidades.",
      "Liderança ineficaz ou distante.",
      "Falta de suporte da chefia.",
      "Incerteza sobre a continuidade do emprego.",
      "Baixa satisfação com as condições de trabalho.",
      "Dificuldade em conciliar demandas do trabalho e da família.",
      "Baixa confiança nas decisões da gestão.",
      "Percepção de injustiça nas decisões e tratamento.",
      "Clima organizacional desfavorável e falta de coesão.",
      "Baixa crença nas próprias capacidades profissionais.",
      "Saúde geral prejudicada pelas condições de trabalho.",
      "Exposição continuada a situações estressantes.",
      "Exaustão física e mental frequentes.",
      "Dificuldades de sono relacionadas ao trabalho.",
      "Sintomas de tristeza, irritabilidade ou ansiedade persistentes.",
      "Exposição a comportamentos hostis, assédio ou violência.",
    ],
    formulaNote: 'Score COPSOQ II = (média − 1) × 25 → 0–100 · Escala Likert 1–5 · Itens positivos dentro de fatores de demanda são invertidos (6 − resposta) antes do cálculo · Fatores protetores (Recursos, Valores, Saúde Geral, Auto-Eficácia): risco exibido como 100 − score · Fatores de exigência/risco: score alto = maior risco.'
  },
  // ─── COPSOQ II ADAPTADO (Versão baixa escolaridade) ─────────────────────────
  copsoq2a: {
    name: 'COPSOQ II — Versão Adaptada (Baixa Escolaridade)',
    short: 'COPSOQ II Adapt.',
    nQuestions: 41,
    scoring: 'copsoq',
    factors: [
      {name:"Exigências Quantitativas",   qs:[0,1,2,3,4], riskInverted:false, note:"Q10-14: ritmo, pressão, sobrecarga, interrupções, volume."},
      {name:"Exigências Cognitivas",      qs:[5,6,7],     riskInverted:false, note:"Q15-17: concentração, memória, decisões difíceis."},
      {name:"Exigências Emocionais",      qs:[8],         riskInverted:false, note:"Q18: trabalho emocionalmente desgastante."},
      {name:"Ocultamento de Emoções",     qs:[9],         riskInverted:false, note:"Q19: fingir que está bem."},
      {name:"Influência no Trabalho",     qs:[10,11,12],  riskInverted:true,  note:"Q20-22: autonomia, participação, liberdade."},
      {name:"Possib. de Desenvolvimento", qs:[13,14],     riskInverted:true,  note:"Q23-24: aprendizado e variedade."},
      {name:"Significado do Trabalho",    qs:[15,16,17],  riskInverted:true,  note:"Q25-27: importância, orgulho, sentido."},
      {name:"Previsibilidade",            qs:[18,19],     riskInverted:true,  note:"Q28-29: comunicação e informações claras."},
      {name:"Transparência do Papel",     qs:[20],        riskInverted:true,  note:"Q30: sabe suas responsabilidades."},
      {name:"Conflito de Papel",          qs:[21],        riskInverted:false, note:"Q31: ordens contraditórias."},
      {name:"Qualidade da Liderança",     qs:[22,23,24],  riskInverted:true,  note:"Q32-34: organização, apoio e feedback."},
      {name:"Reconhecimento",             qs:[25],        riskInverted:true,  note:"Q35: trabalho valorizado."},
      {name:"Justiça Organizacional",     qs:[26],        riskInverted:true,  note:"Q36: tratamento justo."},
      {name:"Apoio Social Colegas",       qs:[27],        riskInverted:true,  note:"Q37: apoio dos colegas."},
      {name:"Comunidade Social",          qs:[28],        riskInverted:true,  note:"Q38: grupo unido."},
      {name:"Burnout",                    qs:[29,30],     riskInverted:false, note:"Q39-40: exaustão física e mental."},
      {name:"Problemas de Sono",          qs:[31],        riskInverted:false, note:"Q41: dificuldade para dormir."},
      {name:"Estresse",                   qs:[32,33,34],  riskInverted:false, note:"Q42-44: irritação, dores, tristeza."},
      {name:"Comportamentos Ofensivos",   qs:[35,36,37,38,39], riskInverted:false, note:"Q45-49: humilhação, assédio, ameaças, violência, brigas. Q45-48 são binárias (Sim=1/Não=0)."},
      {name:"Saúde Geral (autopercebida)",qs:[40],        riskInverted:true,  note:"Q50: nota 0-10 de saúde. Escore alto = boa saúde = baixo risco.", scale10:true},
    ],
    dimensions: [
      {name:"EXIGÊNCIAS NO TRABALHO",  abbr:"EXT", factors:[0,1,2,3],           color:"#ef4444", desc:"Sobrecarga quantitativa, cognitiva, emocional e ocultamento."},
      {name:"RECURSOS E ORGANIZAÇÃO",  abbr:"REC", factors:[4,5,6,7,8,9,10,11,12,13,14], color:"#3b82f6", desc:"Autonomia, desenvolvimento, significado, previsibilidade, papel, liderança, reconhecimento, justiça e apoio."},
      {name:"SAÚDE E COMPORTAMENTOS",  abbr:"SAU", factors:[15,16,17,18,19],    color:"#8b5cf6", desc:"Burnout, sono, estresse, comportamentos ofensivos e saúde geral."},
    ],
    defaultFontes: [
      "Ritmo acelerado, pressão por prazos e volume de tarefas excessivo.",
      "Alta demanda de atenção e decisões frequentes sob pressão.",
      "Contato com situações emocionalmente desgastantes.",
      "Exigência de fingir sentimentos ou esconder emoções.",
      "Baixa autonomia e pouca participação nas decisões.",
      "Poucas oportunidades de aprender e pouca variedade.",
      "Trabalho percebido como sem significado.",
      "Mudanças sem comunicação prévia.",
      "Dúvidas sobre responsabilidades e limites do cargo.",
      "Ordens contraditórias de diferentes lideranças.",
      "Liderança desorganizada ou distante.",
      "Esforço não reconhecido pela chefia.",
      "Percepção de injustiça no tratamento.",
      "Falta de apoio dos colegas.",
      "Clima desfavorável e falta de união.",
      "Exaustão física e mental frequentes.",
      "Dificuldades de sono ligadas ao trabalho.",
      "Irritabilidade, ansiedade e tristeza recorrentes.",
      "Exposição a violência, assédio ou comportamentos hostis.",
      "Percepção negativa da própria saúde.",
    ],
    formulaNote: 'Q10-44 e Q49: score = (média−1)×25 (Likert 1–5 → 0–100). Q45-48 binárias: Sim=100, Não=0. Q50 saúde (0–10): score = valor×10, invertido para risco. Protetores: risco = 100 − score.'
  },


  copsoq2m: {
    name: 'COPSOQ II — Versão Média',
    short: 'COPSOQ II Média',
    nQuestions: 76,
    scoring: 'copsoq',
    factors: [
      // EXIGÊNCIAS LABORAIS — risco: score alto = maior exigência
      // Nota: verificar se algum item de Exigências Quantitativas é positivamente redigido (ex: "Tem tempo suficiente?") e adicionar invertedQs se necessário
      {name:"Exigências Quantitativas",            qs:[0,1,2]},
      {name:"Ritmo de Trabalho",                   qs:[3]},
      {name:"Exigências Cognitivas",               qs:[4,5,6]},
      {name:"Exigências Emocionais",               qs:[7]},
      // ORGANIZAÇÃO DO TRABALHO E CONTEÚDO — protetores
      {name:"Influência no Trabalho",              qs:[8,9,10,11],   riskInverted:true},
      {name:"Possibilidades de Desenvolvimento",   qs:[12,13,14],    riskInverted:true},
      {name:"Significado do Trabalho",             qs:[15,16,17],    riskInverted:true},
      {name:"Compromisso com o Local de Trabalho", qs:[18,19],       riskInverted:true},
      // RELAÇÕES SOCIAIS E LIDERANÇA — protetores (exceto Conflitos de Papel)
      {name:"Previsibilidade",                     qs:[20,21],       riskInverted:true},
      {name:"Reconhecimento e Recompensas",        qs:[22,23,24],    riskInverted:true},
      {name:"Transparência do Papel",              qs:[25,26,27],    riskInverted:true},
      {name:"Conflitos de Papel",                  qs:[28,29,30]},
      {name:"Qualidade da Liderança",              qs:[31,32,33,34], riskInverted:true},
      {name:"Apoio Social de Superiores",          qs:[35,36,37],    riskInverted:true},
      {name:"Apoio Social de Colegas",             qs:[38,39,40],    riskInverted:true},
      // INTERFACE TRABALHO-INDIVÍDUO
      {name:"Insegurança Laboral",                 qs:[41]},
      {name:"Satisfação Laboral",                  qs:[42,43,44,45], riskInverted:true},
      {name:"Conflito Trabalho-Família",           qs:[46,47,48]},
      // VALORES NO LOCAL DE TRABALHO — protetores
      {name:"Confiança Vertical",                  qs:[49,50,51],    riskInverted:true},
      {name:"Confiança Horizontal",                qs:[52,53,54],    riskInverted:true},
      {name:"Justiça e Respeito",                  qs:[55,56,57],    riskInverted:true},
      {name:"Comunidade Social no Trabalho",       qs:[58,59,60],    riskInverted:true},
      // PERSONALIDADE — protetor
      {name:"Auto-Eficácia",                       qs:[61,62],       riskInverted:true},
      // SAÚDE E BEM-ESTAR — Saúde Geral: protetor; demais: risco
      {name:"Saúde Geral",                         qs:[63],          riskInverted:true},
      {name:"Stress",                              qs:[64,65]},
      {name:"Burnout",                             qs:[66,67]},
      {name:"Problemas de Sono",                   qs:[68,69]},
      {name:"Sintomas Depressivos",                qs:[70,71]},
      // COMPORTAMENTOS OFENSIVOS — risco
      {name:"Comportamentos Ofensivos",            qs:[72,73,74,75]},
    ],
    dimensions: [
      {name:"EXIGÊNCIAS LABORAIS",                abbr:"EL", factors:[0,1,2,3],           color:"#ef4444",desc:"Demandas quantitativas, cognitivas, emocionais e ritmo."},
      {name:"ORGANIZAÇÃO DO TRABALHO E CONTEÚDO", abbr:"OTC",factors:[4,5,6,7],           color:"#f59e0b",desc:"Influência, desenvolvimento, significado e comprometimento."},
      {name:"RELAÇÕES SOCIAIS E LIDERANÇA",       abbr:"REL",factors:[8,9,10,11,12,13,14],color:"#3b82f6",desc:"Previsibilidade, reconhecimento, papel, conflitos, liderança e apoio."},
      {name:"INTERFACE TRABALHO-INDIVÍDUO",       abbr:"ITI",factors:[15,16,17],           color:"#8b5cf6",desc:"Insegurança, satisfação e conflito trabalho-família."},
      {name:"VALORES NO LOCAL DE TRABALHO",       abbr:"VLT",factors:[18,19,20,21],        color:"#10b981",desc:"Confiança vertical e horizontal, justiça e comunidade."},
      {name:"PERSONALIDADE",                      abbr:"PER",factors:[22],                 color:"#06b6d4",desc:"Auto-eficácia profissional."},
      {name:"SAÚDE E BEM-ESTAR",                  abbr:"SAU",factors:[23,24,25,26,27],     color:"#ec4899",desc:"Saúde geral, stress, burnout, sono e sintomas depressivos."},
      {name:"COMPORTAMENTOS OFENSIVOS",           abbr:"CO", factors:[28],                 color:"#64748b",desc:"Assédio, violência e comportamentos hostis."},
    ],
    defaultFontes: Array(29).fill("Fator identificado na avaliação — editar fonte geradora."),
    formulaNote: 'Score COPSOQ II = (média − 1) × 25 → 0–100 · Escala Likert 1–5 · Fatores protetores (Recursos, Valores, Apoio, Satisfação, Saúde Geral, Auto-Eficácia): risco exibido como 100 − score · Conflitos de Papel, Insegurança e Exigências: score alto = maior risco · Versão média com 29 fatores.'
  },

  // ─── COPSOQ III — Estrutura validada para o Brasil (Rodrigues, 2020) ───────────
  // Versão padrão: 79 itens → 7 fatores empíricos (AFC, TG N=542, α=0,78–0,98)
  // Referência: Rodrigues, C.A. (2020). Estudos das propriedades psicométricas do
  //             COPSOQ III. Tese de Doutorado, Universidade São Francisco, Campinas.
  //
  // Mapeamento de colunas na planilha Google Forms (0-indexado a partir da 1ª questão):
  // Bloco B.1 (Q1–Q12): Demandas/Ritmo/Cognitivas/Emocionais/Ocultamento de emoções
  // Bloco B.2 (Q13–Q18): Conflito vida profissional-privada
  // Bloco B.3 (Q19–Q27): Influência / Controle do tempo
  // Bloco B.4 (Q28–Q42): Desenvolvimento / Variação / Significado / Comprometimento
  // Bloco B.5 (Q43–Q51): Previsibilidade / Clareza / Conflito de papel / Tarefas ilegítimas
  // Bloco B.6 (Q52–Q55): Qualidade da liderança
  // Bloco B.7 (Q56–Q64): Apoio de colegas e supervisores / Senso de comunidade
  // Bloco B.8 (Q65–Q78): Confiança / Justiça / Reconhecimento / Comportamentos ofensivos
  // Bloco B.9 (Q79–Q85): Insegurança no trabalho e no ambiente
  // Bloco B.10 (Q86–Q90): Satisfação no trabalho
  // Bloco B.11 (Q91–Q92): Engajamento no trabalho
  // Bloco B.12 (Q93–Q101): Comportamentos ofensivos (fofoca, conflitos, assédio, violência)
  // Bloco C.1 (Q102): Saúde autoavaliada
  // Bloco C.3 (Q103–Q122): Problemas de sono / Burnout / Estresse / Sintomas depressivos
  // Bloco C.4 (Q123–Q125): Autoeficácia
  //
  // ÍNDICES de questão abaixo = posição 0-based da coluna de questão na planilha
  // Versão PADRÃO (79 itens) — 7 fatores conforme Tabela 26/27 (Rodrigues, 2020):

  copsoq3: {
    name: 'COPSOQ III — Brasil (Rodrigues, 2020)',
    short: 'COPSOQ III BR',
    nQuestions: 79,
    scoring: 'copsoq', // score = (média − 1) × 25 → 0–100
    // Subversões disponíveis para seleção pelo usuário
    subversions: [
      {id:'padrao', label:'Padrão (79 itens)', nQ:79},
      {id:'reduzida', label:'Reduzida (33 itens)', nQ:33},
    ],

    // ── 7 FATORES EMPÍRICOS (Tabela 27, amostra geral TG N=542) ─────────────────
    // Cada fator agrupa dimensões originais do COPSOQ III conforme AFC
    // Os índices de questão abaixo são POSIÇÕES na planilha (0 = primeira questão após dados demog.)
    // Mapeados conforme Anexo 15 (Rodrigues, 2020) e numeração B.x do instrumento

    factors: [
      // F1 — Satisfação com o trabalho e autoeficácia (α=0,84)
      // Dimensões: Satisfação JS (B.10.1–B.10.5), Engajamento WE (B.11.1–B.11.2), Autoeficácia SE (C.4.1–C.4.3)
      {
        name: "Satisfação com o Trabalho e Autoeficácia",
        sigla: "F1-SAT",
        alpha: 0.84,
        dims: ["Satisfação no Trabalho (JS)", "Engajamento (WE)", "Autoeficácia (SE)"],
        // Questões: B.10.1(satisf. perspectivas), B.10.2(recursos), B.10.3(habilidades), B.10.4(emprego geral), B.10.5(salário)
        //           B.11.1(cheio de energia), B.11.2(entusiasmado)
        //           C.4.1, C.4.2, C.4.3 (autoeficácia — itens de escala inversa: alto=proteção)
        qs: [85,86,87,88,89,  90,91,  122,123,124],
        inverted: false, // F1 alto = melhor saúde/satisfação → para risco, usar (100 - score)
        riskInverted: true,
        note: "Fator protetor: escores altos indicam bem-estar. O risco é interpretado como (100 − score)."
      },
      // F2 — Saúde e bem-estar (α=0,95)
      // Dimensões: Saúde GH (C.1), Sono SL (C.3.1–C.3.3), Burnout BO (C.3.4–C.3.6), Estresse ST, SO, CS, DS (C.3.7–C.3.20)
      {
        name: "Saúde e Bem-Estar",
        sigla: "F2-SAU",
        alpha: 0.95,
        dims: ["Saúde Autoavaliada (GH)", "Problemas de Sono (SL)", "Burnout (BO)", "Estresse (ST/SO/CS/DS)"],
        // C.1=Q102, C.3.1–C.3.20 = Q103–Q122 (20 itens de sintomas — alto = pior saúde)
        qs: [101,  102,103,104,  105,106,107,108,  109,110,111,112,113,114,115,116,117,118,119,120],
        inverted: false,
        riskInverted: false,
        note: "Escores altos indicam pior estado de saúde/bem-estar (sintomas frequentes)."
      },
      // F3 — Demandas e conflitos (α=0,86)
      // Dimensões: Demandas Quantitativas QD (B.1.2–B.1.4), Ocultamento emoções HE (B.1.8), Conflito WF (B.2.1–B.2.5)
      {
        name: "Demandas e Conflito Trabalho-Vida",
        sigla: "F3-DEM",
        alpha: 0.86,
        dims: ["Demandas Quantitativas (QD)", "Ocultamento de Emoções (HE)", "Conflito Trabalho-Família (WF)"],
        // B.1.2=Q1(carga desigual), B.1.3=Q2(sem tempo), B.1.8=Q7(esconder opinião)
        // B.2.1=Q12(casa e trabalho ao mesmo tempo), B.2.1(2)=Q13, B.2.3(2)=Q15, B.2.4(2)=Q16, B.2.5(2)=Q17
        qs: [1, 2,  7,  12,13,15,16,17],
        inverted: false,
        riskInverted: false,
        note: "Escores altos indicam maior sobrecarga de demandas e conflito entre trabalho e vida privada."
      },
      // F4 — Influência no trabalho (α=0,78)
      // Dimensão: Influência IN (B.3.1–B.3.5) — fator protetor
      {
        name: "Influência no Trabalho",
        sigla: "F4-INF",
        alpha: 0.78,
        dims: ["Influência no Trabalho (IN)"],
        // B.3.1=Q18(influência decisões), B.3.2=Q19(velocidade), B.3.4=Q21(o quê faz), B.3.5=Q22(como faz)
        qs: [18, 19, 21, 22],
        inverted: false,
        riskInverted: true,
        note: "Fator protetor: escores altos indicam maior autonomia. O risco é interpretado como (100 − score)."
      },
      // F5 — Senso de comunidade e significado do trabalho (α=0,98)
      // Dimensões: Variação VA, Desenvolvimento PD, Significado MW, Comprometimento CW, Apoio SC/SS, Senso comunidade SW
      {
        name: "Senso de Comunidade e Significado",
        sigla: "F5-COM",
        alpha: 0.98,
        dims: ["Variação (VA)", "Possib. Desenvolvimento (PD)", "Significado (MW)", "Comprometimento (CW)", "Apoio Colegas (SC)", "Apoio Supervisores (SS)", "Senso Comunidade (SW)"],
        // B.4.1=Q27(variado), B.4.2=Q28(mesmo tipo), B.4.1(2)=Q29, B.4.2(2)=Q30, B.4.3(2)=Q31
        // B.4.4(2)=Q32(significativo), B.4.5(2)=Q33(importante), B.4.6(2)=Q34(orgulho), B.4.7(2)=Q35, B.4.8(2)=Q36
        // B.7.1=Q55(apoio colegas), B.7.2=Q56, B.7.3=Q57(supervisores), B.7.4=Q58
        // B.7.7=Q61(clima bom), B.7.8=Q62(boa cooperação), B.7.9=Q63(parte da equipe)
        qs: [27,28, 29,30,31, 32,33, 34,35,36, 55,56,57,58, 61,62,63],
        inverted: false,
        riskInverted: true,
        note: "Fator protetor: escores altos indicam pertencimento e propósito. O risco é interpretado como (100 − score)."
      },
      // F6 — Reconhecimento e qualidade da liderança (α=0,95)
      // Dimensões: Clareza CL (B.5.3–B.5.5), Qualidade Liderança QL (B.6.1–B.6.4), Reconhecimento RE (B.8.9–B.8.11), Confiança Horizontal TE (B.8.14), Confiança Vertical TM (B.8.1), Justiça JU (B.8.5–B.8.8)
      {
        name: "Reconhecimento e Qualidade da Liderança",
        sigla: "F6-LID",
        alpha: 0.95,
        dims: ["Clareza da Função (CL)", "Qualidade da Liderança (QL)", "Reconhecimento (RE)", "Confiança Horizontal (TE)", "Confiança Vertical (TM)", "Justiça Organizacional (JU)"],
        // B.5.3=Q42(objetivos claros), B.5.4=Q43, B.5.5=Q44
        // B.6.1=Q51, B.6.2=Q52, B.6.3=Q53, B.6.4=Q54
        // B.8.1=Q64(gerência confia), B.8.5=Q68(conflitos justo), B.8.6=Q69(trabalho justo), B.8.7=Q70, B.8.8=Q71
        // B.8.9=Q72(reconhecido), B.8.10=Q73(respeitado), B.8.11=Q74(tratado justo), B.8.14=Q77(confiam uns outros)
        qs: [42,43,44,  51,52,53,54,  64,  68,69,70,71,  72,73,74,  77],
        inverted: false,
        riskInverted: true,
        note: "Fator protetor: escores altos indicam liderança de qualidade e reconhecimento. O risco é (100 − score)."
      },
      // F7 — Insegurança (α=0,85)
      // Dimensões: Insegurança Emprego JI (B.9.2), Insegurança Ambiente IW (B.9.4–B.9.6)
      {
        name: "Insegurança no Trabalho",
        sigla: "F7-INS",
        alpha: 0.85,
        dims: ["Insegurança em relação ao Emprego (JI)", "Insegurança em relação ao Ambiente (IW)"],
        // B.9.2=Q80(ficar desemp.), B.9.4=Q82(transf. contra vontade), B.9.5=Q83(tarefas alteradas), B.9.6=Q84(cronograma alterado)
        qs: [80, 82, 83, 84],
        inverted: false,
        riskInverted: false,
        note: "Escores altos indicam maior percepção de insegurança quanto ao emprego e às condições de trabalho."
      },
    ],

    // ── DIMENSÕES PARA O DASHBOARD (agrupamento dos 7 fatores em domínios) ──────
    dimensions: [
      {
        name: "DEMANDAS E CONFLITOS",
        abbr: "DEM",
        factors: [2], // F3
        color: "#ef4444",
        desc: "Sobrecarga quantitativa, ocultamento de emoções e conflito trabalho-família."
      },
      {
        name: "ORGANIZAÇÃO E AUTONOMIA",
        abbr: "ORG",
        factors: [3, 5], // F4 Influência + F6 Liderança
        color: "#f59e0b",
        desc: "Influência no trabalho, qualidade da liderança, clareza de função e reconhecimento."
      },
      {
        name: "COMUNIDADE E SIGNIFICADO",
        abbr: "COM",
        factors: [4], // F5
        color: "#3b82f6",
        desc: "Senso de pertencimento, apoio social, significado e comprometimento organizacional."
      },
      {
        name: "SAÚDE E BEM-ESTAR",
        abbr: "SAU",
        factors: [1], // F2
        color: "#ec4899",
        desc: "Saúde autoavaliada, sono, burnout, estresse e sintomas depressivos."
      },
      {
        name: "SATISFAÇÃO E AUTOEFICÁCIA",
        abbr: "SAT",
        factors: [0], // F1
        color: "#10b981",
        desc: "Satisfação com o trabalho, engajamento e autoeficácia profissional."
      },
      {
        name: "INSEGURANÇA",
        abbr: "INS",
        factors: [6], // F7
        color: "#8b5cf6",
        desc: "Insegurança quanto ao emprego e às condições/ambiente de trabalho."
      },
    ],

    defaultFontes: [
      "Distribuição desigual de tarefas, prazos curtos, pressão por produtividade e conflito entre demandas do trabalho e da vida privada.",
      "Exposição prolongada a sintomas de estresse, burnout, privação de sono e comprometimento da saúde percebida.",
      "Acúmulo de demandas quantitativas, exigência de ocultamento de emoções e interferência do trabalho na vida familiar.",
      "Baixa autonomia nas decisões sobre o próprio trabalho, ritmo imposto e pouca influência sobre as condições laborais.",
      "Falta de reconhecimento pelos pares e pela liderança, ausência de propósito percebido e clima organizacional desfavorável.",
      "Liderança pouco desenvolvida, critérios de reconhecimento pouco claros, injustiça percebida nas decisões organizacionais.",
      "Reestruturações organizacionais, mudanças de função ou condições sem consulta prévia, insegurança quanto à continuidade do emprego.",
    ],

    formulaNote: 'Score COPSOQ III BR = (média − 1) × 25 → 0–100 · Escala Likert 1–5 · Fatores protetores (F1/F4/F5/F6) têm risco calculado como (100 − score). Estrutura de 7 fatores validada por Rodrigues (2020), Universidade São Francisco — versão padrão 79 itens, α 0,78–0,98.',

    citation: 'Rodrigues, C. A. (2020). Estudos das propriedades psicométricas do Copenhagen Psychosocial Questionnaire – COPSOQ III. Tese de Doutorado, Programa de Pós-Graduação Stricto Sensu em Psicologia, Universidade São Francisco, Campinas.'
  }
};


const ALIB=[
  {f:0,lv:"baixa",type:"Ergonomia",title:"Ginástica Laboral",desc:"Alongamentos rápidos durante pausas programadas.",target:"Operacional"},
  {f:0,lv:"baixa",type:"Processo",title:"Mapeamento de Sobrecarga",desc:"Identificar 3 gargalos ou atividades que geram maior sobrecarga.",target:"Intermediária"},
  {f:0,lv:"baixa",type:"Alinhamento",title:"Alinhamento de Metas Realistas",desc:"Comunicação de metas alcançáveis e redistribuição de carga.",target:"Intermediária"},
  {f:0,lv:"média",type:"Processo",title:"Revisão dos Fluxos de Trabalho",desc:"Ajuste dos tempos de ciclo com base na realidade operacional.",target:"Intermediária"},
  {f:0,lv:"alta",type:"RH",title:"Aumento de Quadro",desc:"Contratação nos setores com maior sobrecarga.",target:"Superior"},
  {f:1,lv:"baixa",type:"Organização",title:"Rodízio Simples de Tarefas",desc:"Rodízio entre tarefas rotineiras para combater monotonia.",target:"Intermediária"},
  {f:1,lv:"baixa",type:"Inovação",title:"Banco de Ideias",desc:"Usar períodos de baixa demanda para propor soluções.",target:"Operacional"},
  {f:1,lv:"média",type:"Desenvolvimento",title:"Job Enlargement",desc:"Ampliação horizontal das tarefas do cargo.",target:"Superior"},
  {f:2,lv:"baixa",type:"Autonomia",title:"Flexibilização de Detalhes",desc:"Permitir escolhas em aspectos não críticos da rotina.",target:"Intermediária"},
  {f:2,lv:"baixa",type:"Participação",title:"Mini-Comitê de Planejamento",desc:"Grupos rotativos ajustam regras da rotina com a chefia.",target:"Operacional"},
  {f:2,lv:"média",type:"Autonomia",title:"Autonomia em Pausas",desc:"Trabalhador escolhe o momento das pausas dentro de janela.",target:"Intermediária"},
  {f:3,lv:"baixa",type:"Comunicação",title:"Canais de Escuta Semanal",desc:"Reuniões de check-in de 10 min para identificar necessidades.",target:"Intermediária"},
  {f:3,lv:"baixa",type:"Suporte",title:"Rede de Consultores Internos",desc:"Colaboradores experientes como referência para dúvidas.",target:"Operacional"},
  {f:3,lv:"média",type:"Suporte",title:"Primeiros Socorros Psicológicos",desc:"Treinamento em PSP com protocolo de apoio pós-incidente.",target:"Intermediária"},
  {f:4,lv:"baixa",type:"Comunicação",title:"Clareza de 5 Minutos (semanal)",desc:"Agenda semanal explicando metas e papel de cada um.",target:"Intermediária"},
  {f:4,lv:"média",type:"Processo",title:"Matriz de Responsabilidade RACI",desc:"Definir Responsável, Aprovador, Consultado e Informado.",target:"Superior"},
  {f:5,lv:"baixa",type:"Comunicação",title:"Comunicação Não-Violenta (CNV)",desc:"Treinamento para resolver conflitos e evitar grosserias.",target:"Operacional"},
  {f:5,lv:"baixa",type:"Cultura",title:"Círculo de Respeito",desc:"Dinâmica mediada por psicólogo para estabelecer limites.",target:"Operacional"},
  {f:5,lv:"média",type:"Ética",title:"Comitê de Ética e Conduta",desc:"Receber, investigar e encaminhar denúncias de conflito.",target:"Superior"},
  {f:6,lv:"baixa",type:"Reconhecimento",title:"O Elogio de 1 Minuto",desc:"Feedback positivo específico antes de qualquer feedback construtivo.",target:"Intermediária"},
  {f:6,lv:"baixa",type:"Reconhecimento",title:"Programa de Reconhecimento por Pares",desc:"Sistema de reconhecimento público imediato entre colegas.",target:"Operacional"},
  {f:6,lv:"média",type:"RH",title:"Recompensas Não-Financeiras",desc:"Vouchers, folgas remuneradas, presentes para reconhecimento.",target:"Superior"},
  {f:7,lv:"baixa",type:"Transparência",title:"Consulta Aberta de Regras",desc:"Canal para questionar distribuição com resposta pública da chefia.",target:"Operacional"},
  {f:7,lv:"média",type:"RH",title:"Avaliação de Desempenho 360°",desc:"Critérios claros com feedback regular e múltiplas fontes.",target:"Superior"},
  {f:8,lv:"baixa",type:"Comunicação",title:"Ask Me Anything (AMA)",desc:"Sessões de perguntas diretas à chefia sobre mudanças.",target:"Superior"},
  {f:8,lv:"média",type:"Participação",title:"Embaixadores da Mudança",desc:"Colegas-chave treinados para apoiar a equipe na transição.",target:"Operacional"},
  {f:9,lv:"baixa",type:"Processo",title:"Glossário de Comunicação",desc:"Glossário de termos e códigos padronizados nos postos.",target:"Operacional"},
  {f:9,lv:"média",type:"Tecnologia",title:"Atualização de Equipamentos",desc:"Upgrade de rádios, sistemas ou intranet.",target:"Superior"},
  {f:10,lv:"baixa",type:"Política",title:"Política de Zero Tolerância",desc:"Comunicar e aplicar política clara contra assédio.",target:"Superior"},
  {f:10,lv:"média",type:"Denúncia",title:"Canal de Denúncia Sigiloso",desc:"Canal com sigilo, anonimato e proteção ao denunciante.",target:"Superior"},
  {f:11,lv:"baixa",type:"Segurança",title:"Procedimentos de Emergência",desc:"Divulgar e treinar protocolo de acionamento de emergência.",target:"Operacional"},
  {f:11,lv:"média",type:"Treinamento",title:"Simulação de Gerenciamento de Crise",desc:"Role-playing com técnicas de desescalonamento.",target:"Operacional"},
  {f:11,lv:"alta",type:"Saúde",title:"Programa de Saúde Mental",desc:"Suporte psicológico integrado ao PCMSO.",target:"Superior"},
];
