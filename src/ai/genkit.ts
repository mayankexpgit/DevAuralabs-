import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {getNextApiKey} from './api-key-manager';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: getNextApiKey,
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
