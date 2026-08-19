import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from '../controllers/cart.controller.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware);

router.get('/', asyncHandler(getCart));
router.post('/', asyncHandler(addToCart));
router.put('/:productId', asyncHandler(updateCartItem));
router.delete('/:productId', asyncHandler(removeFromCart));
router.post('/clear/all', asyncHandler(clearCart));

export default router;
