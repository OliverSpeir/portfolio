import { defineConfig } from "astro/config";
import vercelStatic from "@astrojs/vercel/static";
import partytown from "@astrojs/partytown";
import mdx from "@astrojs/mdx";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: vercelStatic(),
  integrations: [partytown({
    config: {
      forward: ["dataLayer.push"]
    }
  }), mdx(), react()]
});