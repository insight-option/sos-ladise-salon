// Fails the build when required configuration is missing, or when a production build
// would ship demo data. Runs before `next build` (see package.json).
import { existsSync } from 'node:fs';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const APP_ENVS = ['preview', 'production'];
const DATA_SOURCES = ['demo', 'empty', 'amplify'];

/** @param {Record<string, string | undefined>} env */
export function checkEnv(env) {
  const errors = [];
  const appEnv = env.APP_ENV;
  const dataSource = env.DATA_SOURCE ?? 'demo';

  if (!appEnv) errors.push('APP_ENV is required (preview | production).');
  else if (!APP_ENVS.includes(appEnv))
    errors.push(`APP_ENV must be one of ${APP_ENVS.join(', ')}.`);

  if (!DATA_SOURCES.includes(dataSource)) {
    errors.push(`DATA_SOURCE must be one of ${DATA_SOURCES.join(', ')}.`);
  }

  if (appEnv === 'production') {
    if (dataSource !== 'amplify') {
      errors.push(
        'Production builds must use DATA_SOURCE=amplify (demo/empty data is preview-only).',
      );
    }
    const site = env.NEXT_PUBLIC_SITE_URL;
    if (!site) errors.push('NEXT_PUBLIC_SITE_URL is required in production.');
    else if (!/^https:\/\/[^/]+/.test(site))
      errors.push('NEXT_PUBLIC_SITE_URL must be an https:// URL.');
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
  console.log(
    `Environment check passed (APP_ENV=${process.env.APP_ENV}, DATA_SOURCE=${process.env.DATA_SOURCE ?? 'demo'}).`,
  );
}
