import express from 'express';
import { semanticSearchProducts } from '../controllers/search.controller.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.post('/', asyncHandler(semanticSearchProducts));

export default router;
