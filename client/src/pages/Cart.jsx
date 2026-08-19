import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { removeFromCart, updateCartItem, clearCart } from '../api/cart.api.js';

export default function Cart() {
  const { cart, loading, updateCart } = useCart();
  const { idToken } = useAuth();
  const [processingId, setProcessingId] = useState(null);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (!idToken) return;

    try {
      setProcessingId(productId);
      const updatedCart = await updateCartItem(idToken, productId, newQuantity);
      updateCart(updatedCart);
    } catch (error) {
      console.error('Failed to update:', error);
      alert('Failed to update quantity');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemove = async (productId) => {
    if (!idToken) return;

    try {
      setProcessingId(productId);
      const updatedCart = await removeFromCart(idToken, productId);
      updateCart(updatedCart);
    } catch (error) {
      console.error('Failed to remove:', error);
      alert('Failed to remove item');
    } finally {
      setProcessingId(null);
    }
  };

  const handleClear = async () => {
    if (!idToken || !confirm('Clear entire cart?')) return;

    try {
      const updatedCart = await clearCart(idToken);
      updateCart(updatedCart);
    } catch (error) {
      console.error('Failed to clear:', error);
      alert('Failed to clear cart');
    }
  };

  if (loading) {
    return <div className="container mx-auto p-8">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-sage-900 mb-4">Your cart is empty</h2>
          <a href="/" className="text-sage-700 hover:underline">
            Continue shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-12">
      <h1 className="text-3xl font-bold text-sage-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.productId}
                className="border border-sage-200 rounded-lg p-4 flex gap-4"
              >
                <div className="w-20 h-20 bg-sage-50 rounded flex-shrink-0">
                  <img
                    src={item.product?.imageUrl}
                    alt={item.product?.name}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80';
                    }}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-sage-900">{item.product?.name}</h3>
                  <p className="text-sm text-sage-600">
                    {item.product?.range} • {item.product?.category}
                  </p>
                  <p className="text-lg font-bold text-sage-900 mt-2">
                    ${item.product?.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.productId, item.quantity - 1)
                      }
                      disabled={processingId === item.productId || item.quantity <= 1}
                      className="bg-sage-200 hover:bg-sage-300 disabled:opacity-50 text-sage-900 w-6 h-6 rounded flex items-center justify-center text-sm"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.productId, item.quantity + 1)
                      }
                      disabled={processingId === item.productId}
                      className="bg-sage-200 hover:bg-sage-300 disabled:opacity-50 text-sage-900 w-6 h-6 rounded flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-sm text-sage-700">
                    Subtotal: ${item.itemTotal?.toFixed(2)}
                  </p>

                  <button
                    onClick={() => handleRemove(item.productId)}
                    disabled={processingId === item.productId}
                    className="text-sm text-red-600 hover:underline disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleClear}
            className="mt-6 text-sm text-sage-600 hover:underline"
          >
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-sage-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-sage-900 mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4 pb-4 border-b border-sage-200">
              <div className="flex justify-between text-sage-700">
                <span>Subtotal</span>
                <span>${cart.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sage-700">
                <span>Tax (8%)</span>
                <span>${cart.tax?.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold text-sage-900 mb-6">
              <span>Total</span>
              <span>${cart.total?.toFixed(2)}</span>
            </div>

            <button className="w-full bg-sage-700 hover:bg-sage-800 text-white py-3 rounded font-semibold transition disabled:opacity-50">
              Proceed to Checkout (Coming Soon)
            </button>

            <p className="text-xs text-sage-600 text-center mt-3">
              Checkout will be available in Stage 7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
