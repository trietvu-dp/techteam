import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ClipboardCheck, Wrench, TrendingUp, AlertCircle } from 'lucide-react';

interface DashboardProps {
  onStartDeviceCheck: () => void;
  onStartRepair: () => void;
}

export function Dashboard({ onStartDeviceCheck, onStartRepair }: DashboardProps) {
  const stats = [
    { label: 'Checks Today', value: 12, icon: ClipboardCheck, color: 'text-blue-600' },
    { label: 'Active Repairs', value: 5, icon: Wrench, color: 'text-orange-600' },
    { label: 'Skills Progress', value: '65%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Pending Tasks', value: 3, icon: AlertCircle, color: 'text-red-600' },
  ];

  const recentActivity = [
    { student: 'Sarah M.', device: 'Chromebook #245', action: 'Check completed', time: '5m ago', status: 'success' },
    { student: 'James K.', device: 'iPad #102', action: 'Repair submitted', time: '12m ago', status: 'warning' },
    { student: 'Emma R.', device: 'Chromebook #189', action: 'Check completed', time: '23m ago', status: 'success' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2>Welcome back, Alex!</h2>
        <p className="text-slate-600">Here's what's happening today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className={stat.color}>{stat.value}</div>
            <p className="text-xs text-slate-600">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button 
            onClick={onStartDeviceCheck}
            className="w-full bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center gap-2"
          >
            <ClipboardCheck className="w-5 h-5" />
            Start Device Check
          </button>
          <button 
            onClick={onStartRepair}
            className="w-full bg-white border border-slate-200 p-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Wrench className="w-5 h-5" />
            Report Repair
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {recentActivity.map((activity, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span>{activity.student}</span>
                    <Badge 
                      variant={activity.status === 'success' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {activity.device}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{activity.action}</p>
                </div>
                <span className="text-xs text-slate-400">{activity.time}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Skills Progress */}
      <Card className="p-4">
        <h3 className="mb-3">Your Skills Progress</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Hardware Basics</span>
              <span className="text-sm text-slate-600">80%</span>
            </div>
            <Progress value={80} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Software Troubleshooting</span>
              <span className="text-sm text-slate-600">65%</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Network Diagnostics</span>
              <span className="text-sm text-slate-600">45%</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  );
}
