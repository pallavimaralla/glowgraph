import logger from '../../utils/logger.js';

export async function cartActionNode(state) {
  try {
    const { userMessage, searchResults = [] } = state;

    logger.info(`Processing cart action: "${userMessage}"`);

    // Parse add/remove/checkout intents
    const lowerMsg = userMessage.toLowerCase();
    let action = null;
    let selectedIndex = null;

    if (lowerMsg.includes('add') || lowerMsg.includes('get')) {
      action = 'add';

      // Try to extract which product (first, second, all, etc.)
      if (lowerMsg.includes('first')) selectedIndex = 0;
      else if (lowerMsg.includes('second')) selectedIndex = 1;
      else if (lowerMsg.includes('third')) selectedIndex = 2;
      else if (lowerMsg.includes('all')) selectedIndex = 'all';
      else selectedIndex = 0; // Default to first
    } else if (lowerMsg.includes('remove')) {
      action = 'remove';
    } else if (lowerMsg.includes('checkout') || lowerMsg.includes('pay')) {
      action = 'checkout';
    }

    // Build response
    let response = '';
    if (action === 'add' && searchResults.length > 0) {
      if (selectedIndex === 'all') {
        response = `Added all ${searchResults.length} products to cart. Ready to checkout?`;
      } else if (selectedIndex !== null && searchResults[selectedIndex]) {
        const product = searchResults[selectedIndex].product;
        response = `Added "${product.name}" ($${product.price}) to cart. Continue shopping or ready to checkout?`;
      } else {
        response = 'Could not add product. Please be more specific.';
      }
    } else if (action === 'checkout') {
      response = 'Checkout coming soon! Your cart items are saved.';
    } else {
      response = 'Sorry, I did not understand that action. Would you like to search for products or checkout?';
    }

    return {
      ...state,
      cartAction: action,
      cartSelectedIndex: selectedIndex,
      response,
    };
  } catch (error) {
    logger.error('Cart action node error:', error.message);
    return {
      ...state,
      response: 'Sorry, the cart action failed. Please try again.',
    };
  }
}
