import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const Support = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchChat();
    connectSocket();
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChat = async () => {
    try {
      const res = await axios.get('https://bite-hub-server.onrender.com/api/chat/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages || []);
      setIsResolved(res.data.isResolved || false);
    } catch (err) {
      toast.error('Failed to load chat!');
    } finally {
      setLoading(false);
    }
  };

  const connectSocket = () => {
    socketRef.current = io('https://bite-hub-server.onrender.com');

    socketRef.current.on('connect', () => {
      setConnected(true);
      socketRef.current.emit('joinRoom', user.id);
    });

    socketRef.current.on('disconnect', () => {
      setConnected(false);
    });

    // Only admin replies come through here
    socketRef.current.on('newMessage', (message) => {
      if (message.sender === 'admin') {
        setMessages(prev => [...prev, message]);
      }
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !connected) return;

    const message = { sender: 'user', text: newMessage.trim(), time: new Date() };

    // Optimistically add to UI
    setMessages(prev => [...prev, message]);

    // If chat was resolved, reopen it on the user side too
    if (isResolved) {
      setIsResolved(false);
      toast.success('Your conversation has been reopened! 💬');
    }

    socketRef.current.emit('userMessage', {
      userId: user.id,
      userName: user.name,
      text: newMessage.trim(),
    });

    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickMessages = [
    'Where is my order? 📦',
    'I want to cancel my order ❌',
    'Wrong item delivered 😕',
    'Payment issue 💳',
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-1">Help & Support 💬</h1>
          <p className="text-orange-100">Chat with our support team — we're here to help!</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* Chat Header */}
          <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                🍔
              </div>
              <div>
                <p className="font-bold text-gray-800">BITE HUB Support</p>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <p className="text-xs text-gray-500">{connected ? 'Online' : 'Connecting...'}</p>
                </div>
              </div>
            </div>
            {isResolved ? (
              <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                ✅ Resolved
              </span>
            ) : (
              <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">
                Support Chat
              </span>
            )}
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto px-6 py-4 flex flex-col gap-3">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-4xl animate-bounce mb-2">💬</div>
                  <p className="text-gray-500">Loading chat...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-5xl mb-3">👋</div>
                <p className="font-bold text-gray-700 text-lg">Hi, {user?.name}!</p>
                <p className="text-gray-500 text-sm mt-1">How can we help you today?</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'admin' && (
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm mr-2 flex-shrink-0">
                      🍔
                    </div>
                  )}
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl
                    ${msg.sender === 'user'
                      ? 'bg-orange-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-orange-100' : 'text-gray-400'}`}>
                      {new Date(msg.time).toLocaleTimeString('en-IN', {
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm ml-2 flex-shrink-0">
                      👤
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Messages — show when no messages or chat is resolved */}
          {(messages.length === 0 || isResolved) && !loading && (
            <div className="px-6 pb-3">
              {isResolved && (
                <p className="text-xs text-green-600 font-medium mb-2 text-center">
                  ✅ This chat was resolved. Send a new message to reopen it.
                </p>
              )}
              <p className="text-xs text-gray-400 mb-2 font-medium">QUICK MESSAGES</p>
              <div className="flex flex-wrap gap-2">
                {quickMessages.map((msg) => (
                  <button
                    key={msg}
                    onClick={() => setNewMessage(msg)}
                    className="text-xs bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-full hover:bg-orange-100 transition"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input — always visible, never blocked */}
          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex gap-3 items-end">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isResolved ? 'Send a message to reopen this chat...' : 'Type your message... (Press Enter to send)'}
                rows={1}
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition resize-none text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || !connected}
                className="bg-orange-500 text-white w-12 h-12 rounded-xl hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center flex-shrink-0"
              >
                <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Our support team typically replies within a few minutes ⚡
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Support;