import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="relative w-full h-[80vh] min-h-[500px] flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 hero-bg z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />

      <div className="container relative z-20 px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
          Master. Build. Secure.
        </h1>
        <p className="text-xl md:text-2xl font-bold mb-8 glowing-text">
          All in One Platform.
        </p>
        <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl mb-12">
          DevAura Labs is your all-in-one platform for e-commerce learning and services, specializing in Cybersecurity, Skill Development, and Website Creation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/courses">
            <Button size="lg" className="gradient-btn gradient-btn-1 w-full sm:w-auto">
              Start Learning
            </Button>
          </Link>
          <Link href="/services">
            <Button size="lg" className="gradient-btn gradient-btn-2 w-full sm:w-auto">
              Hire Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
