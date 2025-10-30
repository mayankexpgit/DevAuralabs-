'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Wand2 } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getCourseRecommendations } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RippleButton } from './ui/ripple-button';

const formSchema = z.object({
  interests: z.string().min(10, 'Please describe your interests in at least 10 characters.'),
  goals: z.string().min(10, 'Please describe your goals in at least 10 characters.'),
});

type FormData = z.infer<typeof formSchema>;

export default function AiRecommendationForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: '',
      goals: '',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setRecommendations(null);
    const result = await getCourseRecommendations(values);
    setIsLoading(false);

    if (result.success && result.data) {
      setRecommendations(result.data.courseRecommendations);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to get recommendations.',
      });
    }
  }

  return (
    <div className="glass-card p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Your Interests</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., ethical hacking, cloud security, web development..."
                    className="resize-none bg-background/50 h-28"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="goals"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Your Goals</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., become a penetration tester, get certified in AWS security..."
                    className="resize-none bg-background/50 h-28"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <RippleButton type="submit" className="w-full gradient-btn gradient-btn-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Get Recommendations
              </>
            )}
          </RippleButton>
        </form>
      </Form>
      {recommendations && (
        <Card className="mt-8 bg-transparent border-primary/20">
          <CardHeader>
            <CardTitle>Recommended For You</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-foreground">{recommendations}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
