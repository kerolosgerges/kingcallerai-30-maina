import React, { useState, useCallback } from 'react';
import { Upload, FileText, ArrowRight, Check, X, RefreshCw, Download, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { FirebaseContactData } from '@/hooks/useContactsLogic';

interface CSVColumn {
  name: string;
  sample: string;
  mappedTo?: string;
}

interface ImportPreview {
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
  sample: any[];
}

interface AdvancedCSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (mappedData: FirebaseContactData[]) => Promise<void>;
  isLoading?: boolean;
}

const SYSTEM_FIELDS = [
  { key: 'name', label: 'Name *', required: true, type: 'text' },
  { key: 'title', label: 'Job Title', required: false, type: 'text' },
  { key: 'company', label: 'Company', required: false, type: 'text' },
  { key: 'email', label: 'Email', required: false, type: 'email' },
  { key: 'phone', label: 'Phone', required: false, type: 'phone' },
  { key: 'address', label: 'Address', required: false, type: 'text' },
  { key: 'pincode', label: 'Pincode', required: false, type: 'text' },
  { key: 'birthday', label: 'Birthday', required: false, type: 'date' },
  { key: 'notes', label: 'Notes', required: false, type: 'text' },
  { key: 'tags', label: 'Tags', required: false, type: 'text' },
  { key: 'profileImage', label: 'Profile Image URL', required: false, type: 'url' },
];

