import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightVersions from 'starlight-versions';
import { readFileSync } from 'node:fs';
import sidebar from './config/sidebar.mjs';

const manifest = JSON.parse(readFileSync(new URL('./public/versions.json', import.meta.url), 'utf8'));

export default defineConfig({
  site: 'https://alex6511.github.io',
  base: '/BellsAndWhistles-Docs',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Bells and Whistles',
      description: 'Versioned installation and content-author guides for the Bells and Whistles Railroader mod.',
      favicon: '/favicon.svg',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/Alex6511/BellsAndWhistles-Docs' }],
      editLink: { baseUrl: 'https://github.com/Alex6511/BellsAndWhistles-Docs/edit/main/' },
      sidebar,
      plugins: [starlightVersions({
        current: { label: manifest.current.label, redirect: 'root' },
        versions: manifest.releases.map(({ slug, label }) => ({ slug, label, redirect: 'root' })),
      })],
    }),
  ],
});
