import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Payment = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [address, setAddress] = useState('');
  const [cardData, setCardData] = useState({
    cardNumber: '', cardName: '', expiry: '', cvv: ''
  });

  const totalWithTax = totalPrice + Math.round(totalPrice * 0.05);

  const handleCardChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(.{4})/g, '$1 ').trim();
    }
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }
    setCardData({ ...cardData, [name]: value });
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error('Please enter your delivery address!');
      return;
    }
    if (paymentMethod === 'card') {
      if (!cardData.cardNumber || !cardData.cardName || !cardData.expiry || !cardData.cvv) {
        toast.error('Please fill in all card details!');
        return;
      }
    }

    setLoading(true);
    try {
      await axios.post(
        'https://bite-hub-server.onrender.com/api/orders',
        {
          items: cartItems.map(item => ({
            food: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          totalAmount: totalWithTax,
          address,
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await new Promise(resolve => setTimeout(resolve, 2000));
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed!');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/menu');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Checkout 💳</h1>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left - Payment Form */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📍 Delivery Address</h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full delivery address..."
                rows={3}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition resize-none"
              />
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">💳 Payment Method</h2>
              <div className="flex gap-3 mb-6">
                {['card', 'upi', 'cod'].map(method => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`flex-1 py-3 rounded-xl font-semibold border-2 transition
                      ${paymentMethod === method
                        ? 'border-orange-500 bg-orange-50 text-orange-500'
                        : 'border-gray-200 text-gray-600 hover:border-orange-300'
                      }`}
                  >
                    {method === 'card' && '💳 Card'}
                    {method === 'upi' && '📱 UPI'}
                    {method === 'cod' && '💵 COD'}
                  </button>
                ))}
              </div>

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={cardData.cardName}
                      onChange={handleCardChange}
                      placeholder="John Doe"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardData.expiry}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        placeholder="•••"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition"
                      />
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <p className="text-blue-600 text-sm font-medium">💡 Demo Mode — Use any card details to test payment</p>
                  </div>
                </div>
              )}

              {/* UPI Form */}
              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition"
                  />
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-3">
                    <p className="text-blue-600 text-sm font-medium">💡 Demo Mode — Enter any UPI ID to test</p>
                  </div>
                </div>
              )}

              {/* COD */}
              {paymentMethod === 'cod' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-700 font-medium">💵 Pay with cash when your order arrives!</p>
                  <p className="text-green-600 text-sm mt-1">No online payment required.</p>
                  <p className="text-orange-500 text-sm mt-1 font-medium">⚠️ Payment status will be updated by admin upon delivery.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="flex flex-col gap-2 mb-4 max-h-48 overflow-y-auto">
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

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>Payment Method</span>
                  <span className="text-orange-500">
                    {paymentMethod === 'card' && '💳 Card'}
                    {paymentMethod === 'upi' && '📱 UPI'}
                    {paymentMethod === 'cod' && '💵 COD'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-700">
                  <span>Payment Status</span>
                  <span className={paymentMethod === 'cod' ? 'text-red-500' : 'text-green-500'}>
                    {paymentMethod === 'cod' ? '❌ Pay on Delivery' : '✅ Will be Paid'}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-extrabold text-xl text-gray-800">
                  <span>Total</span>
                  <span className="text-orange-500">₹{totalWithTax}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition text-lg disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Place Order ₹${totalWithTax} 🚀`
                )}
              </button>

              <p className="text-center text-gray-400 text-xs mt-3">
                🔒 Secure & encrypted payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;