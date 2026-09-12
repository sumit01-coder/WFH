import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Hash, User, Plus, X, Paperclip, FileText, Download } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-worknexus.virtuallabsimulator.com/api';
const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'https://api-worknexus.virtuallabsimulator.com';

const Chat = () => {
  const { user, hasRole } = useAuth();
  const [searchParams] = useSearchParams();
  const initialRoomId = searchParams.get('roomId');
  
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(initialRoomId);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [fileAttachment, setFileAttachment] = useState<File | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  
  const [socket, setSocket] = useState<Socket | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io(SOCKET_URL, {
      auth: { token }
    });
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);



  const fetchRoomsAndUsers = async () => {
    try {
      const [roomsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/chat/rooms`),
        axios.get(`${API_URL}/users`)
      ]);
      
      const fetchedRooms = roomsRes.data;
      setRooms(fetchedRooms);
      setUsers(usersRes.data);
      
      if (!activeRoomId && fetchedRooms.length > 0) {
        setActiveRoomId(fetchedRooms[0].id);
      } else if (activeRoomId && !fetchedRooms.find((r: any) => r.id === activeRoomId)) {
        // If the activeRoomId from URL is not in the list (e.g. newly created direct room),
        // we might want to fetch it explicitly or just rely on the fact that getRooms returns it.
        // For safety, since it's now cross-company, it should be in fetchedRooms.
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
    fetchRoomsAndUsers();
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
      const res = await axios.post(`${API_URL}/chat/rooms`, { 
        name: newRoomName,
        members: selectedMembers 
      });
      setRooms([res.data, ...rooms]);
      setActiveRoomId(res.data.id);
      setNewRoomName('');
      setSelectedMembers([]);
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create channel');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !fileAttachment) || !activeRoomId) return;
    
    if (socket) {
      socket.emit('typing_stop', { roomId: activeRoomId, userName: user?.firstName });
    }

    try {
      if (fileAttachment) {
        const formData = new FormData();
        formData.append('content', input);
        formData.append('attachment', fileAttachment);
        await axios.post(`${API_URL}/chat/rooms/${activeRoomId}/messages`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(`${API_URL}/chat/rooms/${activeRoomId}/messages`, { content: input });
      }
      
      setInput('');
      setFileAttachment(null);
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
      <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2"><MessageSquare size={20} /> Channels</h3>
          {canCreateChannel && (
            <button onClick={() => setIsModalOpen(true)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500 dark:text-slate-400">
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
                activeRoomId === room.id ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:bg-slate-800'
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
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-800">
        {!activeRoomId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
              <MessageSquare size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome to Team Chat</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">Select a channel from the sidebar to start collaborating with your team, or create a new one to kick off a new topic.</p>
          </div>
        ) : (
          <>
            <header className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between z-10">
              <h2 className="font-bold text-xl flex items-center gap-2">
                <Hash size={24} className="text-slate-400" /> {activeRoom?.name}
              </h2>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
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
                          <span className="font-semibold text-slate-600 dark:text-slate-400">
                            {isMe ? 'You' : `${msg.sender?.firstName} ${msg.sender?.lastName}`}
                          </span>
                        </div>
                        <div className={`p-4 ${isMe ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-sm' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl rounded-tl-sm shadow-sm'}`}>
                          {msg.content && <p className="whitespace-pre-wrap mb-2">{msg.content}</p>}
                          {msg.type === 'FILE' && msg.file && (
                            <a 
                              href={`${API_URL.replace('/api', '')}/${msg.file.filePath}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className={`flex items-center gap-3 p-3 mt-2 rounded-xl border ${isMe ? 'bg-blue-500 border-blue-400 text-white hover:bg-blue-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'} transition-colors group`}
                            >
                              <div className={`p-2 rounded-lg ${isMe ? 'bg-blue-400/50 text-white' : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500'}`}>
                                <FileText size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{msg.file.originalName}</p>
                                <p className={`text-xs ${isMe ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                                  {(Number(msg.file.sizeBytes) / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              <Download size={18} className={`${isMe ? 'text-blue-200 group-hover:text-white' : 'text-slate-400 group-hover:text-blue-500'} transition-colors`} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              
              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="flex gap-4 items-end animate-pulse">
                   <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-gradient-to-r from-slate-300 to-slate-200 text-slate-500 dark:text-slate-400">
                      <User size={20} />
                   </div>
                   <div className="bg-slate-200 text-slate-600 dark:text-slate-400 p-4 rounded-2xl rounded-tl-sm shadow-sm text-sm font-medium flex items-center gap-2">
                     <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-50 dark:bg-slate-8000 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-50 dark:bg-slate-8000 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-50 dark:bg-slate-8000 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                     </span>
                     {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                   </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm z-10 flex flex-col">
              {fileAttachment && (
                <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg p-2 mb-3">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-sm font-medium">
                    <FileText size={16} />
                    <span className="truncate max-w-[200px]">{fileAttachment.name}</span>
                  </div>
                  <button type="button" onClick={() => setFileAttachment(null)} className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300">
                    <X size={16} />
                  </button>
                </div>
              )}
              <form onSubmit={handleSend} className="relative flex items-center">
                <label className="absolute left-2 p-2 text-slate-400 hover:text-blue-500 cursor-pointer transition-colors">
                  <input type="file" className="hidden" onChange={(e) => setFileAttachment(e.target.files ? e.target.files[0] : null)} />
                  <Paperclip size={20} />
                </label>
                <input 
                  type="text" 
                  value={input}
                  onChange={handleTyping}
                  placeholder={`Message #${activeRoom?.name}...`} 
                  className="w-full bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-full py-3 pl-12 pr-14 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button type="submit" disabled={!input.trim() && !fileAttachment} className="absolute right-2 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create Channel</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20}/></button>
              </div>
              <form onSubmit={handleCreateRoom} className="p-6 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Channel Name *</label>
                    <input 
                      type="text" required autoFocus
                      value={newRoomName} onChange={e => setNewRoomName(e.target.value)}
                      placeholder="e.g. Project Alpha"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Members</label>
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 max-h-48 overflow-y-auto">
                      {users.filter((u: any) => u.id !== user?.id).map((u: any) => (
                        <label key={u.id} className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors">
                          <input 
                            type="checkbox" 
                            checked={selectedMembers.includes(u.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedMembers([...selectedMembers, u.id]);
                              else setSelectedMembers(selectedMembers.filter(id => id !== u.id));
                            }}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                          />
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-700 dark:text-slate-300">{u.firstName} {u.lastName}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{u.role?.name || u.role}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 transition-colors">Cancel</button>
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
