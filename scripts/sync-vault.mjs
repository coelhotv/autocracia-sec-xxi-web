import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminhos
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LOCAL_VAULT = path.resolve(PROJECT_ROOT, '..', 'autocracia-sec-xxi');
const ICLOUD_VAULT = path.resolve(
  process.env.HOME || '',
  'Library/Mobile Documents/iCloud~md~obsidian/Documents/autocracia-sec-xxi'
);
const CONTENT_DIR = path.resolve(PROJECT_ROOT, 'content');

// Determina fonte disponível
let sourceDir = null;
if (fs.existsSync(LOCAL_VAULT)) {
  sourceDir = LOCAL_VAULT;
} else if (fs.existsSync(ICLOUD_VAULT)) {
  sourceDir = ICLOUD_VAULT;
}

if (!sourceDir) {
  if (fs.existsSync(CONTENT_DIR) && fs.readdirSync(CONTENT_DIR).length > 0) {
    console.log('ℹ️  Vault Obsidian não encontrado localmente (Ambiente Vercel/CI).');
    console.log('ℹ️  Utilizando conteúdo já versionado em ./content.');
    process.exit(0);
  } else {
    console.error('❌ Erro: Vault Obsidian não encontrado e pasta ./content está vazia.');
    process.exit(1);
  }
}

console.log(`🔄 Sincronizando conteúdo a partir de: ${sourceDir}`);

// Garante pasta content/
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// Arquivos a sincronizar
const files = fs.readdirSync(sourceDir);
let count = 0;

for (const file of files) {
  // Sincroniza fichas [1-7].*.md, a matriz e lista de obras
  const isFicha = /^[1-7]\..*\.md$/.test(file);
  const isMatriz = file === 'matriz-teorica-autocracia-tecnologia-exaustao-cognitiva.md';
  const isLista = file === '00-lista-de-obras.md';

  if (isFicha || isMatriz || isLista) {
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(CONTENT_DIR, file);

    let content = fs.readFileSync(srcPath, 'utf8');

    // Sanitização de segurança para YAML: aspas automáticas se obra tiver dois pontos seguidos de espaço sem aspas
    content = content.replace(/^obra:\s*([^"\n\r]+:\s*[^"\n\r]+)$/m, 'obra: "$1"');

    fs.writeFileSync(destPath, content, 'utf8');
    count++;
  }
}

// Remove de content/ o que saiu do vault (ficha renomeada ou apagada), para não publicar página órfã
const synced = new Set(files.filter((f) =>
  /^[1-7]\..*\.md$/.test(f) || f === 'matriz-teorica-autocracia-tecnologia-exaustao-cognitiva.md' || f === '00-lista-de-obras.md'
));
let removed = 0;
for (const file of fs.readdirSync(CONTENT_DIR)) {
  if (file.endsWith('.md') && !synced.has(file)) {
    fs.unlinkSync(path.join(CONTENT_DIR, file));
    console.log(`🗑️  Removido de content/ (não existe mais no vault): ${file}`);
    removed++;
  }
}

console.log(`✅ Sincronização concluída: ${count} arquivos sincronizados, ${removed} removidos em ${CONTENT_DIR}`);