export const AdvancedCSVImportDialog: React.FC<AdvancedCSVImportDialogProps> = ({
  open,
  onOpenChange,
  onImport,
  isLoading = false,
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvColumns, setCsvColumns] = useState<CSVColumn[]>([]);
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');

  const steps = [
    { id: 1, title: 'Upload CSV', description: 'Select your CSV file' },
    { id: 2, title: 'Map Fields', description: 'Map CSV columns to contact fields' },
    { id: 3, title: 'Preview', description: 'Review import data' },
    { id: 4, title: 'Import', description: 'Import contacts' },
  ];

  const parseCSV = useCallback((csvText: string): any[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/['"]/g, ''));
      if (values.length >= headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        data.push(row);
      }
    }

    return data;
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File",
        description: "Please select a valid CSV file.",
        variant: "destructive",
      });
      return;
    }

    setCsvFile(file);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsedData = parseCSV(csvText);
        
        if (parsedData.length === 0) {
          toast({
            title: "Empty File",
            description: "The CSV file appears to be empty.",
            variant: "destructive",
          });
          return;
        }

        setCsvData(parsedData);
        
        // Extract columns with sample data
        const columns: CSVColumn[] = Object.keys(parsedData[0]).map(key => ({
          name: key,
          sample: parsedData[0][key] || '',
        }));
        
        setCsvColumns(columns);
        setCurrentStep(2);
        
        toast({
          title: "File Uploaded",
          description: `Successfully parsed ${parsedData.length} rows from CSV.`,
        });
      } catch (error) {
        toast({
          title: "Parse Error",
          description: "Failed to parse CSV file. Please check the format.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
  }, [parseCSV, toast]);

  const handleFieldMapping = (csvColumn: string, systemField: string) => {
    setFieldMappings(prev => ({
      ...prev,
      [csvColumn]: systemField
    }));
  };

  const validateField = (value: string, fieldType: string): { isValid: boolean; error?: string } => {
    if (!value || !value.trim()) return { isValid: false, error: 'Empty value' };
    
    const trimmed = value.trim();
    
    switch (fieldType) {
      case 'name':
        if (trimmed.length < 2) return { isValid: false, error: 'Name too short' };
        if (trimmed.length > 100) return { isValid: false, error: 'Name too long' };
        if (!/^[a-zA-Z\s\-'\.]+$/.test(trimmed)) return { isValid: false, error: 'Invalid characters in name' };
        return { isValid: true };
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) return { isValid: false, error: 'Invalid email format' };
        if (trimmed.length > 254) return { isValid: false, error: 'Email too long' };
        return { isValid: true };
        
      case 'phone':
        const phoneClean = trimmed.replace(/\D/g, '');
        if (phoneClean.length < 7) return { isValid: false, error: 'Phone too short' };
        if (phoneClean.length > 15) return { isValid: false, error: 'Phone too long' };
        return { isValid: true };
        
      case 'url':
        try {
          new URL(trimmed);
          if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(trimmed)) {
            return { isValid: false, error: 'Invalid image format' };
          }
          return { isValid: true };
        } catch {
          return { isValid: false, error: 'Invalid URL format' };
        }
        
      case 'date':
        const date = new Date(trimmed);
        if (isNaN(date.getTime())) return { isValid: false, error: 'Invalid date format' };
        const today = new Date();
        if (date > today) return { isValid: false, error: 'Date cannot be in the future' };
        return { isValid: true };
        
      default:
        if (trimmed.length > 500) return { isValid: false, error: 'Value too long' };
        return { isValid: true };
    }
  };

  const generatePreview = useCallback(() => {
    if (!csvData.length || !Object.keys(fieldMappings).length) return;

    const mappedData: (FirebaseContactData & { validationErrors: string[] })[] = csvData.map((row, index) => {
      const mapped: FirebaseContactData = {
        name: '',
      };
      
      const validationErrors: string[] = [];
      
      Object.entries(fieldMappings).forEach(([csvColumn, systemField]) => {
        if (systemField && row[csvColumn]) {
          const value = String(row[csvColumn]).trim();
          
          if (systemField === 'phone') {
            const validation = validateField(value, 'phone');
            if (validation.isValid) {
              const phoneClean = value.replace(/\D/g, '');
              mapped.phoneNumbers = [{
                countryCode: '+1',
                phoneNumber: phoneClean,
                label: 'Primary'
              }];
            } else {
              validationErrors.push(`Row ${index + 1}: Phone - ${validation.error}`);
            }
          } else if (systemField === 'email') {
            const validation = validateField(value, 'email');
            if (validation.isValid) {
              mapped.emails = [{
                email: value.toLowerCase(),
                label: 'Primary'
              }];
            } else {
              validationErrors.push(`Row ${index + 1}: Email - ${validation.error}`);
            }
          } else {
            const fieldInfo = SYSTEM_FIELDS.find(f => f.key === systemField);
            const validation = validateField(value, fieldInfo?.type || 'text');
            
            if (validation.isValid) {
              (mapped as any)[systemField] = value;
            } else {
              validationErrors.push(`Row ${index + 1}: ${fieldInfo?.label || systemField} - ${validation.error}`);
            }
          }
        }
      });
      
      // Validate required name field
      if (!mapped.name || mapped.name.trim().length === 0) {
        validationErrors.push(`Row ${index + 1}: Name is required`);
      }
      
      // Validate at least one contact method
      const hasPhone = mapped.phoneNumbers?.length > 0;
      const hasEmail = mapped.emails?.length > 0;
      if (!hasPhone && !hasEmail) {
        validationErrors.push(`Row ${index + 1}: At least one phone number or email is required`);
      }
      
      return { ...mapped, validationErrors };
    });

    // Separate valid and invalid data
    const validData = mappedData.filter(item => item.validationErrors.length === 0);
    const invalidData = mappedData.filter(item => item.validationErrors.length > 0);
    
    // Check for duplicates among valid data
    const seen = new Set();
    const duplicates = validData.filter(item => {
      const key = `${item.name?.toLowerCase()}${item.emails?.[0]?.email?.toLowerCase() || ''}`;
      if (seen.has(key)) return true;
      seen.add(key);
      return false;
    });

    // Log validation errors for debugging
    if (invalidData.length > 0) {
      console.warn('Validation errors found:', invalidData.map(item => item.validationErrors).flat());
    }

    setImportPreview({
      total: csvData.length,
      valid: validData.length - duplicates.length,
      invalid: invalidData.length,
      duplicates: duplicates.length,
      sample: validData.slice(0, 5).map(({ validationErrors, ...item }) => item)
    });

    setCurrentStep(3);
  }, [csvData, fieldMappings]);

  const handleImport = async () => {
    if (!importPreview || !csvData.length) return;

    setImportStatus('importing');
    setCurrentStep(4);

    try {
      const mappedData: FirebaseContactData[] = csvData
        .map((row, index) => {
          const mapped: FirebaseContactData = {
            name: '',
          };
          
          let isValid = true;
          
          Object.entries(fieldMappings).forEach(([csvColumn, systemField]) => {
            if (systemField && row[csvColumn]) {
              const value = String(row[csvColumn]).trim();
              
              if (systemField === 'phone') {
                const validation = validateField(value, 'phone');
                if (validation.isValid) {
                  const phoneClean = value.replace(/\D/g, '');
                  mapped.phoneNumbers = [{
                    countryCode: '+1',
                    phoneNumber: phoneClean,
                    label: 'Primary'
                  }];
                } else {
                  isValid = false;
                }
              } else if (systemField === 'email') {
                const validation = validateField(value, 'email');
                if (validation.isValid) {
                  mapped.emails = [{
                    email: value.toLowerCase(),
                    label: 'Primary'
                  }];
                } else {
                  isValid = false;
                }
              } else {
                const fieldInfo = SYSTEM_FIELDS.find(f => f.key === systemField);
                const validation = validateField(value, fieldInfo?.type || 'text');
                
                if (validation.isValid) {
                  (mapped as any)[systemField] = value;
                } else {
                  isValid = false;
                }
              }
            }
          });
          
          // Final validation
          if (!mapped.name || mapped.name.trim().length === 0) isValid = false;
          const hasPhone = mapped.phoneNumbers?.length > 0;
          const hasEmail = mapped.emails?.length > 0;
          if (!hasPhone && !hasEmail) isValid = false;
          
          return isValid ? mapped : null;
        })
        .filter((item): item is FirebaseContactData => item !== null);

      // Remove duplicates
      const seen = new Set();
      const uniqueData = mappedData.filter(item => {
        const key = `${item.name?.toLowerCase()}${item.emails?.[0]?.email?.toLowerCase() || ''}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      console.log(`Processing ${uniqueData.length} valid contacts for import`);

      // Simulate progress with actual import
      const batchSize = Math.max(1, Math.floor(uniqueData.length / 10));
      setImportProgress(10);

      await onImport(uniqueData);
      
      setImportProgress(100);
      setImportStatus('success');
      
      toast({
        title: "Import Successful",
        description: `Successfully imported ${uniqueData.length} contacts.`,
      });
      
      setTimeout(() => {
        onOpenChange(false);
        resetState();
      }, 2000);
      
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus('error');
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "There was an error importing your contacts.",
        variant: "destructive",
      });
    }
  };

  const resetState = () => {
    setCurrentStep(1);
    setCsvFile(null);
    setCsvData([]);
    setCsvColumns([]);
    setFieldMappings({});
    setImportPreview(null);
    setImportProgress(0);
    setImportStatus('idle');
  };

  const downloadTemplate = () => {
    const headers = SYSTEM_FIELDS.map(field => field.label.replace(' *', '')).join(',');
    const sampleRow = 'John Doe,Senior Developer,Tech Corp,john@example.com,+1234567890,123 Main St,12345,1990-01-01,Great contact,lead';
    const csvContent = `${headers}\n${sampleRow}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-6">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                ${isActive ? 'border-primary bg-primary text-primary-foreground' : 
                  isCompleted ? 'border-green-500 bg-green-500 text-white' : 
                  'border-muted-foreground bg-background'}
              `}>
                {isCompleted ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-px mx-4 ${isCompleted ? 'bg-green-500' : 'bg-muted'}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="border-2 border-dashed border-muted-foreground rounded-lg p-8">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <div className="space-y-2">
            <Label htmlFor="csv-upload" className="text-lg font-medium cursor-pointer">
              Upload your CSV file
            </Label>
            <p className="text-sm text-muted-foreground">
              Select a CSV file containing your contact data
            </p>
            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              onClick={() => document.getElementById('csv-upload')?.click()}
              variant="outline"
              className="mt-4"
            >
              <FileText className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center">
        <Button 
          onClick={downloadTemplate}
          variant="outline"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </Button>
      </div>
      
      {csvFile && (
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            File selected: {csvFile.name} ({Math.round(csvFile.size / 1024)} KB)
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Map CSV Columns to Contact Fields</h3>
        <p className="text-sm text-muted-foreground">
          Match your CSV columns with the contact fields in the system
        </p>
      </div>
      
      <div className="grid gap-4">
        {csvColumns.map((column, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{column.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Sample: "{column.sample}"
                  </div>
                </div>
                
                <ArrowRight className="w-4 h-4 mx-4 text-muted-foreground" />
                
                <div className="flex-1">
                  <Select
                    onValueChange={(value) => handleFieldMapping(column.name, value)}
                    value={fieldMappings[column.name] || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Don't import</SelectItem>
                      {SYSTEM_FIELDS.map((field) => (
                        <SelectItem key={field.key} value={field.key}>
                          {field.label}
                          {field.required && <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button onClick={() => setCurrentStep(1)} variant="outline">
          Back
        </Button>
        <Button 
          onClick={generatePreview}
          disabled={!Object.keys(fieldMappings).some(key => fieldMappings[key] === 'name')}
        >
          Preview Import
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Import Preview</h3>
        <p className="text-sm text-muted-foreground">
          Review the data before importing
        </p>
      </div>
      
      {importPreview && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{importPreview.total}</div>
                <div className="text-sm text-muted-foreground">Total Rows</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{importPreview.valid}</div>
                <div className="text-sm text-muted-foreground">Valid</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{importPreview.invalid}</div>
                <div className="text-sm text-muted-foreground">Invalid</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{importPreview.duplicates}</div>
                <div className="text-sm text-muted-foreground">Duplicates</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Sample Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {importPreview.sample.map((item, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.title && `${item.title} • `}
                      {item.company && `${item.company} • `}
                      {item.emails?.[0]?.email}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {(importPreview.invalid > 0 || importPreview.duplicates > 0) && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {importPreview.invalid > 0 && `${importPreview.invalid} rows are missing required fields. `}
                {importPreview.duplicates > 0 && `${importPreview.duplicates} duplicate entries will be skipped.`}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setCurrentStep(2)} variant="outline">
              Back
            </Button>
            <Button 
              onClick={handleImport}
              disabled={importPreview.valid === 0}
            >
              Import {importPreview.valid} Contacts
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 text-center">
      {importStatus === 'importing' && (
        <>
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="w-12 h-12 animate-spin text-primary" />
            <h3 className="text-lg font-medium">Importing Contacts...</h3>
            <Progress value={importProgress} className="w-full max-w-md" />
            <p className="text-sm text-muted-foreground">
              {importProgress}% complete
            </p>
          </div>
        </>
      )}
      
      {importStatus === 'success' && (
        <div className="flex flex-col items-center space-y-4">
          <Check className="w-12 h-12 text-green-600" />
          <h3 className="text-lg font-medium text-green-600">Import Successful!</h3>
          <p className="text-sm text-muted-foreground">
            Your contacts have been imported successfully.
          </p>
        </div>
      )}
      
      {importStatus === 'error' && (
        <div className="flex flex-col items-center space-y-4">
          <X className="w-12 h-12 text-red-600" />
          <h3 className="text-lg font-medium text-red-600">Import Failed</h3>
          <p className="text-sm text-muted-foreground">
            There was an error importing your contacts.
          </p>
          <Button onClick={() => setCurrentStep(3)} variant="outline">
            Try Again
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced CSV Import</DialogTitle>
          <DialogDescription>
            Import contacts from a CSV file with advanced field mapping and validation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {renderStepIndicator()}
          
          <div className="min-h-[400px]">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};