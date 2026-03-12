import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout!');
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    navigate('/payment');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-7xl sm:text-8xl mb-6">🛒</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">Your cart is empty!</h2>
        <p className="text-gray-500 mb-8 text-center text-sm sm:text-base">Looks like you haven't added anything yet.</p>
        <Link
          to="/menu"
          className="bg-orange-500 text-white font-bold px-8 py-3 rounded-full hover:bg-orange-600 active:bg-orange-700 transition text-base sm:text-lg"
        >
          Browse Menu 🍔
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Your Cart 🛒</h1>
          <button
            onClick={() => { clearCart(); toast.success('Cart cleared!'); }}
            className="text-red-400 hover:text-red-600 active:text-red-700 font-medium transition text-sm py-1 px-2 -mr-2"
          >
            Clear All
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8">

          {/* Cart Items */}
          <div className="flex-1 flex flex-col gap-3 sm:gap-4">
            {cartItems.map(item => (
              <div key={item._id} className="bg-white rounded-2xl shadow-sm p-3 sm:p-4 flex items-center gap-3 sm:gap-4">

                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Food'; }}
                />

                {/* Details + Controls (stacked on mobile) */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-tight truncate">{item.name}</h3>
                    {/* Remove button — top-right on mobile */}
                    <button
                      onClick={() => { removeFromCart(item._id); toast.success('Item removed!'); }}
                      className="text-red-400 hover:text-red-600 active:text-red-700 transition flex-shrink-0 p-1 -mt-1 -mr-1"
                      aria-label="Remove item"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-orange-500 font-bold text-base sm:text-lg">₹{item.price}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 font-bold hover:bg-orange-200 active:bg-orange-300 transition flex items-center justify-center text-lg leading-none"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="font-bold text-gray-800 w-6 text-center text-sm sm:text-base">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 font-bold hover:bg-orange-200 active:bg-orange-300 transition flex items-center justify-center text-lg leading-none"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total */}
                    <p className="font-bold text-gray-800 text-sm sm:text-base min-w-12 text-right">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Order Summary</h2>

              {/* Items List */}
              <div className="flex flex-col gap-2 mb-4">
                {cartItems.map(item => (
                  <div key={item._id} className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span className="truncate mr-2">{item.name} × {item.quantity}</span>
                    <span className="flex-shrink-0">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 sm:pt-4 mb-3 sm:mb-4">
                <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                  <span>Delivery Fee</span>
                  <span className="text-green-500 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                  <span>Taxes (5%)</span>
                  <span>₹{Math.round(totalPrice * 0.05)}</span>
                </div>
              </div>

              <div className="border-t pt-3 sm:pt-4 mb-4 sm:mb-6">
                <div className="flex justify-between font-extrabold text-lg sm:text-xl text-gray-800">
                  <span>Total</span>
                  <span className="text-orange-500">₹{totalPrice + Math.round(totalPrice * 0.05)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-orange-500 text-white font-bold py-3 sm:py-4 rounded-xl hover:bg-orange-600 active:bg-orange-700 transition text-base sm:text-lg"
              >
                Proceed to Payment 💳
              </button>

              <Link
                to="/menu"
                className="block text-center text-orange-500 font-medium mt-3 sm:mt-4 hover:underline text-sm sm:text-base py-1"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;