import { useState } from 'react';
import { addToCart } from '../../api/cart.api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  const { user, idToken } = useAuth();
  const { updateCart } = useCart();

  const handleAddToCart = async () => {
    if (!user || !idToken) {
      alert('Please log in to add items to cart');
      return;
    }

    try {
      setIsAdding(true);
      const updatedCart = await addToCart(idToken, product._id, 1);
      updateCart(updatedCart);
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white border border-sage-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-sage-50 h-48 flex items-center justify-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400?text=Verrà';
          }}
        />
      </div>

      <div className="p-4">
        <div className="text-sm text-sage-600 mb-1">{product.range}</div>
        <h3 className="text-lg font-semibold text-sage-900 mb-1">{product.name}</h3>
        <p className="text-sm text-sage-700 mb-3 line-clamp-2">{product.description}</p>

        <div className="mb-3">
          <div className="text-xs text-sage-600 mb-1">Skin Concerns:</div>
          <div className="flex flex-wrap gap-1">
            {product.concernTags.map((tag) => (
              <span key={tag} className="text-xs bg-sage-100 text-sage-700 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-sage-900">${product.price.toFixed(2)}</div>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-sage-700 hover:bg-sage-800 disabled:opacity-50 text-white px-3 py-2 rounded text-sm font-medium transition"
          >
            {isAdding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
