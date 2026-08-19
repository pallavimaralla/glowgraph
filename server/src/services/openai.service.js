import { OpenAI } from 'openai';
import logger from '../utils/logger.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a knowledgeable Verrà skincare assistant. Verrà is an ingredient-forward, mid-range skincare brand with 6 product ranges:
- Hydra Pure: Hydration-focused
- Clarify Essence: Breakouts & congestion control
- Renewal Ritual: Anti-aging & mature skin
- Balance & Glow: Combination/balanced skin
- Calm Shield: Sensitive skin
- Radiant Layer: Brightening & dark spot control

When recommending products:
1. Be warm, helpful, and non-pushy
2. Explain WHY each product fits the user's needs
3. Reference specific ingredients and benefits
4. Be honest if a concern isn't well-served by current stock
5. Keep responses concise (2-3 sentences per recommendation)
6. Always mention price to help with budget considerations`;

export async function generateResponse(userMessage, products, context = null) {
  try {
    const productText = products
      .map((p) => {
        const { product, relevanceScore } = p;
        return `
- **${product.name}** (${product.range}) - $${product.price}
  ${product.description}
  Concerns: ${product.concernTags.join(', ')}
  Relevance: ${(relevanceScore * 100).toFixed(0)}%
`;
      })
      .join('\n');

    const userPrompt = `
User message: "${userMessage}"

${products.length > 0 ? `Here are the most relevant products:\n${productText}` : 'No products found matching this criteria. Suggest alternatives or ask clarifying questions.'}

${context ? `Previous context: ${context}` : ''}

Provide a friendly, helpful recommendation response. If multiple products fit, explain the trade-offs between them.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.choices[0].message.content;
  } catch (error) {
    logger.error('OpenAI response generation error:', error.message);
    throw error;
  }
}

export async function classifyIntent(userMessage, lastQuery = null) {
  try {
    const context = lastQuery ? `Previous query: "${lastQuery}"` : '';

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Classify this message into ONE category only: "new_search", "refine", "cart_action", or "other".

Message: "${userMessage}"
${context}

Respond with ONLY the category name, nothing else.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 20,
    });

    const intent = response.choices[0].message.content.trim().toLowerCase();
    const validIntents = ['new_search', 'refine', 'cart_action', 'other'];

    return validIntents.includes(intent) ? intent : 'new_search';
  } catch (error) {
    logger.error('Intent classification error:', error.message);
    return 'new_search';
  }
}

export async function extractRefinement(userMessage) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Extract refinement constraints from this message. Return a JSON object with any of these fields:
- maxPrice: number
- minPrice: number
- concerns: array of strings
- range: string (one of: Hydra Pure, Clarify Essence, Renewal Ritual, Balance & Glow, Calm Shield, Radiant Layer)

Message: "${userMessage}"

Return ONLY valid JSON, or {} if no constraints found.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 150,
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch {
      return {};
    }
  } catch (error) {
    logger.error('Refinement extraction error:', error.message);
    return {};
  }
}
