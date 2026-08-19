import 'dotenv/config.js';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import logger from '../utils/logger.js';

const products = [
  // HYDRA PURE - Hydration-focused range
  {
    name: 'Hydra Cleanse Gel',
    description: 'Gentle gel cleanser with hyaluronic acid and cucumber extract. Removes makeup and impurities without disrupting the skin barrier. Perfect for daily hydrating cleanse.',
    range: 'Hydra Pure',
    routineCategory: 'Cleanser',
    concernTags: ['Hydration', 'Dry'],
    price: 12.99,
  },
  {
    name: 'Aqua Essence Toner',
    description: 'Lightweight toner infused with sea kelp and glycerin. Prepares skin for serums and moisturizers. Absorbs quickly without stickiness.',
    range: 'Hydra Pure',
    routineCategory: 'Toner',
    concernTags: ['Hydration', 'Dullness'],
    price: 14.99,
  },
  {
    name: 'Deep Hydration Serum',
    description: 'Silky serum with hyaluronic acid, panthenol, and aloe vera. Locks in moisture and plumps fine lines. Layer under moisturizer for intense hydration.',
    range: 'Hydra Pure',
    routineCategory: 'Serum',
    concernTags: ['Hydration', 'Anti-Aging'],
    price: 22.99,
  },
  {
    name: 'Barrier Restore Moisturizer',
    description: 'Rich cream with ceramides, squalane, and oat extract. Strengthens skin barrier and maintains hydration throughout the day and night.',
    range: 'Hydra Pure',
    routineCategory: 'Moisturizer',
    concernTags: ['Hydration', 'Dry', 'Sensitive'],
    price: 18.99,
  },
  {
    name: 'Hydra Shield SPF 30',
    description: 'Lightweight hydrating sunscreen. Broad-spectrum UVA/UVB protection with hyaluronic acid. Won\'t leave white cast or feel greasy.',
    range: 'Hydra Pure',
    routineCategory: 'Sunscreen',
    concernTags: ['Hydration'],
    price: 16.99,
  },
  {
    name: 'Intense Hydration Mask',
    description: 'Sheet mask soaked in humectant-rich essence. Use 2-3 times weekly for a hydration boost. Leaves skin dewy and plump.',
    range: 'Hydra Pure',
    routineCategory: 'Treatment',
    concernTags: ['Hydration', 'Dullness'],
    price: 8.99,
  },
  {
    name: 'Eye Hydra Contour',
    description: 'Nourishing eye cream with caffeine and peptides. Reduces puffiness and fine lines while delivering intense hydration to delicate eye area.',
    range: 'Hydra Pure',
    routineCategory: 'Eye Care',
    concernTags: ['Hydration', 'Anti-Aging'],
    price: 19.99,
  },
  {
    name: 'Hydra Lip Balm',
    description: 'Creamy lip balm with shea butter, vitamin E, and hyaluronic acid. Heals and plumps lips without stickiness. SPF 15 included.',
    range: 'Hydra Pure',
    routineCategory: 'Lip Care',
    concernTags: ['Hydration'],
    price: 9.99,
  },

  // CLARIFY ESSENCE - Breakout & congestion control
  {
    name: 'Clarify Foam Wash',
    description: 'Gentle foaming cleanser with salicylic acid and tea tree oil. Removes excess oil and unclogged pores without over-drying breakout-prone skin.',
    range: 'Clarify Essence',
    routineCategory: 'Cleanser',
    concernTags: ['Breakouts', 'Oily'],
    price: 11.99,
  },
  {
    name: 'BHA Clarifying Toner',
    description: 'Exfoliating toner with 2% salicylic acid and niacinamide. Dissolves sebum and dead skin. Use every 2-3 days to maintain clarity.',
    range: 'Clarify Essence',
    routineCategory: 'Toner',
    concernTags: ['Breakouts', 'Oily', 'Uneven Tone'],
    price: 16.99,
  },
  {
    name: 'Spot Control Serum',
    description: 'Targeted serum with salicylic acid, centella asiatica, and zinc. Shrinks blemishes and calms inflammation. Wear under SPF.',
    range: 'Clarify Essence',
    routineCategory: 'Serum',
    concernTags: ['Breakouts', 'Irritation'],
    price: 18.99,
  },
  {
    name: 'Oil Control Gel Moisturizer',
    description: 'Lightweight gel moisturizer with zinc and mattifying silica. Hydrates without clogging pores or leaving shine. Perfect for oily, congestion-prone skin.',
    range: 'Clarify Essence',
    routineCategory: 'Moisturizer',
    concernTags: ['Breakouts', 'Oily'],
    price: 15.99,
  },
  {
    name: 'Clarify Daily SPF 35',
    description: 'Oil-free mineral sunscreen with niacinamide. Matte finish, won\'t trigger breakouts. Reef-safe formula.',
    range: 'Clarify Essence',
    routineCategory: 'Sunscreen',
    concernTags: ['Breakouts'],
    price: 17.99,
  },
  {
    name: 'Detox Clay Mask',
    description: 'Weekly treatment mask with kaolin clay and salicylic acid. Purifies pores and absorbs excess oil. Use once weekly.',
    range: 'Clarify Essence',
    routineCategory: 'Treatment',
    concernTags: ['Breakouts', 'Oily'],
    price: 14.99,
  },
  {
    name: 'Pore Minimizing Serum',
    description: 'Lightweight serum with witch hazel and niacinamide. Tightens appearance of enlarged pores and refines skin texture.',
    range: 'Clarify Essence',
    routineCategory: 'Serum',
    concernTags: ['Breakouts', 'Oily'],
    price: 17.99,
  },

  // RENEWAL RITUAL - Anti-aging & mature skin
  {
    name: 'Renewal Milk Cleanser',
    description: 'Creamy cleanser with retinol and peptides. Gently removes makeup while beginning the renewal process. Nourishing, not stripping.',
    range: 'Renewal Ritual',
    routineCategory: 'Cleanser',
    concernTags: ['Anti-Aging', 'Dry'],
    price: 14.99,
  },
  {
    name: 'Peptide Essence Toner',
    description: 'Firming toner infused with pentapeptides and niacinamide. Improves skin elasticity and minimizes fine lines. Apply with cotton pad.',
    range: 'Renewal Ritual',
    routineCategory: 'Toner',
    concernTags: ['Anti-Aging', 'Uneven Tone'],
    price: 18.99,
  },
  {
    name: 'Advanced Retinol Serum',
    description: 'Time-release retinol (0.3%) with hyaluronic acid and squalane. Reduces wrinkles and improves firmness. Start 2-3x weekly.',
    range: 'Renewal Ritual',
    routineCategory: 'Serum',
    concernTags: ['Anti-Aging'],
    price: 28.99,
  },
  {
    name: 'Renewal Rich Cream',
    description: 'Luxurious moisturizer with bakuchiol, retinol alternative, and shea butter. Firms and hydrates mature skin overnight.',
    range: 'Renewal Ritual',
    routineCategory: 'Moisturizer',
    concernTags: ['Anti-Aging', 'Dry'],
    price: 24.99,
  },
  {
    name: 'Renewal Day SPF 40',
    description: 'Protective anti-aging sunscreen with antioxidants and peptides. Prevents photo-aging while defending skin. Lightweight, dewy finish.',
    range: 'Renewal Ritual',
    routineCategory: 'Sunscreen',
    concernTags: ['Anti-Aging'],
    price: 19.99,
  },
  {
    name: 'Firming Sleep Mask',
    description: 'Overnight mask with collagen-boosting peptides and resveratrol. Wake to plumper, firmer skin. Use 2-3x weekly.',
    range: 'Renewal Ritual',
    routineCategory: 'Treatment',
    concernTags: ['Anti-Aging', 'Dry'],
    price: 22.99,
  },
  {
    name: 'Eye Renewal Cream',
    description: 'Potent under-eye treatment with retinol, caffeine, and peptides. Diminishes fine lines, crow\'s feet, and dark circles.',
    range: 'Renewal Ritual',
    routineCategory: 'Eye Care',
    concernTags: ['Anti-Aging'],
    price: 24.99,
  },
  {
    name: 'Renewal Lip Treatment',
    description: 'Rich lip treatment with retinol and vitamin E. Plumps lips and softens fine lines around mouth. Use nightly.',
    range: 'Renewal Ritual',
    routineCategory: 'Lip Care',
    concernTags: ['Anti-Aging'],
    price: 11.99,
  },

  // BALANCE & GLOW - Combination/balanced skin
  {
    name: 'Balance Gel Cleanser',
    description: 'Balancing gel cleanser with green tea and centella asiatica. Removes impurities without stripping natural oils. Leaves skin fresh and balanced.',
    range: 'Balance & Glow',
    routineCategory: 'Cleanser',
    concernTags: ['Uneven Tone', 'Dullness'],
    price: 12.99,
  },
  {
    name: 'Luminance Toner',
    description: 'Brightening toner with niacinamide and vitamin C. Balances skin pH and preps for serums. Gives instant glow.',
    range: 'Balance & Glow',
    routineCategory: 'Toner',
    concernTags: ['Dullness', 'Uneven Tone'],
    price: 15.99,
  },
  {
    name: 'Radiant Boost Serum',
    description: 'Lightweight serum with niacinamide, hyaluronic acid, and botanical extracts. Evens skin tone and boosts radiance without heaviness.',
    range: 'Balance & Glow',
    routineCategory: 'Serum',
    concernTags: ['Dullness', 'Uneven Tone'],
    price: 19.99,
  },
  {
    name: 'Daily Balance Moisturizer',
    description: 'Lightweight lotion with niacinamide and allantoin. Balances hydration for combination skin. Won\'t clog or feel greasy.',
    range: 'Balance & Glow',
    routineCategory: 'Moisturizer',
    concernTags: ['Hydration', 'Oily'],
    price: 16.99,
  },
  {
    name: 'Glow Protect SPF 38',
    description: 'Sheer sunscreen with illuminating minerals. Protects while imparting natural radiance. No white cast, blend effortlessly.',
    range: 'Balance & Glow',
    routineCategory: 'Sunscreen',
    concernTags: ['Dullness'],
    price: 17.99,
  },
  {
    name: 'Brightening Sheet Mask',
    description: 'Essence-soaked mask with vitamin C and niacinamide. Brightens dull skin and evening tone in one treatment.',
    range: 'Balance & Glow',
    routineCategory: 'Treatment',
    concernTags: ['Dullness', 'Uneven Tone'],
    price: 9.99,
  },
  {
    name: 'Glow Eye Serum',
    description: 'Illuminating eye serum with peptides and mica shimmer. Brightens dark circles and adds subtle radiance to eye area.',
    range: 'Balance & Glow',
    routineCategory: 'Eye Care',
    concernTags: ['Dullness'],
    price: 18.99,
  },
  {
    name: 'Glossy Lip Serum',
    description: 'Shiny lip serum with peptides and botanical oil. Plumps lips and adds lustrous glow. Buildable color.',
    range: 'Balance & Glow',
    routineCategory: 'Lip Care',
    concernTags: ['Hydration'],
    price: 10.99,
  },

  // CALM SHIELD - Sensitive skin
  {
    name: 'Calm Milk Cleanser',
    description: 'Ultra-gentle micellar-based cleanser with oat extract and allantoin. Soothes reactive skin while cleansing. Hypoallergenic.',
    range: 'Calm Shield',
    routineCategory: 'Cleanser',
    concernTags: ['Sensitive', 'Irritation'],
    price: 13.99,
  },
  {
    name: 'Soothe Essence Toner',
    description: 'Alcohol-free toner with centella asiatica and panthenol. Calms redness and reduces irritation. Fragrance-free formula.',
    range: 'Calm Shield',
    routineCategory: 'Toner',
    concernTags: ['Sensitive', 'Irritation'],
    price: 14.99,
  },
  {
    name: 'Barrier Repair Serum',
    description: 'Lightweight serum with ceramides, beta-glucan, and centella. Strengthens compromised barrier and soothes inflammation.',
    range: 'Calm Shield',
    routineCategory: 'Serum',
    concernTags: ['Sensitive', 'Irritation'],
    price: 20.99,
  },
  {
    name: 'Gentle Recovery Moisturizer',
    description: 'Creamy moisturizer with ceramides, panthenol, and allantoin. Deeply nourishes sensitive skin without irritants. Eczema-friendly.',
    range: 'Calm Shield',
    routineCategory: 'Moisturizer',
    concernTags: ['Sensitive', 'Irritation', 'Dry'],
    price: 19.99,
  },
  {
    name: 'Mineral Calm SPF 40',
    description: 'Physical sunscreen with zinc oxide. Perfect for reactive and sensitive skin. No chemical UV absorbers, lightweight.',
    range: 'Calm Shield',
    routineCategory: 'Sunscreen',
    concernTags: ['Sensitive'],
    price: 18.99,
  },
  {
    name: 'Soothe Relief Mask',
    description: 'Calming mask with colloidal oatmeal, aloe, and centella. Reduces redness and irritation. Use 1-2x weekly as needed.',
    range: 'Calm Shield',
    routineCategory: 'Treatment',
    concernTags: ['Sensitive', 'Irritation'],
    price: 13.99,
  },
  {
    name: 'Sensitive Eye Balm',
    description: 'Rich eye balm for reactive eye areas. Contains no fragrance, dyes, or common irritants. Gentle enough for contact lens wearers.',
    range: 'Calm Shield',
    routineCategory: 'Eye Care',
    concernTags: ['Sensitive'],
    price: 17.99,
  },
  {
    name: 'Calm Lip Care',
    description: 'Soothing lip balm for sensitive lips. No menthol, no fragrance. Heals chapped lips with allantoin and panthenol.',
    range: 'Calm Shield',
    routineCategory: 'Lip Care',
    concernTags: ['Sensitive'],
    price: 8.99,
  },

  // RADIANT LAYER - Brightening & dark spot control
  {
    name: 'Radiant Cleanse Powder',
    description: 'Gentle powder cleanser with rice bran and turmeric. Brightens dull skin while removing makeup. Mix with water for paste.',
    range: 'Radiant Layer',
    routineCategory: 'Cleanser',
    concernTags: ['Dark Spots', 'Dullness'],
    price: 14.99,
  },
  {
    name: 'Brightening Essence',
    description: 'Essence with vitamin C derivatives and licorice root. Begins fading dark spots and evens skin tone. Use AM/PM.',
    range: 'Radiant Layer',
    routineCategory: 'Toner',
    concernTags: ['Dark Spots', 'Uneven Tone'],
    price: 16.99,
  },
  {
    name: 'Spot Fade Serum',
    description: 'Concentrated serum with niacinamide, vitamin C, and kojic acid. Targets dark spots and post-acne marks. Use at night.',
    range: 'Radiant Layer',
    routineCategory: 'Serum',
    concernTags: ['Dark Spots', 'Uneven Tone'],
    price: 24.99,
  },
  {
    name: 'Glow Cream',
    description: 'Brightening moisturizer with arbutin and licorice. Maintains skin tone while providing daily moisture and radiance.',
    range: 'Radiant Layer',
    routineCategory: 'Moisturizer',
    concernTags: ['Dark Spots', 'Dullness'],
    price: 17.99,
  },
  {
    name: 'Radiant Glow SPF 45',
    description: 'Protective brightening sunscreen. Prevents dark spots from forming while defending against UV damage. Subtle shimmer finish.',
    range: 'Radiant Layer',
    routineCategory: 'Sunscreen',
    concernTags: ['Dark Spots'],
    price: 18.99,
  },
  {
    name: 'Brightening Ampoule Mask',
    description: 'Intensive brightening mask sheet. Concentrates active ingredients for visible radiance. Use 2x weekly for best results.',
    range: 'Radiant Layer',
    routineCategory: 'Treatment',
    concernTags: ['Dark Spots', 'Uneven Tone'],
    price: 11.99,
  },
  {
    name: 'Radiance Eye Patch',
    description: 'Under-eye patches with brightening peptides and mica. Illuminates tired eyes and fades dark circles. Leave on 10 minutes.',
    range: 'Radiant Layer',
    routineCategory: 'Eye Care',
    concernTags: ['Dark Spots', 'Dullness'],
    price: 15.99,
  },
  {
    name: 'Glow Lip Tint',
    description: 'Tinted lip balm with brightening agents and shimmer. Evens lip tone while adding subtle color and glow.',
    range: 'Radiant Layer',
    routineCategory: 'Lip Care',
    concernTags: ['Dullness'],
    price: 10.99,
  },
  {
    name: 'Dark Spot Corrector',
    description: 'Advanced spot treatment with retinol and vitamin C. Target application for visible dark spots. Use under SPF.',
    range: 'Radiant Layer',
    routineCategory: 'Treatment',
    concernTags: ['Dark Spots'],
    price: 26.99,
  },
  {
    name: 'Luminous Sleeping Pack',
    description: 'Overnight brightening mask with vitamin C and niacinamide. Intensifies radiance while you sleep. Weekly treatment.',
    range: 'Radiant Layer',
    routineCategory: 'Treatment',
    concernTags: ['Dullness', 'Dark Spots'],
    price: 19.99,
  },
  {
    name: 'Radiant Glow Booster',
    description: 'Lightweight essence with illuminating particles. Mix into moisturizer for instant radiance boost. Travel-friendly.',
    range: 'Radiant Layer',
    routineCategory: 'Serum',
    concernTags: ['Dullness'],
    price: 15.99,
  },
  {
    name: 'Fade & Brighten Duo',
    description: 'Concentrated duo of spot fader and brightening serum. Use together for maximum dark spot correction. 2x15ml.',
    range: 'Radiant Layer',
    routineCategory: 'Serum',
    concernTags: ['Dark Spots', 'Uneven Tone'],
    price: 29.99,
  },
];

async function seedDatabase() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/glowgraph';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    logger.info('Cleared existing products');

    // Insert new products
    const inserted = await Product.insertMany(products);
    logger.info(`Seeded ${inserted.length} products successfully`);

    // Log summary by range
    const byRange = await Product.aggregate([
      {
        $group: {
          _id: '$range',
          count: { $sum: 1 },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    logger.info('Products by range:');
    byRange.forEach((row) => {
      logger.info(`  ${row._id}: ${row.count} products ($${row.minPrice}-$${row.maxPrice})`);
    });

    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error('Seed failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
