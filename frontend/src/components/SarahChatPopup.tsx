import React, { useState, useEffect, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2, X, Sparkles } from 'lucide-react';
import { useGetSarahResponse } from '../hooks/useQueries';
import { formatCurrency } from '@/utils/formatCurrency';
import { detectIntent, getAmenitySuggestions } from '@/utils/keywordMatcher';
import type { Package } from '@/backend';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface SarahChatPopupProps {
  open: boolean;
  onClose: () => void;
  onOpen?: () => void;
  packageData: Package;
  originalPrice: number;
  currency: string;
  onEnhancementComplete: (amenities: string[]) => void;
}

export default function SarahChatPopup({
  open,
  onClose,
  onOpen,
  packageData,
  originalPrice,
  currency,
  onEnhancementComplete,
}: SarahChatPopupProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Sarah 😊 Let's co-create your perfect travel experience! Tell me what would make this trip special for you." },
  ]);
  const [input, setInput] = useState('');
  const [addedAmenities, setAddedAmenities] = useState<string[]>([]);
  const [hasShownUpgrade, setHasShownUpgrade] = useState(false);
  const [enhancementShown, setEnhancementShown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasCalledOnOpen = useRef(false);

  const sarahMutation = useGetSarahResponse();

  // Call onOpen when popup opens for the first time
  useEffect(() => {
    if (open && !hasCalledOnOpen.current && onOpen) {
      onOpen();
      hasCalledOnOpen.current = true;
    }
  }, [open, onOpen]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleUpgradePackage = () => {
    if (hasShownUpgrade) return;

    const upgradeAmenities = [
      'Airport pickup service 🚕',
      'Guided city tour 🗺️',
      'Complimentary breakfast 🍳',
    ];

    setAddedAmenities(upgradeAmenities);
    setHasShownUpgrade(true);

    const upgradeMessage = `I've upgraded your package with these wonderful extras at no additional cost:\n\n${upgradeAmenities.map(a => `✨ ${a}`).join('\n')}\n\nYour total price remains ${formatCurrency(originalPrice, currency)}. These enhancements will make your trip even more memorable! 🌟`;

    setMessages(prev => [...prev, { role: 'assistant', content: upgradeMessage }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    // Detect intent and generate contextual response
    const intent = detectIntent(currentInput);
    
    if (intent) {
      const suggestions = getAmenitySuggestions(intent);
      const newAmenities = [...addedAmenities, ...suggestions.slice(0, 2)];
      setAddedAmenities(newAmenities);

      const responseMessage = `Great idea! I've added these ${intent} enhancements to your package:\n\n${suggestions.slice(0, 2).map(a => `✨ ${a}`).join('\n')}\n\nYour total price remains ${formatCurrency(originalPrice, currency)}. Would you like any other customizations? 😊`;
      
      setMessages((prev) => [...prev, { role: 'assistant', content: responseMessage }]);
    } else {
      // Fallback to backend response
      try {
        const response = await sarahMutation.mutateAsync(currentInput);
        const assistantMessage: Message = { role: 'assistant', content: response.message };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Sarah response error:', error);
        const errorMessage: Message = { 
          role: 'assistant', 
          content: 'I understand! Let me help you customize this package. What specific experiences are you looking for? (beach activities, romantic experiences, adventure, local culture)' 
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    }
  };

  const handleSeeUpdatedPackage = () => {
    if (!enhancementShown) {
      setEnhancementShown(true);
      onEnhancementComplete(addedAmenities);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg transition-all duration-300 ease-in-out">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/assets/generated/sara-avatar.dim_256x256.png" alt="Sarah" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle>Sarah</SheetTitle>
                <SheetDescription>Your Travel Experience Designer</SheetDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-120px)] mt-6">
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/assets/generated/sara-avatar.dim_256x256.png" alt="Sarah" />
                      <AvatarFallback>S</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[85%] ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-orange-600 to-coral-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
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

          {!hasShownUpgrade && (
            <div className="mt-4 pt-4 border-t">
              <Button
                onClick={handleUpgradePackage}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                size="lg"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade Package
              </Button>
            </div>
          )}

          {addedAmenities.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <Button
                onClick={handleSeeUpdatedPackage}
                className="w-full bg-gradient-to-r from-orange-600 to-coral-600 hover:from-orange-700 hover:to-coral-700 text-white"
                size="lg"
              >
                See Updated Package
              </Button>
            </div>
          )}

          <div className="flex gap-2 mt-4 pt-4 border-t">
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
