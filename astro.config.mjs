import { defineConfig } from 'astro/config';
import vercelStatic from '@astrojs/vercel/static';
export default defineConfig ({ output:'server', adapter:vercelStatic(), });