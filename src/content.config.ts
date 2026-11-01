import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { docsVersionsLoader } from 'starlight-versions/loader';

export const collections = {
  docs: defineCollection({
    loader: docsLoader({
      // Preserve semver dots in archive paths instead of slugifying them away.
      generateId: ({ entry, data }) => typeof data.slug === 'string'
        ? data.slug
        : entry.replaceAll('\\', '/').replace(/\.(md|mdx)$/, '').replace(/\/index$/, ''),
    }),
    schema: docsSchema(),
  }),
  versions: defineCollection({ loader: docsVersionsLoader() }),
  i18n: defineCollection({ loader: glob({ pattern: '*.json', base: './src/content/i18n' }), schema: i18nSchema() }),
};
