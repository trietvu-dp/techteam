import { useState, useMemo, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Search, Filter, CheckCircle2, XCircle, Clock, LayoutList, Table, Plus, ChevronDown, X } from 'lucide-react';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { STUDENTS } from '../data/students';

// Hogwarts teachers
const TEACHERS = [
  'Minerva McGonagall',
  'Severus Snape',
  'Filius Flitwick',
  'Pomona Sprout',
  'Rubeus Hagrid',
  'Sybill Trelawney',
  'Remus Lupin',
  'Horace Slughorn',
];

interface DeviceChecksProps {
  triggerNew?: boolean;
  onTriggerComplete?: () => void;
}

export function DeviceChecks({ triggerNew, onTriggerComplete }: DeviceChecksProps) {
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [checkItems, setCheckItems] = useState({
    physical: false,
    charging: false,
    screen: false,
    keyboard: false,
    software: false,
  });
  
  // New device check flow
  const [showNewCheckFlow, setShowNewCheckFlow] = useState(false);
  const [newCheckStep, setNewCheckStep] = useState<'device-type' | 'form'>('device-type');
  const [selectedDeviceType, setSelectedDeviceType] = useState<'iPad' | 'Chromebook' | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    teacher: '',
    roomNumber: '',
    allPresent: '',
    missingStudents: [] as string[],
    allCharged: '',
    notChargedStudents: [] as string[],
    anyMissing: '',
    missingDeviceStudents: [] as string[],
    anyBroken: '',
    brokenAssetTag: '',
    lteWorking: '',
    lteBrokenAssetTag: '',
  });
  
  // Search states for dropdowns
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [missingStudentsOpen, setMissingStudentsOpen] = useState(false);
  const [notChargedStudentsOpen, setNotChargedStudentsOpen] = useState(false);
  const [missingDeviceStudentsOpen, setMissingDeviceStudentsOpen] = useState(false);
  
  // Effect to handle external trigger
  useEffect(() => {
    if (triggerNew) {
      handleStartNewCheck();
      onTriggerComplete?.();
    }
  }, [triggerNew]);

  const devices = [
    { id: 1, type: 'Chromebook', number: '#245', student: 'Sarah M.', grade: '10th', status: 'pending', lastCheck: '2 days ago' },
    { id: 2, type: 'iPad', number: '#102', student: 'James K.', grade: '9th', status: 'completed', lastCheck: 'Today' },
    { id: 3, type: 'Chromebook', number: '#189', student: 'Emma R.', grade: '11th', status: 'completed', lastCheck: 'Today' },
    { id: 4, type: 'Laptop', number: '#067', student: 'Michael P.', grade: '12th', status: 'pending', lastCheck: '3 days ago' },
    { id: 5, type: 'Chromebook', number: '#312', student: 'Olivia S.', grade: '10th', status: 'issue', lastCheck: '1 day ago' },
    { id: 6, type: 'iPad', number: '#156', student: 'Lucas T.', grade: '9th', status: 'pending', lastCheck: '4 days ago' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'issue':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-orange-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      completed: { label: 'Checked', className: 'bg-green-100 text-green-700' },
      issue: { label: 'Issue', className: 'bg-red-100 text-red-700' },
      pending: { label: 'Pending', className: 'bg-orange-100 text-orange-700' },
    };
    return variants[status] || variants.pending;
  };

  // Get current date and time
  const currentDate = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  }, []);
  
  const currentTime = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }, []);
  
  const handleStartNewCheck = () => {
    setShowNewCheckFlow(true);
    setNewCheckStep('device-type');
    setSelectedDeviceType(null);
    setFormData({
      teacher: '',
      roomNumber: '',
      allPresent: '',
      missingStudents: [],
      allCharged: '',
      notChargedStudents: [],
      anyMissing: '',
      missingDeviceStudents: [],
      anyBroken: '',
      brokenAssetTag: '',
      lteWorking: '',
      lteBrokenAssetTag: '',
    });
  };
  
  const toggleStudent = (list: string[], student: string) => {
    if (list.includes(student)) {
      return list.filter(s => s !== student);
    }
    return [...list, student];
  };
  
  const removeStudent = (list: string[], student: string) => {
    return list.filter(s => s !== student);
  };
  
  const handleDeviceTypeSelect = (type: 'iPad' | 'Chromebook') => {
    setSelectedDeviceType(type);
    setNewCheckStep('form');
  };
  
  const handleFormSubmit = () => {
    // Submit form logic here
    console.log('Submitting form:', { deviceType: selectedDeviceType, ...formData, date: currentDate, time: currentTime });
    setShowNewCheckFlow(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Device Checks</h2>
          <p className="text-slate-600">Monitor peer device status</p>
        </div>
        <Button onClick={handleStartNewCheck} className="gap-2">
          <Plus className="w-4 h-4" />
          Start Device Check
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search student or device..." 
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
        <Button 
          variant={viewMode === 'table' ? 'default' : 'outline'} 
          size="icon"
          onClick={() => setViewMode(viewMode === 'list' ? 'table' : 'list')}
        >
          {viewMode === 'list' ? <Table className="w-4 h-4" /> : <LayoutList className="w-4 h-4" />}
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-2 text-sm">
        <Badge className="bg-green-100 text-green-700">12 Checked</Badge>
        <Badge className="bg-orange-100 text-orange-700">8 Pending</Badge>
        <Badge className="bg-red-100 text-red-700">2 Issues</Badge>
      </div>

      {/* Device List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {devices.map((device) => {
            const statusInfo = getStatusBadge(device.status);
            return (
              <Card 
                key={device.id} 
                className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedDevice(device)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(device.status)}
                    <span>{device.type} {device.number}</span>
                  </div>
                  <Badge className={statusInfo.className}>
                    {statusInfo.label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-slate-600">{device.student}</p>
                    <p className="text-xs text-slate-400">Grade {device.grade}</p>
                  </div>
                  <span className="text-xs text-slate-400">Last: {device.lastCheck}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Table View (Spreadsheet Style) */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-2 text-left">Student</th>
                <th className="p-2 text-left">Device ID</th>
                <th className="p-2 text-center">Physical</th>
                <th className="p-2 text-center">Screen</th>
                <th className="p-2 text-center">Keyboard</th>
                <th className="p-2 text-center">Charging</th>
                <th className="p-2 text-center">Software</th>
                <th className="p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {devices.map((device, index) => (
                <tr 
                  key={device.id} 
                  className={`border-b ${index % 2 === 0 ? 'bg-slate-50' : ''} cursor-pointer hover:bg-blue-50`}
                  onClick={() => setSelectedDevice(device)}
                >
                  <td className="p-2">{device.student}</td>
                  <td className="p-2">{device.type} {device.number}</td>
                  <td className="p-2 text-center">
                    {device.status === 'completed' ? '✓' : device.status === 'issue' ? '✗' : '-'}
                  </td>
                  <td className="p-2 text-center">
                    {device.status === 'completed' ? '✓' : device.status === 'issue' ? '✗' : '-'}
                  </td>
                  <td className="p-2 text-center">
                    {device.status === 'completed' ? '✓' : device.status === 'issue' ? '✗' : '-'}
                  </td>
                  <td className="p-2 text-center">
                    {device.status === 'completed' ? '✓' : device.status === 'issue' ? '✗' : '-'}
                  </td>
                  <td className="p-2 text-center">
                    {device.status === 'completed' ? '✓' : device.status === 'issue' ? '✗' : '-'}
                  </td>
                  <td className="p-2 text-center">
                    <Badge className={`${getStatusBadge(device.status).className} text-xs`}>
                      {getStatusBadge(device.status).label}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Check Dialog */}
      <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Device Check: {selectedDevice?.type} {selectedDevice?.number}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600">Student: {selectedDevice?.student}</p>
              <p className="text-sm text-slate-600">Grade: {selectedDevice?.grade}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm">Check Items</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="physical" 
                  checked={checkItems.physical}
                  onCheckedChange={(checked) => setCheckItems({...checkItems, physical: !!checked})}
                />
                <Label htmlFor="physical" className="text-sm">Physical condition</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="charging" 
                  checked={checkItems.charging}
                  onCheckedChange={(checked) => setCheckItems({...checkItems, charging: !!checked})}
                />
                <Label htmlFor="charging" className="text-sm">Charging port working</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="screen" 
                  checked={checkItems.screen}
                  onCheckedChange={(checked) => setCheckItems({...checkItems, screen: !!checked})}
                />
                <Label htmlFor="screen" className="text-sm">Screen functional</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="keyboard" 
                  checked={checkItems.keyboard}
                  onCheckedChange={(checked) => setCheckItems({...checkItems, keyboard: !!checked})}
                />
                <Label htmlFor="keyboard" className="text-sm">Keyboard/Input working</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="software" 
                  checked={checkItems.software}
                  onCheckedChange={(checked) => setCheckItems({...checkItems, software: !!checked})}
                />
                <Label htmlFor="software" className="text-sm">Software up to date</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm">Notes (optional)</Label>
              <Textarea 
                id="notes"
                placeholder="Any issues or observations..."
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDevice(null)}>
              Cancel
            </Button>
            <Button onClick={() => setSelectedDevice(null)}>
              Submit Check
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Device Check Flow */}
      <Dialog open={showNewCheckFlow} onOpenChange={() => setShowNewCheckFlow(false)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {newCheckStep === 'device-type' && (
            <>
              <DialogHeader>
                <DialogTitle>Start Device Check</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <p className="text-sm text-slate-600">Select the type of device you're checking:</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card 
                    className={`p-6 cursor-pointer hover:shadow-md transition-all ${selectedDeviceType === 'iPad' ? 'ring-2 ring-blue-600' : ''}`}
                    onClick={() => handleDeviceTypeSelect('iPad')}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-4xl">📱</div>
                      <p>iPad</p>
                    </div>
                  </Card>
                  
                  <Card 
                    className={`p-6 cursor-pointer hover:shadow-md transition-all ${selectedDeviceType === 'Chromebook' ? 'ring-2 ring-blue-600' : ''}`}
                    onClick={() => handleDeviceTypeSelect('Chromebook')}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-4xl">💻</div>
                      <p>Chromebook</p>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}
          
          {newCheckStep === 'form' && selectedDeviceType && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDeviceType} Check Form</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {/* Auto-filled Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Current Date <span className="text-red-600">*</span></Label>
                    <Input value={currentDate} disabled className="mt-1 bg-slate-50" />
                  </div>
                  <div>
                    <Label className="text-sm">Current Time <span className="text-red-600">*</span></Label>
                    <Input value={currentTime} disabled className="mt-1 bg-slate-50" />
                  </div>
                </div>
                
                {/* Teacher Name - Searchable */}
                <div>
                  <Label className="text-sm">Teacher Name <span className="text-red-600">*</span></Label>
                  <Popover open={teacherOpen} onOpenChange={setTeacherOpen}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        role="combobox"
                        className="w-full justify-between mt-1"
                      >
                        {formData.teacher || "Select teacher..."}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput 
                          placeholder="Search teachers..." 
                          value={teacherSearch}
                          onValueChange={setTeacherSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No teacher found.</CommandEmpty>
                          <CommandGroup>
                            {TEACHERS
                              .filter(teacher => 
                                teacher.toLowerCase().includes(teacherSearch.toLowerCase())
                              )
                              .map((teacher) => (
                                <CommandItem
                                  key={teacher}
                                  value={teacher}
                                  onSelect={() => {
                                    setFormData({...formData, teacher});
                                    setTeacherOpen(false);
                                    setTeacherSearch('');
                                  }}
                                >
                                  {teacher}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Room Number */}
                <div>
                  <Label className="text-sm">Room Number <span className="text-red-600">*</span></Label>
                  <Input 
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                    placeholder="Enter room number"
                    className="mt-1"
                  />
                </div>
                
                {/* All Present */}
                <div>
                  <Label className="text-sm">Are all {selectedDeviceType}s present? <span className="text-red-600">*</span></Label>
                  <RadioGroup 
                    value={formData.allPresent}
                    onValueChange={(value) => setFormData({...formData, allPresent: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="present-yes" />
                      <Label htmlFor="present-yes" className="text-sm">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="present-no" />
                      <Label htmlFor="present-no" className="text-sm">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Conditional: Missing Students */}
                {formData.allPresent === 'no' && (
                  <div>
                    <Label className="text-sm">If all {selectedDeviceType}s not present, select students:</Label>
                    <Popover open={missingStudentsOpen} onOpenChange={setMissingStudentsOpen}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          role="combobox"
                          className="w-full justify-between mt-1 h-auto min-h-[40px]"
                        >
                          <div className="flex flex-wrap gap-1">
                            {formData.missingStudents.length > 0 ? (
                              formData.missingStudents.map((student) => (
                                <Badge key={student} variant="secondary" className="gap-1">
                                  {student}
                                  <X 
                                    className="w-3 h-3 cursor-pointer" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFormData({
                                        ...formData, 
                                        missingStudents: removeStudent(formData.missingStudents, student)
                                      });
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
                                    setFormData({
                                      ...formData,
                                      missingStudents: toggleStudent(formData.missingStudents, student)
                                    });
                                  }}
                                >
                                  <Checkbox 
                                    checked={formData.missingStudents.includes(student)}
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
                )}
                
                {/* All Charged */}
                <div>
                  <Label className="text-sm">Are all {selectedDeviceType}s charged? <span className="text-red-600">*</span></Label>
                  <RadioGroup 
                    value={formData.allCharged}
                    onValueChange={(value) => setFormData({...formData, allCharged: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="charged-yes" />
                      <Label htmlFor="charged-yes" className="text-sm">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="charged-no" />
                      <Label htmlFor="charged-no" className="text-sm">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Conditional: Not Charged Students */}
                {formData.allCharged === 'no' && (
                  <div>
                    <Label className="text-sm">If all {selectedDeviceType}s not charged, select students:</Label>
                    <Popover open={notChargedStudentsOpen} onOpenChange={setNotChargedStudentsOpen}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          role="combobox"
                          className="w-full justify-between mt-1 h-auto min-h-[40px]"
                        >
                          <div className="flex flex-wrap gap-1">
                            {formData.notChargedStudents.length > 0 ? (
                              formData.notChargedStudents.map((student) => (
                                <Badge key={student} variant="secondary" className="gap-1">
                                  {student}
                                  <X 
                                    className="w-3 h-3 cursor-pointer" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFormData({
                                        ...formData, 
                                        notChargedStudents: removeStudent(formData.notChargedStudents, student)
                                      });
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
                                    setFormData({
                                      ...formData,
                                      notChargedStudents: toggleStudent(formData.notChargedStudents, student)
                                    });
                                  }}
                                >
                                  <Checkbox 
                                    checked={formData.notChargedStudents.includes(student)}
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
                )}
                
                {/* Missing or Stolen */}
                <div>
                  <Label className="text-sm">Any {selectedDeviceType}s missing or stolen? <span className="text-red-600">*</span></Label>
                  <RadioGroup 
                    value={formData.anyMissing}
                    onValueChange={(value) => setFormData({...formData, anyMissing: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="missing-yes" />
                      <Label htmlFor="missing-yes" className="text-sm">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="missing-no" />
                      <Label htmlFor="missing-no" className="text-sm">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Conditional: Missing Device Students */}
                {formData.anyMissing === 'yes' && (
                  <div>
                    <Label className="text-sm">If any {selectedDeviceType}s missing, select students:</Label>
                    <Popover open={missingDeviceStudentsOpen} onOpenChange={setMissingDeviceStudentsOpen}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          role="combobox"
                          className="w-full justify-between mt-1 h-auto min-h-[40px]"
                        >
                          <div className="flex flex-wrap gap-1">
                            {formData.missingDeviceStudents.length > 0 ? (
                              formData.missingDeviceStudents.map((student) => (
                                <Badge key={student} variant="secondary" className="gap-1">
                                  {student}
                                  <X 
                                    className="w-3 h-3 cursor-pointer" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFormData({
                                        ...formData, 
                                        missingDeviceStudents: removeStudent(formData.missingDeviceStudents, student)
                                      });
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
                                    setFormData({
                                      ...formData,
                                      missingDeviceStudents: toggleStudent(formData.missingDeviceStudents, student)
                                    });
                                  }}
                                >
                                  <Checkbox 
                                    checked={formData.missingDeviceStudents.includes(student)}
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
                )}
                
                {/* Any Broken */}
                <div>
                  <Label className="text-sm">Are any {selectedDeviceType}s broken in any way? <span className="text-red-600">*</span></Label>
                  <RadioGroup 
                    value={formData.anyBroken}
                    onValueChange={(value) => setFormData({...formData, anyBroken: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="broken-yes" />
                      <Label htmlFor="broken-yes" className="text-sm">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="broken-no" />
                      <Label htmlFor="broken-no" className="text-sm">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Conditional: Broken Asset Tag */}
                {formData.anyBroken === 'yes' && (
                  <div>
                    <Label className="text-sm">If any {selectedDeviceType} is broken, get asset tag from {selectedDeviceType}:</Label>
                    <Input 
                      value={formData.brokenAssetTag}
                      onChange={(e) => setFormData({...formData, brokenAssetTag: e.target.value})}
                      placeholder="Enter asset tag..."
                      className="mt-1"
                    />
                  </div>
                )}
                
                {/* LTE Working (Chromebook only) */}
                {selectedDeviceType === 'Chromebook' && (
                  <>
                    <div>
                      <Label className="text-sm">Is the LTE working off campus? <span className="text-red-600">*</span></Label>
                      <RadioGroup 
                        value={formData.lteWorking}
                        onValueChange={(value) => setFormData({...formData, lteWorking: value})}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="lte-yes" />
                          <Label htmlFor="lte-yes" className="text-sm">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="lte-no" />
                          <Label htmlFor="lte-no" className="text-sm">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {/* Conditional: LTE Broken Asset Tag */}
                    {formData.lteWorking === 'no' && (
                      <div>
                        <Label className="text-sm">If LTE is not working, get asset tag from Chromebook:</Label>
                        <Input 
                          value={formData.lteBrokenAssetTag}
                          onChange={(e) => setFormData({...formData, lteBrokenAssetTag: e.target.value})}
                          placeholder="Enter asset tag..."
                          className="mt-1"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setNewCheckStep('device-type');
                    setSelectedDeviceType(null);
                  }}
                >
                  Back
                </Button>
                <Button onClick={handleFormSubmit}>
                  Submit Check
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
