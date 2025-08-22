import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Users, 
  Phone, 
  ArrowRight, 
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SimpleLaunchPad = () => {
  const { userProfile, currentSubAccount } = useAuth();
  const navigate = useNavigate();

  const steps = [
    {
      title: "Create Your First AI Assistant",
      description: "Set up a voice AI to handle your calls automatically",
      icon: Bot,
      action: () => navigate(`/${currentSubAccount?.id}/agents`),
      buttonText: "Create Assistant"
    },
    {
      title: "Import Your Contacts",
      description: "Upload your customer list to start making calls",
      icon: Users,
      action: () => navigate(`/${currentSubAccount?.id}/contacts`),
      buttonText: "Import Contacts"
    },
    {
      title: "Get a Phone Number",
      description: "Purchase or port a number for your AI assistant",
      icon: Phone,
      action: () => navigate(`/${currentSubAccount?.id}/phone-numbers`),
      buttonText: "Get Number"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-primary/10 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to KingCaller, {userProfile?.name}!</h1>
          <p className="text-muted-foreground text-lg">
            Get started with these 3 essential steps to launch your AI voice assistant.
          </p>
        </div>

        {/* Quick Setup Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary">{index + 1}</Badge>
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{step.description}</p>
                <Button onClick={step.action} className="w-full">
                  {step.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => navigate(`/${currentSubAccount?.id}/dashboard`)}>
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate(`/${currentSubAccount?.id}/settings`)}>
                Account Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleLaunchPad;