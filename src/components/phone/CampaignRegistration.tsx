
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface CampaignRegistrationProps {
  data?: any;
  brandData?: any;
  onSave: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CampaignRegistration: React.FC<CampaignRegistrationProps> = ({
  data,
  brandData,
  onSave,
  onNext,
  onBack
}) => {
  const [formData, setFormData] = useState({
    campaignName: data?.campaignName || '',
    useCase: data?.useCase || '',
    vertical: data?.vertical || '',
    trafficType: data?.trafficType || '',
    sampleMessages: data?.sampleMessages || [''],
    sampleUrls: data?.sampleUrls || [''],
    optOutLanguage: data?.optOutLanguage || 'Reply STOP to unsubscribe',
    sendWindow: data?.sendWindow || '',
    privacyPolicyUrl: data?.privacyPolicyUrl || '',
    campaignDescription: data?.campaignDescription || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const useCases = [
    'Marketing', 'Notifications', 'OTP', 'Alerts', 'Service Messages',
    'Account Notifications', 'Customer Service', 'Appointment Reminders',
    'Lead Generation', 'Surveys'
  ];

  const verticals = [
    'Retail', 'Finance', 'Healthcare', 'Utilities', 'Travel',
    'Education', 'Insurance', 'Real Estate', 'Technology',
    'Automotive', 'Entertainment', 'Non-Profit'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.campaignName.trim()) {
      newErrors.campaignName = 'Campaign name is required';
    } else if (formData.campaignName.length < 2 || formData.campaignName.length > 50) {
      newErrors.campaignName = 'Campaign name must be 2-50 characters';
    }

    if (!formData.useCase) {
      newErrors.useCase = 'Use case is required';
    }

    if (!formData.vertical) {
      newErrors.vertical = 'Vertical is required';
    }

    if (!formData.trafficType) {
      newErrors.trafficType = 'Traffic type is required';
    }

    const validMessages = formData.sampleMessages.filter(msg => msg.trim().length > 0);
    if (validMessages.length < 2) {
      newErrors.sampleMessages = 'At least 2 sample messages are required';
    } else {
      const invalidMessages = validMessages.filter(msg => msg.length > 160);
      if (invalidMessages.length > 0) {
        newErrors.sampleMessages = 'Each message must be 160 characters or less';
      }
    }

    if (!formData.optOutLanguage.trim()) {
      newErrors.optOutLanguage = 'Opt-out language is required';
    }

    if (formData.trafficType === 'promotional' && !formData.privacyPolicyUrl.trim()) {
      newErrors.privacyPolicyUrl = 'Privacy policy URL is required for promotional campaigns';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      onNext();
      toast.success('Campaign information saved successfully');
    }
  };

  const addSampleMessage = () => {
    if (formData.sampleMessages.length < 5) {
      setFormData(prev => ({
        ...prev,
        sampleMessages: [...prev.sampleMessages, '']
      }));
    }
  };

  const removeSampleMessage = (index: number) => {
    if (formData.sampleMessages.length > 1) {
      setFormData(prev => ({
        ...prev,
        sampleMessages: prev.sampleMessages.filter((_, i) => i !== index)
      }));
    }
  };

  const updateSampleMessage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      sampleMessages: prev.sampleMessages.map((msg, i) => i === index ? value : msg)
    }));
  };

  const addSampleUrl = () => {
    setFormData(prev => ({
      ...prev,
      sampleUrls: [...prev.sampleUrls, '']
    }));
  };

  const removeSampleUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sampleUrls: prev.sampleUrls.filter((_, i) => i !== index)
    }));
  };

  const updateSampleUrl = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      sampleUrls: prev.sampleUrls.map((url, i) => i === index ? value : url)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          {brandData && (
            <p className="text-sm text-muted-foreground">
              Creating campaign for: <Badge variant="outline">{brandData.legalBusinessName}</Badge>
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="campaignName">Campaign Name *</Label>
              <Input
                id="campaignName"
                value={formData.campaignName}
                onChange={(e) => setFormData(prev => ({ ...prev, campaignName: e.target.value }))}
                placeholder="Q4 Marketing Campaign"
                className={errors.campaignName ? 'border-red-500' : ''}
              />
              {errors.campaignName && (
                <p className="text-sm text-red-500 mt-1">{errors.campaignName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="useCase">Use Case *</Label>
              <Select value={formData.useCase} onValueChange={(value) => setFormData(prev => ({ ...prev, useCase: value }))}>
                <SelectTrigger className={errors.useCase ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select use case" />
                </SelectTrigger>
                <SelectContent>
                  {useCases.map((useCase) => (
                    <SelectItem key={useCase} value={useCase.toLowerCase().replace(/\s+/g, '_')}>
                      {useCase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.useCase && (
                <p className="text-sm text-red-500 mt-1">{errors.useCase}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="vertical">Industry Vertical *</Label>
            <Select value={formData.vertical} onValueChange={(value) => setFormData(prev => ({ ...prev, vertical: value }))}>
              <SelectTrigger className={errors.vertical ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {verticals.map((vertical) => (
                  <SelectItem key={vertical} value={vertical.toLowerCase().replace(/\s+/g, '_')}>
                    {vertical}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vertical && (
              <p className="text-sm text-red-500 mt-1">{errors.vertical}</p>
            )}
          </div>

          <div>
            <Label>Traffic Type *</Label>
            <RadioGroup
              value={formData.trafficType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, trafficType: value }))}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transactional" id="transactional" />
                <Label htmlFor="transactional">Transactional (OTPs, alerts, notifications)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="promotional" id="promotional" />
                <Label htmlFor="promotional">Promotional (marketing, sales)</Label>
              </div>
            </RadioGroup>
            {errors.trafficType && (
              <p className="text-sm text-red-500 mt-1">{errors.trafficType}</p>
            )}
          </div>

          <div>
            <Label htmlFor="campaignDescription">Campaign Description</Label>
            <Textarea
              id="campaignDescription"
              value={formData.campaignDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, campaignDescription: e.target.value }))}
              placeholder="Brief description of this campaign for internal use"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample Messages</CardTitle>
          <p className="text-sm text-muted-foreground">
            Provide 2-5 examples of messages you'll send. These must reflect your actual traffic.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.sampleMessages.map((message, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor={`message-${index}`}>Sample Message {index + 1}</Label>
                <Textarea
                  id={`message-${index}`}
                  value={message}
                  onChange={(e) => updateSampleMessage(index, e.target.value)}
                  placeholder="Hi John, your appointment is confirmed for tomorrow at 2 PM. Reply STOP to opt out."
                  rows={2}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {message.length}/160 characters
                </p>
              </div>
              {formData.sampleMessages.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSampleMessage(index)}
                  className="mt-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          {formData.sampleMessages.length < 5 && (
            <Button type="button" variant="outline" onClick={addSampleMessage}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sample Message
            </Button>
          )}
          
          {errors.sampleMessages && (
            <p className="text-sm text-red-500">{errors.sampleMessages}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample URLs (Optional)</CardTitle>
          <p className="text-sm text-muted-foreground">
            If your messages include links, list the URLs you'll use.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.sampleUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={url}
                  onChange={(e) => updateSampleUrl(index, e.target.value)}
                  placeholder="https://your-domain.com/landing-page"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeSampleUrl(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button type="button" variant="outline" onClick={addSampleUrl}>
            <Plus className="h-4 w-4 mr-2" />
            Add URL
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="optOutLanguage">Opt-out Instructions *</Label>
            <Input
              id="optOutLanguage"
              value={formData.optOutLanguage}
              onChange={(e) => setFormData(prev => ({ ...prev, optOutLanguage: e.target.value }))}
              placeholder="Reply STOP to unsubscribe"
              className={errors.optOutLanguage ? 'border-red-500' : ''}
            />
            {errors.optOutLanguage && (
              <p className="text-sm text-red-500 mt-1">{errors.optOutLanguage}</p>
            )}
          </div>

          <div>
            <Label htmlFor="sendWindow">Message Send Window</Label>
            <Input
              id="sendWindow"
              value={formData.sendWindow}
              onChange={(e) => setFormData(prev => ({ ...prev, sendWindow: e.target.value }))}
              placeholder="9 AM - 9 PM local time"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Optional: Specify allowed sending hours
            </p>
          </div>

          {formData.trafficType === 'promotional' && (
            <div>
              <Label htmlFor="privacyPolicyUrl">Privacy Policy URL *</Label>
              <Input
                id="privacyPolicyUrl"
                value={formData.privacyPolicyUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, privacyPolicyUrl: e.target.value }))}
                placeholder="https://your-website.com/privacy"
                className={errors.privacyPolicyUrl ? 'border-red-500' : ''}
              />
              {errors.privacyPolicyUrl && (
                <p className="text-sm text-red-500 mt-1">{errors.privacyPolicyUrl}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" size="lg">
          Save & Continue
        </Button>
      </div>
    </form>
  );
};
