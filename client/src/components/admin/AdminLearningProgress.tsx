import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

interface LearningProgress {
  student: {
    id: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  challengesCompleted: number;
  completions: any[];
}

export function AdminLearningProgress() {
  const { user } = useAuth();
  const schoolId = user?.schoolId;

  const { data: learningProgress = [], isLoading } = useQuery<LearningProgress[]>({
    queryKey: ['/api/schools', schoolId, 'learning-progress'],
    queryFn: async () => {
      const response = await fetch(`/api/schools/${schoolId}/learning-progress`, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch learning progress');
      return response.json();
    },
    enabled: !!schoolId,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" data-testid="heading-learning-progress">Learning Progress</h2>
        <p className="text-slate-600" data-testid="text-subtitle">Track student learning module completion</p>
      </div>

      <Card data-testid="card-progress">
        <CardHeader>
          <CardTitle>Learning Module Progress</CardTitle>
          <CardDescription>Track which challenges students have started and completed</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-center py-4" data-testid="text-loading">Loading progress...</p>
          ) : learningProgress.length === 0 ? (
            <p className="text-muted-foreground text-center py-4" data-testid="text-no-progress">No student progress data yet</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {learningProgress.map((progress) => (
                <div key={progress.student.id} className="p-4 border rounded-md hover-elevate" data-testid={`progress-item-${progress.student.id}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium" data-testid={`progress-student-${progress.student.id}`}>
                        {progress.student.lastName && progress.student.firstName 
                          ? `${progress.student.lastName}, ${progress.student.firstName}` 
                          : progress.student.username}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`progress-email-${progress.student.id}`}>{progress.student.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary" data-testid={`progress-count-${progress.student.id}`}>{progress.challengesCompleted}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
