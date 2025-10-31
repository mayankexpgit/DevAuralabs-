
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Mic, ChevronRight, Loader2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import VantaFogBackground from '@/components/vanta-fog-background';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import TypingAnimation from '@/components/typing-animation';
import { getCourseRecommendations } from '@/app/actions';
import type { AIPoweredCourseRecommendationsOutput } from '@/ai/flows/ai-powered-course-recommendations';
import CourseChatCard from '@/components/course-chat-card';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'aura';
  // @ts-ignore
  courses?: AIPoweredCourseRecommendationsOutput['courses'];
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
};


export default function AuraAiChatPage() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState('Josh');
  const logoImage = PlaceHolderImages.find(p => p.id === 'ai-logo');
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const router = useRouter();


  useEffect(() => {
    setIsMounted(true);
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);

    if (!authStatus) {
      router.push('/login?next=/aura-ai-chat');
      return;
    }

    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory) as ChatSession[];
      setChatHistory(parsedHistory);
    }
    
    const activeChatId = localStorage.getItem('activeChatId');
    if (activeChatId) {
      const activeChat = (JSON.parse(savedHistory || '[]') as ChatSession[]).find(chat => chat.id === activeChatId);
      if (activeChat) {
        setCurrentChatId(activeChat.id);
        setMessages(activeChat.messages);
      }
    } else {
        startNewChat();
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isMounted || !currentChatId) return;

    const updatedHistory = chatHistory.filter(chat => chat.id !== currentChatId);
    const currentSession = chatHistory.find(chat => chat.id === currentChatId) || { id: currentChatId, messages: [], title: '', timestamp: Date.now() };

    const updatedSession: ChatSession = {
        ...currentSession,
        messages: messages,
        title: messages.length > 0 ? messages[0].text.substring(0, 30) : 'New Chat',
        timestamp: Date.now(),
    };
    
    const newHistory = [updatedSession, ...updatedHistory.filter(chat => chat.messages.length > 0)].sort((a, b) => b.timestamp - a.timestamp);

    setChatHistory(newHistory);
    localStorage.setItem('chatHistory', JSON.stringify(newHistory));
    localStorage.setItem('activeChatId', currentChatId);
  }, [messages, currentChatId, isMounted]);

  const startNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    setCurrentChatId(newChatId);
    setMessages([]);
    localStorage.setItem('activeChatId', newChatId);
  }
  
  const loadChat = (chatId: string) => {
    const chatToLoad = chatHistory.find(chat => chat.id === chatId);
    if(chatToLoad) {
        setCurrentChatId(chatToLoad.id);
        setMessages(chatToLoad.messages);
        localStorage.setItem('activeChatId', chatToLoad.id);
    }
  }


  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const result = await getCourseRecommendations({ interests: text, goals: '' });
    
    let aiResponse: Message;
    if (result.success && result.data) {
        aiResponse = {
            id: `aura-${Date.now()}`,
            text: result.data.courseRecommendations,
            sender: 'aura',
            courses: result.data.courses,
        };
    } else {
        aiResponse = {
            id: `aura-${Date.now()}`,
            text: result.error || "I'm having trouble connecting right now. Please try again later.",
            sender: 'aura',
        };
    }

    setIsLoading(false);
    setMessages((prev) => [...prev, aiResponse]);
  };
  
  const startListening = () => {
    setIsListening(true);
    setTimeout(() => {
        setInput("Hey Aura, can you help plan a weekend trip to the mountains?");
        setIsListening(false);
    }, 2500);
  };

  const stopListening = () => {
    setIsListening(false);
    handleSend("Hey Aura, can you help plan a weekend trip to the mountains?");
  };

  if (!isMounted || !isAuthenticated) {
    return (
        <div className="h-screen w-full bg-black flex items-center justify-center">
            <VantaFogBackground />
            <div className="relative z-10 text-white">
                <Loader2 className="h-12 w-12 animate-spin" />
            </div>
        </div>
    );
  }
  
  const renderChatUI = () => (
     <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
        <header className="flex items-center justify-between p-4 text-white">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 12H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 6H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 18H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="sr-only">Open Menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-zinc-900/80 border-zinc-700 text-white backdrop-blur-md">
                <DropdownMenuLabel>Recent Chats</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-700"/>
                {chatHistory.slice(0, 5).map(chat => (
                    <DropdownMenuItem key={chat.id} onSelect={() => loadChat(chat.id)} className="focus:bg-zinc-800 focus:text-white">
                        {chat.title}
                    </DropdownMenuItem>
                ))}
                 <DropdownMenuSeparator className="bg-zinc-700"/>
                 <DropdownMenuItem onSelect={startNewChat} className="focus:bg-zinc-800 focus:text-white">
                    New Chat
                 </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <h2 className="text-xl font-bold">{chatHistory.find(c => c.id === currentChatId)?.title || 'New Chat'}</h2>
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
                    ? 'bg-white text-zinc-900 rounded-br-none'
                    : 'bg-zinc-800/80 text-zinc-200 rounded-bl-none',
                  !message.courses && 'max-w-xs md:max-w-md' 
                )}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                 {message.courses && message.courses.length > 0 && (
                    <div className="mt-4 space-y-4">
                        {message.courses.map(course => (
                            <CourseChatCard key={course.id} course={course} />
                        ))}
                    </div>
                )}
              </div>
               {message.sender === 'user' && (
                 <Avatar className="h-8 w-8">
                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
                <Avatar className="h-8 w-8 border-2 border-green-glow">
                    <AvatarImage src={logoImage?.imageUrl} />
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="bg-zinc-800/80 text-zinc-200 rounded-bl-none max-w-xs md:max-w-md rounded-2xl px-4 py-3">
                    <TypingAnimation />
                </div>
            </div>
          )}
           {messages.length === 0 && !isLoading && (
             <div className="text-center text-zinc-400 pt-20">
                <MessageSquare className="mx-auto h-16 w-16" />
                <h2 className="mt-4 text-2xl font-bold text-white">Ask Aura Anything</h2>
                <p>Start a new conversation by typing your message below.</p>
             </div>
           )}
          <div ref={messagesEndRef} />
        </div>

        <footer className="px-4 pt-2 pb-4">
           <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Ask Aura anything..."
              className="aura-glass-input min-h-[56px] pt-3 pr-24"
              rows={1}
              disabled={isLoading}
            />
            <Button size="icon" className="absolute right-12 bottom-2 aura-glass-btn h-8 w-8" onClick={startListening} disabled={isLoading}>
              <Mic className="h-5 w-5" />
            </Button>
            <Button size="icon" className={cn("absolute right-2 bottom-2 aura-send-btn", isListening && "listening-btn-glow")} onClick={() => handleSend()} disabled={isLoading || !input.trim()}>
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : isListening ? (
                    <Mic className="h-5 w-5" />
                ) : (
                    <ChevronRight className="h-6 w-6" />
                )}
            </Button>
          </div>
        </footer>
      </div>
  );
  
  const renderWelcomeUI = () => (
     <div className="flex flex-col h-full w-full max-w-2xl mx-auto p-4 text-white">
        <header className="flex items-center justify-between">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 12H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 6H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 18H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="sr-only">Open Menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-zinc-900/80 border-zinc-700 text-white backdrop-blur-md">
                <DropdownMenuLabel>Recent Chats</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-700"/>
                 {chatHistory.slice(0, 5).map(chat => (
                    <DropdownMenuItem key={chat.id} onSelect={() => loadChat(chat.id)} className="focus:bg-zinc-800 focus:text-white">
                        {chat.title}
                    </DropdownMenuItem>
                ))}
                 <DropdownMenuSeparator className="bg-zinc-700"/>
                 <DropdownMenuItem onSelect={startNewChat} className="focus:bg-zinc-800 focus:text-white">
                    New Chat
                 </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              placeholder="Ask Aura anything..."
              className="aura-glass-input min-h-[56px] pt-3 pr-24"
              rows={1}
              disabled={isLoading}
            />
            <Button size="icon" className="absolute right-12 bottom-2 aura-glass-btn h-8 w-8" onClick={startListening} disabled={isLoading}>
              <Mic className="h-5 w-5" />
            </Button>
            <Button size="icon" className={cn("absolute right-2 bottom-2 aura-send-btn", isListening && "listening-btn-glow")} onClick={isListening ? stopListening : () => handleSend()} disabled={isLoading || !input.trim()}>
                 {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : isListening ? (
                    <Mic className="h-5 w-5" />
                ) : (
                    <ChevronRight className="h-6 w-6" />
                )}
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

    

    