import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Download,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface ComplianceVerificationProps {
  data?: any;
  allData?: any;
  onSave: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ComplianceVerification: React.FC<ComplianceVerificationProps> = ({
  data = {},
  allData,
  onSave,
  onNext,
  onBack
}) => {
  const [complianceData, setComplianceData] = useState({
    privacyPolicyUrl: data?.privacyPolicyUrl || '',
    termsOfServiceUrl: data?.termsOfServiceUrl || '',
    tcpaCompliance: data?.tcpaCompliance || false,
    canSpamCompliance: data?.canSpamCompliance || false,
    ctiaCompliance: data?.ctiaCompliance || false,
    optInProcess: data?.optInProcess || '',
    optOutProcess: data?.optOutProcess || '',
    dataRetentionPolicy: data?.dataRetentionPolicy || '',
    businessLicense: data?.businessLicense || null,
    w9Form: data?.w9Form || null,
    additionalDocuments: data?.additionalDocuments || [],
    complianceOfficer: {
      name: data?.complianceOfficer?.name || '',
      email: data?.complianceOfficer?.email || '',
      phone: data?.complianceOfficer?.phone || ''
    },
    monthlyVolumeVerification: data?.monthlyVolumeVerification || '',
    useCase24Hours: data?.useCase24Hours || false,
    emergencyContact: data?.emergencyContact || false,
    ...data
  });

  const [uploadingFile, setUploadingFile] = useState<string | null>(null);

  const complianceRequirements = [
    {
      key: 'tcpaCompliance',
      label: 'TCPA Compliance',
      description: 'Telephone Consumer Protection Act compliance for automated messaging',
      required: true
    },
    {
      key: 'canSpamCompliance',
      label: 'CAN-SPAM Compliance',
      description: 'Compliance with CAN-SPAM Act for commercial messaging',
      required: true
    },
    {
      key: 'ctiaCompliance',
      label: 'CTIA Compliance',
      description: 'Cellular Telecommunications Industry Association messaging guidelines',
      required: true
    }
  ];

  const documentRequirements = [
    {
      key: 'businessLicense',
      label: 'Business License',
      description: 'Valid business license or incorporation documents',
      required: true
    },
    {
      key: 'w9Form',
      label: 'W-9 Tax Form',
      description: 'Completed W-9 form for tax reporting',
      required: true
    }
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setComplianceData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setComplianceData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFileUpload = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(field);
    
    // Simulate file upload
    setTimeout(() => {
      handleInputChange(field, {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      });
      setUploadingFile(null);
      toast.success(`${file.name} uploaded successfully`);
    }, 2000);
  };

  const validateCompliance = () => {
    const errors: string[] = [];

    // Check required URLs
    if (!complianceData.privacyPolicyUrl) errors.push('Privacy Policy URL is required');
    if (!complianceData.termsOfServiceUrl) errors.push('Terms of Service URL is required');

    // Check compliance checkboxes
    complianceRequirements.forEach(req => {
      if (req.required && !complianceData[req.key]) {
        errors.push(`${req.label} acknowledgment is required`);
      }
    });

    // Check required documents
    documentRequirements.forEach(doc => {
      if (doc.required && !complianceData[doc.key]) {
        errors.push(`${doc.label} is required`);
      }
    });

    // Check compliance officer info
    if (!complianceData.complianceOfficer.name) errors.push('Compliance Officer name is required');
    if (!complianceData.complianceOfficer.email) errors.push('Compliance Officer email is required');

    if (errors.length > 0) {
      toast.error(`Please address the following issues: ${errors.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateCompliance()) return;

    onSave(complianceData);
    onNext();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
          <Shield className="h-6 w-6" />
          Compliance Verification
        </h2>
        <p className="text-muted-foreground">
          Verify compliance requirements and upload required documentation
        </p>
      </div>

      {/* Legal URLs */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Documentation URLs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="privacyPolicy">Privacy Policy URL *</Label>
            <div className="flex gap-2">
              <Input
                id="privacyPolicy"
                placeholder="https://yourcompany.com/privacy"
                value={complianceData.privacyPolicyUrl}
                onChange={(e) => handleInputChange('privacyPolicyUrl', e.target.value)}
              />
              {complianceData.privacyPolicyUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={complianceData.privacyPolicyUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="termsOfService">Terms of Service URL *</Label>
            <div className="flex gap-2">
              <Input
                id="termsOfService"
                placeholder="https://yourcompany.com/terms"
                value={complianceData.termsOfServiceUrl}
                onChange={(e) => handleInputChange('termsOfServiceUrl', e.target.value)}
              />
              {complianceData.termsOfServiceUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={complianceData.termsOfServiceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Acknowledgments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {complianceRequirements.map((requirement) => (
            <div key={requirement.key} className="flex items-start space-x-3">
              <Checkbox
                id={requirement.key}
                checked={complianceData[requirement.key]}
                onCheckedChange={(checked) => handleInputChange(requirement.key, checked)}
              />
              <div className="space-y-1">
                <Label htmlFor={requirement.key} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {requirement.label} {requirement.required && <span className="text-destructive">*</span>}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {requirement.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Document Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {documentRequirements.map((document) => (
            <div key={document.key} className="space-y-2">
              <Label>
                {document.label} {document.required && <span className="text-destructive">*</span>}
              </Label>
              <p className="text-sm text-muted-foreground">{document.description}</p>
              
              {complianceData[document.key] ? (
                <div className="flex items-center gap-2 p-3 border rounded-lg bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    {complianceData[document.key].name}
                  </span>
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    Uploaded
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={(e) => handleFileUpload(document.key, e)}
                    disabled={uploadingFile === document.key}
                    className="flex-1"
                  />
                  {uploadingFile === document.key && (
                    <div className="text-sm text-muted-foreground">Uploading...</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Compliance Officer */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Officer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="officerName">Full Name *</Label>
              <Input
                id="officerName"
                placeholder="John Smith"
                value={complianceData.complianceOfficer.name}
                onChange={(e) => handleInputChange('complianceOfficer.name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="officerEmail">Email Address *</Label>
              <Input
                id="officerEmail"
                type="email"
                placeholder="john.smith@company.com"
                value={complianceData.complianceOfficer.email}
                onChange={(e) => handleInputChange('complianceOfficer.email', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="officerPhone">Phone Number</Label>
            <Input
              id="officerPhone"
              placeholder="+1 (555) 123-4567"
              value={complianceData.complianceOfficer.phone}
              onChange={(e) => handleInputChange('complianceOfficer.phone', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Compliance Notice */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Important:</strong> All compliance documentation will be reviewed by carrier partners. 
          Incomplete or inaccurate information may result in registration delays or rejection. 
          Please ensure all documents are current and properly executed.
        </AlertDescription>
      </Alert>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back to Phone Numbers
        </Button>
        <Button onClick={handleSubmit} className="flex items-center gap-2">
          Continue to Review
          <CheckCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ComplianceVerification;