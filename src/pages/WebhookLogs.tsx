
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, Eye, RefreshCw } from "lucide-react";

const WebhookLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for webhook logs
  const webhookLogs = [
    {
      id: "WH001",
      endpoint: "/webhook/agent/created",
      method: "POST",
      statusCode: 200,
      payload: JSON.stringify({ agentId: "agent_123", name: "Sales Bot" }),
      responseTime: "145ms",
      timestamp: "2024-06-30 15:45:30",
      source: "KingCaller API",
      retries: 0,
    },
    {
      id: "WH002", 
      endpoint: "/webhook/call/completed",
      method: "POST",
      statusCode: 500,
      payload: JSON.stringify({ callId: "call_456", duration: 180 }),
      responseTime: "3200ms",
      timestamp: "2024-06-30 15:30:15",
      source: "Voice Service",
      retries: 2,
    },
    {
      id: "WH003",
      endpoint: "/webhook/campaign/started",
      method: "POST", 
      statusCode: 200,
      payload: JSON.stringify({ campaignId: "camp_789", contacts: 150 }),
      responseTime: "89ms",
      timestamp: "2024-06-30 15:15:08",
      source: "Campaign Engine",
      retries: 0,
    },
  ];

  const getStatusBadge = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (statusCode >= 400 && statusCode < 500) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    } else if (statusCode >= 500) {
      return "bg-red-100 text-red-800 border-red-200";
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getMethodBadge = (method: string) => {
    const methodColors = {
      GET: "bg-blue-100 text-blue-800 border-blue-200",
      POST: "bg-green-100 text-green-800 border-green-200",
      PUT: "bg-yellow-100 text-yellow-800 border-yellow-200",
      DELETE: "bg-red-100 text-red-800 border-red-200",
    };
    return methodColors[method as keyof typeof methodColors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">🪝 Webhook Logs</h1>
            <p className="text-gray-600 mt-1">Monitor webhook deliveries and responses</p>
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
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-gray-600">Total Webhooks</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">156ms</div>
              <div className="text-sm text-gray-600">Avg Response</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">18</div>
              <div className="text-sm text-gray-600">Failed Today</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">Recent Webhook Deliveries</CardTitle>
                <CardDescription className="text-gray-600">
                  Track webhook performance and delivery status
                </CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search webhooks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-100">
                    <TableHead className="font-medium text-gray-700">Webhook ID</TableHead>
                    <TableHead className="font-medium text-gray-700">Endpoint</TableHead>
                    <TableHead className="font-medium text-gray-700">Method</TableHead>
                    <TableHead className="font-medium text-gray-700">Status</TableHead>
                    <TableHead className="font-medium text-gray-700">Response Time</TableHead>
                    <TableHead className="font-medium text-gray-700">Source</TableHead>
                    <TableHead className="font-medium text-gray-700">Retries</TableHead>
                    <TableHead className="font-medium text-gray-700">Timestamp</TableHead>
                    <TableHead className="font-medium text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhookLogs.map((log) => (
                    <TableRow key={log.id} className="border-gray-50 hover:bg-blue-50/30">
                      <TableCell className="font-mono text-sm">{log.id}</TableCell>
                      <TableCell className="font-medium text-gray-900">{log.endpoint}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getMethodBadge(log.method)}>
                          {log.method}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadge(log.statusCode)}>
                          {log.statusCode}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.responseTime}</TableCell>
                      <TableCell className="text-gray-600">{log.source}</TableCell>
                      <TableCell>
                        {log.retries > 0 ? (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            {log.retries}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600 font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
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

export default WebhookLogs;
