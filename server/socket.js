const Chat = require('./models/Chat');

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 New socket connection:', socket.id);

    socket.on('joinRoom', (userId) => {
      socket.join(userId);
      console.log(`👤 User joined room: ${userId}`);
    });

    socket.on('joinAdmin', () => {
      socket.join('admin');
      console.log('👨‍💼 Admin joined admin room');
    });

    // User sends message
    socket.on('userMessage', async ({ userId, userName, text }) => {
      try {
        let chat = await Chat.findOne({ user: userId });
        if (!chat) {
          chat = await Chat.create({ user: userId, userName, messages: [] });
        }

        const wasResolved = chat.isResolved;

        const message = { sender: 'user', text, time: new Date() };
        chat.messages.push(message);
        chat.lastMessage = new Date();
        chat.isResolved = false; // Always reopen on new user message
        await chat.save();

        // Notify admin room
        io.to('admin').emit('newUserMessage', {
          userId,
          userName,
          message,
          chatId: chat._id,
          reopened: wasResolved, // Let admin UI know it was reopened
        });

        // If chat was resolved and is now reopened, notify admin to update chat status
        if (wasResolved) {
          io.to('admin').emit('chatReopened', {
            chatId: chat._id,
            userId,
            userName,
          });
        }

        console.log(`💬 Message from ${userName}: ${text}`);
      } catch (err) {
        console.error('Socket error:', err);
      }
    });

    // Admin sends message
    socket.on('adminMessage', async ({ userId, text }) => {
      try {
        const chat = await Chat.findOne({ user: userId });
        if (!chat) return;

        const message = { sender: 'admin', text, time: new Date() };
        chat.messages.push(message);
        chat.lastMessage = new Date();
        await chat.save();

        // Send to user's room
        io.to(userId).emit('newMessage', message);

        // Notify other admin connections
        socket.to('admin').emit('adminMessageSent', { userId, message });

        console.log(`👨‍💼 Admin replied to ${userId}: ${text}`);
      } catch (err) {
        console.error('Socket error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });
};

module.exports = setupSocket;