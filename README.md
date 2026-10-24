# Autocracia, Tecnologia e Exaustão Cognitiva (Plataforma Web)

Plataforma estática de estudos sociológicos e teoria política contemporânea por **Antonio Coelho**.

Reúne a **Matriz Teórica Integral** e **69 Fichas Analíticas de Leitura** organizadas em sete eixos para investigar por que e como democracias do século XXI elegem autocracias através de cansaço cognitivo, plataformização e precarização material.

## Arquitetura
- **Framework**: [Astro v5](https://astro.build/) em modo estático (`output: 'static'`)
- **Estilo**: CSS Vanilla artesanal com foco em leitura imersiva (*Newsreader*, *Inter*, *IBM Plex Mono*)
- **Filtro**: Motor reativo em memória (<2 KB) para o catálogo de obras
- **Deploy**: Otimizado para hospedagem estática gratuita na [Vercel](https://vercel.com/) (Hobby)

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Sincronizar fichas do Obsidian local (opcional se já versionado em ./content)
npm run sync

# 3. Iniciar servidor de desenvolvimento
npm run dev

# 4. Compilar bundle estático para produção
npm run build
```
