import express from 'express';
import { optionalAuth } from '../middleware/auth.middleware.js';
import { chat } from '../controllers/chat.controller.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.post('/', optionalAuth, asyncHandler(chat));

export default router;
