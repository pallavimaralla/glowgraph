import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

cartSchema.methods.addItem = async function (productId, quantity = 1) {
  const Product = mongoose.model('Product');
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  const existingItem = this.items.find((item) => item.productId.equals(productId));

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({ productId, quantity });
  }

  this.updateTotals();
  return this;
};

cartSchema.methods.removeItem = async function (productId) {
  this.items = this.items.filter((item) => !item.productId.equals(productId));
  this.updateTotals();
  return this;
};

cartSchema.methods.updateItemQuantity = async function (productId, quantity) {
  if (quantity <= 0) {
    return this.removeItem(productId);
  }

  const item = this.items.find((item) => item.productId.equals(productId));
  if (item) {
    item.quantity = quantity;
    this.updateTotals();
  }

  return this;
};

cartSchema.methods.updateTotals = async function () {
  const Product = mongoose.model('Product');

  let subtotal = 0;
  for (const item of this.items) {
    const product = await Product.findById(item.productId);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  }

  this.subtotal = Math.round(subtotal * 100) / 100;
  this.tax = Math.round(this.subtotal * 0.08 * 100) / 100; // 8% tax
  this.total = Math.round((this.subtotal + this.tax) * 100) / 100;
  this.lastModified = new Date();

  return this;
};

cartSchema.methods.clear = function () {
  this.items = [];
  this.subtotal = 0;
  this.tax = 0;
  this.total = 0;
  return this;
};

cartSchema.methods.toJSON = async function () {
  const Product = mongoose.model('Product');

  const itemsWithDetails = await Promise.all(
    this.items.map(async (item) => {
      const product = await Product.findById(item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        addedAt: item.addedAt,
        product: product
          ? {
              id: product._id,
              name: product.name,
              price: product.price,
              range: product.range,
              imageUrl: product.imageUrl,
            }
          : null,
        itemTotal: product ? Math.round(product.price * item.quantity * 100) / 100 : 0,
      };
    })
  );

  return {
    userId: this.userId,
    items: itemsWithDetails,
    itemCount: this.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: this.subtotal,
    tax: this.tax,
    total: this.total,
    lastModified: this.lastModified,
  };
};

export default mongoose.model('Cart', cartSchema);
