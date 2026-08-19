import { useState } from 'react';
import { addToCart } from '../../api/cart.api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function ChatProductCard({ product, index }) {
  const [isAdding, setIsAdding] = useState(false);
  const { user, idToken } = useAuth();
  const { updateCart } = useCart();

  const handleAdd = async () => {
    if (!user || !idToken) {
      alert('Please log in to add to cart');
      return;
    }

    try {
      setIsAdding(true);
      const updatedCart = await addToCart(idToken, product.id, 1);
      updateCart(updatedCart);
      alert('Added to cart!');
    } catch (error) {
      console.error('Failed to add:', error);
      alert('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white text-sage-900 rounded p-2 text-xs border border-sage-200">
      <div className="font-semibold mb-1">{index + 1}. {product.name}</div>
      <div className="text-sage-700 mb-1 line-clamp-2">{product.description}</div>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold">${product.price.toFixed(2)}</span>
          <span className="text-sage-600 ml-1">({product.range})</span>
        </div>
        <button
          onClick={handleAdd}
          disabled={isAdding}
          className="bg-sage-600 hover:bg-sage-700 disabled:opacity-50 text-white px-2 py-1 rounded text-xs transition"
        >
          {isAdding ? '...' : 'Add'}
        </button>
      </div>
    </div>
  );
}
