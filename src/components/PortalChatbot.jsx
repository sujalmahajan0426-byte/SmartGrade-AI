import React, { useState, useRef, useEffect } from 'react';
import { MdChatBubbleOutline, MdClose, MdSend, MdSchool, MdPerson } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { sendChatMessage } from '../utils/chatApi';

export default function PortalChatbot() {
    const { user, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Hi there! I am your AI assistant. How can I help you today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Only show for students and teachers
    if (!isAuthenticated || (user?.role !== 'student' && user?.role !== 'teacher')) {
        return null;
    }

    const isStudent = user?.role === 'student';
    const themeColor = isStudent ? 'blue' : 'green';
    const Icon = isStudent ? MdSchool : MdPerson;

    // Reset chat when role changes
    useEffect(() => {
        setMessages([
            { role: 'model', text: `Hi ${user?.name}! I am your SmartGrade AI ${isStudent ? 'Tutor' : 'Coach'}. How can I assist you right now?` }
        ]);
        setIsOpen(false);
    }, [user?.role, user?.name, isStudent]);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const newUserMessage = { role: 'user', text: inputValue };
        const updatedMessages = [...messages, newUserMessage];

        setMessages(updatedMessages);
        setInputValue('');
        setIsLoading(true);

        // Fetch AI Response
        const responseText = await sendChatMessage(user?.role, messages, newUserMessage.text);

        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        setIsLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 bg-white w-80 sm:w-96 h-[500px] max-h-[70vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slide-up origin-bottom-right">
                    {/* Header */}
                    <div className={`bg-brand-${themeColor} text-white p-4 flex justify-between items-center shadow-md z-10`}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-full">
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold">SmartGrade AI</h3>
                                <p className="text-xs text-white/80">{isStudent ? 'Student Tutor' : 'Teacher Coach'}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <MdClose className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user'
                                        ? `bg-brand-${themeColor} text-white rounded-tr-sm`
                                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                                    }`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                                    <div className={`w-2 h-2 bg-${themeColor}-400 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                                    <div className={`w-2 h-2 bg-${themeColor}-400 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                                    <div className={`w-2 h-2 bg-${themeColor}-400 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100">
                        <div className="flex items-center gap-2 relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:border-brand-blue bg-slate-50 text-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className={`p-2 rounded-full text-white transition-all ${!inputValue.trim() || isLoading
                                        ? 'bg-slate-300'
                                        : `bg-brand-${themeColor} shadow-md hover:shadow-lg hover:scale-105 active:scale-95`
                                    }`}
                            >
                                <MdSend className="w-5 h-5 ml-1" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className={`w-14 h-14 rounded-full bg-brand-blue hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110 active:scale-95 animate-bounce`}
                >
                    <MdChatBubbleOutline className="w-7 h-7" />
                </button>
            )}
        </div>
    );
}
