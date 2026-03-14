# Deploy no GitHub Pages — passo a passo

## Opção A — Upload direto (mais simples)

1. Acesse github.com e faça login
2. Clique em **New repository**
   - Nome: `drps` (ou qualquer nome)
   - Visibilidade: **Public** (obrigatório para Pages gratuito)
3. Clique em **uploading an existing file**
4. Arraste os arquivos `index.html` e `README.md`
5. Clique em **Commit changes**
6. Vá em **Settings → Pages**
7. Em *Source*, selecione **Deploy from a branch**
8. Branch: **main**, pasta: **/ (root)**
9. Clique **Save**
10. Aguarde ~2 minutos. O link aparece no topo da página Pages.

**URL final**: `https://SEU-USUARIO.github.io/drps/`

---

## Opção B — Git CLI

```bash
git clone https://github.com/SEU-USUARIO/drps.git
cd drps
cp /caminho/para/DRPS_App_v4.html index.html
git add .
git commit -m "DRPS v4 - multi-template, Groq AI"
git push origin main
```

---

## Por que GitHub Pages resolve o problema da IA?

O Groq permite requisições **diretas do browser** (CORS habilitado).
Quando o app está hospedado em `github.io`, a chamada funciona sem proxy:
- `fetch('https://api.groq.com/openai/v1/chat/completions', {...})` ✅

Ao rodar como arquivo local (`file://`), alguns navegadores bloqueiam
requisições externas por política de segurança — por isso o GitHub Pages é recomendado.
