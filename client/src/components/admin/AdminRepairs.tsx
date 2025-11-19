import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import type { Ticket } from '@shared/schema';

export function AdminRepairs() {
  const { user } = useAuth();
  const schoolId = user?.schoolId;
  const [sortBy, setSortBy] = useState<'date' | 'student'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: repairs = [], isLoading } = useQuery<Ticket[]>({
    queryKey: ['/api/schools', schoolId, 'tickets', sortBy, sortOrder, 'repair'],
    queryFn: async () => {
      const url = `/api/schools/${schoolId}/tickets?sortBy=${sortBy}&sortOrder=${sortOrder}&issueType=repair`;
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch repairs');
      return response.json();
    },
    enabled: !!schoolId,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" data-testid="heading-repairs">Repair Tickets</h2>
        <p className="text-slate-600" data-testid="text-subtitle">Review all repair submissions</p>
      </div>

      <Card data-testid="card-repairs">
        <CardHeader>
          <CardTitle>Repair History ({repairs.length})</CardTitle>
          <CardDescription>All repair ticket submissions</CardDescription>
          <div className="flex gap-2 pt-4">
            <Button
              variant={sortBy === 'date' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('date')}
              data-testid="button-sort-date"
            >
              Sort by Date
            </Button>
            <Button
              variant={sortBy === 'student' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('student')}
              data-testid="button-sort-student"
            >
              Sort by Student
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              data-testid="button-toggle-order"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-center py-4" data-testid="text-loading">Loading repairs...</p>
          ) : repairs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4" data-testid="text-no-repairs">No repair tickets found</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {repairs.map((repair) => (
                <div key={repair.id} className="p-4 border rounded-md hover-elevate" data-testid={`repair-item-${repair.id}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium" data-testid={`repair-student-${repair.id}`}>{repair.studentName}</p>
                      <p className="text-sm text-muted-foreground" data-testid={`repair-device-${repair.id}`}>
                        {repair.deviceType} {repair.deviceNumber ? `- #${repair.deviceNumber}` : ''}
                      </p>
                      <p className="text-sm text-muted-foreground">Grade: {repair.studentGrade}</p>
                    </div>
                    <span 
                      className={`text-xs px-2 py-1 rounded-full ${
                        repair.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        repair.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`} 
                      data-testid={`repair-status-${repair.id}`}
                    >
                      {repair.status}
                    </span>
                  </div>
                  <p className="text-sm mb-2" data-testid={`repair-description-${repair.id}`}>{repair.issueDescription}</p>
                  <p className="text-xs text-muted-foreground" data-testid={`repair-date-${repair.id}`}>
                    {new Date(repair.createdAt).toLocaleDateString()} at {new Date(repair.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
