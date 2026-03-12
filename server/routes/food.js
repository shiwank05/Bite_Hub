const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get all food items
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find({ available: true });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get food by category
router.get('/category/:category', async (req, res) => {
  try {
    const foods = await Food.find({ category: req.params.category, available: true });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add food item (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json(food);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update food item (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete food item (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: 'Food item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;