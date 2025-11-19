import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Edit, KeyRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'wouter';
import type { User } from '@shared/schema';

export function AdminStudentsList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId;

  const { data: students = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/schools', schoolId, 'students'],
    enabled: !!schoolId,
  });

  const [studentForm, setStudentForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const createStudentMutation = useMutation({
    mutationFn: async (data: typeof studentForm) => {
      return await apiRequest('POST', `/api/schools/${schoolId}/students`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schools', schoolId, 'students'] });
      toast({ title: 'Success', description: 'Student created successfully' });
      setStudentForm({ username: '', email: '', password: '', firstName: '', lastName: '' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to create student', variant: 'destructive' });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" data-testid="heading-students">Students</h2>
        <p className="text-slate-600" data-testid="text-subtitle">Manage tech team students</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card data-testid="card-create-student">
          <CardHeader>
            <CardTitle>Add New Student</CardTitle>
            <CardDescription>Create a student account for your tech team</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); createStudentMutation.mutate(studentForm); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  data-testid="input-username"
                  value={studentForm.username}
                  onChange={(e) => setStudentForm({ ...studentForm, username: e.target.value })}
                  placeholder="jane.smith"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  data-testid="input-email"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  placeholder="jane.smith@student.edu"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  data-testid="input-password"
                  value={studentForm.password}
                  onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    data-testid="input-first-name"
                    value={studentForm.firstName}
                    onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
                    placeholder="Jane"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    data-testid="input-last-name"
                    value={studentForm.lastName}
                    onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })}
                    placeholder="Smith"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createStudentMutation.isPending} data-testid="button-create-student">
                <UserPlus className="h-4 w-4 mr-2" />
                {createStudentMutation.isPending ? 'Creating...' : 'Add Student'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card data-testid="card-students-list">
          <CardHeader>
            <CardTitle>Tech Team Students ({students.length})</CardTitle>
            <CardDescription>Click on a student to view details</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground text-center py-4" data-testid="text-loading">Loading students...</p>
            ) : students.length === 0 ? (
              <p className="text-muted-foreground text-center py-4" data-testid="text-no-students">No students yet. Add your first student!</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {students.map((student) => (
                  <Link key={student.id} href={`/admin/students/${student.id}`}>
                    <div className="p-3 border rounded-md hover-elevate cursor-pointer" data-testid={`student-item-${student.id}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium" data-testid={`student-name-${student.id}`}>
                            {student.lastName && student.firstName ? `${student.lastName}, ${student.firstName}` : student.username}
                          </p>
                          <p className="text-sm text-muted-foreground" data-testid={`student-email-${student.id}`}>{student.email}</p>
                          <p className="text-xs text-muted-foreground" data-testid={`student-points-${student.id}`}>{student.points} points</p>
                        </div>
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
