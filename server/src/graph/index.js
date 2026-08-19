import { classifyIntentNode } from './nodes/classifyIntent.js';
import { searchNode } from './nodes/search.js';
import { refineNode } from './nodes/refine.js';
import { cartActionNode } from './nodes/cartAction.js';
import logger from '../utils/logger.js';

export async function executeConversationFlow(input) {
  try {
    const { userMessage, sessionState = {} } = input;

    // Initialize state
    let state = {
      userMessage,
      topK: 5,
      ...sessionState,
    };

    logger.info(`[Graph] Processing: "${userMessage}"`);

    // Step 1: Classify Intent
    state = await classifyIntentNode(state);
    logger.info(`[Graph] Intent: ${state.intent}`);

    // Step 2: Route based on intent
    if (state.intent === 'new_search') {
      state = await searchNode(state);
    } else if (state.intent === 'refine') {
      state = await refineNode(state);
    } else if (state.intent === 'cart_action') {
      state = await cartActionNode(state);
    } else {
      // 'other' - treat as new search
      state = await searchNode(state);
    }

    logger.info(`[Graph] Response ready`);

    return {
      response: state.response,
      results: state.searchResults || [],
      updatedState: {
        lastQuery: state.lastQuery,
        lastResults: state.lastResults,
        lastRefinementConstraints: state.lastRefinementConstraints,
      },
    };
  } catch (error) {
    logger.error('Graph execution error:', error.message);
    return {
      response: 'Sorry, something went wrong. Please try again.',
      results: [],
      updatedState: {},
    };
  }
}
