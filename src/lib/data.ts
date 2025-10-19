import { ShieldCheck, Code, Bot, Palette } from 'lucide-react';

export const courses = [
  {
    id: 'c1',
    title: 'Ethical Hacking Pro',
    icon: ShieldCheck,
    rating: 4.8,
    level: 'Intermediate',
    price: 199.99,
    description: 'Learn to hack systems like a pro and secure them like an expert.',
    image: 'course-1',
  },
  {
    id: 'c2',
    title: 'Network Security Fundamentals',
    icon: ShieldCheck,
    rating: 4.9,
    level: 'Beginner',
    price: 149.99,
    description: 'Master the fundamentals of network security and defense mechanisms.',
    image: 'course-2',
  },
  {
    id: 'c3',
    title: 'Advanced Cloud Security',
    icon: ShieldCheck,
    rating: 4.7,
    level: 'Advanced',
    price: 249.99,
    description: 'Secure cloud infrastructure and applications on AWS, Azure, and GCP.',
    image: 'course-3',
  },
  {
    id: 'c4',
    title: 'Reverse Engineering & Malware Analysis',
    icon: ShieldCheck,
    rating: 4.8,
    level: 'Advanced',
    price: 299.99,
    description: 'Dive deep into malware analysis and reverse engineering techniques.',
    image: 'course-4',
  },
];

export const skills = [
  {
    id: 's1',
    title: 'Full-Stack Web Development',
    icon: Code,
    progress: 75,
    description: 'Become a full-stack developer with React, Node.js, and more.',
    image: 'skill-1',
  },
  {
    id: 's2',
    title: 'AI & Machine Learning Engineer',
    icon: Bot,
    progress: 60,
    description: 'Dive into the world of AI, data science, and machine learning.',
    image: 'skill-2',
  },
  {
    id: 's3',
    title: 'UI/UX Design Mastery',
    icon: Palette,
    progress: 90,
    description: 'Create stunning and user-friendly interfaces from scratch.',
    image: 'skill-3',
  },
];
