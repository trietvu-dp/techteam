import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { 
  Sparkles, 
  Target, 
  User,
  Award,
  ChevronRight,
  BookOpen,
  Wrench,
  Network
} from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState('🚀');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const avatarOptions = ['🚀', '🎯', '⚡', '🌟', '💡', '🔧', '🎨', '🦄'];

  const skillAreas = [
    { id: 'hardware', name: 'Hardware Troubleshooting', icon: Wrench, level: 'beginner' },
    { id: 'software', name: 'Software Support', icon: BookOpen, level: 'beginner' },
    { id: 'network', name: 'Network Issues', icon: Network, level: 'beginner' },
    { id: 'chromebook', name: 'Chromebook Repair', icon: Wrench, level: 'intermediate' },
    { id: 'ipad', name: 'iPad/Tablet Support', icon: Wrench, level: 'intermediate' },
    { id: 'advanced', name: 'Advanced Diagnostics', icon: Target, level: 'advanced' },
  ];

  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 text-center">
            <div className="text-6xl mb-4">
              👋
            </div>
            <div>
              <h2>Hey! I Noticed You're New Here</h2>
              <p className="text-slate-600 mt-2">
                Welcome to TechTeam! Let's get you set up in just 3 quick steps.
              </p>
            </div>

            <Card className="p-6 text-left space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span>1</span>
                </div>
                <div>
                  <h3 className="text-sm">App Overview</h3>
                  <p className="text-sm text-slate-600">
                    Track device checks, manage repairs, and build tech skills
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span>2</span>
                </div>
                <div>
                  <h3 className="text-sm">Self-Assessment</h3>
                  <p className="text-sm text-slate-600">
                    Connected to future recommendations
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span>3</span>
                </div>
                <div>
                  <h3 className="text-sm">Profile Setup</h3>
                  <p className="text-sm text-slate-600">
                    Choose an avatar and personalize your experience
                  </p>
                </div>
              </div>
            </Card>

            <Button onClick={nextStep} className="w-full" size="lg">
              Get Started
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h2>Tell Us About Yourself</h2>
              <p className="text-slate-600 mt-2">
                This helps us recommend the right challenges and resources for you
              </p>
            </div>

            <div>
              <h3 className="mb-3">What areas are you interested in exploring?</h3>
              <p className="text-sm text-slate-600 mb-4">Select all that apply</p>
              
              <div className="space-y-2">
                {skillAreas.map((skill) => {
                  const SkillIcon = skill.icon;
                  const isSelected = selectedSkills.includes(skill.id);
                  
                  return (
                    <Card
                      key={skill.id}
                      className={`p-4 cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-50 border-blue-300 shadow-sm' 
                          : 'hover:bg-slate-50'
                      }`}
                      onClick={() => handleSkillToggle(skill.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-blue-100' : 'bg-slate-100'
                        }`}>
                          <SkillIcon className={`w-5 h-5 ${
                            isSelected ? 'text-blue-600' : 'text-slate-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm">{skill.name}</h4>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                skill.level === 'beginner' ? 'bg-green-100 text-green-700' :
                                skill.level === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                                'bg-purple-100 text-purple-700'
                              }`}
                            >
                              {skill.level}
                            </Badge>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'border-slate-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                Back
              </Button>
              <Button 
                onClick={nextStep} 
                className="flex-1"
                disabled={selectedSkills.length === 0}
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-orange-600" />
              </div>
              <h2>Choose Your Avatar</h2>
              <p className="text-slate-600 mt-2">
                Pick an avatar that represents you
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`aspect-square rounded-2xl flex items-center justify-center text-4xl transition-all ${
                    selectedAvatar === avatar
                      ? 'bg-gradient-to-br from-blue-100 to-purple-100 ring-4 ring-blue-600 scale-105 shadow-lg'
                      : 'bg-slate-100 hover:bg-slate-200 hover:scale-105'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-green-600" />
                <h3>You're All Set!</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Based on your interests, we've prepared some recommendations:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Join the "Hardware Master" challenge</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>Start with beginner-level resources</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-600" />
                  <span>Get certified in your chosen areas</span>
                </div>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={onComplete} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                Start Using TechTeam
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Step {step} of 3</span>
            <span className="text-sm text-slate-600">{Math.round((step / 3) * 100)}%</span>
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
        </div>

        <Card className="p-6">
          {renderStep()}
        </Card>
      </div>
    </div>
  );
}
