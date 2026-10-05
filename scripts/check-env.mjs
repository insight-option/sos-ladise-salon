// Fails the build on invalid configuration. Runs before `next build` (see package.json).
// The site has no secrets and no backend; APP_ENV only controls search-engine indexing.
import { existsSync } from 'node:fs';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const APP_ENVS = ['preview', 'production'];

/** @param {Record<string, string | undefined>} env */
export function checkEnv(env) {
  const errors = [];
  const appEnv = env.APP_ENV ?? 'preview';

  if (!APP_ENVS.includes(appEnv)) errors.push(`APP_ENV must be one of ${APP_ENVS.join(', ')}.`);

  if (appEnv === 'production') {
    const onAmplify = Boolean(env.AWS_APP_ID && env.AWS_BRANCH);
    const site = env.NEXT_PUBLIC_SITE_URL;
    if (!site && !onAmplify) {
      errors.push('Production needs NEXT_PUBLIC_SITE_URL (or an Amplify build to derive it).');
    } else if (site && !/^https:\/\/[^/]+/.test(site)) {
      errors.push('NEXT_PUBLIC_SITE_URL must be an https:// URL.');
    }
  }

  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const file of ['.env', '.env.local', '.env.production', '.env.production.local']) {
    if (existsSync(file)) process.loadEnvFile(file);
  }
  const errors = checkEnv(process.env);
  if (errors.length > 0) {
    console.error('Environment check failed:\n' + errors.map((e) => `  - ${e}`).join('\n'));
    process.exit(1);
  }
  console.log(`Environment check passed (APP_ENV=${process.env.APP_ENV ?? 'preview'}).`);
}
