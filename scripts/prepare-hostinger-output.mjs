import { copyFileSync, existsSync } from 'node:fs';

const repositoryEntry = new URL('../server.js', import.meta.url);
const outputRoot = new URL('../dist/portfolio-jmgd/', import.meta.url);
const angularServer = new URL('server/server.mjs', outputRoot);
const browserOutput = new URL('browser/', outputRoot);
const deploymentEntry = new URL('server.js', outputRoot);

if (!existsSync(angularServer) || !existsSync(browserOutput)) {
  throw new Error(
    'Angular SSR output is incomplete. Expected dist/portfolio-jmgd/browser and server/server.mjs.',
  );
}

copyFileSync(repositoryEntry, deploymentEntry);
