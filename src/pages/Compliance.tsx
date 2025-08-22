
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, FileText, AlertTriangle, Download, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Compliance = () => {
  const [selectedCompliance, setSelectedCompliance] = useState("hipaa");
  const [recordingEnabled, setRecordingEnabled] = useState(true);
  const [consentRequired, setConsentRequired] = useState(true);

  const complianceStandards = [
    {
      id: "hipaa",
      name: "HIPAA",
      description: "Health Insurance Portability and Accountability Act",
      status: "active",
      compliance: 95,
      lastAudit: "2025-01-01",
      requirements: [
        "Patient consent for recordings",
        "Encrypted data storage",
        "Access logging",
        "Data retention policies"
      ]
    },
    {
      id: "sox",
      name: "SOX",
      description: "Sarbanes-Oxley Act",
      status: "active", 
      compliance: 88,
      lastAudit: "2024-12-15",
      requirements: [
        "Financial data protection",
        "Audit trail maintenance",
        "Internal controls",
        "Executive accountability"
      ]
    },
    {
      id: "gdpr",
      name: "GDPR",
      description: "General Data Protection Regulation",
      status: "active",
      compliance: 92,
      lastAudit: "2025-01-05",
      requirements: [
        "Data subject consent",
        "Right to erasure",
        "Data portability",
        "Privacy by design"
      ]
    },
    {
      id: "ccpa",
      name: "CCPA",
      description: "California Consumer Privacy Act",
      status: "pending",
      compliance: 75,
      lastAudit: "2024-11-20",
      requirements: [
        "Consumer rights disclosure",
        "Opt-out mechanisms",
        "Data inventory",
        "Third-party sharing controls"
      ]
    }
  ];

  const dataRetentionPolicies = [
    {
      dataType: "Call Recordings",
      retentionPeriod: "7 years",
      location: "Encrypted Cloud Storage",
      status: "active",
      autoDelete: true
    },
    {
      dataType: "Customer Data",
      retentionPeriod: "5 years",
      location: "Secure Database",
      status: "active", 
      autoDelete: true
    },
    {
      dataType: "Analytics Data",
      retentionPeriod: "2 years",
      location: "Data Warehouse",
      status: "active",
      autoDelete: false
    },
    {
      dataType: "Audit Logs",
      retentionPeriod: "10 years",
      location: "Immutable Storage",
      status: "active",
      autoDelete: false
    }
  ];

  const consentManagement = [
    {
      id: "call_001",
      phoneNumber: "+1-555-0123",
      consentGiven: true,
      consentDate: "2025-01-08 14:30",
      consentType: "Explicit",
      recording: "Yes",
      dataProcessing: "Yes"
    },
    {
      id: "call_002",
      phoneNumber: "+1-555-0456", 
      consentGiven: false,
      consentDate: "2025-01-08 13:15",
      consentType: "Declined",
      recording: "No",
      dataProcessing: "Limited"
    },
    {
      id: "call_003",
      phoneNumber: "+1-555-0789",
      consentGiven: true,
      consentDate: "2025-01-08 12:00",
      consentType: "Implicit",
      recording: "Yes",
      dataProcessing: "Yes"
    }
  ];

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return "text-green-600";
    if (compliance >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "secondary",
      inactive: "destructive"
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance & Legal</h1>
          <p className="text-gray-600">Manage compliance standards and legal requirements</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Compliance Report
          </Button>
          <Button>
            <Shield className="h-4 w-4 mr-2" />
            Run Audit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Standards</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Out of 4 total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Compliance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Above target of 90%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Audit</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 days</div>
            <p className="text-xs text-muted-foreground">ago</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="standards" className="space-y-6">
        <TabsList>
          <TabsTrigger value="standards">Compliance Standards</TabsTrigger>
          <TabsTrigger value="consent">Consent Management</TabsTrigger>
          <TabsTrigger value="retention">Data Retention</TabsTrigger>
          <TabsTrigger value="policies">Policy Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="standards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceStandards.map((standard) => (
              <Card key={standard.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{standard.name}</CardTitle>
                      <CardDescription>{standard.description}</CardDescription>
                    </div>
                    {getStatusBadge(standard.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Compliance Level</span>
                      <span className={getComplianceColor(standard.compliance)}>{standard.compliance}%</span>
                    </div>
                    <Progress value={standard.compliance} className="h-2" />
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Requirements</h4>
                    <ul className="space-y-1">
                      {standard.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Last Audit: {standard.lastAudit}</span>
                    <Button size="sm" variant="outline">Configure</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="consent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call Recording Consent</CardTitle>
              <CardDescription>Manage consent for call recordings and data processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recording-enabled">Enable Call Recording</Label>
                    <Switch 
                      id="recording-enabled"
                      checked={recordingEnabled}
                      onCheckedChange={setRecordingEnabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="consent-required">Require Explicit Consent</Label>
                    <Switch 
                      id="consent-required"
                      checked={consentRequired}
                      onCheckedChange={setConsentRequired}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consent-message">Consent Message</Label>
                    <Textarea 
                      id="consent-message"
                      placeholder="This call may be recorded for quality and training purposes..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Consent Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Calls Today</span>
                      <span>47</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consent Given</span>
                      <span className="text-green-600">42 (89%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consent Declined</span>
                      <span className="text-red-600">5 (11%)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Recent Consent Records</h4>
                <div className="space-y-2">
                  {consentManagement.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-medium">{record.phoneNumber}</div>
                          <div className="text-sm text-gray-500">{record.consentDate}</div>
                        </div>
                        <Badge variant={record.consentGiven ? "default" : "destructive"}>
                          {record.consentType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span>Recording: {record.recording}</span>
                        <span>Data: {record.dataProcessing}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Retention Policies</CardTitle>
              <CardDescription>Configure how long different types of data are stored</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataRetentionPolicies.map((policy, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{policy.dataType}</h4>
                      <p className="text-sm text-gray-500">Stored in {policy.location}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{policy.retentionPeriod}</div>
                        <div className="text-sm text-gray-500">
                          Auto-delete: {policy.autoDelete ? "Yes" : "No"}
                        </div>
                      </div>
                      {getStatusBadge(policy.status)}
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Terms of Service Generator</CardTitle>
                <CardDescription>Generate customized terms of service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" placeholder="Your Company Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-type">Service Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai-calling">AI Calling Service</SelectItem>
                      <SelectItem value="customer-support">Customer Support</SelectItem>
                      <SelectItem value="sales-automation">Sales Automation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jurisdiction">Jurisdiction</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="eu">European Union</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Terms of Service
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy Policy Generator</CardTitle>
                <CardDescription>Generate compliant privacy policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="data-collection">Data Collection Types</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="personal-data" />
                      <Label htmlFor="personal-data">Personal Information</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="call-data" />
                      <Label htmlFor="call-data">Call Recordings</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="usage-data" />
                      <Label htmlFor="usage-data">Usage Analytics</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="device-data" />
                      <Label htmlFor="device-data">Device Information</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="third-parties">Third-Party Integrations</Label>
                  <Textarea 
                    id="third-parties"
                    placeholder="List any third-party services you integrate with..."
                    rows={3}
                  />
                </div>
                <Button className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Generate Privacy Policy
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Compliance;
