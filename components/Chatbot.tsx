
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatbotProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    history: ChatMessage[];
    onSend: (message: string) => void;
    isLoading: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, setIsOpen, history, onSend, isLoading }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [history, isLoading]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSend(input);
            setInput('');
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-5 right-5 bg-rose-500 text-white p-4 rounded-full shadow-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-transform transform hover:scale-110"
                aria-label="Open Story Idea Chat"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15v1a1 1 0 001 1h12a1 1 0 001-1v-1a1 1 0 00-.293-.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
            </button>
        );
    }

    return (
        <div className="fixed bottom-5 right-5 w-full max-w-sm h-[60vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 animate-fade-in-up">
            <header className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-2xl">
                <h3 className="font-bold text-gray-700">Story Idea Helper</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {history.map((msg, index) => (
                    <div key={index} className={`flex items-end ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`px-4 py-2 rounded-2xl max-w-xs ${msg.role === 'user' ? 'bg-rose-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                           {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-end justify-start">
                        <div className="px-4 py-2 rounded-2xl max-w-xs bg-gray-200 text-gray-800 rounded-bl-none">
                            <div className="flex items-center justify-center space-x-1">
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-150"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-300"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 border-t">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask for a story idea..."
                        className="w-full pl-3 pr-12 py-2 border rounded-full focus:ring-rose-500 focus:border-rose-500"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading} className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-10 text-rose-500 disabled:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chatbot;
