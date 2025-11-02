
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/server';

// This file is now deprecated and data is fetched from Firestore.
// The initial data has been seeded into the 'showcase' collection.

export const showcaseImages = [
  {
    id: 'showcase-app-dev',
    alt: 'App Development',
    url: 'https://i.ibb.co/gFdWxx65/1000496340-removebg-preview.png',
  },
  {
    id: 'showcase-cybersecurity',
    alt: 'Cybersecurity',
    url: 'https://i.ibb.co/sdF55N83/IMG-20251031-123738.jpg',
  },
  {
    id: 'showcase-web-dev',
    alt: 'Web Development',
    url: 'https://i.ibb.co/DDtWW3zw/1000496339-removebg-preview.png',
  },
  {
    id: 'showcase-engagement-skill',
    alt: 'Engagement Skill',
    url: 'https://i.ibb.co/BHBKP0Xm/Adobe-Express-file.png',
  },
];


// One-time script to seed data into Firestore.
// This can be removed or commented out after first run.
async function seedShowcaseData() {
    const { firestore } = initializeFirebase();
    const showcaseCollection = collection(firestore, 'showcase');
    const snapshot = await getDocs(showcaseCollection);
    if (snapshot.empty) {
        console.log('Seeding showcase data...');
        for (const item of showcaseImages) {
            // Firestore will auto-generate an ID, we don't need the 'id' field.
            const { id, ...dataToSave } = item;
            await addDoc(showcaseCollection, dataToSave);
        }
        console.log('Showcase data seeded successfully.');
    } else {
        console.log('Showcase data already exists. Skipping seed.');
    }
}

// You can run this seed function if needed, for example, in a separate script
// or a development-only server-side component. For simplicity here, we'll
// assume it's run manually or the collection is populated via the new UI.
// seedShowcaseData();
