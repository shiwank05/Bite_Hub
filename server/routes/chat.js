const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get or create chat for logged in user
router.get('/my', protect, async (req, res) => {
  try {
    let chat = await Chat.findOne({ user: req.user.id });
    if (!chat) {
      chat = await Chat.create({
        user: req.user.id,
        userName: req.user.name,
        messages: [],
      });
    }
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all chats (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate('user', 'name email')
      .sort({ lastMessage: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Mark chat as resolved (admin only)
router.put('/:id/resolve', protect, adminOnly, async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      { isResolved: req.body.isResolved },
      { new: true }
    );
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;