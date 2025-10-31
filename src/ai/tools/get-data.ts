'use server';
/**
 * @fileOverview Genkit tools for retrieving data from the database.
 *
 * - getCourses - Retrieves a list of all available cybersecurity courses.
 * - getSkills - Retrieves a list of all available skill development programs.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function getCollectionData(collectionName: string) {
    const { firestore } = initializeFirebase();
    const collectionRef = collection(firestore, collectionName);
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

export const getCourses = ai.defineTool(
    {
        name: 'getCourses',
        description: 'Get a list of available cybersecurity courses.',
        inputSchema: z.object({}),
        outputSchema: z.array(
            z.object({
                id: z.string(),
                title: z.string(),
                level: z.string(),
                price: z.number(),
                description: z.string(),
                image: z.string(),
                icon: z.string(),
            })
        ),
    },
    async () => {
        const courses = await getCollectionData('courses');
        return courses.map(({ id, title, level, price, description, image, icon }: any) => ({ id, title, level, price, description, image, icon }));
    }
);

export const getSkills = ai.defineTool(
    {
        name: 'getSkills',
        description: 'Get a list of available skill development programs.',
        inputSchema: z.object({}),
        outputSchema: z.array(
            z.object({
                id: z.string(),
                title: z.string(),
                progress: z.number(),
                description: z.string(),
                image: z.string(),
                icon: z.string(),
            })
        ),
    },
    async () => {
        const skills = await getCollectionData('skills');
        return skills.map(({ id, title, progress, description, image, icon }: any) => ({ id, title, progress, description, image, icon }));
    }
);
