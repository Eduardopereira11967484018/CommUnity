import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiMessage } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_KEY;

if (!API_KEY) {
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const generateChatResponse = async (messages: GeminiMessage[]): Promise<string> => {
  try {
    const chat = model.startChat({
      history: messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.parts }],
      })),
    });

    const result = await chat.sendMessage(messages[messages.length - 1].parts);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error generating chat response:', error);
    return 'Sorry, I encountered an error processing your request.';
  }
};