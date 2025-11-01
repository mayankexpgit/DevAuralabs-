
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Edit, Trash2 } from 'lucide-react';
import { useCurrency } from '@/context/currency-context';
import Link from 'next/link';

export default function ContentListPage() {
  const firestore = useFirestore();
  const { getConvertedPrice } = useCurrency();

  const coursesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'courses') : null, [firestore]);
  const { data: courses, isLoading: coursesLoading } = useCollection(coursesQuery);

  const skillsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'skills') : null, [firestore]);
  const { data: skills, isLoading: skillsLoading } = useCollection(skillsQuery);

  const handleDelete = (collection: string, id: string) => {
    // In a real app, you would add logic to delete the document from Firestore.
    console.log(`Deleting document with ID ${id} from ${collection}`);
    alert(`Delete functionality not implemented yet. (ID: ${id})`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Platform Content</h1>
        <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-destructive"
                        onClick={() => handleDelete('courses', course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-destructive"
                        onClick={() => handleDelete('skills', skill.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
    </div>
  );
}
