import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  getProfile,
  updateProfile,
  getOrderHistory,
  getOrderDetails,
} from '../controllers/user.controller.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

router.get('/profile', asyncHandler(getProfile));
router.put('/profile', asyncHandler(updateProfile));
router.get('/orders', asyncHandler(getOrderHistory));
router.get('/orders/:orderId', asyncHandler(getOrderDetails));

export default router;
