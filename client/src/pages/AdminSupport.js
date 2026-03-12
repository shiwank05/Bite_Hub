import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const AdminSupport = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [adminMessage, setAdminMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/'); return; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socketRef.current = io('https://bite-hub-server.onrender.com');
    socketRef.current.emit('joinAdmin');

    // New message from user
    socketRef.current.on('newUserMessage', ({ userId, userName, message, chatId }) => {
      setChats(prev => {
        const exists = prev.find(c => c.user?._id === userId || c.user === userId);
        if (exists) {
          return prev.map(c =>
            (c.user?._id === userId || c.user === userId)
              ? { ...c, messages: [...(c.messages || []), message], lastMessage: new Date() }
              : c
          );
        }
        return [...prev, {
          _id: chatId,
          user: { _id: userId, name: userName },
          messages: [message],
          isResolved: false,
          lastMessage: new Date()
        }];
      });

      setSelectedChat(prev => {
        if (!prev) return prev;
        const selectedUserId = prev.user?._id || prev.user;
        if (selectedUserId === userId) {
          return { ...prev, messages: [...(prev.messages || []), message] };
        }
        return prev;
      });

      setUnreadCount(prev => prev + 1);
      toast.success(`New message from ${userName}! 💬`);
    });

    // Chat reopened by user after being resolved
    socketRef.current.on('chatReopened', ({ chatId, userName }) => {
      setChats(prev => prev.map(c =>
        c._id === chatId ? { ...c, isResolved: false } : c
      ));
      setSelectedChat(prev =>
        prev?._id === chatId ? { ...prev, isResolved: false } : prev
      );
      toast(`${userName} reopened their chat 🔄`, { icon: '💬' });
    });

    // Admin message sent to another admin connection
    socketRef.current.on('adminMessageSent', ({ userId, message }) => {
      setChats(prev => prev.map(c =>
        (c.user?._id === userId || c.user === userId)
          ? { ...c, messages: [...(c.messages || []), message], lastMessage: new Date() }
          : c
      ));
    });

    fetchChats();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  const fetchChats = async () => {
    try {
      const res = await axios.get('https://bite-hub-server.onrender.com/api/chat', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(res.data);
    } catch (err) {
      toast.error('Failed to load chats!');
    }
  };

  const sendAdminMessage = () => {
    if (!adminMessage.trim() || !selectedChat) return;
    const userId = selectedChat.user?._id || selectedChat.user;
    const message = { sender: 'admin', text: adminMessage.trim(), time: new Date() };

    socketRef.current.emit('adminMessage', {
      userId,
      text: adminMessage.trim(),
    });

    setSelectedChat(prev => ({
      ...prev,
      messages: [...(prev.messages || []), message]
    }));

    setChats(prev => prev.map(c =>
      (c.user?._id === userId || c.user === userId)
        ? { ...c, messages: [...(c.messages || []), message], lastMessage: new Date() }
        : c
    ));

    setAdminMessage('');
  };

  const resolveChat = async (chatId) => {
    try {
      await axios.put(
        `https://bite-hub-server.onrender.com/api/chat/${chatId}/resolve`,
        { isResolved: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChats(prev => prev.map(c => c._id === chatId ? { ...c, isResolved: true } : c));
      setSelectedChat(prev => prev?._id === chatId ? { ...prev, isResolved: true } : prev);
      toast.success('Chat marked as resolved! ✅');
    } catch (err) {
      toast.error('Failed to resolve chat!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold mb-1">Support Chats 💬</h1>
            <p className="text-orange-100">Manage customer conversations</p>
          </div>
          {unreadCount > 0 && (
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
              {unreadCount} new message{unreadCount > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-4 h-[600px]">

          {/* Chat List */}
          <div className="w-80 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-bold text-gray-800">Conversations</h2>
              <p className="text-xs text-gray-500">{chats.length} total</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-gray-500 text-sm">No support chats yet!</p>
                </div>
              ) : (
                chats.map(chat => (
                  <div
                    key={chat._id}
                    onClick={() => { setSelectedChat(chat); setUnreadCount(0); }}
                    className={`p-4 border-b cursor-pointer hover:bg-orange-50 transition
                      ${selectedChat?._id === chat._id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-800 text-sm">
                        {chat.user?.name || 'Unknown User'}
                      </p>
                      {chat.isResolved ? (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Resolved</span>
                      ) : (
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Active</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{chat.user?.email}</p>
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {chat.messages?.length > 0
                        ? chat.messages[chat.messages.length - 1].text.slice(0, 30) + '...'
                        : 'No messages yet'
                      }
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {!selectedChat ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="font-bold text-gray-700 text-xl">Select a conversation</p>
                <p className="text-gray-500 mt-2">Choose a chat from the left to start replying</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800">{selectedChat.user?.name}</p>
                    <p className="text-xs text-gray-500">{selectedChat.user?.email}</p>
                  </div>
                  {!selectedChat.isResolved ? (
                    <button
                      onClick={() => resolveChat(selectedChat._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-600 transition"
                    >
                      ✅ Mark Resolved
                    </button>
                  ) : (
                    <span className="bg-green-100 text-green-600 px-4 py-2 rounded-xl text-sm font-semibold">
                      ✅ Resolved
                    </span>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
                  {selectedChat.messages?.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400">No messages yet</p>
                    </div>
                  ) : (
                    selectedChat.messages?.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.sender === 'user' && (
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0">
                            👤
                          </div>
                        )}
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl
                          ${msg.sender === 'admin'
                            ? 'bg-orange-500 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.sender === 'admin' ? 'text-orange-100' : 'text-gray-400'}`}>
                            {new Date(msg.time).toLocaleTimeString('en-IN', {
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {msg.sender === 'admin' && (
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm ml-2 flex-shrink-0">
                            🍔
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Input — always open for admin */}
                <div className="px-6 py-4 border-t bg-gray-50">
                  {selectedChat.isResolved && (
                    <p className="text-xs text-green-600 font-medium text-center mb-3">
                      ✅ Resolved — user can reopen by sending a new message
                    </p>
                  )}
                  <div className="flex gap-3 items-end">
                    <textarea
                      value={adminMessage}
                      onChange={(e) => setAdminMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendAdminMessage();
                        }
                      }}
                      placeholder="Type your reply... (Press Enter to send)"
                      rows={1}
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition resize-none text-sm"
                    />
                    <button
                      onClick={sendAdminMessage}
                      disabled={!adminMessage.trim()}
                      className="bg-orange-500 text-white w-12 h-12 rounded-xl hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;