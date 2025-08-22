import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building, 
  MessageSquare, 
  Phone, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Send,
  ExternalLink
} from 'lucide-react';

interface RegistrationReviewProps {
  data: any;
  onBack: () => void;
  onComplete: () => void;
}

export const RegistrationReview: React.FC<RegistrationReviewProps> = ({
  data,
  onBack,
  onComplete
}) => {
  const { brand, campaign, phoneNumbers, compliance } = data;

  const getSectionStatus = (sectionData: any) => {
    if (!sectionData || Object.keys(sectionData).length === 0) {
      return { status: 'incomplete', label: 'Incomplete', variant: 'destructive' as const };
    }
    return { status: 'complete', label: 'Complete', variant: 'default' as const };
  };

  const renderBrandSummary = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Brand Registration
          <Badge variant={getSectionStatus(brand).variant}>
            {getSectionStatus(brand).label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Legal Business Name</h4>
            <p className="font-medium">{brand?.legalBusinessName || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Display Name</h4>
            <p className="font-medium">{brand?.displayName || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">EIN</h4>
            <p className="font-medium">{brand?.ein || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Industry</h4>
            <p className="font-medium">{brand?.industry || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Website</h4>
            {brand?.website ? (
              <a 
                href={brand.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                {brand.website}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <p className="font-medium">Not provided</p>
            )}
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Monthly Volume</h4>
            <p className="font-medium">{brand?.monthlyVolume || 'Not provided'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCampaignSummary = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Campaign Registration
          <Badge variant={getSectionStatus(campaign).variant}>
            {getSectionStatus(campaign).label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Campaign Name</h4>
            <p className="font-medium">{campaign?.campaignName || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Use Case</h4>
            <p className="font-medium">{campaign?.useCase || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Vertical</h4>
            <p className="font-medium">{campaign?.vertical || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Traffic Type</h4>
            <p className="font-medium">{campaign?.trafficType || 'Not provided'}</p>
          </div>
        </div>
        
        {campaign?.sampleMessages && campaign.sampleMessages.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Sample Messages</h4>
            <div className="space-y-2">
              {campaign.sampleMessages.filter(msg => msg.trim()).map((message: string, index: number) => (
                <div key={index} className="p-2 bg-muted rounded text-sm">
                  {message}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderPhoneNumbersSummary = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Phone Number Registration
          <Badge variant={phoneNumbers && phoneNumbers.length > 0 ? 'default' : 'destructive'}>
            {phoneNumbers && phoneNumbers.length > 0 ? 'Complete' : 'Incomplete'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {phoneNumbers && phoneNumbers.length > 0 ? (
          <div className="space-y-2">
            {phoneNumbers.map((phone: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{phone.number || 'Not provided'}</p>
                  <p className="text-sm text-muted-foreground capitalize">{phone.type}</p>
                </div>
                <Badge variant="secondary">
                  {phone.status || 'Pending'}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No phone numbers registered</p>
        )}
      </CardContent>
    </Card>
  );

  const renderComplianceSummary = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Compliance Verification
          <Badge variant={getSectionStatus(compliance).variant}>
            {getSectionStatus(compliance).label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Privacy Policy</h4>
            {compliance?.privacyPolicyUrl ? (
              <a 
                href={compliance.privacyPolicyUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
              >
                View Policy
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <p className="font-medium">Not provided</p>
            )}
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Terms of Service</h4>
            {compliance?.termsOfServiceUrl ? (
              <a 
                href={compliance.termsOfServiceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
              >
                View Terms
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <p className="font-medium">Not provided</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Compliance Acknowledgments</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant={compliance?.tcpaCompliance ? 'default' : 'outline'}>
              {compliance?.tcpaCompliance ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
              TCPA
            </Badge>
            <Badge variant={compliance?.canSpamCompliance ? 'default' : 'outline'}>
              {compliance?.canSpamCompliance ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
              CAN-SPAM
            </Badge>
            <Badge variant={compliance?.ctiaCompliance ? 'default' : 'outline'}>
              {compliance?.ctiaCompliance ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
              CTIA
            </Badge>
          </div>
        </div>

        {compliance?.complianceOfficer && (
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Compliance Officer</h4>
            <p className="font-medium">{compliance.complianceOfficer.name}</p>
            <p className="text-sm text-muted-foreground">{compliance.complianceOfficer.email}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const isReadyToSubmit = () => {
    return (
      brand && Object.keys(brand).length > 0 &&
      campaign && Object.keys(campaign).length > 0 &&
      phoneNumbers && phoneNumbers.length > 0 &&
      compliance && Object.keys(compliance).length > 0 &&
      compliance.tcpaCompliance &&
      compliance.canSpamCompliance &&
      compliance.ctiaCompliance
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
          <FileText className="h-6 w-6" />
          Registration Review
        </h2>
        <p className="text-muted-foreground">
          Review all information before submitting for A2P registration approval
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {renderBrandSummary()}
        {renderCampaignSummary()}
        {renderPhoneNumbersSummary()}
        {renderComplianceSummary()}
      </div>

      {/* Submission Status */}
      {isReadyToSubmit() ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Ready to Submit:</strong> All required information has been provided. 
            Your A2P registration will be submitted for carrier review upon confirmation.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Review Required:</strong> Please complete all sections with incomplete status 
            before submitting your A2P registration.
          </AlertDescription>
        </Alert>
      )}

      {/* Terms and Conditions */}
      <Card className="border-muted/50">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>By submitting this registration, you acknowledge that:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>All information provided is accurate and complete</li>
              <li>You have read and agree to comply with all carrier messaging policies</li>
              <li>Registration approval may take 2-10 business days</li>
              <li>Additional documentation may be requested during review</li>
              <li>Messaging rates and compliance requirements apply</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back to Compliance
        </Button>
        <Button 
          onClick={onComplete}
          disabled={!isReadyToSubmit()}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          Submit A2P Registration
        </Button>
      </div>
    </div>
  );
};

export default RegistrationReview;