
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
import { Calendar, Clock, Zap, Users, Mail, Phone, Star, TrendingUp, Plus, Play, Pause, Edit } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Automation = () => {
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [automationEnabled, setAutomationEnabled] = useState(true);

  const followUpSequences = [
    {
      id: "seq_001",
      name: "Post-Demo Follow-up",
      trigger: "Demo Completed",
      steps: 4,
      active: true,
      conversion: 23,
      lastRun: "2025-01-08 15:30"
    },
    {
      id: "seq_002", 
      name: "Lead Nurturing Campaign",
      trigger: "Lead Captured",
      steps: 6,
      active: true,
      conversion: 15,
      lastRun: "2025-01-08 14:20"
    },
    {
      id: "seq_003",
      name: "Customer Onboarding",
      trigger: "Purchase Complete",
      steps: 5,
      active: false,
      conversion: 87,
      lastRun: "2025-01-07 16:45"
    }
  ];

  const campaigns = [
    {
      id: "camp_001",
      name: "Q1 Sales Outreach",
      type: "Outbound",
      status: "active",
      leads: 2847,
      contacted: 1256,
      appointments: 89,
      conversion: 7.1,
      startDate: "2025-01-01",
      endDate: "2025-03-31"
    },
    {
      id: "camp_002",
      name: "Product Demo Campaign",
      type: "Inbound",
      status: "active", 
      leads: 1563,
      contacted: 1342,
      appointments: 156,
      conversion: 11.6,
      startDate: "2025-01-05",
      endDate: "2025-02-05"
    },
    {
      id: "camp_003",
      name: "Customer Retention",
      type: "Follow-up",
      status: "paused",
      leads: 892,
      contacted: 445,
      appointments: 67,
      conversion: 15.1,
      startDate: "2024-12-15",
      endDate: "2025-01-15"
    }
  ];

  const leadScoring = [
    {
      criteria: "Company Size",
      weight: 25,
      values: {
        "Enterprise (1000+)": 100,
        "Mid-Market (100-999)": 75,
        "Small Business (10-99)": 50,
        "Startup (<10)": 25
      }
    },
    {
      criteria: "Budget Range", 
      weight: 30,
      values: {
        "$50K+": 100,
        "$10K-$49K": 75,
        "$5K-$9K": 50,
        "<$5K": 25
      }
    },
    {
      criteria: "Decision Timeline",
      weight: 20,
      values: {
        "Immediate": 100,
        "30 days": 75,
        "90 days": 50,
        "No timeline": 10
      }
    },
    {
      criteria: "Engagement Level",
      weight: 25,
      values: {
        "High": 100,
        "Medium": 60,
        "Low": 20,
        "None": 0
      }
    }
  ];

  const appointments = [
    {
      id: "apt_001",
      leadName: "John Smith",
      company: "TechCorp Inc",
      phone: "+1-555-0123",
      scheduledFor: "2025-01-09 10:00",
      type: "Product Demo",
      status: "confirmed",
      score: 85
    },
    {
      id: "apt_002",
      leadName: "Sarah Johnson", 
      company: "Marketing Solutions",
      phone: "+1-555-0456",
      scheduledFor: "2025-01-09 14:30",
      type: "Sales Call",
      status: "pending",
      score: 72
    },
    {
      id: "apt_003",
      leadName: "Mike Davis",
      company: "Growth Dynamics",
      phone: "+1-555-0789",
      scheduledFor: "2025-01-09 16:00", 
      type: "Follow-up Call",
      status: "confirmed",
      score: 91
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      paused: "secondary",
      completed: "outline",
      confirmed: "default",
      pending: "secondary",
      cancelled: "destructive"
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automation & Scheduling</h1>
          <p className="text-gray-600">Automate follow-ups and manage appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">3 total campaigns</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9.2%</div>
            <p className="text-xs text-muted-foreground">+1.4% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lead Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76</div>
            <p className="text-xs text-muted-foreground">High quality leads</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sequences" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sequences">Follow-up Sequences</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="scoring">Lead Scoring</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="sequences" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="automation-toggle">Enable Automation</Label>
                <Switch 
                  id="automation-toggle"
                  checked={automationEnabled}
                  onCheckedChange={setAutomationEnabled}
                />
              </div>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Sequence
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followUpSequences.map((sequence) => (
              <Card key={sequence.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{sequence.name}</CardTitle>
                    {sequence.active ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Paused</Badge>
                    )}
                  </div>
                  <CardDescription>Trigger: {sequence.trigger}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Steps</span>
                    <span className="font-medium">{sequence.steps}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Conversion</span>
                    <span className="font-medium text-green-600">{sequence.conversion}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Run</span>
                    <span className="text-sm">{sequence.lastRun}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      {sequence.active ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex items-center justify-between">
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="paused">Paused Only</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{campaign.name}</h3>
                        <Badge variant="outline">{campaign.type}</Badge>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {campaign.startDate} - {campaign.endDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-xl font-bold">{campaign.leads}</div>
                        <div className="text-xs text-gray-500">Total Leads</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold">{campaign.contacted}</div>
                        <div className="text-xs text-gray-500">Contacted</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold">{campaign.appointments}</div>
                        <div className="text-xs text-gray-500">Appointments</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{campaign.conversion}%</div>
                        <div className="text-xs text-gray-500">Conversion</div>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{Math.round((campaign.contacted / campaign.leads) * 100)}%</span>
                    </div>
                    <Progress value={(campaign.contacted / campaign.leads) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Scoring Configuration</CardTitle>
              <CardDescription>Set up criteria and weights for automatic lead scoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {leadScoring.map((criteria, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{criteria.criteria}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Weight:</span>
                      <Badge variant="outline">{criteria.weight}%</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(criteria.values).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{key}</span>
                        <span className="font-medium">{value} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button>Save Scoring Rules</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <div className="flex items-center justify-between">
            <Input placeholder="Search appointments..." className="w-64" />
            <div className="flex items-center gap-3">
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">{appointment.leadName}</h3>
                        <p className="text-sm text-gray-500">{appointment.company}</p>
                        <p className="text-sm text-gray-500">{appointment.phone}</p>
                      </div>
                      <Badge variant="outline">{appointment.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{appointment.scheduledFor}</div>
                        <div className={`text-sm font-medium ${getScoreColor(appointment.score)}`}>
                          Score: {appointment.score}
                        </div>
                      </div>
                      {getStatusBadge(appointment.status)}
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Automation;
