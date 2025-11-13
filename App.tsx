
import React, { useState, useCallback, useRef } from 'react';
import { generateColoringPages, startChat, sendMessage } from './services/geminiService';
import { jsPDF } from 'jspdf';
import { Page, ChatMessage as ChatMessageType } from './types';
import Header from './components/Header';
import UserInput from './components/UserInput';
import GenerationProgress from './components/GenerationProgress';
import ColoringBookDisplay from './components/ColoringBookDisplay';
import Chatbot from './components/Chatbot';
import type { Chat } from '@google/genai';

const App: React.FC = () => {
    const [theme, setTheme] = useState<string>('Space Dinosaurs');
    const [childName, setChildName] = useState<string>('Alex');
    const [pages, setPages] = useState<Page[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
    const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
    const chatRef = useRef<Chat | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!theme || !childName) {
            setError('Please provide both a theme and a name.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setPages([]);

        try {
            await generateColoringPages(theme, childName, (message, newPages) => {
                setLoadingMessage(message);
                if (newPages) {
                    setPages(newPages);
                }
            });
            setLoadingMessage('Your coloring book is ready!');
        } catch (err) {
            console.error(err);
            setError('An error occurred while creating your coloring book. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [theme, childName]);

    const handleDownloadPdf = useCallback(() => {
        if (pages.length === 0) return;

        const doc = new jsPDF();
        pages.forEach((page, index) => {
            if (index > 0) {
                doc.addPage();
            }
            const img = new Image();
            img.src = page.imageData;
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            doc.addImage(img, 'JPEG', 10, 10, pageWidth - 20, pageHeight - 20, undefined, 'FAST');
        });
        doc.save(`${childName.toLowerCase().replace(/ /g, '_')}_${theme.toLowerCase().replace(/ /g, '_')}_coloring_book.pdf`);
    }, [pages, childName, theme]);

    const handleChatSend = useCallback(async (message: string) => {
        if (!message.trim()) return;

        setChatHistory(prev => [...prev, { role: 'user', text: message }]);
        setIsChatLoading(true);

        try {
            if (!chatRef.current) {
                chatRef.current = startChat();
            }
            const response = await sendMessage(chatRef.current, `My coloring book theme is '${theme}'. ${message}`);
            setChatHistory(prev => [...prev, { role: 'model', text: response }]);
        } catch (err) {
            console.error(err);
            setChatHistory(prev => [...prev, { role: 'model', text: 'Sorry, I had trouble coming up with an idea. Please try again.' }]);
        } finally {
            setIsChatLoading(false);
        }
    }, [theme]);


    return (
        <div className="min-h-screen bg-rose-50 text-gray-800 font-sans">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-6 md:p-10 border border-rose-200">
                    <UserInput
                        theme={theme}
                        setTheme={setTheme}
                        childName={childName}
                        setChildName={setChildName}
                        onGenerate={handleGenerate}
                        isLoading={isLoading}
                    />

                    {isLoading && <GenerationProgress message={loadingMessage} />}

                    {error && <p className="text-center text-red-500 mt-4 font-semibold">{error}</p>}

                    {!isLoading && pages.length > 0 && (
                        <ColoringBookDisplay
                            pages={pages}
                            onDownloadPdf={handleDownloadPdf}
                            childName={childName}
                        />
                    )}
                </div>
            </main>
            <Chatbot 
                isOpen={isChatOpen}
                setIsOpen={setIsChatOpen}
                history={chatHistory}
                onSend={handleChatSend}
                isLoading={isChatLoading}
            />
        </div>
    );
};

export default App;
