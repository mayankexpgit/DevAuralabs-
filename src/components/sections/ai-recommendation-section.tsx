import AiRecommendationForm from "@/components/ai-recommendation-form";

export default function AiRecommendationSection() {
    return (
        <section id="ai-recommendation" className="py-12 md:py-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight glowing-text">AI-Powered Recommendations</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Not sure where to start? Let our AI guide you to the perfect course or skill path based on your interests and career goals.
                </p>
            </div>
            <div className="max-w-3xl mx-auto">
                <AiRecommendationForm />
            </div>
        </section>
    );
}
