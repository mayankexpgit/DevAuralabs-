
'use server';

import { aiPoweredCourseRecommendations, AIPoweredCourseRecommendationsInput } from '@/ai/flows/ai-powered-course-recommendations';
import Razorpay from 'razorpay';
import { randomBytes } from 'crypto';
import { initializeFirebase } from '@/firebase/server';
import { collection, query, where, getDocs, doc, getDoc, runTransaction, serverTimestamp, addDoc, setDoc, Timestamp } from 'firebase/firestore';

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
    const isProduction = process.env.NODE_ENV === 'production';
    const keyId = isProduction ? process.env.RAZORPAY_KEY_ID : process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID_TEST;
    const keySecret = isProduction ? process.env.RAZORPAY_KEY_SECRET : process.env.RAZORPAY_KEY_SECRET_TEST;

    if (!keyId || !keySecret) {
        console.error('Razorpay API keys not configured for mode:', isProduction ? 'Live' : 'Test');
        return { success: false, error: 'Payment service is not configured. Please contact support.' };
    }

    const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });
    
    const amountInSmallestUnit = Math.round(amount * 100);

    if (amountInSmallestUnit < 100 && currency === 'INR') { // Minimum 1 INR
        console.error('Order amount is too low:', amountInSmallestUnit);
        return { success: false, error: 'The final amount is too low to process the payment.' };
    }

    const options = {
        amount: amountInSmallestUnit,
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
    
    if (userId === 'demo_user') {
        const totalRedemptionsSnapshot = await getDocs(collection(firestore, `promo_codes/${promoDoc.id}/redemptions`));
        if (totalRedemptionsSnapshot.size >= promoData.limit) {
            return { success: false, message: 'This promo code has reached its usage limit.' };
        }
        return {
            success: true,
            discount: promoData.discount,
            message: `Success! ${promoData.discount}% discount applied.`,
            codeId: promoDoc.id,
        };
    }

    const redemptionsRef = collection(firestore, `promo_codes/${promoDoc.id}/redemptions`);
    
    const redemptionsSnapshot = await getDocs(redemptionsRef);
    if (redemptionsSnapshot.size >= promoData.limit) {
        return { success: false, message: 'This promo code has reached its usage limit.' };
    }

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
     if (userId === 'demo_user') {
        console.log('Skipping redemption recording for demo user.');
        return { success: true, message: 'Demo redemption not recorded.' };
    }
    const { firestore } = initializeFirebase();
    const redemptionRef = doc(firestore, 'promo_codes', promoCodeId, 'redemptions', userId);

    try {
        await runTransaction(firestore, async (transaction) => {
            const redemptionSnap = await transaction.get(redemptionRef);
            if (redemptionSnap.exists()) {
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

export async function enrollUserInContent(userId: string, contentId: string, contentType: 'course' | 'skill') {
    if (!userId || !contentId || !contentType) {
        return { success: false, message: 'Missing required information for enrollment.' };
    }
    
    if (userId === 'demo_user') {
        console.log('Skipping enrollment for demo user.');
        return { success: true, message: 'Enrollment skipped for demo user.' };
    }

    const { firestore } = initializeFirebase();
    const enrollmentRef = doc(firestore, `users/${userId}/enrollments`, contentId);

    const newEnrollment = {
        userId: userId,
        [`${contentType}Id`]: contentId,
        type: contentType,
        enrollmentDate: serverTimestamp(),
        progress: 0,
    };

    try {
        await setDoc(enrollmentRef, newEnrollment);
        return { success: true, message: 'Enrollment successful.' };
    } catch (error) {
        console.error('Error creating enrollment:', error);
        return { success: false, message: 'Failed to enroll user.' };
    }
}

export async function getClassDetails(contentId: string, contentType: 'courses' | 'skills', userId: string) {
    const { firestore } = initializeFirebase();

    // 1. Check if user is admin
    const adminRef = doc(firestore, 'privates', userId);
    const adminSnap = await getDoc(adminRef);
    const isAdmin = adminSnap.exists();

    // 2. Check for enrollment if not admin
    let isEnrolled = false;
    if (!isAdmin) {
        const enrollmentRef = doc(firestore, 'users', userId, 'enrollments', contentId);
        const enrollmentSnap = await getDoc(enrollmentRef);
        isEnrolled = enrollmentSnap.exists();
    }

    // 3. If not admin and not enrolled, deny access
    if (!isAdmin && !isEnrolled) {
        return { success: false, error: 'You are not enrolled in this content.' };
    }

    // 4. Fetch class details if authorized
    try {
        const classDetailsRef = doc(firestore, contentType, contentId, 'classDetails', 'details');
        const classDetailsSnap = await getDoc(classDetailsRef);

        if (!classDetailsSnap.exists()) {
            return { success: true, data: null }; // No details found, but access is allowed
        }

        const data = classDetailsSnap.data();
         // Serialize Timestamps
        const serializableData = { ...data };
        if (serializableData.liveClassTime instanceof Timestamp) {
            serializableData.liveClassTime = serializableData.liveClassTime.toDate().toISOString();
        }

        return { success: true, data: serializableData };

    } catch (error) {
        console.error('Error fetching class details:', error);
        return { success: false, error: 'Failed to fetch class details.' };
    }
}
