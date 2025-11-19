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
            <div className="flex items-center gap-2 mt-1"></div>
          </div>
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
        <p>VILS | Digital Promise TechTeam App v1.0.0</p>
        <p>Student Device Support</p>
      </div>
    </div>
  );
}
