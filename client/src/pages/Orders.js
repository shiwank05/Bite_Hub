import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Confirmed': 'bg-blue-100 text-blue-700',
  'Preparing': 'bg-orange-100 text-orange-700',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
  'Delivered': 'bg-green-100 text-green-700',
};

const statusIcons = {
  'Pending': '⏳',
  'Confirmed': '✅',
  'Preparing': '👨‍🍳',
  'Out for Delivery': '🛵',
  'Delivered': '🎉',
};

const statusSteps = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('https://bite-hub-server.onrender.com/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to load orders!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">📦</div>
          <p className="text-gray-500 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-8xl mb-6">📦</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">No orders yet!</h2>
        <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
        <Link to="/menu" className="bg-orange-500 text-white font-bold px-8 py-3 rounded-full hover:bg-orange-600 transition text-lg">
          Order Now 🍔
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">My Orders 📦</h1>

        <div className="flex flex-col gap-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">

              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b">
                <div>
                  <p className="text-xs text-gray-400 font-medium">ORDER ID</p>
                  <p className="font-mono text-sm text-gray-700">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">DATE</p>
                  <p className="text-sm text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">TOTAL</p>
                  <p className="font-bold text-orange-500">₹{order.totalAmount}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}>
                  {statusIcons[order.status]} {order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4 border-b">
                <div className="flex flex-col gap-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm text-gray-600">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="px-6 py-3 border-b">
                <p className="text-xs text-gray-400 font-medium mb-1">DELIVERY ADDRESS</p>
                <p className="text-sm text-gray-600">📍 {order.address}</p>
              </div>

              {/* Payment Status */}
              <div className="px-6 py-3 border-b">
                <p className="text-xs text-gray-400 font-medium mb-1">PAYMENT STATUS</p>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold
                  ${order.paymentStatus === 'Paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                  {order.paymentStatus === 'Paid' ? '✅ Paid' : '❌ Unpaid (Cash on Delivery)'}
                </span>
              </div>

              {/* Order Progress */}
              <div className="px-6 py-4">
                <p className="text-xs text-gray-400 font-medium mb-3">ORDER PROGRESS</p>
                <div className="flex items-center justify-between">
                  {statusSteps.map((step, index) => {
                    const currentIndex = statusSteps.indexOf(order.status);
                    const isCompleted = index <= currentIndex;
                    const isActive = index === currentIndex;
                    return (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center gap-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                            ${isActive ? 'bg-orange-500 text-white shadow-md scale-110' :
                              isCompleted ? 'bg-orange-200 text-orange-600' :
                                'bg-gray-100 text-gray-400'}`}
                          >
                            {statusIcons[step]}
                          </div>
                          <span className={`text-xs hidden sm:block text-center
                            ${isActive ? 'text-orange-500 font-bold' :
                              isCompleted ? 'text-orange-400' : 'text-gray-400'}`}
                          >
                            {step}
                          </span>
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div className={`flex-1 h-1 mx-1 rounded
                            ${index < currentIndex ? 'bg-orange-300' : 'bg-gray-100'}`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;