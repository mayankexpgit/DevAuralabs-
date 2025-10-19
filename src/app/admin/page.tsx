import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, BookOpen, BarChart } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const stats = [
  { title: 'Total Revenue', value: '$45,231.89', icon: DollarSign, change: '+20.1% from last month' },
  { title: 'Active Users', value: '+2350', icon: Users, change: '+180.1% from last month' },
  { title: 'Courses Sold', value: '+12,234', icon: BookOpen, change: '+19% from last month' },
  { title: 'Avg. Rating', value: '4.85', icon: BarChart, change: '+0.2 from last month' },
];

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
];

const recentCourses = [
  { id: 'C001', title: 'Ethical Hacking Pro', price: '$199.99', status: 'Published', sales: 1200 },
  { id: 'C002', title: 'Network Security', price: '$149.99', status: 'Published', sales: 2500 },
  { id: 'C003', title: 'Cloud Security', price: '$249.99', status: 'Draft', sales: 0 },
  { id: 'C004', title: 'AI & Machine Learning', price: '$299.99', status: 'Published', sales: 800 },
];

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 glass-card">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <RechartsBarChart data={salesData}>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}K`} />
                <Tooltip
                    contentStyle={{
                        background: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        color: "hsl(var(--foreground))"
                    }}
                    cursor={{fill: 'hsl(var(--primary)/0.1)'}}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 glass-card">
          <CardHeader>
            <CardTitle>Course Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCourses.map((course) => (
                  <TableRow key={course.id} className="border-white/10">
                    <TableCell>
                      <div className="font-medium">{course.title}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">{course.price}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={course.status === 'Published' ? 'default' : 'secondary'} className={course.status === 'Published' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-muted text-muted-foreground'}>
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{course.sales}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button className="w-full mt-4" variant="outline">Manage All Courses</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
