# DRPS — Diagnóstico de Riscos Psicossociais

Ferramenta web para diagnóstico de riscos psicossociais conforme **NR-1**, com suporte a múltiplos instrumentos e geração de relatórios por clínica.

## 🚀 Como usar (GitHub Pages)

1. Faça fork deste repositório
2. Vá em **Settings → Pages → Source: main branch / root**
3. Acesse em `https://SEU-USUARIO.github.io/drps/`

O app roda 100% no navegador — sem servidor, sem banco de dados.

## 📋 Funcionalidades

- **4 instrumentos**: AOT/DRPS (24q), COPSOQ II Curta (41q), COPSOQ II Média (72q), COPSOQ III Brasil — Rodrigues 2020 (79q)
- **Upload de planilha** Google Forms (xlsx) com detecção automática de colunas
- **Dashboard interativo**: scores por fator, NPS, perfil demográfico, dimensões
- **Análise por setor**: tabela com score de cada fator × setor
- **4 templates de relatório** por clínica (AMBRAC Verde, Azul Corporativo, Vinho Premium, Cinza Institucional)
- **Preferências por clínica**: template salvo automaticamente por nome de clínica
- **Plano de ação por IA** via Groq API (gratuito) — intervenções específicas por setor
- **Banco de relatórios**: salva histórico no localStorage do navegador
- **Impressão/PDF**: relatório completo pronto para impressão

## 🤖 Configurar IA (Groq — gratuito)

1. Acesse [console.groq.com](https://console.groq.com)
2. Crie uma conta gratuita
3. Gere uma API Key
4. Cole a chave quando solicitado na aba **Ações → Gerar Plano por IA**

A chave fica salva apenas na sessão do navegador (não persiste após fechar a aba).

## 🏥 Uso por clínica

Na aba **Relatório**, informe o nome da clínica no campo correspondente. O template visual escolhido é salvo automaticamente para aquela clínica e restaurado na próxima vez.

## 📁 Estrutura

```
drps/
├── index.html          # App completo (single file)
└── README.md
```

## 🔬 Instrumentos suportados

| Instrumento | Questões | Fatores | Referência |
|---|---|---|---|
| AOT/DRPS | 24 | 12 | AMBRAC / NR-1 |
| COPSOQ II Curta | 41 | 15 | Kristensen et al., 2005 |
| COPSOQ II Média | 72 | 24 | Kristensen et al., 2005 |
| COPSOQ III BR | 79 | 7 | Rodrigues, 2020 — USF |

## 📄 Licença

Uso interno — AMBRAC Medicina e Segurança do Trabalho.
