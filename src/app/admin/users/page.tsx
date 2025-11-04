
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Users, ArrowLeft, ChevronRight, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

const providerColor: { [key: string]: string } = {
  'google.com': 'bg-red-500/20 text-red-400 border-red-500/50',
  'facebook.com': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  'password': 'bg-gray-500/20 text-gray-400 border-gray-500/50',
}

export default function UsersPage() {
    const firestore = useFirestore();
    const router = useRouter();
    
    // Correctly query the 'users' collection. This collection should contain all user documents.
    const usersQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'users'), orderBy('displayName')) : null, 
        [firestore]
    );
    const { data: users, isLoading } = useCollection(usersQuery);

    const getProviderBadge = (user: any) => {
        const providerId = user.providerData?.[0]?.providerId || 'password';
        return <Badge variant="outline" className={cn(providerColor[providerId] || providerColor['password'])}>{providerId.split('.')[0]}</Badge>
    }
    
    const handleRowClick = (userId: string) => {
        router.push(`/admin/users/${userId}`);
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center gap-2"><Users /> All Users ({users?.length || 0})</h1>
                </div>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Registered Users</CardTitle>
                        <CardDescription>A list of all users who have created an account. Click a user to view details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Provider</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">
                                            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                                        </TableCell>
                                    </TableRow>
                                ) : users && users.length > 0 ? (
                                    users.map((user) => (
                                        <TableRow key={user.id} onClick={() => handleRowClick(user.id)} className="cursor-pointer">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName} />
                                                        <AvatarFallback>{user.displayName?.[0] || <User className="h-5 w-5" />}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{user.displayName || 'No Name'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                {getProviderBadge(user)}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {user.metadata?.creationTime ? formatDistanceToNow(new Date(user.metadata.creationTime), { addSuffix: true }) : 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
