import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Confirmed': 'bg-blue-100 text-blue-700',
  'Preparing': 'bg-orange-100 text-orange-700',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
  'Delivered': 'bg-green-100 text-green-700',
};

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/'); return; }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to load orders!');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prev => prev.map(o =>
        o._id === orderId ? { ...o, status: res.data.status, paymentStatus: res.data.paymentStatus } : o
      ));
      toast.success('Order status updated! ✅');
    } catch (err) {
      toast.error('Failed to update order!');
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { paymentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prev => prev.map(o =>
        o._id === orderId ? { ...o, paymentStatus } : o
      ));
      toast.success('Payment status updated! ✅');
    } catch (err) {
      toast.error('Failed to update payment status!');
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-1">Admin Dashboard 👨‍💼</h1>
          <p className="text-orange-100">Welcome back, {user?.name}!</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: orders.length, icon: '📦', color: 'bg-blue-50 text-blue-700' },
            { label: 'Pending Orders', value: pendingOrders, icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Delivered', value: deliveredOrders, icon: '✅', color: 'bg-green-50 text-green-700' },
            { label: 'Total Revenue', value: `₹${totalRevenue}`, icon: '💰', color: 'bg-orange-50 text-orange-700' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.color} rounded-2xl p-5 flex items-center gap-4`}>
              <span className="text-4xl">{stat.icon}</span>
              <div>
                <p className="text-sm font-medium opacity-70">{stat.label}</p>
                <p className="text-2xl font-extrabold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Orders Heading */}
        <h2 className="text-xl font-bold text-gray-700 mb-4">📦 Orders ({orders.length})</h2>

        {/* Orders List */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="text-6xl animate-bounce">📦</div>
              <p className="text-gray-500 mt-4">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">No orders yet!</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">ORDER ID</p>
                    <p className="font-mono font-bold text-gray-700">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">CUSTOMER</p>
                    <p className="font-semibold text-gray-700">{order.user?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">TOTAL</p>
                    <p className="font-bold text-orange-500 text-lg">₹{order.totalAmount}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">ORDER STATUS</p>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-semibold border-0 cursor-pointer ${statusColors[order.status]}`}
                      >
                        {['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">PAYMENT STATUS</p>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => updatePaymentStatus(order._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-semibold border-0 cursor-pointer
                          ${order.paymentStatus === 'Paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                          }`}
                      >
                        <option value="Unpaid">❌ Unpaid</option>
                        <option value="Paid">✅ Paid</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-gray-600">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">📍 {order.address}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(order.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;