
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, RefreshCw } from "lucide-react";

const WorkflowLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for workflow logs
  const workflowLogs = [
    {
      id: "WFL001",
      workflowName: "Lead Qualification",
      status: "completed",
      duration: "2m 34s",
      steps: 8,
      timestamp: "2024-06-30 15:30:15",
      agent: "Sales Agent Pro",
      triggeredBy: "Incoming Call",
    },
    {
      id: "WFL002",
      workflowName: "Customer Onboarding",
      status: "failed",
      duration: "1m 12s",
      steps: 3,
      timestamp: "2024-06-30 15:25:42",
      agent: "Support Agent",
      triggeredBy: "Manual Start",
    },
    {
      id: "WFL003",
      workflowName: "Payment Processing",
      status: "running",
      duration: "45s",
      steps: 5,
      timestamp: "2024-06-30 15:20:08",
      agent: "Payment Bot",
      triggeredBy: "API Call",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusColors = {
      completed: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      running: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">⚡ Workflow Logs</h1>
            <p className="text-gray-600 mt-1">Monitor workflow execution and performance</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">92.3%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">342</div>
              <div className="text-sm text-gray-600">Total Executions</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">1m 45s</div>
              <div className="text-sm text-gray-600">Avg Duration</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-gray-600">Active Now</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">Recent Workflow Executions</CardTitle>
                <CardDescription className="text-gray-600">
                  Track workflow performance and identify issues
                </CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/70 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-100">
                    <TableHead className="font-medium text-gray-700">Workflow ID</TableHead>
                    <TableHead className="font-medium text-gray-700">Workflow Name</TableHead>
                    <TableHead className="font-medium text-gray-700">Agent</TableHead>
                    <TableHead className="font-medium text-gray-700">Status</TableHead>
                    <TableHead className="font-medium text-gray-700">Duration</TableHead>
                    <TableHead className="font-medium text-gray-700">Steps</TableHead>
                    <TableHead className="font-medium text-gray-700">Triggered By</TableHead>
                    <TableHead className="font-medium text-gray-700">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflowLogs.map((log) => (
                    <TableRow key={log.id} className="border-gray-50 hover:bg-purple-50/30">
                      <TableCell className="font-mono text-sm">{log.id}</TableCell>
                      <TableCell className="font-medium text-gray-900">{log.workflowName}</TableCell>
                      <TableCell className="text-gray-600">{log.agent}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadge(log.status)}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.duration}</TableCell>
                      <TableCell className="text-center">{log.steps}</TableCell>
                      <TableCell className="text-gray-600">{log.triggeredBy}</TableCell>
                      <TableCell className="text-gray-600 font-mono text-sm">{log.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkflowLogs;
