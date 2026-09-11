import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function deploymentConfig(env) {
  const required = (name) => {
    const value = env[name]?.trim();
    if (!value) throw new Error(`${name} is required in the GitHub Environment.`);
    return value;
  };
  const httpsUrl = (name) => {
    const value = required(name);
    let url;
    try { url = new URL(value); } catch { throw new Error(`${name} must be an HTTPS URL.`); }
    if (url.protocol !== 'https:' || url.username || url.password || url.hash ||
        /^(localhost|127\..*|\[::1\])$/i.test(url.hostname) || url.hostname.endsWith('.localhost')) {
      throw new Error(`${name} must be a public HTTPS URL without credentials or fragments.`);
    }
    return value;
  };
  const backendUrl = httpsUrl('BACKEND_URL');
  const siteUrl = httpsUrl('SITE_URL');
  if (new URL(siteUrl).pathname !== '/' || new URL(siteUrl).search) {
    throw new Error('SITE_URL must be a domain root; subdirectory hosting is not configured.');
  }
  const defaultLocale = required('DEFAULT_LOCALE');
  try { Intl.getCanonicalLocales(defaultLocale); } catch {
    throw new Error('DEFAULT_LOCALE must be a valid language tag.');
  }
  if (!/^[a-f0-9]{40}$/.test(required('GITHUB_SHA'))) {
    throw new Error('GITHUB_SHA must identify the commit being deployed.');
  }
  return { backendUrl, defaultLocale, siteUrl, commit: env.GITHUB_SHA };
}

export function prepareHostinger(directory, env) {
  const config = deploymentConfig(env);
  // Angular retains this name when all routes use CSR, even in static output.
  if (!existsSync(join(directory, 'index.html')) && existsSync(join(directory, 'index.csr.html'))) {
    copyFileSync(join(directory, 'index.csr.html'), join(directory, 'index.html'));
  }
  if (!existsSync(join(directory, 'index.html'))) {
    throw new Error('Static index.html missing (and no index.csr.html). Run npm run build -- --output-mode static first.');
  }
  writeFileSync(join(directory, 'version.json'), JSON.stringify({ commit: config.commit }) + '\n');
  copyFileSync(new URL('../deployment/hostinger.htaccess', import.meta.url), join(directory, '.htaccess'));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.includes('--validate-only')) deploymentConfig(process.env);
  else prepareHostinger(resolve('dist/portfolio-jmgd/browser'), process.env);
}
