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
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your cart is empty!</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link
          to="/menu"
          className="bg-orange-500 text-white font-bold px-8 py-3 rounded-full hover:bg-orange-600 transition text-lg"
        >
          Browse Menu 🍔
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Your Cart 🛒</h1>
          <button
            onClick={() => { clearCart(); toast.success('Cart cleared!'); }}
            className="text-red-400 hover:text-red-600 font-medium transition text-sm"
          >
            Clear All
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cart Items */}
          <div className="flex-1 flex flex-col gap-4">
            {cartItems.map(item => (
              <div key={item._id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Food'; }}
                />

                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <p className="text-orange-500 font-bold text-lg">₹{item.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 font-bold hover:bg-orange-200 transition flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="font-bold text-gray-800 w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 font-bold hover:bg-orange-200 transition flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right min-w-16">
                  <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => { removeFromCart(item._id); toast.success('Item removed!'); }}
                  className="text-red-400 hover:text-red-600 transition ml-2"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

              {/* Items List */}
              <div className="flex flex-col gap-2 mb-4">
                {cartItems.map(item => (
                  <div key={item._id} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Delivery Fee</span>
                  <span className="text-green-500">FREE</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Taxes (5%)</span>
                  <span>₹{Math.round(totalPrice * 0.05)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-extrabold text-xl text-gray-800">
                  <span>Total</span>
                  <span className="text-orange-500">₹{totalPrice + Math.round(totalPrice * 0.05)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition text-lg"
              >
                Proceed to Payment 💳
              </button>

              <Link
                to="/menu"
                className="block text-center text-orange-500 font-medium mt-4 hover:underline"
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