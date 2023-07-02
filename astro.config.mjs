import { defineConfig } from "astro/config";
import vercelStatic from "@astrojs/vercel/static";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";

import prefetch from "@astrojs/prefetch";

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: vercelStatic(),
  site: 'https://www.oliverspeir.com',
  integrations: [partytown({
    config: {
      forward: ["dataLayer.push"]
    }
  }), sitemap(), prefetch({
    throttle: 5,
  })]
});