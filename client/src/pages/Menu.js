import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const categories = ['All', 'Burgers', 'Pizza', 'Pasta', 'Sides', 'Drinks', 'Desserts'];

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) setActiveCategory(category);
  }, [location.search]);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get('https://bite-hub-server.onrender.com/api/food');
      setFoods(res.data);
    } catch (err) {
      toast.error('Failed to load menu!');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (food) => {
    if (!user) {
      toast.error('Please login to add items to cart!');
      navigate('/login');
      return;
    }
    addToCart(food);
    toast.success(`${food.name} added to cart! 🛒`);
  };

  const filteredFoods = activeCategory === 'All'
    ? foods
    : foods.filter(f => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-extrabold mb-2">Our Menu 🍽️</h1>
        <p className="text-orange-100 text-lg">Fresh, delicious food made just for you</p>
      </div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition
                ${activeCategory === cat
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl animate-bounce">🍔</div>
            <p className="text-gray-500 mt-4 text-lg">Loading menu...</p>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl">😕</div>
            <p className="text-gray-500 mt-4 text-lg">No items found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFoods.map(food => (
              <div key={food._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden group">
                {/* Image */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Food'; }}
                  />
                  <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {food.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-lg">{food.name}</h3>
                  <p className="text-gray-500 text-sm mt-1 mb-3 line-clamp-2">{food.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-500 font-extrabold text-xl">₹{food.price}</span>
                    <button
                      onClick={() => handleAddToCart(food)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition font-semibold text-sm"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;