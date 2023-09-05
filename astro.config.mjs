import { defineConfig } from "astro/config";
import vercelStatic from "@astrojs/vercel/static";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import prefetch from "@astrojs/prefetch";
import { accessibleCheckbox } from './src/rehype-plugins/addAccessability';
import { removeInlineStyles } from './src/rehype-plugins/removeInlineStyles';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: vercelStatic(),
  site: 'https://www.oliverspeir.com',
  markdown: {
    rehypePlugins: [accessibleCheckbox, removeInlineStyles]
  },
  integrations: [partytown({
    config: {
      forward: ["dataLayer.push"]
    }
  }), sitemap(), prefetch({
    throttle: 5
  }),     tailwind({applyBaseStyles: false})],
});