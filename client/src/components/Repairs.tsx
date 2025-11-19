import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
  Wrench,
  ChevronDown,
  X,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { STUDENTS } from "@/data/students";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import type { Ticket } from "@shared/schema";

interface RepairsProps {
  triggerNew?: boolean;
  onTriggerComplete?: () => void;
}

export function Repairs({ triggerNew, onTriggerComplete }: RepairsProps) {
  const { user } = useAuth();
  const [showNewRepair, setShowNewRepair] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<Ticket | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentOpen, setStudentOpen] = useState(false);

  // Fetch repairs from the database
  const { data: repairsData = [], isLoading: repairsLoading, error: repairsError } = useQuery<Ticket[]>({
    queryKey: ['/api/student/repairs'],
    enabled: !!user,
  });

  // Transform repairs data to match UI expectations
  const repairs = useMemo(() => 
    repairsData.map((repair) => ({
      id: repair.id,
      device: `${repair.deviceType} ${repair.deviceNumber || ''}`,
      student: repair.studentName,
      issue: repair.issueDescription,
      priority: repair.priority || 'medium',
      status: repair.status,
      submitted: formatRelativeTime(repair.createdAt),
      assignedTo: repair.assignedTo === user?.id ? 'You' : 'Tech Team',
    }))
  , [repairsData, user]);

  // Calculate actual counts from data with memoization
  const { pendingRepairsCount, inProgressCount, completedCount } = useMemo(() => ({
    pendingRepairsCount: repairs.filter(r => r.status === 'pending').length,
    inProgressCount: repairs.filter(r => r.status === 'in_progress').length,
    completedCount: repairs.filter(r => r.status === 'completed').length,
  }), [repairs]);

  function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  }

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
      return students.filter((s) => s !== student);
    }
    return [...students, student];
  };

  const removeStudent = (students: string[], student: string) => {
    return students.filter((s) => s !== student);
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-100 text-red-700",
      medium: "bg-orange-100 text-orange-700",
      low: "bg-blue-100 text-blue-700",
    };
    return colors[priority] || colors.medium;
  };

  const getStatusInfo = (status: string) => {
    const info: Record<
      string,
      { icon: any; label: string; className: string }
    > = {
      pending: {
        icon: Clock,
        label: "Pending",
        className: "bg-slate-100 text-slate-700",
      },
      in_progress: {
        icon: Wrench,
        label: "In Progress",
        className: "bg-blue-100 text-blue-700",
      },
      completed: {
        icon: CheckCircle,
        label: "Completed",
        className: "bg-green-100 text-green-700",
      },
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
          <Plus className="w-4 h-4" />
          New Repair Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center">
          <div className="text-orange-600">
            {repairsLoading ? '...' : pendingRepairsCount}
          </div>
          <p className="text-xs text-slate-600">Pending</p>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-blue-600">
            {repairsLoading ? '...' : inProgressCount}
          </div>
          <p className="text-xs text-slate-600">In Progress</p>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-green-600">
            {repairsLoading ? '...' : completedCount}
          </div>
          <p className="text-xs text-slate-600">Completed</p>
        </Card>
      </div>

      {/* Repairs List */}
      <div className="space-y-2">
        {repairsLoading ? (
          <div className="text-center py-8 text-slate-500">
            Loading repairs...
          </div>
        ) : repairsError ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Error loading repairs</p>
            <p className="text-sm text-slate-400">
              {repairsError instanceof Error ? repairsError.message : 'Failed to load repairs. Please try again.'}
            </p>
          </div>
        ) : repairs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 mb-2">No repairs yet</p>
            <p className="text-sm text-slate-400">
              Report a new repair to get started
            </p>
          </div>
        ) : (
          repairs.map((repair) => {
            const statusInfo = getStatusInfo(repair.status);
            const StatusIcon = statusInfo.icon;

            return (
              <Card
                key={repair.id}
                className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedRepair(repair)}
                data-testid={`card-repair-${repair.id}`}
              >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusIcon className="w-4 h-4 text-slate-600" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{repair.device}</span>
                      <Badge
                        className={getPriorityColor(repair.priority)}
                        variant="secondary"
                      >
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
        })
        )}
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
                          <Badge
                            key={student}
                            variant="secondary"
                            className="gap-1"
                          >
                            {student}
                            <X
                              className="w-3 h-3 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudents(
                                  removeStudent(selectedStudents, student),
                                );
                              }}
                            />
                          </Badge>
                        ))
                      ) : (
                        <span className="text-slate-500">
                          Select students...
                        </span>
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
                              setSelectedStudents(
                                toggleStudent(selectedStudents, student),
                              );
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
              <Textarea id="issue" placeholder="Describe the problem..." />
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
      <Dialog
        open={!!selectedRepair}
        onOpenChange={() => setSelectedRepair(null)}
      >
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
                <Badge
                  className={getStatusInfo(selectedRepair.status).className}
                >
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

              {selectedRepair.status !== "completed" && (
                <div className="pt-2 space-y-2">
                  <Button className="w-full" variant="outline">
                    Update Status
                  </Button>
                  <Button className="w-full">Mark as Complete</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
