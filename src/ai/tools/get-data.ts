'use server';
/**
 * @fileOverview Genkit tools for retrieving data from the database.
 *
 * - getCourses - Retrieves a list of all available cybersecurity courses.
 * - getSkills - Retrieves a list of all available skill development programs.
 */

import { ai } from '@/ai/genkit';
import { courses, skills } from '@/lib/data';
import { z } from 'zod';

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
            })
        ),
    },
    async () => {
        // In a real app, you would fetch this from a database.
        // For now, we'll return the static data.
        return courses.map(({ id, title, level, price, description }) => ({ id, title, level, price, description }));
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
            })
        ),
    },
    async () => {
        // In a real app, you would fetch this from a database.
        // For now, we'll return the static data.
        return skills.map(({ id, title, progress, description }) => ({ id, title, progress, description }));
    }
);
