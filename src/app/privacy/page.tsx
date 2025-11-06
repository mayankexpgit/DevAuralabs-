
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function PrivacyPage() {

  return (
    <div className="container mx-auto max-w-4xl py-20 px-4">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert lg:prose-lg max-w-none text-muted-foreground space-y-6">
            <p>We value your privacy and are committed to protecting your personal information.</p>
            
            <h3 className="text-xl font-bold text-foreground">Information We Collect</h3>
            <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-semibold">Personal Information:</span> Your name, email, phone number, and address when you register or make a purchase.</li>
                <li>Payment information is processed securely via Razorpay.</li>
                <li>Device and browser data to enhance the user experience.</li>
            </ul>

            <h3 className="text-xl font-bold text-foreground">How We Use Your Information</h3>
            <ul className="list-disc pl-5 space-y-2">
                <li>To process course enrollments and hardware orders.</li>
                <li>To communicate order updates, offers, and new courses.</li>
                <li>To improve our website, content, and services.</li>
            </ul>
            
            <p>We never sell or share your data with third parties, except as required by law or for payment processing.</p>
            <p>All payments are handled securely via Razorpay Payment Gateway.</p>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
