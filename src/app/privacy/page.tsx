
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export default function PrivacyPage() {
  const firestore = useFirestore();
  const contentRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'content') : null, [firestore]);
  const { data: contentData, isLoading } = useDoc(contentRef);
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  const privacyContent = contentData?.privacyContent || `
    Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.

    1.  **Information Collection:** We collect information you provide directly to us, such as when you create an account or contact us.
    2.  **Information Use:** We use your information to provide and improve our services, and to communicate with you.
    3.  **Data Sharing:** We do not share your personal information with third parties except as required by law.
    4.  **Security:** We take reasonable measures to protect your information from unauthorized access.
  `;

  return (
    <div className="container mx-auto max-w-4xl py-20 px-4">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert lg:prose-lg max-w-none text-muted-foreground">
            <p className="whitespace-pre-wrap">{privacyContent}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
