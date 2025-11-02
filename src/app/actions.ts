'use server';

import { aiPoweredCourseRecommendations, AIPoweredCourseRecommendationsInput } from '@/ai/flows/ai-powered-course-recommendations';
import Razorpay from 'razorpay';
import { randomBytes } from 'crypto';

export async function getCourseRecommendations(input: AIPoweredCourseRecommendationsInput) {
    try {
        const result = await aiPoweredCourseRecommendations(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to get recommendations. Please try again.' };
    }
}

export async function createRazorpayOrder(amount: number, currency: string) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay API keys are not configured.');
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: amount * 100, // amount in the smallest currency unit
        currency,
        receipt: `receipt_order_${randomBytes(10).toString('hex')}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        return { success: true, order };
    } catch (error) {
        console.error('Razorpay order creation failed:', error);
        return { success: false, error: 'Failed to create payment order.' };
    }
}
