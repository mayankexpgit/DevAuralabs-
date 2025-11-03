
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
import { Mic, ChevronRight, Loader2, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import VantaFogBackground from '@/components/vanta-fog-background';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import TypingAnimation from '@/components/typing-animation';
import { getCourseRecommendations } from '@/app/actions';
import type { AIPoweredCourseRecommendationsOutput } from '@/ai/flows/ai-powered-course-recommendations';
import CourseChatCard from '@/components/course-chat-card';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp, query, orderBy, addDoc, doc, setDoc } from 'firebase/firestore';
import { useAdmin } from '@/context/admin-context';
import type { User as FirebaseUser } from 'firebase/auth';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'aura';
  timestamp: any;
  courses?: AIPoweredCourseRecommendationsOutput['courseRecommendations'][];
};

type ChatSession = {
  id: string;
  title: string;
  timestamp: any;
  userId: string;
};


export default function AuraAiChatPage() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const logoImage = PlaceHolderImages.find(p => p.id === 'ai-logo');
  const router = useRouter();

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);


  const { user: regularUser, isUserLoading } = useUser();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const firestore = useFirestore();

  const [activeUser, setActiveUser] = useState<FirebaseUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // This effect determines the active user or redirects.
  useEffect(() => {
    if (isUserLoading || isAdminLoading) {
      return; // Wait until both auth checks are complete
    }

    if (isAdmin) {
      setActiveUser({
          uid: 'admin_user',
          displayName: 'Administrator',
          email: 'admin@devaura.labs',
          photoURL: "https://i.pravatar.cc/150?u=admin",
      } as FirebaseUser);
    } else if (regularUser) {
      setActiveUser(regularUser);
    } else {
      router.push('/login?next=/aura-ai-chat');
    }
    setAuthChecked(true); // Mark that authentication has been checked.
  }, [regularUser, isUserLoading, isAdmin, isAdminLoading, router]);

  const user = activeUser;
  
  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(finalTranscript);
        setInput(input + finalTranscript + interimTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [input]);

  const handleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInput('');
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };


  // Fetch user's chat sessions only when authentication is checked and a user is present.
  const chatSessionsQuery = useMemoFirebase(() => 
    authChecked && user ? query(collection(firestore, 'users', user.uid, 'chats'), orderBy('timestamp', 'desc')) : null
  , [firestore, user, authChecked]);
  const { data: chatHistory, isLoading: isHistoryLoading } = useCollection<ChatSession>(chatSessionsQuery);

  // Fetch messages for the current chat only when authentication is checked and a chat is selected.
  const messagesQuery = useMemoFirebase(() => 
    authChecked && user && currentChatId ? query(collection(firestore, 'users', user.uid, 'chats', currentChatId, 'messages'), orderBy('timestamp', 'asc')) : null
  , [firestore, user, currentChatId, authChecked]);
  const { data: messages, isLoading: areMessagesLoading } = useCollection<Message>(messagesQuery);
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
  // Set the first chat as active, or create a new one
  useEffect(() => {
      if (!isHistoryLoading && chatHistory) {
          if (chatHistory.length > 0 && !currentChatId) {
              setCurrentChatId(chatHistory[0].id);
          }
      }
  }, [chatHistory, isHistoryLoading, currentChatId]);


  const startNewChat = async () => {
    if (!user || !firestore) return;
    const newChatSessionData = {
        title: 'New Chat',
        timestamp: serverTimestamp(),
        userId: user.uid,
    };
    const newChatRef = await addDoc(collection(firestore, 'users', user.uid, 'chats'), newChatSessionData);
    setCurrentChatId(newChatRef.id);
  }
  
  const loadChat = (chatId: string) => {
    setCurrentChatId(chatId);
  }

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isSending || !user || !firestore) return;

    setIsSending(true);
    setInput('');
    
    let activeChatId = currentChatId;

    // Create a new chat session if one doesn't exist
    if (!activeChatId) {
        const newChatRef = await addDoc(collection(firestore, 'users', user.uid, 'chats'), {
            title: text.substring(0, 30),
            timestamp: serverTimestamp(),
            userId: user.uid,
        });
        activeChatId = newChatRef.id;
        setCurrentChatId(activeChatId);
    }
    
    if (!activeChatId) {
      console.error("Failed to create or get a chat ID.");
      setIsSending(false);
      return;
    }

    const userMessage: Omit<Message, 'id'> = {
      text,
      sender: 'user',
      timestamp: serverTimestamp(),
    };

    const messagesCol = collection(firestore, 'users', user.uid, 'chats', activeChatId, 'messages');
    addDocumentNonBlocking(messagesCol, userMessage);


    setIsLoading(true);
    const result = await getCourseRecommendations({ interests: text, goals: '' });
    
    let aiResponse: Omit<Message, 'id'>;
    if (result.success && result.data) {
        aiResponse = {
            text: result.data.courseRecommendations,
            sender: 'aura',
            timestamp: serverTimestamp(),
        };

        if (result.data.courseRecommendations) {
          // @ts-ignore
          aiResponse.courses = result.data.courses;
        }

    } else {
        aiResponse = {
            text: result.error || "I'm having trouble connecting right now. Please try again later.",
            sender: 'aura',
            timestamp: serverTimestamp(),
        };
    }

    addDocumentNonBlocking(messagesCol, aiResponse);
    setIsLoading(false);
    setIsSending(false);
  };
  
  if (!authChecked || !user) {
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
                {chatHistory?.slice(0, 5).map(chat => (
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
          <h2 className="text-xl font-bold">{chatHistory?.find(c => c.id === currentChatId)?.title || 'New Chat'}</h2>
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL || undefined} />
            <AvatarFallback>{user.displayName?.charAt(0) || <User className="h-5 w-5" />}</AvatarFallback>
          </Avatar>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages?.map((message) => (
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
                        {/*@ts-ignore*/}
                        {message.courses.map(course => (
                            <CourseChatCard key={course.id} course={course} />
                        ))}
                    </div>
                )}
              </div>
               {message.sender === 'user' && (
                 <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} />
                    <AvatarFallback>{isAdmin ? 'AD' : user.displayName?.charAt(0) || <User className="h-5 w-5" />}</AvatarFallback>
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
           {!areMessagesLoading && messages?.length === 0 && !isLoading && (
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
              disabled={isSending}
            />
            <Button size="icon" className="absolute right-12 bottom-2 aura-glass-btn h-8 w-8" onClick={handleListen} disabled={isSending}>
              <Mic className={cn("h-5 w-5", isListening && "text-red-500")} />
            </Button>
            <Button size="icon" className={cn("absolute right-2 bottom-2 aura-send-btn", isListening && "listening-btn-glow")} onClick={() => handleSend()} disabled={isSending || !input.trim()}>
                {isSending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
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
                 {chatHistory?.slice(0, 5).map(chat => (
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
            <h1 className="text-4xl font-bold">HI {user.displayName?.split(' ')[0].toUpperCase() || 'USER'}!</h1>
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
              disabled={isSending}
            />
            <Button size="icon" className="absolute right-12 bottom-2 aura-glass-btn h-8 w-8" onClick={handleListen} disabled={isSending}>
              <Mic className={cn("h-5 w-5", isListening && "text-red-500")} />
            </Button>
            <Button size="icon" className={cn("absolute right-2 bottom-2 aura-send-btn", isListening && "listening-btn-glow")} onClick={() => handleSend()} disabled={isSending || !input.trim()}>
                 {isSending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
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
        {isHistoryLoading || areMessagesLoading || (messages && messages.length > 0) ? renderChatUI() : renderWelcomeUI()}
      </div>
    </div>
  );
}

    