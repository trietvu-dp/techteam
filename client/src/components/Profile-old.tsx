import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Trophy,
  Star,
  Award,
  Settings,
  LogOut,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  Target,
  Sparkles,
} from "lucide-react";

interface ProfileProps {
  onShowOnboarding?: () => void;
}

export function Profile({ onShowOnboarding }: ProfileProps) {
  const [selectedAvatar, setSelectedAvatar] = useState("🚀");

  const avatarOptions = ["🚀", "🎯", "⚡", "🌟", "💡", "🔧", "🎨", "🦄"];

  const userStats = {
    level: 4,
    points: 2420,
    checksCompleted: 87,
    repairsFixed: 23,
    skillsLearned: 12,
    streak: 8,
  };

  const achievements = [
    { id: 1, name: "First Device Check", icon: "✅", earned: true },
    { id: 2, name: "10 Repairs Complete", icon: "🔧", earned: true },
    { id: 3, name: "Week Streak", icon: "🔥", earned: true },
    { id: 4, name: "Quick Learner", icon: "⚡", earned: true },
    { id: 5, name: "Hardware Expert", icon: "💻", earned: false },
    { id: 6, name: "Network Ninja", icon: "📶", earned: false },
  ];

  const certifications = [
    { name: "Hardware Basics", status: "Earned", date: "Jan 2025" },
    { name: "Software Troubleshooting", status: "In Progress", progress: 65 },
    { name: "Network Diagnostics", status: "Not Started", progress: 0 },
  ];

  return (
    <div className="h-full overflow-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
            {selectedAvatar}
          </div>
          <div>
            <h2 className="text-white">Alex Johnson</h2>
            <p className="text-sm text-blue-100">Student Tech Team</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-white/20 text-white border-white/30">
                Level {userStats.level}
              </Badge>
              <Badge className="bg-yellow-400/20 text-yellow-100 border-yellow-300/30">
                🔥 {userStats.streak} day streak
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress to next level */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span>Level {userStats.level}</span>
            <span>{userStats.points} / 3000 pts</span>
          </div>
          <Progress
            value={(userStats.points / 3000) * 100}
            className="h-2 bg-white/20"
          />
          <p className="text-xs text-blue-100 mt-1">
            580 pts to Level {userStats.level + 1}
          </p>
        </div>
      </div>

      {/* Choose Avatar Section */}
      <div className="p-4 border-b">
        <h3 className="mb-3 flex items-center gap-2">
          <User className="w-4 h-4" />
          Choose Your Avatar
        </h3>
        <div className="grid grid-cols-8 gap-2">
          {avatarOptions.map((avatar) => (
            <button
              key={avatar}
              onClick={() => setSelectedAvatar(avatar)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                selectedAvatar === avatar
                  ? "bg-blue-100 ring-2 ring-blue-600 scale-110"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-4 border-b">
        <h3 className="mb-3">Your Stats</h3>
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <div className="text-blue-600">{userStats.checksCompleted}</div>
            <p className="text-xs text-slate-600">Checks</p>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-orange-600">{userStats.repairsFixed}</div>
            <p className="text-xs text-slate-600">Repairs</p>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-green-600">{userStats.skillsLearned}</div>
            <p className="text-xs text-slate-600">Skills</p>
          </Card>
        </div>
      </div>

      {/* Achievements */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-600" />
            Achievements
          </h3>
          <span className="text-sm text-slate-600">
            {achievements.filter((a) => a.earned).length}/{achievements.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`p-3 text-center ${
                achievement.earned
                  ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
                  : "opacity-40"
              }`}
            >
              <div className="text-2xl mb-1">{achievement.icon}</div>
              <p className="text-xs leading-tight">{achievement.name}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            Certifications
          </h3>
          <Button variant="link" className="text-sm p-0 h-auto">
            View All
          </Button>
        </div>
        <div className="space-y-2">
          {certifications.map((cert, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm">{cert.name}</h4>
                {cert.status === "Earned" && (
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    ✓ {cert.status}
                  </Badge>
                )}
              </div>
              {cert.status === "Earned" ? (
                <p className="text-xs text-slate-600">{cert.date}</p>
              ) : cert.status === "In Progress" ? (
                <>
                  <Progress value={cert.progress} className="h-1.5 mb-1" />
                  <p className="text-xs text-slate-600">
                    {cert.progress}% complete
                  </p>
                </>
              ) : (
                <p className="text-xs text-slate-600">Start your journey</p>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Self-Assessment */}
      <div className="p-4 border-b">
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <h3>Self-Assessment</h3>
          </div>
          <p className="text-sm text-slate-600 mb-3">
            Take a quick assessment to get personalized recommendations
          </p>
          <Button className="w-full" variant="outline">
            Start Assessment
          </Button>
        </Card>
      </div>

      {/* Settings & Options */}
      <div className="p-4 space-y-1">
        <h3 className="mb-3">Settings</h3>

        <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="text-sm">Notifications</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-slate-600" />
            <span className="text-sm">Privacy & Security</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-slate-600" />
            <span className="text-sm">Help & Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {onShowOnboarding && (
          <button
            onClick={onShowOnboarding}
            className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-slate-600" />
              <span className="text-sm">View Onboarding Again</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        )}

        <Separator className="my-3" />

        <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors text-red-600">
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* App Info */}
      <div className="p-4 text-center text-xs text-slate-400 border-t">
        <p>TechTeam v1.0.0</p>
        <p>Student Device Support</p>
      </div>
    </div>
  );
}
