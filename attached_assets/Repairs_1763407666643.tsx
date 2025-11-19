import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Clock, AlertCircle, CheckCircle, Wrench, ChevronDown, X } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Checkbox } from './ui/checkbox';
import { STUDENTS } from '../data/students';

interface RepairsProps {
  triggerNew?: boolean;
  onTriggerComplete?: () => void;
}

export function Repairs({ triggerNew, onTriggerComplete }: RepairsProps) {
  const [showNewRepair, setShowNewRepair] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<any>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentOpen, setStudentOpen] = useState(false);
  
  // Effect to handle external trigger
  useEffect(() => {
    if (triggerNew) {
      setShowNewRepair(true);
      setSelectedStudents([]);
      onTriggerComplete?.();
    }
  }, [triggerNew]);

  // Helper functions for multi-select
  const toggleStudent = (students: string[], student: string) => {
    if (students.includes(student)) {
      return students.filter(s => s !== student);
    }
    return [...students, student];
  };

  const removeStudent = (students: string[], student: string) => {
    return students.filter(s => s !== student);
  };

  const repairs = [
    {
      id: 'R-001',
      device: 'Chromebook #245',
      student: 'Sarah M.',
      issue: 'Screen cracked',
      priority: 'high',
      status: 'in-progress',
      submitted: '2 hours ago',
      assignedTo: 'You',
    },
    {
      id: 'R-002',
      device: 'iPad #102',
      student: 'James K.',
      issue: 'Battery not charging',
      priority: 'medium',
      status: 'pending',
      submitted: '1 day ago',
      assignedTo: 'Tech Team',
    },
    {
      id: 'R-003',
      device: 'Laptop #067',
      student: 'Michael P.',
      issue: 'Keyboard keys stuck',
      priority: 'low',
      status: 'completed',
      submitted: '3 days ago',
      assignedTo: 'Emma R.',
    },
    {
      id: 'R-004',
      device: 'Chromebook #189',
      student: 'Emma R.',
      issue: 'Won\'t power on',
      priority: 'high',
      status: 'pending',
      submitted: '4 hours ago',
      assignedTo: 'Tech Team',
    },
    {
      id: 'R-005',
      device: 'iPad #156',
      student: 'Lucas T.',
      issue: 'Screen flickering',
      priority: 'medium',
      status: 'in-progress',
      submitted: '1 day ago',
      assignedTo: 'Alex K.',
    },
  ];

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-orange-100 text-orange-700',
      low: 'bg-blue-100 text-blue-700',
    };
    return colors[priority] || colors.medium;
  };

  const getStatusInfo = (status: string) => {
    const info: Record<string, { icon: any; label: string; className: string }> = {
      pending: { icon: Clock, label: 'Pending', className: 'bg-slate-100 text-slate-700' },
      'in-progress': { icon: Wrench, label: 'In Progress', className: 'bg-blue-100 text-blue-700' },
      completed: { icon: CheckCircle, label: 'Completed', className: 'bg-green-100 text-green-700' },
    };
    return info[status] || info.pending;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Repair Tracking</h2>
          <p className="text-slate-600">Monitor device repairs</p>
        </div>
        <Button size="icon" onClick={() => setShowNewRepair(true)}>
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center">
          <div className="text-orange-600">2</div>
          <p className="text-xs text-slate-600">Pending</p>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-blue-600">2</div>
          <p className="text-xs text-slate-600">In Progress</p>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-green-600">1</div>
          <p className="text-xs text-slate-600">Completed</p>
        </Card>
      </div>

      {/* Repairs List */}
      <div className="space-y-2">
        {repairs.map((repair) => {
          const statusInfo = getStatusInfo(repair.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <Card 
              key={repair.id} 
              className="p-3 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedRepair(repair)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusIcon className="w-4 h-4 text-slate-600" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{repair.device}</span>
                      <Badge className={getPriorityColor(repair.priority)} variant="secondary">
                        {repair.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{repair.student}</p>
                  </div>
                </div>
                <Badge className={statusInfo.className}>
                  {statusInfo.label}
                </Badge>
              </div>
              <div className="text-sm">
                <p className="text-slate-700">{repair.issue}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                  <span>Assigned: {repair.assignedTo}</span>
                  <span>{repair.submitted}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* New Repair Dialog */}
      <Dialog open={showNewRepair} onOpenChange={setShowNewRepair}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Report New Repair</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="device-id">Device ID</Label>
              <Input id="device-id" placeholder="e.g., Chromebook #245" />
            </div>

            <div>
              <Label htmlFor="student-name">Student Name(s)</Label>
              <Popover open={studentOpen} onOpenChange={setStudentOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    role="combobox"
                    className="w-full justify-between mt-1 h-auto min-h-[40px]"
                  >
                    <div className="flex flex-wrap gap-1">
                      {selectedStudents.length > 0 ? (
                        selectedStudents.map((student) => (
                          <Badge key={student} variant="secondary" className="gap-1">
                            {student}
                            <X 
                              className="w-3 h-3 cursor-pointer" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudents(removeStudent(selectedStudents, student));
                              }}
                            />
                          </Badge>
                        ))
                      ) : (
                        <span className="text-slate-500">Select students...</span>
                      )}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput placeholder="Search students..." />
                    <CommandList>
                      <CommandEmpty>No student found.</CommandEmpty>
                      <CommandGroup>
                        {STUDENTS.map((student) => (
                          <CommandItem
                            key={student}
                            value={student}
                            onSelect={() => {
                              setSelectedStudents(toggleStudent(selectedStudents, student));
                            }}
                          >
                            <Checkbox 
                              checked={selectedStudents.includes(student)}
                              className="mr-2"
                            />
                            {student}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="issue">Issue Description</Label>
              <Textarea 
                id="issue"
                placeholder="Describe the problem..."
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewRepair(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowNewRepair(false)}>
              Submit Repair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Repair Detail Dialog */}
      <Dialog open={!!selectedRepair} onOpenChange={() => setSelectedRepair(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Repair Details</DialogTitle>
          </DialogHeader>
          
          {selectedRepair && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Repair ID:</span>
                <span>{selectedRepair.id}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Device:</span>
                <span>{selectedRepair.device}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Student:</span>
                <span>{selectedRepair.student}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Priority:</span>
                <Badge className={getPriorityColor(selectedRepair.priority)}>
                  {selectedRepair.priority}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Status:</span>
                <Badge className={getStatusInfo(selectedRepair.status).className}>
                  {getStatusInfo(selectedRepair.status).label}
                </Badge>
              </div>
              
              <div>
                <span className="text-sm text-slate-600">Issue:</span>
                <p className="mt-1">{selectedRepair.issue}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Assigned To:</span>
                <span>{selectedRepair.assignedTo}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Submitted:</span>
                <span>{selectedRepair.submitted}</span>
              </div>

              {selectedRepair.status !== 'completed' && (
                <div className="pt-2 space-y-2">
                  <Button className="w-full" variant="outline">
                    Update Status
                  </Button>
                  <Button className="w-full">
                    Mark as Complete
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
