import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Hash, User } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    setMessages([
      { id: '1', sender: 'Jane Smith', content: 'Did we finalize the designs?', time: '10:00 AM' },
      { id: '2', sender: 'You', content: 'Yes, I just uploaded them.', time: '10:05 AM' },
    ]);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), sender: 'You', content: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
  };

  return (
    <div className="flex h-[calc(100vh-2px)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-200 bg-white p-4">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MessageSquare size={20} /> Channels</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-400 bg-blue-500/10 p-2 rounded-lg cursor-pointer">
            <Hash size={16} /> general
          </div>
          <div className="flex items-center gap-2 text-slate-500 hover:text-slate-900 p-2 rounded-lg cursor-pointer">
            <Hash size={16} /> design-team
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50">
        <header className="p-4 border-b border-slate-200 bg-white shadow-sm">
          <h2 className="font-bold text-xl flex items-center gap-2"><Hash size={24} className="text-slate-400" /> general</h2>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-4 ${msg.sender === 'You' ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shrink-0 shadow-lg">
                <User size={20} />
              </div>
              <div className={`max-w-[70%] ${msg.sender === 'You' ? 'text-right' : ''}`}>
                <div className="flex items-baseline gap-2 mb-1 justify-end flex-row-reverse">
                  <span className="text-xs text-slate-400">{msg.time}</span>
                  <span className="font-semibold text-slate-600">{msg.sender}</span>
                </div>
                <div className={`p-4 rounded-2xl ${msg.sender === 'You' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-100 text-gray-200 rounded-tl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 bg-white shadow-sm">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message #general..." 
              className="w-full bg-white shadow-sm border border-slate-200 rounded-full py-3 pl-6 pr-14 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button type="submit" className="absolute right-2 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-500 transition-colors">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
