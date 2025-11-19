import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { 
  Trophy,
  Star,
  Target,
  Users,
  BookOpen,
  Video,
  ExternalLink,
  Play,
  Calendar as CalendarIcon,
  Award,
  TrendingUp,
  Lightbulb
} from 'lucide-react';

export function Learn() {
  const [activeTab, setActiveTab] = useState('challenges');
  const [showLogWork, setShowLogWork] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const challenges = [
    {
      id: 1,
      title: '30-Day Hardware Master',
      description: 'Complete device diagnostics daily for 30 days',
      participants: 24,
      daysLeft: 12,
      progress: 60,
      category: 'Hardware',
      difficulty: 'Intermediate',
      reward: '500 pts',
    },
    {
      id: 2,
      title: 'Network Troubleshooter',
      description: 'Solve 15 network-related issues',
      participants: 18,
      daysLeft: 20,
      progress: 40,
      category: 'Network',
      difficulty: 'Advanced',
      reward: '750 pts',
    },
    {
      id: 3,
      title: 'Quick Fix Rookie',
      description: 'Complete 10 repairs in under 24 hours',
      participants: 32,
      daysLeft: 7,
      progress: 80,
      category: 'Speed',
      difficulty: 'Beginner',
      reward: '300 pts',
    },
  ];

  const rankings = [
    { rank: 1, name: 'Sarah M.', points: 2850, avatar: '🎯', streak: 15 },
    { rank: 2, name: 'James K.', points: 2640, avatar: '⚡', streak: 12 },
    { rank: 3, name: 'You (Alex)', points: 2420, avatar: '🚀', streak: 8, isCurrentUser: true },
    { rank: 4, name: 'Emma R.', points: 2180, avatar: '🌟', streak: 10 },
    { rank: 5, name: 'Michael P.', points: 2050, avatar: '💡', streak: 6 },
  ];

  const recommendations = [
    {
      title: 'Chromebook Battery Issues',
      type: 'Scenario',
      description: 'Learn to diagnose and fix common battery problems',
      duration: '5 min',
      category: 'Hardware',
    },
    {
      title: 'WiFi Connection Troubleshooting',
      type: 'Guide',
      description: 'Step-by-step guide for network connectivity issues',
      duration: '8 min',
      category: 'Network',
    },
    {
      title: 'Software Updates Best Practices',
      type: 'Video',
      description: 'Keep devices running smoothly with proper updates',
      duration: '3 min',
      category: 'Software',
    },
  ];

  const quickVideos = [
    {
      id: 1,
      title: 'How to Replace a Chromebook Screen',
      duration: '0:45',
      thumbnail: '🔧',
      views: '1.2k',
      category: 'Hardware',
    },
    {
      id: 2,
      title: 'Quick WiFi Diagnostics',
      duration: '0:30',
      thumbnail: '📶',
      views: '890',
      category: 'Network',
    },
    {
      id: 3,
      title: 'Keyboard Key Replacement',
      duration: '0:52',
      thumbnail: '⌨️',
      views: '2.1k',
      category: 'Hardware',
    },
  ];

  const resources = [
    {
      title: 'Chromebook Repair Manual',
      description: 'Official repair documentation',
      url: '#',
      category: 'Documentation',
    },
    {
      title: 'Network Diagnostics Tools',
      description: 'Essential software for testing',
      url: '#',
      category: 'Tools',
    },
    {
      title: 'Tech Support Scenarios',
      description: 'Practice with real-world cases',
      url: '#',
      category: 'Practice',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2>Learn & Grow</h2>
        <p className="text-slate-600">Build skills and track progress</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="log">Log Work</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* CHALLENGES TAB */}
        <TabsContent value="challenges" className="space-y-4 mt-4">
          {/* Active Challenges */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3>Active Challenges</h3>
              <Badge className="bg-blue-100 text-blue-700">3 Joined</Badge>
            </div>
            <div className="space-y-2">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h4 className="text-sm">{challenge.title}</h4>
                          <p className="text-xs text-slate-600">{challenge.description}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {challenge.reward}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                        <Users className="w-3 h-3" />
                        <span>{challenge.participants} joined</span>
                        <span>•</span>
                        <span>{challenge.daysLeft} days left</span>
                      </div>
                      <div className="mt-2">
                        <Progress value={challenge.progress} className="h-2" />
                        <p className="text-xs text-slate-600 mt-1">{challenge.progress}% complete</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="mb-3">Recommended for You</h3>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Lightbulb className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm">{rec.title}</h4>
                          <Badge variant="secondary" className="text-xs">{rec.type}</Badge>
                        </div>
                        <p className="text-xs text-slate-600">{rec.description}</p>
                        <p className="text-xs text-slate-400 mt-1">{rec.duration}</p>
                      </div>
                    </div>
                    <Button size="sm">Start</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Videos */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Video className="w-4 h-4" />
              <h3>Quick Learning Videos</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickVideos.map((video) => (
                <Card key={video.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-2 flex items-center justify-center relative">
                    <span className="text-3xl">{video.thumbnail}</span>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-5 h-5 text-blue-600 ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xs mb-1">{video.title}</h4>
                  <p className="text-xs text-slate-600">{video.views} views</p>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* LOG WORK TAB */}
        <TabsContent value="log" className="space-y-4 mt-4">
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="w-5 h-5 text-green-600" />
              <h3>Challenge-Based Tracking</h3>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Self-device reporting/battery test—reporting format
            </p>
            <Button onClick={() => setShowLogWork(true)} className="w-full">
              Log Today's Work
            </Button>
          </Card>

          {/* Calendar View */}
          <Card className="p-4">
            <h3 className="mb-3">Activity Calendar</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
            />
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Work logged</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Challenge day</span>
              </div>
            </div>
          </Card>

          {/* Recent Logs */}
          <div>
            <h3 className="mb-3">Recent Work Logs</h3>
            <div className="space-y-2">
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Device Checks</span>
                  <Badge className="bg-green-100 text-green-700">Today</Badge>
                </div>
                <p className="text-xs text-slate-600">Completed 5 device diagnostics</p>
              </Card>
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Repair Work</span>
                  <Badge className="bg-blue-100 text-blue-700">Yesterday</Badge>
                </div>
                <p className="text-xs text-slate-600">Fixed 2 Chromebook screens</p>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* RANKINGS TAB */}
        <TabsContent value="rankings" className="space-y-4 mt-4">
          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-600" />
                <div>
                  <div className="text-yellow-900">Your Rank: #3</div>
                  <p className="text-sm text-yellow-700">2,420 points</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-yellow-700">8 day streak</div>
                <p className="text-xs text-yellow-600">🔥</p>
              </div>
            </div>
          </Card>

          <div>
            <h3 className="mb-3">Leaderboard</h3>
            <div className="space-y-2">
              {rankings.map((user) => (
                <Card 
                  key={user.rank} 
                  className={`p-3 ${user.isCurrentUser ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        user.rank === 1 ? 'bg-yellow-100' :
                        user.rank === 2 ? 'bg-slate-100' :
                        user.rank === 3 ? 'bg-orange-100' :
                        'bg-slate-50'
                      }`}>
                        {user.rank === 1 ? '🥇' :
                         user.rank === 2 ? '🥈' :
                         user.rank === 3 ? '🥉' :
                         user.rank}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{user.avatar} {user.name}</span>
                          {user.isCurrentUser && (
                            <Badge className="bg-blue-600 text-white text-xs">You</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-600">{user.streak} day streak 🔥</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{user.points.toLocaleString()}</div>
                      <p className="text-xs text-slate-600">points</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-purple-600" />
              <h3>Get Certified</h3>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Complete challenges to earn certifications and upskill
            </p>
            <Button className="w-full" variant="outline">
              View Available Certifications
            </Button>
          </Card>
        </TabsContent>

        {/* RESOURCES TAB */}
        <TabsContent value="resources" className="space-y-4 mt-4">
          <Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3>Curated Resources</h3>
            </div>
            <p className="text-sm text-slate-600">
              Searchable resources organized by topic and scenario
            </p>
          </Card>

          {/* Search would go here */}
          <div className="space-y-2">
            <h3 className="mb-3">Recommended Resources</h3>
            {resources.map((resource, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm">{resource.title}</h4>
                      <Badge variant="secondary" className="text-xs">{resource.category}</Badge>
                    </div>
                    <p className="text-xs text-slate-600">{resource.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 ml-2" />
                </div>
              </Card>
            ))}
          </div>

          {/* Topics/Scenarios */}
          <div>
            <h3 className="mb-3">Browse by Topic</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Hardware', 'Software', 'Network', 'Security', 'Troubleshooting', 'Best Practices'].map((topic) => (
                <Button key={topic} variant="outline" className="justify-start">
                  {topic}
                </Button>
              ))}
            </div>
          </div>

          {/* Try Now / Required Materials Box */}
          <Card className="p-4 border-2 border-dashed border-blue-300 bg-blue-50">
            <h3 className="mb-2">Get Started</h3>
            <p className="text-sm text-slate-600 mb-3">
              Resources are organized with "Try Now" scenarios and required materials boxes to support hands-on learning
            </p>
            <Button className="w-full">Explore Interactive Scenarios</Button>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Log Work Dialog */}
      <Dialog open={showLogWork} onOpenChange={setShowLogWork}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Log Your Work</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm">What did you work on today?</label>
              <Textarea 
                placeholder="e.g., Completed device checks, fixed screen issues..."
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm">Hours worked</label>
              <input 
                type="number" 
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg"
                placeholder="0.5"
                step="0.5"
              />
            </div>

            <div>
              <label className="text-sm">Category</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {['Device Checks', 'Repairs', 'Learning', 'Other'].map((cat) => (
                  <Button key={cat} variant="outline" size="sm">
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogWork(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowLogWork(false)}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
