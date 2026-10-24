import { visit } from 'unist-util-visit';

/**
 * Normaliza um texto para slug de âncora (compatível com GitHub/Astro).
 */
function slugifyHeading(text) {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')    // remove pontuações como pontos e aspas
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Plugin Remark para converter sintaxe de Wikilinks do Obsidian:
 * 1. [[1.1-fromm-o-medo-a-liberdade]] -> <a href="/obras/1.1-fromm-o-medo-a-liberdade" class="wikilink">1.1-fromm-o-medo-a-liberdade</a>
 * 2. [[1.1-fromm-o-medo-a-liberdade|Fromm · O Medo à Liberdade]] -> <a href="/obras/1.1-fromm-o-medo-a-liberdade" class="wikilink">Fromm · O Medo à Liberdade</a>
 * 3. [[#1. Matriz por eixo|1. Matriz por eixo]] -> <a href="#1-matriz-por-eixo" class="wikilink">1. Matriz por eixo</a>
 */
export function remarkWikilinks() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!node.value || !node.value.includes('[[')) return;

      const regex = /\[\[([^\]]+)\]\]/g;
      const children = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(node.value)) !== null) {
        // Texto anterior ao wikilink
        if (match.index > lastIndex) {
          children.push({
            type: 'text',
            value: node.value.slice(lastIndex, match.index)
          });
        }

        const rawContent = match[1].trim();
        const [targetRaw, labelRaw] = rawContent.split('|').map(s => s?.trim());
        const [targetFile, anchor] = targetRaw.split('#').map(s => s?.trim());

        let href = '';
        let displayText = labelRaw;

        if (!targetFile && anchor) {
          // Âncora interna do mesmo documento: [[#Seção|Label]]
          href = `#${slugifyHeading(anchor)}`;
          displayText = displayText || anchor;
        } else if (targetFile) {
          // Link para obra: [[1.1-fromm-o-medo-a-liberdade]]
          const cleanSlug = targetFile.replace(/\.md$/, '');
          href = `/obras/${cleanSlug}${anchor ? `#${slugifyHeading(anchor)}` : ''}`;
          displayText = displayText || cleanSlug;
        }

        children.push({
          type: 'link',
          url: href,
          data: {
            hProperties: {
              className: ['wikilink'],
              'data-slug': targetFile ? targetFile.replace(/\.md$/, '') : undefined
            }
          },
          children: [{ type: 'text', value: displayText }]
        });

        lastIndex = regex.lastIndex;
      }

      // Texto restante após o último wikilink
      if (lastIndex < node.value.length) {
        children.push({
          type: 'text',
          value: node.value.slice(lastIndex)
        });
      }

      // Substitui o nó de texto único pela lista de nós decomposta
      if (parent && typeof index === 'number' && children.length > 0) {
        parent.children.splice(index, 1, ...children);
        return index + children.length;
      }
    });
  };
}
