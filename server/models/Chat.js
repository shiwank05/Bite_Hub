const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'admin'], required: true },
  text: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String },
  messages: [messageSchema],
  isResolved: { type: Boolean, default: false },
  lastMessage: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);