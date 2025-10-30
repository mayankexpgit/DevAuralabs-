
'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ShieldEllipsis, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import VantaBackground from '@/components/vanta-background';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  mobile: z.string().min(10, { message: 'Please enter a valid mobile number.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function SignupPage() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Simulate successful signup
    localStorage.setItem('isAuthenticated', 'true');
    toast({
      title: 'Sign-up Successful',
      description: 'Welcome to DevAura Labs!',
    });
    
    if (next) {
      router.push(next);
    } else {
      router.push('/');
    }
  }

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center px-4 py-12">
        <VantaBackground />
        <div className="relative z-10 w-full max-w-md">
            <div className="glass-card p-8 space-y-6">
                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <ShieldEllipsis className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold">Create an Account</h1>
                    <p className="text-muted-foreground">Join us to start your journey</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                            <Input placeholder="John Doe" {...field} className="bg-background/50"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} className="bg-background/50"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mobile Number</FormLabel>                            <FormControl>
                            <Input placeholder="+91 00000-00000" {...field} className="bg-background/50"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input type={showPassword ? 'text' : 'password'} placeholder="********" {...field} className="bg-background/50 pr-10"/>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                             <FormControl>
                                <div className="relative">
                                    <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="********" {...field} className="bg-background/50 pr-10"/>
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full gradient-btn gradient-btn-1 relative">
                        Create Account
                    </Button>
                    </form>
                </Form>
                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href={`/login${next ? `?next=${next}` : ''}`} className="font-semibold text-primary hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    </div>
  );
}
