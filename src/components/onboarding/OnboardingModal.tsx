import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Bot, 
  Users, 
  Phone, 
  ArrowRight, 
  CheckCircle,
  Target,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  userEmail
}) => {
  const { userProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to KingCaller!",
      description: "Your AI-powered voice platform is ready to transform how you handle calls.",
      icon: Sparkles,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Hello {userProfile?.name}!</h3>
            <p className="text-muted-foreground">
              Welcome to your new Voice AI workspace. Let's get you started with the essentials.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium">AI Assistants</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium">Contact Management</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium">Phone Numbers</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Quick Setup Guide",
      description: "Follow these 3 essential steps to get your AI assistant running.",
      icon: Target,
      content: (
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-medium">Create Your First AI Assistant</h4>
                <p className="text-sm text-muted-foreground">Set up a voice AI to handle your calls automatically</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-medium">Import Your Contacts</h4>
                <p className="text-sm text-muted-foreground">Upload your customer list to start making calls</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-medium">Get a Phone Number</h4>
                <p className="text-sm text-muted-foreground">Purchase or port a number for your AI assistant</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-medium text-sm">Pro Tip</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You can always return to this guide from the LaunchPad. Take your time setting up each component properly.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "You're All Set!",
      description: "Time to explore your new Voice AI platform.",
      icon: CheckCircle,
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Ready to Launch!</h3>
          <p className="text-muted-foreground mb-4">
            Your workspace is ready. Follow the LaunchPad guide to complete your setup and start making AI-powered calls.
          </p>
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-4">
            <p className="text-sm font-medium mb-2">What's Next?</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Complete the essential setup steps</li>
              <li>• Test your first AI assistant</li>
              <li>• Start making calls to your contacts</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onClose();
  };

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <currentStepData.icon className="h-6 w-6 text-primary" />
            <DialogTitle className="text-xl">{currentStepData.title}</DialogTitle>
          </div>
          <DialogDescription>
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {/* Progress indicator */}
          <div className="flex justify-between items-center mb-6">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    index <= currentStep 
                      ? 'bg-primary text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div 
                    className={`w-12 h-1 mx-2 transition-colors ${
                      index < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} 
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <Card>
            <CardContent className="p-6">
              {currentStepData.content}
            </CardContent>
          </Card>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between gap-3">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};