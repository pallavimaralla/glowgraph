import Product from '../models/Product.js';
import { embedQuery } from '../services/embeddings.service.js';
import { semanticSearch } from '../services/vectorStore.service.js';
import logger from '../utils/logger.js';

export async function semanticSearchProducts(req, res) {
  try {
    const { query, topK = 5 } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query cannot be empty' });
    }

    logger.info(`Semantic search: "${query}"`);

    // Embed the query
    const queryEmbedding = await embedQuery(query);

    // Search vector store
    const { productIds, scores } = await semanticSearch(queryEmbedding, topK);

    // Fetch full product details from MongoDB
    const products = await Product.find({ _id: { $in: productIds } });

    // Sort by search result order
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));
    const sortedProducts = productIds
      .map((id, idx) => ({
        product: productMap.get(id.toString()),
        relevanceScore: scores[idx],
      }))
      .filter((item) => item.product);

    res.json({
      query,
      results: sortedProducts,
      count: sortedProducts.length,
    });
  } catch (error) {
    logger.error('Semantic search error:', error.message);
    res.status(500).json({ error: 'Search failed' });
  }
}
