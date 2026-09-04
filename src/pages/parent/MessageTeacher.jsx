import React, { useState, useRef, useEffect } from 'react';
import { chatMessages } from '../../data/mockParentData';
import { MdSend, MdPerson, MdFamilyRestroom } from 'react-icons/md';
import { toast } from 'react-toastify';

export default function MessageTeacher() {
    const [messages, setMessages] = useState(chatMessages);
    const [input, setInput] = useState('');
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const newMsg = {
            id: Date.now(),
            sender: 'parent',
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMsg]);
        setInput('');

        // Simulate teacher typing & replying
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'teacher',
                text: "Thank you for letting me know. I'll make sure to monitor Arjun's progress on those exercises.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 2000);
    };

    const sendQuickReply = (text) => {
        setInput(text);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in relative pb-10 sm:h-[calc(100vh-140px)] flex flex-col">
            <div className="mb-6 shrink-0">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Message Teacher</h1>
                <p className="text-slate-500">Directly communicate with Mrs. Sharma about Arjun's learning.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden flex-1 relative">

                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center border-2 border-white shadow-sm">
                                <MdPerson className="w-7 h-7" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Mrs. Sharma</h2>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Homeroom • Science & Maths</p>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex max-w-[80%] ${msg.sender === 'parent' ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}>
                            <div className={`flex items-end gap-2 ${msg.sender === 'parent' ? 'flex-row-reverse' : 'flex-row'}`}>

                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white shadow-sm
                    ${msg.sender === 'parent' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                    {msg.sender === 'parent' ? <MdFamilyRestroom className="w-4 h-4" /> : <MdPerson className="w-4 h-4" />}
                                </div>

                                <div className={`p-4 rounded-2xl shadow-sm relative text-[15px]
                    ${msg.sender === 'parent'
                                        ? 'bg-brand-blue text-white rounded-br-none'
                                        : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'}`}>
                                    {msg.text}
                                    <div className={`text-[10px] mt-2 font-medium pb-0 ${msg.sender === 'parent' ? 'text-blue-200 text-right' : 'text-slate-400'}`}>
                                        {msg.time}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={endOfMessagesRef} />
                </div>

                {/* Quick Replies */}
                <div className="px-6 py-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto shrink-0 no-scrollbar">
                    {["Can we schedule a meeting?", "Thank you for the update.", "How can I help at home?"].map((text, i) => (
                        <button
                            key={i}
                            onClick={() => sendQuickReply(text)}
                            className="whitespace-nowrap px-4 py-1.5 rounded-full border border-blue-200 text-brand-blue bg-blue-50 text-sm font-semibold hover:bg-brand-blue hover:text-white transition-colors"
                        >
                            {text}
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 bg-white shrink-0 border-t border-slate-100 flex gap-4 items-end">
                    <textarea
                        rows="1"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message to Mrs. Sharma..."
                        className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 outline-none resize-none min-h-[50px] transition-all"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="bg-brand-blue text-white rounded-xl w-12 h-12 flex shrink-0 items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <MdSend className="w-5 h-5 ml-1" />
                    </button>
                </form>
            </div>
        </div>
    );
}