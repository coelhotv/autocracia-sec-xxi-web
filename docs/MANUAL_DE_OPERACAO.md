# Manual de Operação e Guia Canônico da Plataforma Web
**Autocracia, Tecnologia e Exaustão Cognitiva** · *Antonio Coelho*

Este documento foi escrito de forma didática e passo a passo para orientar a operação diária, manutenção e publicação do site, sem exigir conhecimentos avançados de engenharia de software ou DevOps.

---

## 1. Visão Geral da Arquitetura

O projeto foi construído para ser **100% estático, ultra-rápido e de custo zero permanente**.

```
[Seu Computador / macOS]
  └─ Obsidian (iCloud)  ----(npm run sync)---->  site/content/ (Markdown das 69 fichas)
                                                       │
                                                       ▼
                                            Astro v5 (Gerador de Páginas)
                                                       │
                                                       ▼
[GitHub] coelhotv/autocracia-sec-xxi-web  <---(git push)---
        │
        ▼ (Gatilho automático de Deploy)
[Vercel] Rede Global Edge (Hobby - $0/mês)  ===>  https://seu-site.vercel.app
```

### Como os arquivos se organizam:
- `site/content/`: Pasta onde ficam as cópias das 69 fichas e da matriz teórica dentro do projeto web.
- `site/src/pages/`: As páginas do site:
  - `index.astro`: A página inicial (Home) com a tese e o mapa dos 7 eixos.
  - `matriz.astro`: A Matriz Teórica Integral de leitura contínua.
  - `obras/index.astro`: O Catálogo com filtros de pesquisa e ordenação.
  - `obras/[...slug].astro`: O modelo visual que gera as páginas individuais de cada uma das 69 obras.
- `site/scripts/sync-vault.mjs`: Script que busca as fichas atualizadas da sua pasta do Obsidian/iCloud e traz para o site.

---

## 2. Como Rodar e Testar o Site no seu Computador

Sempre que quiser visualizar o site localmente antes de publicar:

1. Abra o **Terminal** do seu Mac.
2. Navegue até a pasta do site:
   ```bash
   cd ~/Documents/estudos-sociologicos/site
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. O terminal mostrará uma mensagem como:
   ```
   Local: http://localhost:4321/
   ```
5. Abra o seu navegador (Chrome, Safari ou Firefox) e acesse: `http://localhost:4321`.
6. Para encerrar o servidor no terminal, basta pressionar: `Ctrl + C`.

---

## 3. Como Adicionar ou Atualizar Fichas no Obsidian

Você continua editando normalmente pelo aplicativo Obsidian. Para que uma edição reflita no site:

1. No **Terminal**, dentro de `~/Documents/estudos-sociologicos/site`:
2. Execute o comando de sincronização:
   ```bash
   npm run sync
   ```
   *(Ele lerá do seu iCloud e atualizará a pasta `./content` automaticamente).*
3. Para conferir se tudo compilou perfeitamente:
   ```bash
   npm run build
   ```
4. Se o resultado for `[build] Complete!`, está tudo pronto para subir para o ar.

---

## 4. Como Colocar o Site no Ar na Vercel (Passo a Passo)

Como o repositório já está criado e público no seu GitHub ([github.com/coelhotv/autocracia-sec-xxi-web](https://github.com/coelhotv/autocracia-sec-xxi-web)), conectar na Vercel leva menos de 2 minutos:

### Passo 1: Acessar a Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login com a sua conta GitHub (`coelhotv`).
2. No painel principal (Dashboard), clique no botão **"Add New..."** e selecione **"Project"**.

### Passo 2: Importar o Repositório
1. Na lista de repositórios do seu GitHub que aparecer na tela, localize:
   **`autocracia-sec-xxi-web`**
2. Clique no botão azul **"Import"** ao lado dele.

### Passo 3: Configuração do Projeto (Zero Configuração)
1. **Project Name**: Pode manter `autocracia-sec-xxi-web` (ou personalizar).
2. **Framework Preset**: A Vercel detectará automaticamente **Astro**.
3. **Root Directory**: Mantenha `./` (pois o repositório foi criado direto na pasta do site).
4. **Build and Output Settings**: Mantenha os valores padrão:
   - *Build Command*: `astro build` (ou `npm run build`)
   - *Output Directory*: `dist`
5. Clique no botão **"Deploy"**.

### Passo 4: Pronto!
- Em aproximadamente 30 a 50 segundos, a Vercel compilará as 72 páginas e exibirá uma tela de comemoração com o link público definitivo (exemplo: `https://autocracia-sec-xxi-web.vercel.app`).
- O site ganha certificado SSL automático (HTTPS), proteção contra ataques e carregamento instantâneo em todo o mundo.

---

## 5. Como Publicar Novas Atualizações no Ar

Depois que o site estiver conectado à Vercel, você **nunca mais precisa entrar no painel da Vercel para atualizar o site**. 

O deploy é 100% automático a cada alteração enviada pelo Git:

No terminal da pasta `~/Documents/estudos-sociologicos/site`:
```bash
# 1. Puxa as últimas edições do seu Obsidian
npm run sync

# 2. Registra as alterações no Git
git add .
git commit -m "conteudo: atualiza fichas do acervo"

# 3. Envia para o GitHub
git push origin main
```

Assim que o `git push` termina, a Vercel detecta o novo commit no GitHub, recompila as páginas em ~30 segundos e atualiza o site no ar sem nenhuma interrupção de serviço.

---

## 6. Dúvidas e Resolução de Problemas Comuns

### 1. "Editei um arquivo no Obsidian mas a mudança não apareceu no site local"
- **Motivo**: O site lê da pasta `site/content/`.
- **Solução**: Rode `npm run sync` no terminal para atualizar os arquivos antes de rodar `npm run dev` ou `npm run build`.

### 2. "Ao rodar npm run build recebi erro de bad indentation no YAML"
- **Motivo**: No frontmatter (cabeçalho entre `---`), se o valor de `obra:` tiver dois pontos seguidos de espaço sem aspas (ex.: `obra: Título: Subtítulo`), o YAML interpreta como chave aninhada.
- **Solução**: O nosso script `npm run sync` já corrige isso automaticamente colocando aspas duplas, mas caso adicione manualmente no Obsidian, use aspas: `obra: "Título: Subtítulo"`.

### 3. "Como mudar o domínio para um domínio próprio (ex: autocracia.org ou meudominio.com.br)?"
- No painel do projeto na Vercel, vá em **Settings** ➔ **Domains**.
- Digite o domínio desejado e siga as instruções simples da Vercel para adicionar 2 registros DNS no seu registrador (ex: Registro.br, Cloudflare, etc.). O SSL é emitido automaticamente sem custo.
