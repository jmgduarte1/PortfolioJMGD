import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { deploymentConfig, prepareHostinger } from './prepare-hostinger.mjs';

const valid = {
  BACKEND_URL: 'https://cms.example.com', DEFAULT_LOCALE: 'en-CA',
  SITE_URL: 'https://portfolio.example.com',
  GITHUB_SHA: 'a'.repeat(40),
};

test('requires every environment value instead of falling back to development defaults', () => {
  for (const key of Object.keys(valid)) {
    assert.throws(() => deploymentConfig({ ...valid, [key]: '' }), new RegExp(key));
  }
});

test('rejects local, insecure and credential-bearing deployment URLs', () => {
  for (const key of ['BACKEND_URL', 'SITE_URL']) {
    for (const value of ['http://example.com', 'https://localhost', 'https://127.0.0.1', 'https://user:pass@example.com']) {
      assert.throws(() => deploymentConfig({ ...valid, [key]: value }), new RegExp(key));
    }
  }
});

test('rejects invalid locale and subdirectory deployments', () => {
  assert.throws(() => deploymentConfig({ ...valid, DEFAULT_LOCALE: 'en_CA' }), /DEFAULT_LOCALE/);
  assert.throws(() => deploymentConfig({ ...valid, SITE_URL: 'https://example.com/site/' }), /domain root/);
});

test('packages commit identity and routing without legacy contact configuration after a static build', () => {
  const directory = mkdtempSync(join(tmpdir(), 'portfolio-package-'));
  assert.throws(() => prepareHostinger(directory, valid), /index.html missing/);
  writeFileSync(join(directory, 'index.html'), '<html></html>');
  prepareHostinger(directory, { ...valid, SSH_PRIVATE_KEY: 'never-export-this' });
  assert.equal(existsSync(join(directory, 'app-config.json')), false);
  assert.deepEqual(JSON.parse(readFileSync(join(directory, 'version.json'), 'utf8')), { commit: valid.GITHUB_SHA });
  assert.match(readFileSync(join(directory, '.htaccess'), 'utf8'), /RewriteRule \^ index\.html/);
  assert.equal(readFileSync(join(directory, 'index.html'), 'utf8'), '<html></html>');
});

test('uses Angular CSR entry as the shared-hosting index without replacing a prerendered index', () => {
  const directory = mkdtempSync(join(tmpdir(), 'portfolio-csr-'));
  writeFileSync(join(directory, 'index.csr.html'), '<html>Angular CSR entry</html>');
  prepareHostinger(directory, valid);
  assert.equal(readFileSync(join(directory, 'index.html'), 'utf8'), '<html>Angular CSR entry</html>');
  writeFileSync(join(directory, 'index.html'), '<html>Prerendered page</html>');
  prepareHostinger(directory, valid);
  assert.equal(readFileSync(join(directory, 'index.html'), 'utf8'), '<html>Prerendered page</html>');
});
