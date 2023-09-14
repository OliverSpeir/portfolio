import { defineConfig } from "astro/config";
import vercelStatic from "@astrojs/vercel/static";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import prefetch from "@astrojs/prefetch";
import { accessibleCheckbox } from './src/rehype-plugins/addAccessability';
import { removeInlineStyles } from './src/rehype-plugins/removeInlineStyles';
import { autolinkConfig } from './src/rehype-plugins/rehype-autolink-config'
import tailwind from "@astrojs/tailwind";
import critters from "astro-critters";
import purgecss from "astro-purgecss";
import autolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug';

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: vercelStatic(),
  site: 'https://www.oliverspeir.com',
  markdown: {
    rehypePlugins: [rehypeSlug, accessibleCheckbox, removeInlineStyles, [autolinkHeadings, autolinkConfig]]
  },
  integrations: [partytown({
    config: {
      forward: ["dataLayer.push"]
    }
  }), sitemap(), prefetch({
    throttle: 5
  }), tailwind({
    applyBaseStyles: false
  }), critters({path: ["./.vercel/output/static"]}), purgecss()]
});