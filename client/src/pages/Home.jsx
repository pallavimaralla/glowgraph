import { useState } from 'react';
import ProductGrid from '../components/products/ProductGrid.jsx';
import ChatWidget from '../components/chat/ChatWidget.jsx';

const RANGES = [
  'Hydra Pure',
  'Clarify Essence',
  'Renewal Ritual',
  'Balance & Glow',
  'Calm Shield',
  'Radiant Layer',
];

const CATEGORIES = ['Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen', 'Treatment', 'Eye Care', 'Lip Care'];

export default function Home() {
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceMax, setPriceMax] = useState(null);

  const filters = {};
  if (selectedRange) filters.range = selectedRange;
  if (selectedCategory) filters.category = selectedCategory;
  if (priceMax) filters.maxPrice = priceMax;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-sage-50 py-12 mb-12">
        <div className="container mx-auto px-8">
          <h1 className="text-4xl font-bold text-sage-900 mb-2">Verrà Skincare</h1>
          <p className="text-sage-700 text-lg">
            Ingredient-forward skincare for everyone. Find your perfect match below, or chat with our assistant.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-sage-50 p-6 rounded-lg sticky top-24">
              <h3 className="text-lg font-semibold text-sage-900 mb-4">Filter</h3>

              {/* Range Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-sage-800 mb-2">Range</h4>
                <button
                  onClick={() => setSelectedRange(null)}
                  className={`block w-full text-left px-3 py-2 rounded text-sm mb-1 transition ${
                    !selectedRange
                      ? 'bg-sage-700 text-white'
                      : 'text-sage-700 hover:bg-sage-200'
                  }`}
                >
                  All Ranges
                </button>
                {RANGES.map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedRange(range)}
                    className={`block w-full text-left px-3 py-2 rounded text-sm mb-1 transition ${
                      selectedRange === range
                        ? 'bg-sage-700 text-white'
                        : 'text-sage-700 hover:bg-sage-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-sage-800 mb-2">Category</h4>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full text-left px-3 py-2 rounded text-sm mb-1 transition ${
                    !selectedCategory
                      ? 'bg-sage-700 text-white'
                      : 'text-sage-700 hover:bg-sage-200'
                  }`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left px-3 py-2 rounded text-sm mb-1 transition ${
                      selectedCategory === cat
                        ? 'bg-sage-700 text-white'
                        : 'text-sage-700 hover:bg-sage-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="text-sm font-semibold text-sage-800 mb-2">Max Price</h4>
                <div className="space-y-1">
                  {[15, 20, 25, 30].map((price) => (
                    <button
                      key={price}
                      onClick={() => setPriceMax(priceMax === price ? null : price)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition ${
                        priceMax === price
                          ? 'bg-sage-700 text-white'
                          : 'text-sage-700 hover:bg-sage-200'
                      }`}
                    >
                      Under ${price}
                    </button>
                  ))}
                </div>
                {priceMax && (
                  <button
                    onClick={() => setPriceMax(null)}
                    className="mt-2 text-xs text-sage-600 hover:underline"
                  >
                    Clear price
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            <ProductGrid filters={filters} />
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
