
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Star, Play, Pause, Download, Filter, TrendingUp, Users, Clock, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const QualityAssurance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [selectedAgent, setSelectedAgent] = useState("all");

  const qualityScores = [
    { date: "Mon", score: 87, calls: 24 },
    { date: "Tue", score: 91, calls: 32 },
    { date: "Wed", score: 85, calls: 28 },
    { date: "Thu", score: 93, calls: 35 },
    { date: "Fri", score: 89, calls: 31 },
    { date: "Sat", score: 86, calls: 19 },
    { date: "Sun", score: 90, calls: 22 },
  ];

  const conversationReviews = [
    {
      id: "conv_001",
      agentName: "Customer Service Bot",
      caller: "+1-555-0123",
      duration: "4:23",
      qualityScore: 92,
      status: "reviewed",
      issues: ["Excellent rapport", "Clear communication"],
      timestamp: "2025-01-08 14:30",
    },
    {
      id: "conv_002", 
      agentName: "Sales Assistant",
      caller: "+1-555-0456",
      duration: "6:45",
      qualityScore: 78,
      status: "pending",
      issues: ["Needs improvement in objection handling"],
      timestamp: "2025-01-08 13:15",
    },
    {
      id: "conv_003",
      agentName: "Support Agent",
      caller: "+1-555-0789", 
      duration: "3:12",
      qualityScore: 95,
      status: "approved",
      issues: ["Perfect execution", "Customer satisfaction"],
      timestamp: "2025-01-08 12:00",
    },
  ];

  const performanceMetrics = [
    { name: "Call Resolution Rate", value: 89, target: 85, trend: "+5%" },
    { name: "Customer Satisfaction", value: 4.6, target: 4.5, trend: "+0.3" },
    { name: "First Call Resolution", value: 78, target: 80, trend: "-2%" },
    { name: "Average Handle Time", value: 245, target: 240, trend: "+5s" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "default",
      pending: "secondary", 
      reviewed: "outline"
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quality Assurance</h1>
          <p className="text-gray-600">Monitor and improve conversation quality</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}{metric.name.includes("Satisfaction") ? "/5" : metric.name.includes("Time") ? "s" : "%"}</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                <span className="text-xs text-gray-500">{metric.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="scoring" className="space-y-6">
        <TabsList>
          <TabsTrigger value="scoring">Quality Scoring</TabsTrigger>
          <TabsTrigger value="reviews">Conversation Reviews</TabsTrigger>
          <TabsTrigger value="training">Training Mode</TabsTrigger>
          <TabsTrigger value="benchmarks">Performance Benchmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="scoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Score Trends</CardTitle>
              <CardDescription>Average quality scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={qualityScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[70, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Input placeholder="Search conversations..." className="w-64" />
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="customer-service">Customer Service Bot</SelectItem>
                <SelectItem value="sales">Sales Assistant</SelectItem>
                <SelectItem value="support">Support Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {conversationReviews.map((conversation) => (
              <Card key={conversation.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">{conversation.agentName}</h3>
                        <p className="text-sm text-gray-500">{conversation.caller} • {conversation.timestamp}</p>
                      </div>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {conversation.duration}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-xl font-bold ${getScoreColor(conversation.qualityScore)}`}>
                          {conversation.qualityScore}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < Math.floor(conversation.qualityScore / 20) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      {getStatusBadge(conversation.status)}
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-gray-600">
                      <strong>Notes:</strong> {conversation.issues.join(", ")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Mode</CardTitle>
              <CardDescription>Set up training environments for new agents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Training Scenarios</h3>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span>Customer Complaint Handling</span>
                        <Button size="sm">Start Training</Button>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span>Product Upselling</span>
                        <Button size="sm">Start Training</Button>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span>Technical Support</span>
                        <Button size="sm">Start Training</Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Training Progress</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Sales Training</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2 mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Customer Service</span>
                        <span>90%</span>
                      </div>
                      <Progress value={90} className="h-2 mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Compliance Training</span>
                        <span>60%</span>
                      </div>
                      <Progress value={60} className="h-2 mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Benchmarks</CardTitle>
              <CardDescription>Compare agent performance against industry standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Industry Benchmarks</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Customer Satisfaction</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Industry: 4.2/5</span>
                        <span className="font-semibold text-green-600">Ours: 4.6/5</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Resolution Rate</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Industry: 82%</span>
                        <span className="font-semibold text-green-600">Ours: 89%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Average Handle Time</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Industry: 280s</span>
                        <span className="font-semibold text-green-600">Ours: 245s</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Agent Rankings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="font-medium">Support Agent</span>
                      <Badge variant="default">Top Performer</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="font-medium">Customer Service Bot</span>
                      <Badge variant="secondary">Above Average</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="font-medium">Sales Assistant</span>
                      <Badge variant="outline">Needs Improvement</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QualityAssurance;
