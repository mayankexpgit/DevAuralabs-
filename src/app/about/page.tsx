import { ShieldEllipsis } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-8">
            <ShieldEllipsis className="w-24 h-24 glowing-icon"/>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About DevAura Labs</h1>
        <div className="prose prose-invert lg:prose-xl mx-auto text-muted-foreground space-y-6">
            <p>
                At DevAura Labs, we stand at the intersection of education, technology, and security. Born from a passion for empowering individuals and businesses in the digital age, our mission is to provide an all-in-one platform for mastering critical tech skills and building secure, high-performance web solutions.
            </p>
            <p>
                Our team comprises industry veterans, cybersecurity experts, and seasoned developers dedicated to delivering cutting-edge courses and top-tier web creation services. We believe that knowledge is the ultimate defense and that a powerful online presence is essential for success.
            </p>
            <p>
                Whether you're looking to launch a career in cybersecurity, sharpen your development skills, or create a standout website for your business, DevAura Labs is your trusted partner. We are committed to fostering a community of learners and builders who are ready to shape the future of technology.
            </p>
            <p className="text-lg font-semibold text-foreground">
                Join us, and let&apos;s master, build, and secure the digital world together.
            </p>
        </div>
      </div>
    </div>
  );
}
