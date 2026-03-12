import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🍔</span>
          <span className="text-2xl font-bold text-orange-500">BITE HUB</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-orange-500 font-medium transition">Home</Link>

          <Link
            to={isAdmin ? "/admin-menu" : "/menu"}
            className="text-gray-600 hover:text-orange-500 font-medium transition"
          >
            Menu
          </Link>

          {/* Regular user links */}
          {user && !isAdmin && (
            <>
              <Link to="/orders" className="text-gray-600 hover:text-orange-500 font-medium transition">
                My Orders
              </Link>
              <Link to="/support" className="text-gray-600 hover:text-orange-500 font-medium transition">
                Support
              </Link>
            </>
          )}

          {/* Admin links */}
          {isAdmin && (
            <>
              <Link to="/admin" className="text-gray-600 hover:text-orange-500 font-medium transition">
                Dashboard
              </Link>
              <Link to="/admin-support" className="text-gray-600 hover:text-orange-500 font-medium transition">
                Support
              </Link>
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">

          {/* Cart - only for regular users */}
          {!isAdmin && (
            <Link to="/cart" className="relative">
              <span className="text-2xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              {/* Admin badge */}
              {isAdmin && (
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                  👨‍💼 Admin
                </span>
              )}

              <span className="text-gray-700 font-medium">
                Hi, {user.name.split(' ')[0]}!
              </span>

              <button
                onClick={handleLogout}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-orange-500 border border-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">

          {/* Cart for mobile - only for regular users */}
          {!isAdmin && (
            <Link to="/cart" className="relative">
              <span className="text-2xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-3">

          <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-orange-500 font-medium">
            Home
          </Link>

          <Link
            to={isAdmin ? "/admin-menu" : "/menu"}
            onClick={() => setMenuOpen(false)}
            className="text-gray-600 hover:text-orange-500 font-medium"
          >
            Menu
          </Link>

          {/* Regular user mobile links */}
          {user && !isAdmin && (
            <>
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="text-gray-600 hover:text-orange-500 font-medium"
              >
                My Orders
              </Link>
              <Link
                to="/support"
                onClick={() => setMenuOpen(false)}
                className="text-gray-600 hover:text-orange-500 font-medium"
              >
                Support
              </Link>
            </>
          )}

          {/* Admin mobile links */}
          {isAdmin && (
            <>
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-orange-500 font-medium">
                Dashboard
              </Link>
              <Link to="/admin-support" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-orange-500 font-medium">
                Support
              </Link>
            </>
          )}

          {user ? (
            <div className="flex flex-col gap-2">
              {isAdmin && (
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full w-fit">
                  👨‍💼 Admin
                </span>
              )}
              <button
                onClick={handleLogout}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-left font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-orange-500 border border-orange-500 px-4 py-2 rounded-lg font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;