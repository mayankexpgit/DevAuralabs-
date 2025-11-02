'use client';

import HeroSection from '@/components/sections/hero';
import CoursesSection from '@/components/sections/courses-section';
import SkillsSection from '@/components/sections/skills-section';
import ServicesSection from '@/components/sections/services-section';
import { Separator } from '@/components/ui/separator';
import FloatingAiButton from '@/components/floating-ai-button';
import Footer from '@/components/layout/footer';
import ShowcaseSection from '@/components/sections/showcase-section';
import AdminFAB from '@/components/admin-fab';
import { useAdmin } from '@/context/admin-context';
import { useDemoUser } from '@/context/demo-user-context';

export default function Home() {
  const { isAdmin } = useAdmin();
  const { isDemoMode } = useDemoUser();

  return (
    <div className="flex flex-col">
      <HeroSection />
      <div className="relative z-20 -mt-24 md:-mt-40">
        <div className="md:pr-8">
          <ShowcaseSection />
        </div>
      </div>
      <div className="container mx-auto px-4">
        <CoursesSection />
        <Separator className="my-12 md:my-24 bg-white/10" />
        <SkillsSection />
        <Separator className="my-12 md:my-24 bg-white/10" />
        <ServicesSection />
      </div>
      {isAdmin && !isDemoMode && <AdminFAB />}
      <FloatingAiButton />
      <Footer />
    </div>
  );
}
