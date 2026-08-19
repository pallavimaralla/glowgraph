import Product from '../../models/Product.js';
import { extractRefinement } from '../../services/openai.service.js';
import { generateResponse } from '../../services/openai.service.js';
import logger from '../../utils/logger.js';

export async function refineNode(state) {
  try {
    const { userMessage, lastResults = [] } = state;

    logger.info(`Refining search with: "${userMessage}"`);

    if (!lastResults || lastResults.length === 0) {
      return {
        ...state,
        response: 'No previous search results to refine. Please do a new search first.',
      };
    }

    // Extract refinement constraints
    const constraints = await extractRefinement(userMessage);

    // Fetch previous results
    const previousProducts = await Product.find({ _id: { $in: lastResults } });

    // Apply constraints
    let refinedProducts = previousProducts;

    if (constraints.maxPrice) {
      refinedProducts = refinedProducts.filter((p) => p.price <= constraints.maxPrice);
    }
    if (constraints.minPrice) {
      refinedProducts = refinedProducts.filter((p) => p.price >= constraints.minPrice);
    }
    if (constraints.concerns && constraints.concerns.length > 0) {
      refinedProducts = refinedProducts.filter((p) =>
        constraints.concerns.some((c) => p.concernTags.includes(c))
      );
    }
    if (constraints.range) {
      refinedProducts = refinedProducts.filter((p) => p.range === constraints.range);
    }

    // Map to search result format with static scores
    const searchResults = refinedProducts.map((p) => ({
      product: p,
      relevanceScore: 0.8,
    }));

    // Generate response
    const responseText = await generateResponse(userMessage, searchResults);

    return {
      ...state,
      lastResults: refinedProducts.map((p) => p._id),
      lastRefinementConstraints: constraints,
      searchResults,
      response: responseText,
    };
  } catch (error) {
    logger.error('Refine node error:', error.message);
    return {
      ...state,
      response: 'Sorry, refinement failed. Please try a new search.',
    };
  }
}
