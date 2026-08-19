import { classifyIntent } from '../../services/openai.service.js';
import logger from '../../utils/logger.js';

export async function classifyIntentNode(state) {
  try {
    const { userMessage, lastQuery } = state;

    logger.info(`Classifying intent for: "${userMessage}"`);

    const intent = await classifyIntent(userMessage, lastQuery);

    return {
      ...state,
      intent,
    };
  } catch (error) {
    logger.error('Classify intent node error:', error.message);
    return {
      ...state,
      intent: 'new_search',
    };
  }
}
