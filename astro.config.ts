import { defineConfig } from "astro/config";
import type { AstroUserConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import icon from "astro-icon";
import expressiveCode from "astro-expressive-code";
import compress from "@playform/compress";
import { remarkReadingTime } from "./src/assets/plugins/remark-reading-time.mjs";
import { autolinkConfig } from "./src/assets/plugins/rehype-autolink-config.ts";
import { addGroupToH2 } from "./src/assets/plugins/rehype-autolink-h2group.js";
import { accessibleCheckbox } from "./src/assets/plugins/accessibleCheckbox.js";
import rehypeSlug from "rehype-slug";
import autolinkHeadings from "rehype-autolink-headings";
import imgAttr from "remark-imgattr";
import metaTags from "astro-meta-tags";
import remarkDirective from "remark-directive";
import remarkCalloutDirectives from "./src/assets/plugins/remark-callout-directives-customized.js"

const config: AstroUserConfig = defineConfig({
  site: "http://oliverspeir.dev/",
  build: {
    inlineStylesheets: "always",
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    robotsTxt(),
    icon({
      include: {
        bxl: ["linkedin-square", "github"],
        f7: ["tree"],
      },
    }),
    expressiveCode(),
    compress(),
    metaTags(),
  ],
  markdown: {
    remarkPlugins: [
      remarkReadingTime,
      imgAttr,
      remarkDirective,
      remarkCalloutDirectives,
    ],
    rehypePlugins: [
      rehypeSlug,
      accessibleCheckbox,
      [autolinkHeadings, autolinkConfig],
      addGroupToH2,
    ],
  },
});

// https://astro.build/config
export default defineConfig(config);
