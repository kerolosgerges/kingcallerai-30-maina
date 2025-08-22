import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, Eye, RefreshCw } from "lucide-react";

const ApiLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for API logs
  const apiLogs = [
    {
      id: "req_123456",
      endpoint: "/api/v1/agents",
      method: "GET",
      statusCode: 200,
      responseTime: "125ms",
      requestSize: "2.1KB",
      responseSize: "15.3KB",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      ipAddress: "192.168.1.100",
      timestamp: "2023-12-07 14:30:25"
    },
    {
      id: "req_123457",
      endpoint: "/api/v1/calls",
      method: "POST",
      statusCode: 201,
      responseTime: "89ms",
      requestSize: "5.2KB",
      responseSize: "3.1KB",
      userAgent: "React Native App/1.0",
      ipAddress: "10.0.0.42",
      timestamp: "2023-12-07 14:29:15"
    }
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

  const getResponseTimeColor = (responseTime: string) => {
    const time = parseInt(responseTime);
    if (time < 100) return "text-green-600";
    if (time < 500) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredLogs = apiLogs.filter(log =>
    log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">🔗 API Logs</h1>
            <p className="text-gray-600 mt-1">Monitor API requests and system integrations</p>
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
              <div className="text-2xl font-bold text-green-600">99.1%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{apiLogs.length}</div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">234ms</div>
              <div className="text-sm text-gray-600">Avg Response</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">12</div>
              <div className="text-sm text-gray-600">Errors Today</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">API Request History</CardTitle>
                <CardDescription className="text-gray-600">
                  Track API usage and monitor system health
                </CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search API logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/70 border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-100">
                    <TableHead className="font-medium text-gray-700">Request ID</TableHead>
                    <TableHead className="font-medium text-gray-700">Endpoint</TableHead>
                    <TableHead className="font-medium text-gray-700">Method</TableHead>
                    <TableHead className="font-medium text-gray-700">Status</TableHead>
                    <TableHead className="font-medium text-gray-700">Response Time</TableHead>
                    <TableHead className="font-medium text-gray-700">Size</TableHead>
                    <TableHead className="font-medium text-gray-700">User Agent</TableHead>
                    <TableHead className="font-medium text-gray-700">IP Address</TableHead>
                    <TableHead className="font-medium text-gray-700">Timestamp</TableHead>
                    <TableHead className="font-medium text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        No API logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id} className="border-gray-50 hover:bg-indigo-50/30">
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
                        <TableCell className={`font-mono text-sm font-medium ${getResponseTimeColor(log.responseTime)}`}>
                          {log.responseTime}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          <div className="flex flex-col">
                            <span>↑ {log.requestSize}</span>
                            <span>↓ {log.responseSize}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm max-w-32 truncate" title={log.userAgent}>
                          {log.userAgent}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-gray-600">{log.ipAddress}</TableCell>
                        <TableCell className="text-gray-600 font-mono text-sm">{log.timestamp}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiLogs;