import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import logger from '../utils/logger.js';

export async function getCart(req, res) {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    const cartData = await cart.toJSON();
    res.json(cartData);
  } catch (error) {
    logger.error('Get cart error:', error.message);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
}

export async function addToCart(req, res) {
  try {
    const userId = req.user?.uid;
    const { productId, quantity = 1 } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!productId) {
      return res.status(400).json({ error: 'productId required' });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId });
    }

    // Add item
    await cart.addItem(productId, quantity);
    await cart.save();

    logger.info(`Added to cart [${userId}]: ${product.name} x${quantity}`);

    const cartData = await cart.toJSON();
    res.json(cartData);
  } catch (error) {
    logger.error('Add to cart error:', error.message);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
}

export async function removeFromCart(req, res) {
  try {
    const userId = req.user?.uid;
    const { productId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    await cart.removeItem(productId);
    await cart.save();

    logger.info(`Removed from cart [${userId}]: ${productId}`);

    const cartData = await cart.toJSON();
    res.json(cartData);
  } catch (error) {
    logger.error('Remove from cart error:', error.message);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
}

export async function updateCartItem(req, res) {
  try {
    const userId = req.user?.uid;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    if (quantity === 0) {
      await cart.removeItem(productId);
    } else {
      await cart.updateItemQuantity(productId, quantity);
    }

    await cart.save();

    logger.info(`Updated cart [${userId}]: ${productId} qty=${quantity}`);

    const cartData = await cart.toJSON();
    res.json(cartData);
  } catch (error) {
    logger.error('Update cart item error:', error.message);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
}

export async function clearCart(req, res) {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId });
    }

    cart.clear();
    await cart.save();

    logger.info(`Cleared cart [${userId}]`);

    const cartData = await cart.toJSON();
    res.json(cartData);
  } catch (error) {
    logger.error('Clear cart error:', error.message);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
}
