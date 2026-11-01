import { verifyVersions } from './versions-lib.mjs';
const manifest = await verifyVersions(process.cwd());
console.log('Verified ' + manifest.releases.length + ' frozen documentation versions and the development channel.');
