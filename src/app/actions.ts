
'use server';

import { aiPoweredCourseRecommendations, AIPoweredCourseRecommendationsInput } from '@/ai/flows/ai-powered-course-recommendations';
import Razorpay from 'razorpay';
import { randomBytes } from 'crypto';
import { initializeFirebase } from '@/firebase/server';
import { collection, query, where, getDocs, doc, getDoc, runTransaction } from 'firebase/firestore';

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

export async function applyPromoCode(code: string, userId: string): Promise<{ success: boolean; discount?: number; message: string, codeId?: string }> {
    if (!code) {
        return { success: false, message: 'Please enter a promo code.' };
    }

    const { firestore } = initializeFirebase();
    const promoCodesRef = collection(firestore, 'promo_codes');
    const q = query(promoCodesRef, where('code', '==', code.toUpperCase()));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return { success: false, message: 'Invalid promo code.' };
    }

    const promoDoc = querySnapshot.docs[0];
    const promoData = promoDoc.data();

    if (!promoData.isActive) {
        return { success: false, message: 'This promo code is no longer active.' };
    }

    const redemptionsRef = collection(firestore, `promo_codes/${promoDoc.id}/redemptions`);
    
    // Check total redemptions
    const redemptionsSnapshot = await getDocs(redemptionsRef);
    if (redemptionsSnapshot.size >= promoData.limit) {
        return { success: false, message: 'This promo code has reached its usage limit.' };
    }

    // Check if user has already redeemed
    const userRedemptionRef = doc(redemptionsRef, userId);
    const userRedemptionSnap = await getDoc(userRedemptionRef);
    if (userRedemptionSnap.exists()) {
        return { success: false, message: 'You have already used this promo code.' };
    }

    return {
        success: true,
        discount: promoData.discount,
        message: `Success! ${promoData.discount}% discount applied.`,
        codeId: promoDoc.id,
    };
}


export async function recordPromoCodeRedemption(promoCodeId: string, userId: string) {
    if (!promoCodeId || !userId) {
        console.error('Promo code ID or User ID is missing.');
        return { success: false, message: 'Failed to record redemption: Missing information.' };
    }
    const { firestore } = initializeFirebase();
    const redemptionRef = doc(firestore, 'promo_codes', promoCodeId, 'redemptions', userId);

    try {
        await runTransaction(firestore, async (transaction) => {
            const redemptionSnap = await transaction.get(redemptionRef);
            if (redemptionSnap.exists()) {
                // User has already redeemed it, maybe in a race condition.
                console.log(`User ${userId} already redeemed code ${promoCodeId}.`);
                return;
            }
            transaction.set(redemptionRef, {
                userId: userId,
                redemptionDate: new Date(),
            });
        });
        return { success: true, message: 'Redemption recorded.' };
    } catch (error) {
        console.error('Failed to record promo code redemption:', error);
        return { success: false, message: 'An error occurred while recording the redemption.' };
    }
}
