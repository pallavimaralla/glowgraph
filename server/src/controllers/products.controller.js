import Product from '../models/Product.js';
import logger from '../utils/logger.js';

export async function listProducts(req, res) {
  try {
    const { range, category, concern, minPrice, maxPrice, limit = 50, skip = 0 } = req.query;

    const filter = {};

    if (range) {
      filter.range = range;
    }

    if (category) {
      filter.routineCategory = category;
    }

    if (concern) {
      filter.concernTags = concern;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) {
        filter.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice !== undefined) {
        filter.price.$lte = parseFloat(maxPrice);
      }
    }

    const products = await Product.find(filter)
      .limit(Math.min(parseInt(limit), 100))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.json({
      data: products,
      pagination: {
        total,
        limit: Math.min(parseInt(limit), 100),
        skip: parseInt(skip),
        hasMore: parseInt(skip) + products.length < total,
      },
    });
  } catch (error) {
    logger.error('List products error:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    logger.error('Get product error:', error.message);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}
