import React, { useState, useRef, useEffect } from 'react';
import { generateChatResponse } from '../../lib/gemini';
import { GeminiMessage } from '../../types';
import { Button } from '../ui/Button';
import { SendHorizontal, Bot, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface GeminiChatProps {
  communityId?: string;
  isMember?: boolean;
}

export const GeminiChat: React.FC<GeminiChatProps> = ({ communityId, isMember }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<GeminiMessage[]>([
    { role: 'model', parts: 'Hello! I\'m your community assistant. How can I help you today?' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating || !user) return;

    const userMessage: GeminiMessage = { role: 'user', parts: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      const newMessages = [...messages, userMessage];
      const response = await generateChatResponse(newMessages);
      
      setMessages((prev) => [
        ...prev,
        { role: 'model', parts: response }
      ]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'model', parts: 'I encountered an error. Please try again later.' }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col h-96 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-indigo-600 text-white p-4 flex items-center">
          <Bot className="h-5 w-5 mr-2" />
          <span className="font-medium">Community Assistant</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to Access Chat</h3>
            <p className="text-gray-600 mb-4">Please sign in to use the community assistant.</p>
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (communityId && !isMember) {
    return (
      <div className="flex flex-col h-96 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-indigo-600 text-white p-4 flex items-center">
          <Bot className="h-5 w-5 mr-2" />
          <span className="font-medium">Community Assistant</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Members Only</h3>
            <p className="text-gray-600">Join this community to access the chat assistant.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-600 text-white p-4 flex items-center">
        <Bot className="h-5 w-5 mr-2" />
        <span className="font-medium">Community Assistant</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-indigo-100 text-gray-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.parts}</p>
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about communities..."
          className="flex-1 focus:outline-none focus:ring-0 border-0"
          disabled={isGenerating}
        />
        <Button
          type="submit"
          disabled={!input.trim() || isGenerating}
          size="sm"
          className="ml-2"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};