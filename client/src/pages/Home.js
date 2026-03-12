import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '🍕', title: 'Wide Variety', desc: 'Burgers, Pizza, Pasta, Drinks & more!' },
  { icon: '⚡', title: 'Fast Delivery', desc: 'Hot food delivered to your door quickly.' },
  { icon: '💳', title: 'Easy Payment', desc: 'Secure and simple payment process.' },
  { icon: '📦', title: 'Track Orders', desc: 'Real-time order tracking at your fingertips.' },
];

const categories = [
  { name: 'Burgers', emoji: '🍔', bg: 'bg-yellow-100' },
  { name: 'Pizza', emoji: '🍕', bg: 'bg-red-100' },
  { name: 'Pasta', emoji: '🍝', bg: 'bg-orange-100' },
  { name: 'Sides', emoji: '🍟', bg: 'bg-green-100' },
  { name: 'Drinks', emoji: '🥤', bg: 'bg-blue-100' },
  { name: 'Desserts', emoji: '🍰', bg: 'bg-pink-100' },
];

const adminQuickLinks = [
  { icon: '📦', title: 'Manage Orders', desc: 'View and update all customer orders.', to: '/admin', color: 'bg-blue-50 hover:bg-blue-100' },
  { icon: '🍔', title: 'Manage Menu', desc: 'Add, edit or remove food items.', to: '/admin-menu', color: 'bg-orange-50 hover:bg-orange-100' },
  { icon: '💬', title: 'Support Chats', desc: 'Reply to customer support messages.', to: '/admin-support', color: 'bg-green-50 hover:bg-green-100' },
];

const Home = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // ─── ADMIN VIEW ───────────────────────────────────────────────
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">

        {/* Admin Hero */}
        <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <p className="text-orange-200 font-semibold text-lg mb-2">Welcome back 👋</p>
              <h1 className="text-5xl font-extrabold mb-4 leading-tight">
                Hello, <br />
                <span className="text-yellow-300">{user.name.split(' ')[0]}!</span>
              </h1>
              <p className="text-orange-100 text-lg mb-8">
                Manage your restaurant from one place — orders, menu, and customer support.
              </p>
              <div className="flex gap-4 justify-center md:justify-start flex-wrap">
                <Link
                  to="/admin"
                  className="bg-white text-orange-500 font-bold px-8 py-3 rounded-full hover:bg-yellow-50 transition shadow-lg text-lg"
                >
                  Dashboard 📊
                </Link>
                <Link
                  to="/admin-menu"
                  className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-orange-600 transition text-lg"
                >
                  Manage Menu 🍔
                </Link>
              </div>
            </div>
            <div className="text-9xl animate-bounce">👨‍💼</div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Quick Actions</h2>
          <p className="text-center text-gray-500 mb-10">Jump right into what you need</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {adminQuickLinks.map((link) => (
              <Link
                key={link.title}
                to={link.to}
                className={`${link.color} rounded-2xl p-8 flex flex-col items-center gap-3 text-center transition shadow-sm hover:shadow-md`}
              >
                <span className="text-5xl">{link.icon}</span>
                <h3 className="font-bold text-gray-800 text-lg">{link.title}</h3>
                <p className="text-gray-500 text-sm">{link.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-400 text-center py-6">
          <p className="text-lg font-bold text-white mb-1">🍔 BITE HUB</p>
          <p className="text-sm">© 2026 Bite Hub. All rights reserved.</p>
        </footer>

      </div>
    );
  }

  // ─── USER / GUEST VIEW ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-extrabold mb-4 leading-tight">
              Hungry? <br />
              <span className="text-yellow-300">We've Got You!</span>
            </h1>
            <p className="text-orange-100 text-lg mb-8">
              Order your favorite food online and get it delivered hot & fresh to your doorstep.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link
                to="/menu"
                className="bg-white text-orange-500 font-bold px-8 py-3 rounded-full hover:bg-yellow-50 transition shadow-lg text-lg"
              >
                Order Now 🍔
              </Link>

              {!user && (
                <Link
                  to="/register"
                  className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-orange-600 transition text-lg"
                >
                  Sign Up Free
                </Link>
              )}

              {user && (
                <Link
                  to="/orders"
                  className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-orange-600 transition text-lg"
                >
                  My Orders 📦
                </Link>
              )}
            </div>
          </div>
          <div className="text-9xl animate-bounce">🍔</div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Browse by Category</h2>
        <p className="text-center text-gray-500 mb-10">What are you craving today?</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/menu?category=${cat.name}`}
              className={`${cat.bg} rounded-2xl p-5 flex flex-col items-center gap-2 hover:scale-105 transition-transform shadow-sm cursor-pointer`}
            >
              <span className="text-4xl">{cat.emoji}</span>
              <span className="font-semibold text-gray-700 text-sm">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Why Choose BITE HUB?</h2>
          <p className="text-center text-gray-500 mb-10">We make food ordering simple and delightful</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-orange-50 rounded-2xl p-6 text-center hover:shadow-md transition">
                <div className="text-5xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-16 px-4 text-center">
        <h2 className="text-4xl font-extrabold mb-4">Ready to Order? 🚀</h2>
        <p className="text-orange-100 text-lg mb-8">
          Join thousands of happy customers enjoying delicious food every day!
        </p>
        <Link
          to="/menu"
          className="bg-white text-orange-500 font-bold px-10 py-4 rounded-full hover:bg-yellow-50 transition shadow-lg text-xl"
        >
          Explore Menu 🍕
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-6">
        <p className="text-lg font-bold text-white mb-1">🍔 BITE HUB</p>
        <p className="text-sm">© 2026 Bite Hub. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default Home;