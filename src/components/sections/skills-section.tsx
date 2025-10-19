import { skills } from '@/lib/data';
import SkillCard from '@/components/skill-card';

export default function SkillsSection() {
  return (
    <section id="skills" className="py-12 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Skill Development Programs</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          From coding and web development to AI, we have the right program to boost your career.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    </section>
  );
}
