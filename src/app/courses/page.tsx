import CoursesSection from "@/components/sections/courses-section";

export default function CoursesPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="text-center mt-12 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Our Courses</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our full catalog of courses and start your journey to mastery.
        </p>
      </div>
      <CoursesSection />
    </div>
  );
}
