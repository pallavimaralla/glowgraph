import Product from '../../models/Product.js';
import { embedQuery } from '../../services/embeddings.service.js';
import { semanticSearch } from '../../services/vectorStore.service.js';
import { generateResponse } from '../../services/openai.service.js';
import logger from '../../utils/logger.js';

export async function searchNode(state) {
  try {
    const { userMessage, topK = 5 } = state;

    logger.info(`Searching for: "${userMessage}"`);

    // Embed query
    const queryEmbedding = await embedQuery(userMessage);

    // Semantic search
    const { productIds, scores } = await semanticSearch(queryEmbedding, topK);

    // Fetch full product details
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const searchResults = productIds
      .map((id, idx) => ({
        product: productMap.get(id.toString()),
        relevanceScore: scores[idx],
      }))
      .filter((item) => item.product);

    // Generate response
    const responseText = await generateResponse(userMessage, searchResults);

    return {
      ...state,
      lastQuery: userMessage,
      lastResults: productIds,
      searchResults,
      response: responseText,
    };
  } catch (error) {
    logger.error('Search node error:', error.message);
    return {
      ...state,
      response: 'Sorry, the search failed. Please try again.',
      searchResults: [],
    };
  }
}
