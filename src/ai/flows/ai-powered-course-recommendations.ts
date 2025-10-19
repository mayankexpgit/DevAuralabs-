'use server';

/**
 * @fileOverview Provides AI-powered course recommendations based on user interests and goals.
 *
 * - aiPoweredCourseRecommendations - A function that returns personalized course recommendations.
 * - AIPoweredCourseRecommendationsInput - The input type for the aiPoweredCourseRecommendations function.
 * - AIPoweredCourseRecommendationsOutput - The return type for the aiPoweredCourseRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPoweredCourseRecommendationsInputSchema = z.object({
  interests: z
    .string()
    .describe('The users interests related to cybersecurity and skill development.'),
  goals: z
    .string()
    .describe('The users goals for taking courses in cybersecurity and skill development.'),
});
export type AIPoweredCourseRecommendationsInput = z.infer<
  typeof AIPoweredCourseRecommendationsInputSchema
>;

const AIPoweredCourseRecommendationsOutputSchema = z.object({
  courseRecommendations: z
    .string()
    .describe(
      'A list of recommended courses based on the users interests and goals.'
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
  prompt: `You are an AI assistant designed to provide personalized course recommendations in cybersecurity and skill development.

  Based on the user's interests and goals, recommend relevant courses.

  Interests: {{{interests}}}
  Goals: {{{goals}}}

  Provide a list of courses that align with these interests and goals.
  Ensure the courses recommended match the users interests and goals closely.
  Courses Recommended:`,
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
