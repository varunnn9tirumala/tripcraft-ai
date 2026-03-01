import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2 } from 'lucide-react';
import { useGetSarahResponse } from '../hooks/useQueries';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi there! I'm Sarah, your friendly travel companion! 😊 How can I help you plan your perfect trip today?" },
  ]);
  const [input, setInput] = useState('');

  const sarahMutation = useGetSarahResponse();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    try {
      const response = await sarahMutation.mutateAsync(currentInput);
      const assistantMessage: Message = { role: 'assistant', content: response.message };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Sarah response error:', error);
      const errorMessage: Message = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-coral-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Chat with Sarah
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get personalized travel advice from your friendly AI assistant
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/assets/generated/sara-avatar.dim_256x256.png" alt="Sarah" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              Sarah - Your Friendly Guide
            </CardTitle>
            <CardDescription>
              Chat with Sarah for personalized travel recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/assets/generated/sara-avatar.dim_256x256.png" alt="Sarah" />
                        <AvatarFallback>S</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-orange-600 to-coral-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-orange-600 text-white">U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={sarahMutation.isPending}
              />
              <Button
                onClick={handleSend}
                disabled={sarahMutation.isPending || !input.trim()}
                className="bg-gradient-to-r from-orange-600 to-coral-600 hover:from-orange-700 hover:to-coral-700"
              >
                {sarahMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
