import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    author: z.string().optional().default('Anonymous'),
    category: z.string().optional().default('general'),
    pubDate: z.coerce.date(),
    description: z.string().optional().default(''),
  }),
});

export const collections = { blog };