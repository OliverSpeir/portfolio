import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
	type: "content",
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			date: z.date(),
			ogImage: image(),
			header: z.boolean().default(true),
		}),
});

export const collections = {
	blog: blogCollection,
};
