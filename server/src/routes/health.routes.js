import express from 'express';
import mongoose from 'mongoose';
import { getRedisClient } from '../config/redis.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    const mongoConnected = mongoose.connection.readyState === 1;

    let redisConnected = false;
    try {
      const redisClient = getRedisClient();
      await redisClient.ping();
      redisConnected = true;
    } catch (e) {
      redisConnected = false;
    }

    const health = {
      status: mongoConnected && redisConnected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        mongodb: mongoConnected ? 'connected' : 'disconnected',
        redis: redisConnected ? 'connected' : 'disconnected',
      },
    };

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Health check error:', error.message);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

export default router;
