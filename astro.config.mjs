import { defineConfig } from 'astro/config';
import { remarkCallouts } from './src/plugins/remark-callouts.mjs';
import { remarkWikilinks } from './src/plugins/remark-wikilinks.mjs';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  build: {
    format: 'directory'
  },
  markdown: {
    remarkPlugins: [
      remarkCallouts,
      remarkWikilinks
    ]
  }
});
