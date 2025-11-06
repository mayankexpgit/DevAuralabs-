
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  
  return (
    <div className="container mx-auto max-w-4xl py-20 px-4">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms & Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert lg:prose-lg max-w-none text-muted-foreground space-y-8">

            <section>
              <h2 className="text-2xl font-bold text-foreground">Introduction</h2>
              <p>Welcome to DevAura Labs (“we”, “our”, “us”). Our endeavor is to offer world-class Cybersecurity Courses, Skill Development Programs, and Certified Hardware Devices that would help learners and professionals enrich their technical capabilities.</p>
              <p>By using or accessing our website (www.devauralabs.xyz), you accept the following policies, terms, and conditions.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">Refund & Cancellation Policy</h2>
              <h3 className="text-xl font-bold text-foreground mt-4">For Courses and Skill Programs:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>No refund will be made once a course has been purchased and access is provided to it.</li>
                <li>In case of a double payment or technical glitch, kindly get in touch with us within 7 working days for resolution.</li>
              </ul>
              <h3 className="text-xl font-bold text-foreground mt-4">Hardware Devices:</h3>
              <ul className="list-disc pl-5 space-y-2">
                  <li>Refunds or replacements are available only for defective or damaged products reported within 7 days of delivery.</li>
                  <li>Initiate a return by sending an email with proof of purchase, along with product images.</li>
                  <li>Returning goods may be at the expense of the customer unless the product is defective.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">Terms & Conditions</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>All contents, materials, and videos of this course are the intellectual property of DevAura Labs and must not be shared or resold. Unauthorized distribution or reproduction of course content will result in legal action.</li>
                <li>Hardware device specifications and availability are subject to change without prior notice.</li>
                <li>DevAura Labs reserves the right to modify or discontinue courses or products at any time.</li>
              </ul>
              <p className="mt-4">By continuing to utilize our website, you hereby acknowledge that you have read, understood, and agreed to these terms.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-foreground">Payment Policy</h2>
               <ul className="list-disc pl-5 space-y-2">
                  <li>We use Razorpay as our trusted payment partner.</li>
                  <li>Your financial data is handled with advanced security and encryption measures.</li>
                  <li>The accepted modes of payment are Credit/Debit Cards, UPI, Net Banking, and Wallets.</li>
               </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">Disclaimer</h2>
              <p>DevAura Labs is an independent education and technology platform. While we work to provide accurate and timely training, we cannot be held responsible for career, financial, or business decisions you make based on information supplied in our content.</p>
            </section>

             <section>
              <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
              <p>For questions, refunds, or concerns, please reach out to:</p>
               <div className="not-prose text-muted-foreground mt-4 space-y-2 p-4 border border-muted rounded-lg">
                <p><span className="font-semibold text-foreground">DevAura Labs</span></p>
                <p><strong>Email:</strong> support@devauralabs.xyz</p>
                <p><strong>Phone:</strong> +91-62078-85443</p>
                <p><strong>Business Hours:</strong> Monday – Saturday (10:00 AM – 6:00 PM)</p>
              </div>
            </section>

            <p className="text-center pt-8">&copy; {new Date().getFullYear()} DevAura Labs. All Rights Reserved.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
