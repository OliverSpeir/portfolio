import { defineConfig } from 'astro/config';
import vercelStatic from '@astrojs/vercel/static';
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel()
});