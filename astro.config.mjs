// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://westhertskids.pages.dev', // keep in step with SITE.url in src/site.config.ts
  trailingSlash: 'always',
  integrations: [sitemap()],
});
