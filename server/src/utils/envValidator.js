import logger from './logger.js';

const requiredEnvVars = [
  'MONGODB_URI',
  'REDIS_URL',
];

const optionalEnvVars = [
  'OPENAI_API_KEY',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
];

export function validateEnv() {
  const missing = [];
  const warnings = [];

  // Check required vars
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  // Check optional but recommended vars
  for (const varName of optionalEnvVars) {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  }

  if (missing.length > 0) {
    logger.error('Missing required environment variables:', missing.join(', '));
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  if (warnings.length > 0) {
    logger.warn('Missing optional environment variables:', warnings.join(', '));
    logger.warn('Some features may not work without these variables.');
  }

  logger.info('Environment validation passed');
}
