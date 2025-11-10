
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Users, BookOpen, Award, Cpu, DollarSign, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

export default function AnalyticsPage() {
    const firestore = useFirestore();

    const usersQuery = useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]);
    const { data: users, isLoading: usersLoading } = useCollection(usersQuery);

    const coursesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'courses') : null, [firestore]);
    const { data: courses, isLoading: coursesLoading } = useCollection(coursesQuery);

    const skillsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'skills') : null, [firestore]);
    const { data: skills, isLoading: skillsLoading } = useCollection(skillsQuery);

    const hardwareQuery = useMemoFirebase(() => firestore ? collection(firestore, 'hardware') : null, [firestore]);
    const { data: hardware, isLoading: hardwareLoading } = useCollection(hardwareQuery);
    
    const isLoading = usersLoading || coursesLoading || skillsLoading || hardwareLoading;

    const totalCourses = courses?.length || 0;
    const totalSkills = skills?.length || 0;
    const totalHardware = hardware?.length || 0;
    
    const contentData = [
        { name: 'Courses', count: totalCourses, fill: 'hsl(var(--primary))' },
        { name: 'Skills', count: totalSkills, fill: 'hsl(var(--secondary))' },
        { name: 'Hardware', count: totalHardware, fill: 'hsl(var(--aura-green))' },
    ];
    
    const chartConfig = {
        count: {
            label: 'Count',
        },
        courses: {
            label: 'Courses',
            color: 'hsl(var(--chart-1))',
        },
        skills: {
            label: 'Skills',
            color: 'hsl(var(--chart-2))',
        },
        hardware: {
            label: 'Hardware',
            color: 'hsl(var(--chart-3))',
        },
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Platform Analytics</h1>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Registered users on the platform</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCourses}</div>
                         <p className="text-xs text-muted-foreground">Available courses for enrollment</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSkills}</div>
                        <p className="text-xs text-muted-foreground">Available skill programs</p>
                    </CardContent>
                </Card>
                 <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Hardware</CardTitle>
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalHardware}</div>
                        <p className="text-xs text-muted-foreground">Hardware products in store</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Content Overview</CardTitle>
                    <CardDescription>A summary of all content available on the platform.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={contentData}>
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="count" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

        </div>
    );
}
