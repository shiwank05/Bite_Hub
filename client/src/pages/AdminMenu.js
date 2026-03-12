import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminMenu = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddFood, setShowAddFood] = useState(false);
  const [editFood, setEditFood] = useState(null);
  const [foodForm, setFoodForm] = useState({
    name: '', description: '', price: '', category: '', image: '', available: true
  });

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/'); return; }
    fetchFoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/food');
      setFoods(res.data);
    } catch (err) {
      toast.error('Failed to load foods!');
    } finally {
      setLoading(false);
    }
  };

  const handleFoodFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFoodForm({ ...foodForm, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAddFood = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/food',
        { ...foodForm, price: Number(foodForm.price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFoods(prev => [...prev, res.data]);
      setShowAddFood(false);
      setFoodForm({ name: '', description: '', price: '', category: '', image: '', available: true });
      toast.success('Food item added! 🍔');
    } catch (err) {
      toast.error('Failed to add food!');
    }
  };

  const handleEditFood = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/food/${editFood._id}`,
        { ...foodForm, price: Number(foodForm.price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFoods(prev => prev.map(f => f._id === editFood._id ? res.data : f));
      setEditFood(null);
      setFoodForm({ name: '', description: '', price: '', category: '', image: '', available: true });
      toast.success('Food item updated! ✅');
    } catch (err) {
      toast.error('Failed to update food!');
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/food/${foodId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFoods(prev => prev.filter(f => f._id !== foodId));
      toast.success('Food item deleted!');
    } catch (err) {
      toast.error('Failed to delete food!');
    }
  };

  const openEditModal = (food) => {
    setEditFood(food);
    setFoodForm({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
      image: food.image,
      available: food.available,
    });
  };

  const FoodModal = ({ onSave, onClose, title }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="flex flex-col gap-3">
          <input name="name" value={foodForm.name} onChange={handleFoodFormChange}
            placeholder="Food Name" className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-orange-400" />
          <textarea name="description" value={foodForm.description} onChange={handleFoodFormChange}
            placeholder="Description" rows={2} className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-orange-400 resize-none" />
          <input name="price" value={foodForm.price} onChange={handleFoodFormChange}
            placeholder="Price (₹)" type="number" className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-orange-400" />
          <select name="category" value={foodForm.category} onChange={handleFoodFormChange}
            className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-orange-400">
            <option value="">Select Category</option>
            {['Burgers', 'Pizza', 'Pasta', 'Sides', 'Drinks', 'Desserts'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input name="image" value={foodForm.image} onChange={handleFoodFormChange}
            placeholder="Image URL" className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-orange-400" />
          <label className="flex items-center gap-2 text-gray-700">
            <input type="checkbox" name="available" checked={foodForm.available} onChange={handleFoodFormChange} className="w-4 h-4 accent-orange-500" />
            Available
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-600 py-2 rounded-xl hover:bg-gray-50 transition font-medium">Cancel</button>
          <button onClick={onSave} className="flex-1 bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition font-bold">Save</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-1">Menu Management 🍔</h1>
          <p className="text-orange-100">Add, edit or remove food items</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Add Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowAddFood(true)}
            className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition"
          >
            + Add Food Item
          </button>
        </div>

        {/* Food Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl animate-bounce">🍔</div>
            <p className="text-gray-500 mt-4">Loading menu...</p>
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-500 text-lg">No food items yet!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {foods.map(food => (
              <div key={food._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Food'; }}
                />
                <div className="p-4">
                  <h3 className="font-bold text-gray-800">{food.name}</h3>
                  <p className="text-orange-500 font-bold">₹{food.price}</p>
                  <p className="text-xs text-gray-400">{food.category}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block
                    ${food.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                    {food.available ? '✅ Available' : '❌ Unavailable'}
                  </span>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => openEditModal(food)}
                      className="flex-1 bg-blue-50 text-blue-600 py-1 rounded-lg text-sm font-semibold hover:bg-blue-100 transition">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDeleteFood(food._id)}
                      className="flex-1 bg-red-50 text-red-500 py-1 rounded-lg text-sm font-semibold hover:bg-red-100 transition">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Food Modal */}
      {showAddFood && (
        <FoodModal
          title="Add New Food Item 🍔"
          onSave={handleAddFood}
          onClose={() => {
            setShowAddFood(false);
            setFoodForm({ name: '', description: '', price: '', category: '', image: '', available: true });
          }}
        />
      )}

      {/* Edit Food Modal */}
      {editFood && (
        <FoodModal
          title="Edit Food Item ✏️"
          onSave={handleEditFood}
          onClose={() => {
            setEditFood(null);
            setFoodForm({ name: '', description: '', price: '', category: '', image: '', available: true });
          }}
        />
      )}
    </div>
  );
};

export default AdminMenu;