import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Edit, KeyRound, Award, CheckCircle2, Clock } from 'lucide-react';
import { useState } from 'react';

export default function StudentDetail() {
  const { id: studentId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const schoolId = user?.schoolId;

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
  });
  const [newPassword, setNewPassword] = useState('');

  const { data: studentData, isLoading } = useQuery<any>({
    queryKey: ['/api/schools', schoolId, 'students', studentId, 'details'],
    queryFn: async () => {
      const response = await fetch(`/api/schools/${schoolId}/students/${studentId}/details`, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch student details');
      return response.json();
    },
    enabled: !!schoolId && !!studentId,
  });

  const updateStudentMutation = useMutation({
    mutationFn: async (data: typeof studentForm) => {
      return await apiRequest('PATCH', `/api/schools/${schoolId}/students/${studentId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schools', schoolId, 'students'] });
      queryClient.invalidateQueries({ queryKey: ['/api/schools', schoolId, 'students', studentId, 'details'] });
      toast({ title: 'Success', description: 'Student updated successfully' });
      setEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update student', variant: 'destructive' });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (newPassword: string) => {
      return await apiRequest('POST', `/api/schools/${schoolId}/students/${studentId}/reset-password`, { newPassword });
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Password reset successfully' });
      setPasswordDialogOpen(false);
      setNewPassword('');
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to reset password', variant: 'destructive' });
    },
  });

  const handleEditOpen = () => {
    if (studentData?.student) {
      setStudentForm({
        username: studentData.student.username || '',
        email: studentData.student.email || '',
        firstName: studentData.student.firstName || '',
        lastName: studentData.student.lastName || '',
      });
      setEditDialogOpen(true);
    }
  };

  if (isLoading) {
    return <div className="p-6" data-testid="text-loading">Loading student details...</div>;
  }

  if (!studentData) {
    return <div className="p-6" data-testid="text-not-found">Student not found</div>;
  }

  const { student, deviceChecks, repairs, learningModules, workLogs } = studentData;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold" data-testid="heading-student-name">
              {student.lastName && student.firstName ? `${student.lastName}, ${student.firstName}` : student.username}
            </h1>
            <p className="text-muted-foreground" data-testid="text-student-email">{student.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={handleEditOpen} data-testid="button-edit-student">
                <Edit className="h-4 w-4 mr-2" />
                Edit Info
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-edit-student">
              <DialogHeader>
                <DialogTitle>Edit Student Information</DialogTitle>
                <DialogDescription>Update student profile details</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); updateStudentMutation.mutate(studentForm); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-username">Username</Label>
                  <Input
                    id="edit-username"
                    data-testid="input-edit-username"
                    value={studentForm.username}
                    onChange={(e) => setStudentForm({ ...studentForm, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    data-testid="input-edit-email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-first-name">First Name</Label>
                    <Input
                      id="edit-first-name"
                      data-testid="input-edit-first-name"
                      value={studentForm.firstName}
                      onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-last-name">Last Name</Label>
                    <Input
                      id="edit-last-name"
                      data-testid="input-edit-last-name"
                      value={studentForm.lastName}
                      onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={updateStudentMutation.isPending} data-testid="button-save-student">
                    {updateStudentMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" data-testid="button-reset-password">
                <KeyRound className="h-4 w-4 mr-2" />
                Reset Password
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-reset-password">
              <DialogHeader>
                <DialogTitle>Reset Student Password</DialogTitle>
                <DialogDescription>Set a new password for {student.username}</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); resetPasswordMutation.mutate(newPassword); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    data-testid="input-new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={resetPasswordMutation.isPending} data-testid="button-confirm-reset">
                    {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card data-testid="card-points">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-points">{student.points || 0}</div>
          </CardContent>
        </Card>

        <Card data-testid="card-streak">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-streak">{student.streak || 0} days</div>
          </CardContent>
        </Card>

        <Card data-testid="card-checks">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Device Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-check-count">{deviceChecks.total}</div>
            <p className="text-xs text-muted-foreground">{deviceChecks.completed} completed</p>
          </CardContent>
        </Card>

        <Card data-testid="card-repairs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repairs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-repair-count">{repairs.total}</div>
            <p className="text-xs text-muted-foreground">{repairs.completed} completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="checks" data-testid="tabs-student-activity">
        <TabsList>
          <TabsTrigger value="checks" data-testid="tab-checks">Device Checks ({deviceChecks.total})</TabsTrigger>
          <TabsTrigger value="repairs" data-testid="tab-repairs">Repairs ({repairs.total})</TabsTrigger>
          <TabsTrigger value="learning" data-testid="tab-learning">Learning ({learningModules.total})</TabsTrigger>
          <TabsTrigger value="logs" data-testid="tab-logs">Work Logs ({workLogs.total})</TabsTrigger>
        </TabsList>

        <TabsContent value="checks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Device Check History</CardTitle>
              <CardDescription>All device checks performed by this student</CardDescription>
            </CardHeader>
            <CardContent>
              {deviceChecks.total === 0 ? (
                <p className="text-muted-foreground text-center py-4" data-testid="text-no-checks">No device checks yet</p>
              ) : (
                <div className="space-y-3">
                  {deviceChecks.tickets.map((ticket: any) => (
                    <div key={ticket.id} className="p-4 border rounded-md" data-testid={`check-${ticket.id}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{ticket.deviceType} {ticket.deviceNumber ? `- #${ticket.deviceNumber}` : ''}</p>
                          {ticket.teacher && <p className="text-sm text-muted-foreground">Teacher: {ticket.teacher} - Room {ticket.roomNumber}</p>}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          ticket.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{ticket.issueDescription}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repairs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Repair History</CardTitle>
              <CardDescription>All repair tickets handled by this student</CardDescription>
            </CardHeader>
            <CardContent>
              {repairs.total === 0 ? (
                <p className="text-muted-foreground text-center py-4" data-testid="text-no-repairs">No repairs yet</p>
              ) : (
                <div className="space-y-3">
                  {repairs.tickets.map((ticket: any) => (
                    <div key={ticket.id} className="p-4 border rounded-md" data-testid={`repair-${ticket.id}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{ticket.deviceType} {ticket.deviceNumber ? `- #${ticket.deviceNumber}` : ''}</p>
                          <p className="text-sm text-muted-foreground">Grade: {ticket.studentGrade}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          ticket.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{ticket.issueDescription}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Module Progress</CardTitle>
              <CardDescription>Challenges completed by this student</CardDescription>
            </CardHeader>
            <CardContent>
              {learningModules.total === 0 ? (
                <p className="text-muted-foreground text-center py-4" data-testid="text-no-learning">No learning modules completed yet</p>
              ) : (
                <div className="space-y-3">
                  {learningModules.completions.map((completion: any) => (
                    <div key={completion.id} className="p-4 border rounded-md" data-testid={`completion-${completion.id}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{completion.challengeTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            Completed: {new Date(completion.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Award className="h-5 w-5 text-yellow-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Work Logs</CardTitle>
              <CardDescription>Time tracking and work notes</CardDescription>
            </CardHeader>
            <CardContent>
              {workLogs.total === 0 ? (
                <p className="text-muted-foreground text-center py-4" data-testid="text-no-logs">No work logs yet</p>
              ) : (
                <div className="space-y-3">
                  {workLogs.logs.map((log: any) => (
                    <div key={log.id} className="p-4 border rounded-md" data-testid={`log-${log.id}`}>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground mt-1" />
                        <div className="flex-1">
                          <p className="text-sm">{log.notes}</p>
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Duration: {log.duration} minutes</span>
                            <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
