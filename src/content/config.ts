import { z, defineCollection } from 'astro:content';

const blogsCollection = defineCollection({ 
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        cardPicture: z.string(),
    }),
});

export const collections = {
  'blogs': blogsCollection,
};