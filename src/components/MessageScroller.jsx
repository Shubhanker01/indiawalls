'use client';

import { useState, useRef, useEffect } from 'react';
import {
    MessageScrollerProvider,
    MessageScroller,
    MessageScrollerViewport,
    MessageScrollerContent,
} from '@/components/ui/message-scroller'; // Adjust path if needed

const initialMessages = [
    {
        id: 1,
        sender: 'bot',
        text: 'Hello! Welcome to Indiawalls Infratech. How can I assist with your boundary project today?',
        time: '10:00 AM',
    },
    {
        id: 2,
        sender: 'user',
        text: 'Hi, I need a quote for an 8ft precast concrete boundary wall.',
        time: '10:01 AM',
    },
    {
        id: 3,
        sender: 'bot',
        text: 'Great! Could you please share the total running length required and your project site location?',
        time: '10:01 AM',
    },
    {
        id: 4,
        sender: 'user',
        text: 'Around 600 running feet, site is near Bhiwadi, Rajasthan.',
        time: '10:02 AM',
    },
    {
        id: 5,
        sender: 'bot',
        text: 'Thank you! An engineer will send you direct factory rates and transport estimates shortly.',
        time: '10:02 AM',
    },
];

// Icons
const BotIcon = () => (
    <div className="w-8 h-8 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700">
        🤖
    </div>
);

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
        👤
    </div>
);

export default function MessageAttachmentDemo() {
    const [messages, setMessages] = useState(initialMessages);
    const messageEndRef = useRef(null)
    const [input, setInput] = useState('');
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: 'user',
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput('');
    };

    return (
        <div className="flex w-full h-full flex-col bg-white rounded-xl overflow-hidden">
            {/* 1. Scrollable Message Feed */}
            <div className="flex-1 overflow-hidden">
                <MessageScrollerProvider>
                    <MessageScroller className="h-full">
                        <MessageScrollerViewport className="h-full p-4">
                            <MessageScrollerContent className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                                            }`}
                                    >
                                        {/* Avatar Icon */}
                                        {msg.sender === 'bot' ? <BotIcon /> : <UserIcon />}

                                        {/* Chat Bubble Container */}
                                        <div
                                            className={`flex flex-col max-w-[78%] ${msg.sender === 'user' ? 'items-end' : 'items-start'
                                                }`}
                                        >
                                            <div
                                                className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${msg.sender === 'user'
                                                    ? 'bg-yellow-600 text-white rounded-tr-none'
                                                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>
                                            <span className="text-[10px] text-slate-400 mt-1 px-1">
                                                {msg.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messageEndRef}></div>
                            </MessageScrollerContent>
                        </MessageScrollerViewport>
                    </MessageScroller>
                </MessageScrollerProvider>
            </div>

            {/* 2. Chat Input Bar */}
            <form
                onSubmit={handleSend}
                className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-yellow-500 transition"
                />
                <button
                    type="submit"
                    className="bg-yellow-600 hover:bg-yellow-500 text-white p-2.5 rounded-xl transition flex items-center justify-center shrink-0"
                    aria-label="Send Message"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                    </svg>
                </button>
            </form>
        </div>
    );
}