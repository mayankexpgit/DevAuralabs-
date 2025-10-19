'use server';

import { aiPoweredCourseRecommendations, AIPoweredCourseRecommendationsInput } from '@/ai/flows/ai-powered-course-recommendations';

export async function getCourseRecommendations(input: AIPoweredCourseRecommendationsInput) {
    try {
        const result = await aiPoweredCourseRecommendations(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to get recommendations. Please try again.' };
    }
}
