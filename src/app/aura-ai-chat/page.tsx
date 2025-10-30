
'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp, Menu, Mic, X } from 'lucide-react';
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
    setTimeout(() => {
      handleSend("Hey Aura, can you help plan a weekend trip to the mountains?");
      setIsListening(false);
    }, 2500);
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

        <footer className="p-4">
           <div className="relative">
             <img src={logoImage?.imageUrl} alt="AI Icon" className="absolute top-3 left-4 w-6 h-6" />
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="What is on your mind?"
              className="aura-glass-input min-h-[96px] pl-12 pt-3"
              rows={4}
            />
            <Button size="icon" className="absolute right-2 bottom-4 aura-send-btn" onClick={() => handleSend()}>
              <ArrowUp className="h-5 w-5" />
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
        
        <footer className="p-4">
          <div className="relative">
            <img src={logoImage?.imageUrl} alt="AI Icon" className="absolute top-3 left-4 w-6 h-6" />
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="What is on your mind?"
              className="aura-glass-input min-h-[96px] pl-12 pt-3"
              rows={4}
            />
             <Button size="icon" className="absolute right-12 bottom-4 aura-glass-btn h-8 w-8" onClick={() => {}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
            </Button>
            <Button size="icon" className="absolute right-2 bottom-4 aura-send-btn" onClick={startListening}>
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </footer>
     </div>
  );

  const renderListeningUI = () => (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto p-4 text-white items-center justify-center text-center">
      <div className="listening-indicator">
        <img src={logoImage?.imageUrl} alt="Aura AI" className="w-24 h-24"/>
      </div>
      <p className='mt-8 text-zinc-300'>Listening...</p>
      <p className="text-xl mt-4 max-w-md">
        Hey Aura, can you help plan a weekend trip to the mountains?
      </p>
      <div className="absolute bottom-10 flex gap-4">
         <Button size="lg" className="aura-send-btn rounded-full gap-2 px-8">
            <Mic className="h-5 w-5" />
            Send
         </Button>
         <Button variant="ghost" size="icon" className="aura-glass-btn h-14 w-14" onClick={() => setIsListening(false)}>
            <X className="h-6 w-6" />
         </Button>
      </div>
    </div>
  );


  return (
    <div className="h-screen w-full bg-black aura-chat-container">
      <VantaFogBackground />
      <div className="relative z-10 h-full w-full backdrop-blur-sm bg-black/30">
        {isListening ? renderListeningUI() : (messages.length > 0 ? renderChatUI() : renderWelcomeUI())}
      </div>
    </div>
  );
}
