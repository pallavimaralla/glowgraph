import { getUserProfile, updateUserProfile } from '../services/auth.service.js';
import Order from '../models/Order.js';
import logger from '../utils/logger.js';

export async function getProfile(req, res) {
  try {
    const uid = req.user?.uid;

    if (!uid) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await getUserProfile(uid);

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error('Get profile error:', error.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

export async function updateProfile(req, res) {
  try {
    const uid = req.user?.uid;
    const updates = req.body;

    if (!uid) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Whitelist updatable fields
    const allowedFields = ['displayName', 'phone', 'defaultAddress', 'preferences'];
    const sanitized = {};

    for (const field of allowedFields) {
      if (field in updates) {
        sanitized[field] = updates[field];
      }
    }

    const user = await updateUserProfile(uid, sanitized);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    logger.info(`Updated profile [${uid}]`);
    res.json(user);
  } catch (error) {
    logger.error('Update profile error:', error.message);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

export async function getOrderHistory(req, res) {
  try {
    const uid = req.user?.uid;

    if (!uid) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const orders = await Order.find({ userId: uid }).sort({ createdAt: -1 });

    res.json({
      userId: uid,
      orderCount: orders.length,
      orders: orders,
    });
  } catch (error) {
    logger.error('Get order history error:', error.message);
    res.status(500).json({ error: 'Failed to fetch order history' });
  }
}

export async function getOrderDetails(req, res) {
  try {
    const uid = req.user?.uid;
    const { orderId } = req.params;

    if (!uid) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const order = await Order.findOne({ orderId, userId: uid });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    logger.error('Get order details error:', error.message);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}
