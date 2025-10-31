
import HeroSection from '@/components/sections/hero';
import CoursesSection from '@/components/sections/courses-section';
import SkillsSection from '@/components/sections/skills-section';
import ServicesSection from '@/components/sections/services-section';
import AiRecommendationSection from '@/components/sections/ai-recommendation-section';
import { Separator } from '@/components/ui/separator';
import FloatingAiButton from '@/components/floating-ai-button';
import Footer from '@/components/layout/footer';
import ShowcaseSection from '@/components/sections/showcase-section';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <div className="relative z-20 -mt-24">
        <ShowcaseSection />
      </div>
      <div className="container mx-auto px-4">
        <CoursesSection />
        <Separator className="my-12 md:my-24 bg-white/10" />
        <SkillsSection />
        <Separator className="my-12 md:my-24 bg-white/10" />
        <ServicesSection />
        <Separator className="my-12 md:my-24 bg-white/10" />
        <AiRecommendationSection />
      </div>
      <FloatingAiButton />
      <Footer />
    </div>
  );
}
