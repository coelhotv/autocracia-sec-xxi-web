import { getEntry } from 'astro:content';

export interface Eixo {
  num: string;
  nome: string;
  pergunta: string;
  autores: string;
}

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho',
  'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

async function matriz() {
  const entry = await getEntry('matriz', 'matriz-teorica-autocracia-tecnologia-exaustao-cognitiva');
  if (!entry) throw new Error('Documento da Matriz Teórica não encontrado na coleção.');
  return entry;
}

/**
 * Lê o "Mapa dos eixos" da matriz, para que nomes, perguntas e autores
 * do site acompanhem o texto sem edição manual.
 * Linha esperada: | **1 · Raízes psíquicas** | Pergunta? | Autores | 6 |
 */
export async function getEixos(): Promise<Eixo[]> {
  const body = (await matriz()).body ?? '';
  const eixos: Eixo[] = [];
  for (const line of body.split('\n')) {
    const m = line.match(/^\|\s*\*\*(\d)\s*·\s*([^*]+)\*\*\s*\|\s*([^|]+)\|\s*([^|]+)\|/);
    if (m) {
      eixos.push({ num: m[1], nome: m[2].trim(), pergunta: m[3].trim(), autores: m[4].trim() });
    }
  }
  if (eixos.length !== 7) throw new Error(`Mapa dos eixos da matriz: esperava 7 eixos, achei ${eixos.length}.`);
  return eixos;
}

/** Versão e mês/ano da matriz, do frontmatter (ex.: "Versão 5 · Outubro 2026"). */
export async function getVersaoMatriz() {
  const { data } = await matriz();
  // o YAML lê "2026-10-27" como data em UTC; getUTC* evita cair no dia anterior no fuso local
  const d = data.atualizado;
  const mesAno = d ? `${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}` : '';
  return {
    versao: data.versao,
    mesAno: mesAno.charAt(0).toUpperCase() + mesAno.slice(1),
  };
}
