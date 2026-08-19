import 'dotenv/config.js';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { embedProduct } from '../services/embeddings.service.js';
import { initVectorStore } from '../services/vectorStore.service.js';
import logger from '../utils/logger.js';

async function embedAllProducts() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/glowgraph';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('Connected to MongoDB');

    // Initialize vector store
    const vectorStore = initVectorStore();

    // Fetch all products
    const products = await Product.find({});
    logger.info(`Found ${products.length} products to embed`);

    if (products.length === 0) {
      logger.warn('No products found. Run "npm run seed" first.');
      await mongoose.disconnect();
      return;
    }

    // Embed each product
    let embeddedCount = 0;
    for (const product of products) {
      try {
        logger.info(`Embedding ${embeddedCount + 1}/${products.length}: ${product.name}`);

        const embedding = await embedProduct(product);

        // Save embedding to MongoDB
        product.embedding = embedding;
        await product.save();

        // Add to vector store
        vectorStore.addVector(product._id.toString(), embedding);

        embeddedCount++;
      } catch (error) {
        logger.error(`Failed to embed ${product.name}:`, error.message);
      }
    }

    // Save vector store to disk
    vectorStore.saveIndex();

    logger.info(`Successfully embedded ${embeddedCount}/${products.length} products`);
    logger.info(`Vector store saved with ${vectorStore.getSize()} products`);

    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error('Embedding failed:', error.message);
    process.exit(1);
  }
}

embedAllProducts();
