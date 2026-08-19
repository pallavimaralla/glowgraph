import { createClient } from 'redis';
import logger from '../utils/logger.js';

let redisClient = null;

export async function connectRedis() {
  try {
    const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';

    redisClient = createClient({
      url: redisURL,
      socket: {
        reconnectStrategy: (retries) => {
          logger.warn(`Redis reconnect attempt ${retries}`);
          return Math.min(retries * 50, 500);
        },
      },
    });

    redisClient.on('error', (err) => logger.error('Redis error:', err));
    redisClient.on('connect', () => logger.info('Redis connected'));

    await redisClient.connect();
    logger.info('Redis connected successfully');

    return redisClient;
  } catch (error) {
    logger.error('Redis connection failed:', error.message);
    process.exit(1);
  }
}

export function getRedisClient() {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
}

export async function disconnectRedis() {
  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis disconnected');
  }
}

export default { connectRedis, getRedisClient, disconnectRedis };
