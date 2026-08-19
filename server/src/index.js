import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import { connectMongoDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { initializeFirebase } from './config/firebase.js';
import { initVectorStore } from './services/vectorStore.service.js';
import { validateEnv } from './utils/envValidator.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

import healthRoutes from './routes/health.routes.js';
import productsRoutes from './routes/products.routes.js';
import searchRoutes from './routes/search.routes.js';
import cartRoutes from './routes/cart.routes.js';
import chatRoutes from './routes/chat.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', healthRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Startup
async function start() {
  try {
    logger.info('Starting GlowGraph API...');

    // Validate environment
    validateEnv();

    await connectMongoDB();
    await connectRedis();
    initializeFirebase();
    initVectorStore();

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...');
  process.exit(0);
});
