
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { Edit, Trash2, Video } from 'lucide-react';
import { useCurrency } from '@/context/currency-context';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function ContentListPage() {
  const firestore = useFirestore();
  const { getConvertedPrice } = useCurrency();
  const { toast } = useToast();

  const [itemToDelete, setItemToDelete] = useState<{ collection: string; id: string; title: string } | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [deletedItemTitle, setDeletedItemTitle] = useState('');

  const coursesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'courses') : null, [firestore]);
  const { data: courses, isLoading: coursesLoading } = useCollection(coursesQuery);

  const skillsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'skills') : null, [firestore]);
  const { data: skills, isLoading: skillsLoading } = useCollection(skillsQuery);

  const handleDelete = async () => {
    if (!itemToDelete || !firestore) return;

    try {
      await deleteDoc(doc(firestore, itemToDelete.collection, itemToDelete.id));
      setDeletedItemTitle(itemToDelete.title);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error(`Error deleting document:`, error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete the item. Please try again.',
      });
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Platform Content</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <AlertDialog>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Courses</CardTitle>
            <CardDescription>List of all available courses on the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Title</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coursesLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center">Loading courses...</TableCell></TableRow>
                ) : courses && courses.length > 0 ? (
                  courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.level}</TableCell>
                      <TableCell>{getConvertedPrice(course.price)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/edit-course/${course.id}`}>
                          <Button variant="ghost" size="icon" className="hover:text-primary">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-destructive"
                            onClick={() => setItemToDelete({ collection: 'courses', id: course.id, title: course.title })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={4} className="text-center">No courses found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Skill Programs</CardTitle>
            <CardDescription>List of all available skill development programs.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skillsLoading ? (
                  <TableRow><TableCell colSpan={3} className="text-center">Loading skills...</TableCell></TableRow>
                ) : skills && skills.length > 0 ? (
                  skills.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell className="font-medium">{skill.title}</TableCell>
                      <TableCell>{getConvertedPrice(skill.price)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/edit-skill/${skill.id}`}>
                          <Button variant="ghost" size="icon" className="hover:text-primary">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-destructive"
                            onClick={() => setItemToDelete({ collection: 'skills', id: skill.id, title: skill.title })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={3} className="text-center">No skills found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Video /> Manage Classes</CardTitle>
                <CardDescription>Manage live and recorded class URLs for your courses and skill programs.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">This section will allow you to add and update class links for your content.</p>
                <Link href="/admin/manage-classes">
                    <Button variant="outline">Manage Class URLs</Button>
                </Link>
            </CardContent>
        </Card>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item
              <span className="font-bold"> "{itemToDelete?.title}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              The item "{deletedItemTitle}" has been successfully deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
