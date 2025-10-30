
'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Menu, Mic, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import VantaFogBackground from '@/components/vanta-fog-background';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'aura';
};

export default function AuraAiChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState('Josh');
  const logoImage = PlaceHolderImages.find(p => p.id === 'ai-logo');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: `aura-${Date.now()}`,
        text: "I'm sorry, I am a demo assistant and my capabilities are limited. I can only show you how a conversation would look.",
        sender: 'aura',
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };
  
  const startListening = () => {
    setIsListening(true);
    // Simulate speech-to-text
    setTimeout(() => {
        setInput("Hey Aura, can you help plan a weekend trip to the mountains?");
        setIsListening(false);
    }, 2500);
  };

  const stopListening = () => {
    setIsListening(false);
    handleSend("Hey Aura, can you help plan a weekend trip to the mountains?");
  };
  
  const renderChatUI = () => (
     <div className="flex flex-col h-full w-full max-w-2xl mx-auto">
        <header className="flex items-center justify-between p-4 text-white">
          <Button variant="ghost" size="icon" className="aura-glass-btn">
            <Menu className="h-6 w-6" />
          </Button>
          <h2 className="text-xl font-bold">NEW CHAT</h2>
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-3',
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.sender === 'aura' && (
                <Avatar className="h-8 w-8 border-2 border-green-glow">
                  <AvatarImage src={logoImage?.imageUrl} />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs md:max-w-md rounded-2xl px-4 py-3',
                  message.sender === 'user'
                    ? 'bg-green-500/80 text-white rounded-br-none'
                    : 'bg-zinc-800/80 text-zinc-200 rounded-bl-none'
                )}
              >
                <p>{message.text}</p>
              </div>
               {message.sender === 'user' && (
                 <Avatar className="h-8 w-8">
                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <footer className="px-4 pt-2 pb-4">
           <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Ask Aura,"
              className="aura-glass-input min-h-[56px] pt-3 pr-24"
              rows={1}
            />
            <Button size="icon" className="absolute right-12 bottom-2 aura-glass-btn h-8 w-8" onClick={startListening}>
              <Mic className="h-5 w-5" />
            </Button>
            <Button size="icon" className={cn("absolute right-2 bottom-2 aura-send-btn", isListening && "listening-btn-glow")} onClick={() => handleSend()}>
                {isListening ? <Mic className="h-5 w-5" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </footer>
      </div>
  );
  
  const renderWelcomeUI = () => (
     <div className="flex flex-col h-full w-full max-w-2xl mx-auto p-4 text-white">
        <header className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="aura-glass-btn">
            <Menu className="h-6 w-6" />
          </Button>
        </header>

        <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-bold">HI {userName.toUpperCase()}!</h1>
            <p className="text-white mt-2">What Do You Want To Chat About Today?</p>
        </div>
        
        <footer className="px-4 pt-2 pb-4">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Ask Aura,"
              className="aura-glass-input min-h-[56px] pt-3 pr-24"
              rows={1}
            />
            <Button size="icon" className="absolute right-12 bottom-2 aura-glass-btn h-8 w-8" onClick={startListening}>
              <Mic className="h-5 w-5" />
            </Button>
            <Button size="icon" className={cn("absolute right-2 bottom-2 aura-send-btn", isListening && "listening-btn-glow")} onClick={isListening ? stopListening : () => handleSend()}>
                {isListening ? <Mic className="h-5 w-5" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </footer>
     </div>
  );

  return (
    <div className="h-screen w-full bg-black aura-chat-container">
      <VantaFogBackground />
      <div className="relative z-10 h-full w-full backdrop-blur-sm bg-black/30">
        {messages.length > 0 ? renderChatUI() : renderWelcomeUI()}
      </div>
    </div>
  );
}
