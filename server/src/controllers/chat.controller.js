import { v4 as uuidv4 } from 'uuid';
import ChatSession from '../models/ChatSession.js';
import { executeConversationFlow } from '../graph/index.js';
import { getRedisClient } from '../config/redis.js';
import logger from '../utils/logger.js';

export async function chat(req, res) {
  try {
    const { message, sessionId: providedSessionId } = req.body;
    const userId = req.user?.uid || null;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Use provided sessionId or generate new one
    const sessionId = providedSessionId || uuidv4();

    logger.info(`Chat [${sessionId}]: ${message}`);

    // Get or create chat session
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      session = new ChatSession({
        sessionId,
        userId,
        messages: [],
        currentState: 'idle',
      });
    }

    // Prepare state for graph
    const sessionState = {
      lastQuery: session.lastQuery,
      lastResults: session.lastResults,
      lastRefinementConstraints: session.lastRefinementConstraints,
    };

    // Execute graph flow
    const graphResult = await executeConversationFlow({
      userMessage: message,
      sessionState,
    });

    // Update session
    session.messages.push({
      role: 'user',
      content: message,
    });

    session.messages.push({
      role: 'assistant',
      content: graphResult.response,
    });

    // Update session state from graph output
    if (graphResult.updatedState) {
      if (graphResult.updatedState.lastQuery) {
        session.lastQuery = graphResult.updatedState.lastQuery;
      }
      if (graphResult.updatedState.lastResults) {
        session.lastResults = graphResult.updatedState.lastResults;
      }
      if (graphResult.updatedState.lastRefinementConstraints) {
        session.lastRefinementConstraints = graphResult.updatedState.lastRefinementConstraints;
      }
    }

    await session.save();

    // Cache session in Redis for fast access
    const redisClient = getRedisClient();
    await redisClient.setEx(`session:${sessionId}`, 86400, JSON.stringify(session.toObject()));

    res.json({
      sessionId,
      message,
      response: graphResult.response,
      results: graphResult.results.map((r) => ({
        id: r.product._id,
        name: r.product.name,
        description: r.product.description,
        price: r.product.price,
        range: r.product.range,
        category: r.product.routineCategory,
        concerns: r.product.concernTags,
        relevanceScore: r.relevanceScore,
      })),
    });
  } catch (error) {
    logger.error('Chat error:', error.message);
    res.status(500).json({ error: 'Chat failed. Please try again.' });
  }
}
