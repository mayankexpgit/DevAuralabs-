
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

export default function PrivacyPage() {
  const firestore = useFirestore();
  const contentRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'content') : null, [firestore]);
  const { data: contentData, isLoading } = useDoc(contentRef);

  const getRenderedHTML = (markdown: string | undefined) => {
    if (!markdown) return '';
    const dirtyHtml = marked.parse(markdown);
    const cleanHtml = DOMPurify.sanitize(dirtyHtml);
    return cleanHtml;
  }

  return (
    <div className="container mx-auto max-w-4xl py-20 px-4">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
           {isLoading ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
          ) : (
            <div 
              className="prose prose-invert lg:prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: getRenderedHTML(contentData?.privacyContent) }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
