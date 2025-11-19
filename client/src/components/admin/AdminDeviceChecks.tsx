import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import type { Ticket } from '@shared/schema';

export function AdminDeviceChecks() {
  const { user } = useAuth();
  const schoolId = user?.schoolId;
  const [sortBy, setSortBy] = useState<'date' | 'student'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: checks = [], isLoading } = useQuery<Ticket[]>({
    queryKey: ['/api/schools', schoolId, 'tickets', sortBy, sortOrder, 'check'],
    queryFn: async () => {
      const url = `/api/schools/${schoolId}/tickets?sortBy=${sortBy}&sortOrder=${sortOrder}&issueType=check`;
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch checks');
      return response.json();
    },
    enabled: !!schoolId,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" data-testid="heading-device-checks">Device Checks</h2>
        <p className="text-slate-600" data-testid="text-subtitle">Review all device check tickets</p>
      </div>

      <Card data-testid="card-device-checks">
        <CardHeader>
          <CardTitle>Device Check History ({checks.length})</CardTitle>
          <CardDescription>All device check submissions</CardDescription>
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
            <p className="text-muted-foreground text-center py-4" data-testid="text-loading">Loading device checks...</p>
          ) : checks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4" data-testid="text-no-checks">No device checks found</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {checks.map((check) => (
                <div key={check.id} className="p-4 border rounded-md hover-elevate" data-testid={`check-item-${check.id}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium" data-testid={`check-student-${check.id}`}>{check.studentName}</p>
                      <p className="text-sm text-muted-foreground" data-testid={`check-device-${check.id}`}>
                        {check.deviceType} {check.deviceNumber ? `- #${check.deviceNumber}` : ''}
                      </p>
                      {check.teacher && (
                        <p className="text-sm text-muted-foreground">Teacher: {check.teacher} - Room {check.roomNumber}</p>
                      )}
                    </div>
                    <span 
                      className={`text-xs px-2 py-1 rounded-full ${
                        check.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        check.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`} 
                      data-testid={`check-status-${check.id}`}
                    >
                      {check.status}
                    </span>
                  </div>
                  <p className="text-sm mb-2" data-testid={`check-description-${check.id}`}>{check.issueDescription}</p>
                  <p className="text-xs text-muted-foreground" data-testid={`check-date-${check.id}`}>
                    {new Date(check.createdAt).toLocaleDateString()} at {new Date(check.createdAt).toLocaleTimeString()}
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
