
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Page } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                aspectRatio: '4:3',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
};

const generatePrompts = async (theme: string): Promise<string[]> => {
    const prompt = `
        You are a creative assistant that generates prompts for an AI image generator. The goal is to create pages for a children's coloring book.
        Based on the theme "${theme}", generate 5 unique and imaginative scenes.
        Each scene should be simple enough for a child to color, with clear subjects and backgrounds. Avoid complex details or text.
        The final images must be black and white with thick, bold outlines and no shading.
        Your output must be a JSON array of 5 strings, where each string is a detailed prompt for one coloring page.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                }
            }
        });
        const jsonText = response.text.trim();
        const prompts = JSON.parse(jsonText);
        if (Array.isArray(prompts) && prompts.length === 5 && prompts.every(p => typeof p === 'string')) {
            return prompts;
        }
        throw new Error("Invalid prompt format received from AI.");
    } catch (error) {
        console.error("Error generating prompts:", error);
        throw error;
    }
};

export const generateColoringPages = async (
    theme: string,
    childName: string,
    onProgress: (message: string, newPages?: Page[]) => void
): Promise<void> => {
    let currentPages: Page[] = [];

    // 1. Generate Prompts
    onProgress("Brainstorming some fun ideas...");
    const pagePrompts = await generatePrompts(theme);

    // 2. Generate Cover
    onProgress("Designing a beautiful cover...");
    const coverPrompt = `A beautiful and fun cover for a children's coloring book titled "${childName}'s Coloring Book!". The theme is "${theme}". The title text should be large, clear, and easy to color. Include fun characters or elements related to the theme around the title. The style should be a children's coloring book page, simple line art, thick bold black outlines, black and white, no shading, clean vector style.`;
    const coverImageData = await generateImage(coverPrompt);
    currentPages.push({ id: 0, type: 'cover', imageData: coverImageData });
    onProgress("Cover created!", currentPages);

    // 3. Generate Pages
    const imageStylePrefix = "A children's coloring book page, simple line art, thick bold black outlines, black and white, no shading, no color, clean vector style. ";
    
    for (let i = 0; i < pagePrompts.length; i++) {
        onProgress(`Drawing page ${i + 1} of 5...`, currentPages);
        const fullPrompt = imageStylePrefix + pagePrompts[i];
        const imageData = await generateImage(fullPrompt);
        currentPages.push({ id: i + 1, type: 'page', imageData: imageData });
        onProgress(`Page ${i + 1} is ready!`, currentPages);
    }
};

export const startChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are a friendly and cheerful assistant helping a child and parent come up with fun story ideas for their coloring book. Keep responses short, imaginative, and appropriate for young children.",
        },
    });
};

export const sendMessage = async (chat: Chat, message: string): Promise<string> => {
    try {
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Chat error:", error);
        throw new Error("Failed to get chat response.");
    }
};
