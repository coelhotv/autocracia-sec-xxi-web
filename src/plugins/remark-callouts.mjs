import { visit } from 'unist-util-visit';

const DEFAULT_TITLES = {
  abstract: 'Tese Central',
  info: 'Nota Explicativa',
  tip: 'Como Ler',
  warning: 'Atenção',
  danger: 'Risco',
  example: 'Exemplo',
  success: 'Resultado',
  todo: 'Pendente',
  quote: 'Citação',
};

/**
 * Plugin Remark para converter sintaxe de Callouts do Obsidian:
 * > [!tipo] Título opcional
 * > Corpo do callout...
 * 
 * em HTML semântico:
 * <aside class="callout callout-tipo" role="note">
 *   <div class="callout-title">Título</div>
 *   <p>Corpo do callout...</p>
 * </aside>
 */
export function remarkCallouts() {
  return (tree) => {
    visit(tree, 'blockquote', (node) => {
      if (!node.children || node.children.length === 0) return;

      const firstChild = node.children[0];
      if (firstChild.type !== 'paragraph' || !firstChild.children || firstChild.children.length === 0) return;

      const firstTextNode = firstChild.children[0];
      if (firstTextNode.type !== 'text') return;

      // Detecta padrão [!tipo] ou [!tipo] Título
      const match = firstTextNode.value.match(/^\[!([\w-]+)\](?:[ \t]+([^\n\r]+))?(?:\r?\n|$)/);
      if (!match) return;

      const calloutType = match[1].toLowerCase();
      const customTitle = match[2]?.trim();
      const displayTitle = customTitle || DEFAULT_TITLES[calloutType] || calloutType.toUpperCase();

      // Remove a marcação [!tipo] Título do texto
      firstTextNode.value = firstTextNode.value.slice(match[0].length);

      // Se o nó de texto ficou vazio, remove-o
      if (!firstTextNode.value.trim() && firstChild.children.length > 1) {
        firstChild.children.shift();
      }

      // Se o parágrafo inteiro ficou vazio, remove o primeiro filho
      if (firstChild.children.length === 0 || (firstChild.children.length === 1 && !firstChild.children[0].value?.trim())) {
        node.children.shift();
      }

      // Configura renderização para <aside class="callout callout-{tipo}" role="note">
      node.data = node.data || {};
      node.data.hName = 'aside';
      node.data.hProperties = {
        className: ['callout', `callout-${calloutType}`],
        role: 'note'
      };

      // Cria elemento do cabeçalho do callout
      const titleNode = {
        type: 'paragraph',
        data: {
          hName: 'div',
          hProperties: { className: ['callout-title'] }
        },
        children: [{ type: 'text', value: displayTitle }]
      };

      node.children.unshift(titleNode);
    });
  };
}
