import { OpenAI } from 'openai';
import logger from '../utils/logger.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = 'text-embedding-3-small';

export async function embedText(text) {
  try {
    const response = await openai.embeddings.create({
      model: MODEL,
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    logger.error('Embedding error:', error.message);
    throw error;
  }
}

export async function embedProduct(product) {
  const textToEmbed = `
    Product: ${product.name}
    Description: ${product.description}
    Range: ${product.range}
    Category: ${product.routineCategory}
    Concerns: ${product.concernTags.join(', ')}
    Price: $${product.price}
  `.trim();

  return embedText(textToEmbed);
}

export async function embedQuery(query) {
  return embedText(query);
}
