import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Hash, User, Plus, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

const Chat = () => {
  const { user, hasRole } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  
  const [socket, setSocket] = useState<Socket | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${API_URL}/chat/rooms`);
      setRooms(res.data);
      if (res.data.length > 0 && !activeRoomId) {
        setActiveRoomId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    if (!activeRoomId) return;
    try {
      const res = await axios.get(`${API_URL}/chat/rooms/${activeRoomId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (!activeRoomId || !socket) return;
    
    // Fetch initial messages
    fetchMessages();
    setTypingUsers([]);

    // Join room in socket
    socket.emit('join_room', activeRoomId);

    // Socket Listeners
    socket.on('new_message', (message: any) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('typing_start', ({ userName }: { userName: string }) => {
      setTypingUsers((prev) => {
        if (!prev.includes(userName)) return [...prev, userName];
        return prev;
      });
    });

    socket.on('typing_stop', ({ userName }: { userName: string }) => {
      setTypingUsers((prev) => prev.filter(name => name !== userName));
    });

    return () => {
      socket.emit('leave_room', activeRoomId);
      socket.off('new_message');
      socket.off('typing_start');
      socket.off('typing_stop');
    };
  }, [activeRoomId, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/chat/rooms`, { name: newRoomName });
      setRooms([res.data, ...rooms]);
      setActiveRoomId(res.data.id);
      setNewRoomName('');
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create channel');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeRoomId) return;
    
    if (socket) {
      socket.emit('typing_stop', { roomId: activeRoomId, userName: user?.firstName });
    }

    try {
      await axios.post(`${API_URL}/chat/rooms/${activeRoomId}/messages`, { content: input });
      setInput('');
      // Message will be added via the 'new_message' socket event!
    } catch (err) {
      console.error(err);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    if (socket && activeRoomId) {
      socket.emit('typing_start', { roomId: activeRoomId, userName: user?.firstName });
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', { roomId: activeRoomId, userName: user?.firstName });
      }, 2000);
    }
  };

  const activeRoom = rooms.find(r => r.id === activeRoomId);
  const canCreateChannel = hasRole('HR', 'MANAGER', 'COMPANY_ADMIN', 'SUPER_ADMIN');

  return (
    <div className="flex h-[calc(100vh-2px)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2"><MessageSquare size={20} /> Channels</h3>
          {canCreateChannel && (
            <button onClick={() => setIsModalOpen(true)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
              <Plus size={20} />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {rooms.map(room => (
            <div 
              key={room.id}
              onClick={() => setActiveRoomId(room.id)}
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                activeRoomId === room.id ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Hash size={16} /> {room.name}
            </div>
          ))}
          {rooms.length === 0 && (
            <p className="text-slate-400 text-sm italic text-center mt-4">No channels yet.</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {!activeRoomId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
              <MessageSquare size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Team Chat</h2>
            <p className="text-slate-500 max-w-md">Select a channel from the sidebar to start collaborating with your team, or create a new one to kick off a new topic.</p>
          </div>
        ) : (
          <>
            <header className="p-4 border-b border-slate-200 bg-white shadow-sm flex items-center justify-between z-10">
              <h2 className="font-bold text-xl flex items-center gap-2">
                <Hash size={24} className="text-slate-400" /> {activeRoom?.name}
              </h2>
              <div className="text-sm text-slate-500 font-medium">
                {activeRoom?.members?.length || 0} Members
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <p>No messages yet. Be the first to say hello!</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm text-white ${isMe ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 'bg-gradient-to-r from-slate-600 to-slate-400'}`}>
                        <User size={20} />
                      </div>
                      <div className={`max-w-[70%] ${isMe ? 'text-right' : ''}`}>
                        <div className={`flex items-baseline gap-2 mb-1 justify-end ${isMe ? 'flex-row-reverse' : ''}`}>
                          <span className="text-xs text-slate-400">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="font-semibold text-slate-600">
                            {isMe ? 'You' : `${msg.sender?.firstName} ${msg.sender?.lastName}`}
                          </span>
                        </div>
                        <div className={`p-4 ${isMe ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm shadow-sm'}`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              
              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="flex gap-4 items-end animate-pulse">
                   <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-gradient-to-r from-slate-300 to-slate-200 text-slate-500">
                      <User size={20} />
                   </div>
                   <div className="bg-slate-200 text-slate-600 p-4 rounded-2xl rounded-tl-sm shadow-sm text-sm font-medium flex items-center gap-2">
                     <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                     </span>
                     {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                   </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-200 bg-white shadow-sm z-10">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={handleTyping}
                  placeholder={`Message #${activeRoom?.name}...`} 
                  className="w-full bg-white shadow-sm border border-slate-200 rounded-full py-3 pl-6 pr-14 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button type="submit" disabled={!input.trim()} className="absolute right-2 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">Create Channel</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20}/></button>
              </div>
              <form onSubmit={handleCreateRoom} className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Channel Name</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" required autoFocus
                      value={newRoomName} onChange={e => setNewRoomName(e.target.value)}
                      placeholder="e.g. design-team"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">Create Channel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
