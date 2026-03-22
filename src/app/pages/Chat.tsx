import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Send } from 'lucide-react';
import { format } from 'date-fns';

export function Chat() {
  const { id: requestId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { requests, users, services, messages, sendMessage, currentUser } = useApp();
  
  const request = requests.find(r => r.id === requestId);
  const [text, setText] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, request]);

  if (!request) {
    return <div className="p-8 text-center text-neutral-500">Solicitud no encontrada.</div>;
  }

  const isClient = currentUser.id === request.clientId;
  const otherUserId = isClient ? request.providerId : request.clientId;
  const otherUser = users.find(u => u.id === otherUserId);
  const service = services.find(s => s.id === request.serviceId);

  const requestMessages = messages.filter(m => m.requestId === requestId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      sendMessage(request.id, text.trim());
      setText('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-neutral-200 rounded-full text-neutral-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-neutral-900">{otherUser?.name}</h2>
            <p className="text-xs text-neutral-500">{service?.title}</p>
          </div>
        </div>
        <div className="text-xs px-3 py-1 bg-neutral-200 text-neutral-700 rounded-full font-semibold capitalize">
          Estado: {request.status}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50">
        {requestMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
            Envía un mensaje para comenzar a chatear.
          </div>
        ) : (
          requestMessages.map(msg => {
            const isMine = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${isMine ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-sm'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <span className={`text-[10px] mt-1 block text-right ${isMine ? 'text-blue-200' : 'text-neutral-400'}`}>
                    {format(new Date(msg.timestamp), 'HH:mm')}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-neutral-200">
        <form onSubmit={handleSend} className="flex space-x-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={request.status === 'canceled'}
            placeholder={request.status === 'canceled' ? "Chat cerrado." : "Escribe un mensaje..."}
            className="flex-1 border border-neutral-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!text.trim() || request.status === 'canceled'}
            className="bg-blue-600 text-white p-2 w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
