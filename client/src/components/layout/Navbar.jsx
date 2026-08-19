import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const itemCount = cart?.itemCount || 0;

  return (
    <nav className="border-b border-sage-200 sticky top-0 bg-white z-40">
      <div className="container mx-auto px-8 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-sage-800 hover:text-sage-900">
          Verrà
        </Link>

        <div className="flex gap-6 items-center">
          <Link to="/" className="text-sage-700 hover:text-sage-900 text-sm">
            Shop
          </Link>

          <Link to="/cart" className="relative text-sage-700 hover:text-sage-900 text-sm">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-sage-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex gap-3 items-center text-sm">
              <span className="text-sage-700">{user.email}</span>
              <button
                onClick={logout}
                className="text-sage-700 hover:text-sage-900 underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sage-700 hover:text-sage-900 text-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
