import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';
import { 
  Building2, 
  MessageSquare, 
  Phone, 
  Shield, 
  CheckCircle, 
  Info,
  Clock,
  AlertCircle
} from 'lucide-react';
import { BrandRegistration } from './BrandRegistration';
import { CampaignRegistration } from './CampaignRegistration';
import { PhoneNumberRegistration } from './PhoneNumberRegistration';
import { ComplianceVerification } from './ComplianceVerification';
import { RegistrationReview } from './RegistrationReview';
import { A2PRegistrationService } from '@/services/a2pRegistrationService';
import { A2PRegistration } from '@/types/a2p';
import { useAuth } from '@/contexts/AuthContext';
import { useSubAccount } from '@/contexts/SubAccountContext';

interface A2PProcessSystemProps {
  onComplete?: (data: any) => void;
}

const A2PProcessSystem: React.FC<A2PProcessSystemProps> = ({ onComplete }) => {
  const { currentUser } = useAuth();
  const { currentSubAccount } = useSubAccount();
  
  const [registration, setRegistration] = useState<A2PRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Initialize or load existing registration
  useEffect(() => {
    const initializeRegistration = async () => {
      if (!currentSubAccount?.id || !currentUser?.uid) return;
      
      setLoading(true);
      try {
        // Try to get existing active registration
        let existingRegistration = await A2PRegistrationService.getActiveRegistration(currentSubAccount.id);
        
        if (!existingRegistration) {
          // Create new registration
          const registrationId = await A2PRegistrationService.createRegistration(
            currentSubAccount.id,
            currentUser.uid
          );
          existingRegistration = await A2PRegistrationService.getRegistration(registrationId);
        }
        
        setRegistration(existingRegistration);
      } catch (error) {
        console.error('Error initializing registration:', error);
        toast.error('Failed to initialize registration');
      } finally {
        setLoading(false);
      }
    };

    initializeRegistration();
  }, [currentSubAccount?.id, currentUser?.uid]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!registration?.id) return;

    const unsubscribe = A2PRegistrationService.subscribeToRegistration(
      registration.id,
      (updatedRegistration) => {
        if (updatedRegistration) {
          setRegistration(updatedRegistration);
        }
      }
    );

    return unsubscribe;
  }, [registration?.id]);

  const steps = [
    {
      id: 1,
      title: 'Brand Registration',
      description: 'Register your brand with Twilio',
      icon: Building2,
      status: getStepStatus(1)
    },
    {
      id: 2,
      title: 'Campaign Registration',
      description: 'Create your messaging campaign',
      icon: MessageSquare,
      status: getStepStatus(2)
    },
    {
      id: 3,
      title: 'Phone Number Registration',
      description: 'Register phone numbers for your campaign',
      icon: Phone,
      status: getStepStatus(3)
    },
    {
      id: 4,
      title: 'Compliance Verification',
      description: 'Complete compliance requirements',
      icon: Shield,
      status: getStepStatus(4)
    },
    {
      id: 5,
      title: 'Review & Submit',
      description: 'Review and submit your registration',
      icon: CheckCircle,
      status: getStepStatus(5)
    }
  ];

  function getStepStatus(stepNumber: number): 'pending' | 'current' | 'completed' {
    if (!registration) return 'pending';
    if (registration.currentStep > stepNumber - 1) return 'completed';
    if (registration.currentStep === stepNumber - 1) return 'current';
    return 'pending';
  }

  const handleStepSave = useCallback(async (stepData: any) => {
    if (!registration?.id) return;
    
    setSaving(true);
    try {
      await A2PRegistrationService.updateStep(registration.id, registration.currentStep + 1, stepData);
      toast.success('Progress saved');
    } catch (error) {
      console.error('Error saving step:', error);
      toast.error('Failed to save progress');
    } finally {
      setSaving(false);
    }
  }, [registration?.id, registration?.currentStep]);

  const handleNext = useCallback(async () => {
    if (!registration?.id) return;
    
    try {
      const nextStep = Math.min(registration.currentStep + 1, steps.length - 1);
      await A2PRegistrationService.updateRegistration(registration.id, {
        currentStep: nextStep
      });
    } catch (error) {
      console.error('Error advancing step:', error);
      toast.error('Failed to advance to next step');
    }
  }, [registration?.id, registration?.currentStep, steps.length]);

  const handleBack = useCallback(async () => {
    if (!registration?.id) return;
    
    try {
      const prevStep = Math.max(registration.currentStep - 1, 0);
      await A2PRegistrationService.updateRegistration(registration.id, {
        currentStep: prevStep
      });
    } catch (error) {
      console.error('Error going back:', error);
      toast.error('Failed to go back');
    }
  }, [registration?.id, registration?.currentStep]);

  const handleComplete = useCallback(async () => {
    if (!registration?.id) return;
    
    setSaving(true);
    try {
      await A2PRegistrationService.submitRegistration(registration.id);
      toast.success('Registration submitted successfully!');
      
      if (onComplete) {
        onComplete(registration);
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error('Failed to submit registration');
    } finally {
      setSaving(false);
    }
  }, [registration?.id, registration, onComplete]);

  const renderStepContent = () => {
    if (!registration) return null;
    
    const currentStepIndex = registration.currentStep;
    
    switch (currentStepIndex) {
      case 0:
        return (
          <BrandRegistration
            data={registration.brandData}
            onSave={handleStepSave}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <CampaignRegistration
            data={registration.campaignData}
            brandData={registration.brandData}
            onSave={handleStepSave}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <PhoneNumberRegistration
            data={registration.phoneNumberData}
            brandData={registration.brandData}
            campaignData={registration.campaignData}
            onSave={handleStepSave}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ComplianceVerification
            data={registration.complianceData}
            onSave={handleStepSave}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <RegistrationReview
            data={registration}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!registration) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to load registration. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            A2P Registration Process
            <div className="flex items-center gap-2">
              {saving && <LoadingSpinner />}
              <Badge variant={registration.status === 'submitted' ? "default" : "secondary"}>
                Step {registration.currentStep + 1} of {steps.length}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {registration.status}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Progress Header */}
          <div className="mb-8">
            <Progress value={((registration.currentStep + 1) / steps.length) * 100} className="mb-6" />
            
            {/* Steps visualization */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const status = step.status;
                
                return (
                  <div key={step.id} className="flex flex-col items-center space-y-2">
                    <div className={`
                      rounded-full p-3 border-2 transition-colors
                      ${status === 'completed' ? 'bg-green-100 border-green-500 text-green-700' : 
                        status === 'current' ? 'bg-blue-100 border-blue-500 text-blue-700' : 
                        'bg-gray-100 border-gray-300 text-gray-500'}
                    `}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{step.title}</p>
                      <Badge variant={
                        status === 'completed' ? 'default' : 
                        status === 'current' ? 'secondary' : 'outline'
                      } className="text-xs">
                        {status === 'completed' ? 'Done' : 
                         status === 'current' ? 'Active' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current Step Alert */}
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>{steps[registration.currentStep]?.title}:</strong> {steps[registration.currentStep]?.description}
              </AlertDescription>
            </Alert>
          </div>

          {/* Step Content */}
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Important A2P Requirements */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> A2P registration is required for business messaging. 
          Brand registration typically takes 2-5 business days, and campaign registration may take up to 10 business days.
          All information must be accurate and verifiable.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export { A2PProcessSystem };