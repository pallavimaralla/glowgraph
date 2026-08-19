import express from 'express';
import { listProducts, getProductById } from '../controllers/products.controller.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/', asyncHandler(listProducts));
router.get('/:id', asyncHandler(getProductById));

export default router;
