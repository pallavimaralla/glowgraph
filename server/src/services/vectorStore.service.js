import HierarchicalNSW from 'hnswlib-node';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger.js';

const INDEX_PATH = './vector-index';
const INDEX_FILE = path.join(INDEX_PATH, 'products.index');
const METADATA_FILE = path.join(INDEX_PATH, 'metadata.json');

let index = null;
let productIdMap = null; // Maps index position to MongoDB product ID

class VectorStore {
  constructor() {
    this.index = null;
    this.productIdMap = new Map();
    this.vectorDim = 1536; // OpenAI text-embedding-3-small dimension
  }

  initialize() {
    try {
      if (!fs.existsSync(INDEX_PATH)) {
        fs.mkdirSync(INDEX_PATH, { recursive: true });
      }

      // Try to load existing index
      if (fs.existsSync(INDEX_FILE) && fs.existsSync(METADATA_FILE)) {
        this.loadIndex();
        logger.info('Loaded existing vector index');
      } else {
        // Create new index
        this.index = new HierarchicalNSW('l2', this.vectorDim);
        this.index.initIndex({ maxM: 16, efConstruction: 200 });
        logger.info('Created new vector index');
      }
    } catch (error) {
      logger.error('Vector store initialization error:', error.message);
      throw error;
    }
  }

  addVector(productId, embedding, label = null) {
    if (!this.index) {
      throw new Error('Vector store not initialized');
    }

    const idx = this.productIdMap.size;
    this.productIdMap.set(idx, productId);

    try {
      this.index.addPoint(embedding, idx);
    } catch (error) {
      logger.error('Error adding vector:', error.message);
      throw error;
    }
  }

  search(queryEmbedding, topK = 5) {
    if (!this.index) {
      throw new Error('Vector store not initialized');
    }

    try {
      this.index.efSearch = Math.max(topK * 2, 100);
      const result = this.index.searchKnn(queryEmbedding, topK);

      const productIds = result.neighbors.map((idx) => this.productIdMap.get(idx));
      const distances = result.distances;

      return {
        productIds,
        distances,
        scores: distances.map((d) => Math.exp(-d)), // Simple distance-to-score conversion
      };
    } catch (error) {
      logger.error('Search error:', error.message);
      throw error;
    }
  }

  saveIndex() {
    try {
      if (!fs.existsSync(INDEX_PATH)) {
        fs.mkdirSync(INDEX_PATH, { recursive: true });
      }

      this.index.writeIndex(INDEX_FILE);

      const metadata = {
        vectorDim: this.vectorDim,
        productIdMap: Object.fromEntries(this.productIdMap),
        createdAt: new Date().toISOString(),
      };
      fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));

      logger.info(`Saved vector index to ${INDEX_FILE}`);
    } catch (error) {
      logger.error('Error saving index:', error.message);
      throw error;
    }
  }

  loadIndex() {
    try {
      this.index = new HierarchicalNSW('l2', this.vectorDim);
      this.index.readIndex(INDEX_FILE);

      const metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf-8'));
      this.productIdMap = new Map(Object.entries(metadata.productIdMap));

      logger.info(`Loaded vector index with ${this.productIdMap.size} products`);
    } catch (error) {
      logger.error('Error loading index:', error.message);
      throw error;
    }
  }

  clear() {
    this.index = null;
    this.productIdMap.clear();
    if (fs.existsSync(INDEX_FILE)) fs.unlinkSync(INDEX_FILE);
    if (fs.existsSync(METADATA_FILE)) fs.unlinkSync(METADATA_FILE);
  }

  getSize() {
    return this.productIdMap.size;
  }
}

// Singleton instance
const vectorStore = new VectorStore();

export function initVectorStore() {
  vectorStore.initialize();
  return vectorStore;
}

export function getVectorStore() {
  return vectorStore;
}

export async function semanticSearch(queryEmbedding, topK = 5) {
  return vectorStore.search(queryEmbedding, topK);
}
