
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Bot, 
  Users, 
  Phone, 
  Workflow, 
  BarChart3, 
  Settings, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { useAuth } from '@/contexts/AuthContext';

const LaunchPad = () => {
  const navigate = useNavigate();
  const { subAccountId } = useParams();
  const { userProfile } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if this is a new user (show onboarding modal)
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(`onboarding_seen_${subAccountId}`);
    const isNewUser = !hasSeenOnboarding;
    
    if (isNewUser && userProfile) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setShowOnboarding(true);
      }, 500);
    }
  }, [subAccountId, userProfile]);

  const leftSteps = [
    {
      id: 1,
      title: "Create Your First AI Assistant",
      description: "Set up your first voice AI assistant to handle customer calls",
      icon: Bot,
      route: `/${subAccountId}/assistants`,
      color: "bg-blue-500",
      category: "Essential"
    },
    {
      id: 3,
      title: "Get a Phone Number",
      description: "Purchase or port a phone number for your AI assistant",
      icon: Phone,
      route: `/${subAccountId}/phone-numbers`,
      color: "bg-purple-500",
      category: "Essential"
    },
    {
      id: 5,
      title: "Set Up Analytics",
      description: "Monitor your AI assistant's performance and optimize results",
      icon: BarChart3,
      route: `/${subAccountId}/analytics`,
      color: "bg-teal-500",
      category: "Growth"
    }
  ];

  const rightSteps = [
    {
      id: 2,
      title: "Import Your Contacts",
      description: "Add your customer contacts to start making calls",
      icon: Users,
      route: `/${subAccountId}/contacts`,
      color: "bg-green-500",
      category: "Essential"
    },
    {
      id: 4,
      title: "Build Your First Workflow",
      description: "Create automated workflows to handle complex call scenarios",
      icon: Workflow,
      route: `/${subAccountId}/workflows`,
      color: "bg-orange-500",
      category: "Advanced"
    },
    {
      id: 6,
      title: "Configure Team Settings",
      description: "Invite team members and set up permissions",
      icon: Settings,
      route: `/${subAccountId}/team-settings`,
      color: "bg-indigo-500",
      category: "Growth"
    }
  ];

  const handleStepClick = (route: string) => {
    navigate(route);
  };

  const handleCompleteLaunchPad = () => {
    // Mark launchpad as completed for this sub-account
    localStorage.setItem(`launchpad_completed_${subAccountId}`, 'true');
    navigate(`/${subAccountId}/dashboard`);
  };

  const handleOnboardingClose = () => {
    // Mark onboarding as seen
    localStorage.setItem(`onboarding_seen_${subAccountId}`, 'true');
    setShowOnboarding(false);
  };

  const StepCard = ({ step, side }: { step: typeof leftSteps[0], side: 'left' | 'right' }) => (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/50 ${
        side === 'left' ? 'mr-8' : 'ml-8'
      }`}
      onClick={() => handleStepClick(step.route)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-lg ${step.color} flex items-center justify-center text-white mb-3`}>
            <step.icon className="h-6 w-6" />
          </div>
          <Badge variant="outline" className="text-xs">
            {step.category}
          </Badge>
        </div>
        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
          {step.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {step.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button variant="ghost" size="sm" className="w-full justify-between text-primary">
          Get Started
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-gray-900">Welcome to KingCaller!</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Let's get your Voice AI platform set up. Follow these steps to unlock the full potential of AI-powered calling.
            </p>
            <Button variant="outline" onClick={handleCompleteLaunchPad} className="mb-8">
              Skip to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Main Flow with Vertical Line */}
          <div className="max-w-6xl mx-auto relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 transform -translate-x-1/2 z-10"></div>
            
            {/* Steps Grid */}
            <div className="relative z-20">
              {leftSteps.map((leftStep, index) => {
                const rightStep = rightSteps[index];
                return (
                  <div key={leftStep.id} className="grid grid-cols-2 gap-8 mb-8">
                    {/* Left Side */}
                    <div className="flex justify-end">
                      <div className="w-full max-w-sm">
                        <StepCard step={leftStep} side="left" />
                      </div>
                    </div>
                    
                    {/* Right Side */}
                    <div className="flex justify-start">
                      <div className="w-full max-w-sm">
                        <StepCard step={rightStep} side="right" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="text-center mt-16">
            <Card className="max-w-md mx-auto bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>Ready to Launch?</CardTitle>
                <CardDescription>
                  Once you've completed the essential steps, you'll be ready to start making AI-powered calls!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleCompleteLaunchPad} className="w-full" size="lg">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
        userEmail={userProfile?.email}
      />
    </>
  );
};

export default LaunchPad;
