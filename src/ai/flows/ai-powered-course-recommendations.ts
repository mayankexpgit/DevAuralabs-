'use server';

/**
 * @fileOverview Provides AI-powered course recommendations based on user interests and goals.
 *
 * - aiPoweredCourseRecommendations - A function that returns personalized course recommendations.
 * - AIPoweredCourseRecommendationsInput - The input type for the aiPoweredCourseRecommendations function.
 * - AIPoweredCourseRecommendationsOutput - The return type for the aiPoweredCourseRecommendations function.
 */

import {ai} from '@/ai/genkit';
import { getCourses, getSkills } from '@/ai/tools/get-data';
import {z} from 'genkit';

const AIPoweredCourseRecommendationsInputSchema = z.object({
  message: z.string().describe("The user's message or query."),
});
export type AIPoweredCourseRecommendationsInput = z.infer<
  typeof AIPoweredCourseRecommendationsInputSchema
>;

const AIPoweredCourseRecommendationsOutputSchema = z.object({
  courseRecommendations: z
    .string()
    .describe(
      "A helpful, conversational response that provides course recommendations if relevant to the user's message."
    ),
});
export type AIPoweredCourseRecommendationsOutput = z.infer<
  typeof AIPoweredCourseRecommendationsOutputSchema
>;

export async function aiPoweredCourseRecommendations(
  input: AIPoweredCourseRecommendationsInput
): Promise<AIPoweredCourseRecommendationsOutput> {
  return aiPoweredCourseRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredCourseRecommendationsPrompt',
  input: {schema: AIPoweredCourseRecommendationsInputSchema},
  output: {schema: AIPoweredCourseRecommendationsOutputSchema},
  tools: [getCourses, getSkills],
  prompt: `You are Aura, an AI assistant for DevAura Labs, a platform for cybersecurity courses, skill development programs, and web development services. Be friendly, conversational, and exceptionally helpful.

Your primary goal is to assist users by providing detailed information and personalized recommendations about DevAura Labs' offerings.

You have access to the following tools:
- \`getCourses\`: Use this tool to retrieve a list of all available cybersecurity courses.
- \`getSkills\`: Use this tool to retrieve a list of all available skill development programs.

Website Knowledge Base:
- **Offerings**: DevAura Labs provides:
  1.  **Cybersecurity Courses**: Expert-led courses on topics like ethical hacking, network security, and cloud security.
  2.  **Skill Development Programs**: Programs to boost careers in areas like full-stack development, AI/ML, and UI/UX design.
  3.  **Website Creation Services**: Custom website building services for businesses and individuals.
- **Audience**: The platform is for anyone looking to start or advance a career in tech, from beginners to advanced professionals.
- **Your Role**: As Aura, you should be proactive. If a user asks a general question about learning a new skill, use your tools to see if DevAura Labs offers a relevant course or program and recommend it. If a user asks about services, describe the website creation service.

Interaction Flow:
1.  Analyze the user's message to understand their intent.
2.  If their query is about learning, courses, or skills, use the \`getCourses\` or \`getSkills\` tools to get up-to-date information from the database.
3.  Formulate a helpful, conversational response that integrates the information you've retrieved. Include course/skill titles, descriptions, and prices.
4.  If the query is about building a website, describe the "Website Creation Service" and suggest they fill out the form on the services page.
5.  If the user's message is not related to the platform's offerings (e.g., asking for the weather), provide a friendly, polite response indicating that you are an assistant for DevAura Labs and can only help with questions about their offerings.

User's message: {{{message}}}

Your response:`,
});

const aiPoweredCourseRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiPoweredCourseRecommendationsFlow',
    inputSchema: AIPoweredCourseRecommendationsInputSchema,
    outputSchema: AIPoweredCourseRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
