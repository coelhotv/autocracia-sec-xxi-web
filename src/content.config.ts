import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Coleção das fichas de leitura
const fichas = defineCollection({
  loader: glob({
    pattern: '[1-7].*.md',
    base: './content',
    generateId: ({ entry }) => entry.replace(/\.md$/, '')
  }),
  schema: z.object({
    id: z.coerce.string(),
    autor: z.string(),
    datas: z.string().optional(),
    obra: z.string(),
    ano: z.coerce.string(),
    eixo: z.union([z.string(), z.number()]).transform(val => String(val)),
    tipo: z.string().default('livro'),
    confianca: z.string().default('alta'),
    papel: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    fonte: z.string().optional(),
    lido: z.union([z.string(), z.boolean()]).optional(),
    versao: z.union([z.string(), z.number()]).optional(),
  })
});

// Coleção da Matriz Teórica Integral
const matriz = defineCollection({
  loader: glob({
    pattern: 'matriz-teorica-autocracia-tecnologia-exaustao-cognitiva.md',
    base: './content',
    generateId: ({ entry }) => entry.replace(/\.md$/, '')
  }),
  schema: z.object({
    titulo: z.string().default('Matriz Teórica'),
    subtitulo: z.string().optional(),
    autor: z.string().default('Antonio Coelho'),
    versao: z.coerce.number().optional(),
    atualizado: z.coerce.date().optional(),
    'dados-eleitorais': z.string().optional(),
    fichas: z.coerce.number().optional(),
    eixos: z.coerce.number().optional(),
    tags: z.array(z.string()).optional().default([]),
    aliases: z.array(z.string()).optional().default([]),
  })
});

export const collections = {
  fichas,
  matriz
};
