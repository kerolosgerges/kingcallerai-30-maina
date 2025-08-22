import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, RefreshCw } from "lucide-react";
import { useCallLogs } from "@/hooks/useCallLogs";
import { useCallLogKPIs } from "@/hooks/useCallLogKPIs";
import { CallDetailsDialog } from "@/components/call-logs/CallDetailsDialog";

function formatTimestamp(ts?: number) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleString();
}

const CallLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { callLogs, isLoading, refresh } = useCallLogs(searchTerm);

  // KPI analytics
  const kpis = useCallLogKPIs(callLogs);

  // Dialog state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [callDetails, setCallDetails] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const handleShowDetails = async (call_id: string) => {
    setDetailsLoading(true);
    try {
      const resp = await fetch(`https://voiceai.kingcaller.ai/twilio/call_status/${call_id}`);
      const data = await resp.json();
      setCallDetails(data);
      setDetailsOpen(true);
    } catch (e) {
      setCallDetails({ call_id, status: "Failed to load", error: String(e) });
      setDetailsOpen(true);
    }
    setDetailsLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      completed: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      ongoing: "bg-blue-100 text-blue-800 border-blue-200",
      queued: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Get recent 7 days for perDay chart
  const days = Object.keys(kpis.perDay).sort().slice(-7);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

      

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Call Logs</h1>
            <p className="text-gray-600 mt-1">Review call history and performance metrics</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white" onClick={refresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white" disabled>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>



  {/* === KPI DASHBOARD === */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Calls */}
          <Card className="bg-white/90 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 mb-1">Total Calls</div>
              <div className="text-2xl font-bold">{kpis.total}</div>
            </CardContent>
          </Card>
          {/* Calls per Status */}
          <Card className="bg-white/90 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 mb-1">By Status</div>
              <ul className="space-y-1">
                {Object.entries(kpis.perStatus).map(([status, count]) => (
                  <li key={status}>
                    <span className="capitalize">{status}</span>
                    <span className="ml-2 font-bold">{count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          {/* Calls per Agent */}
          <Card className="bg-white/90 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 mb-1">By Agent</div>
              <ul className="space-y-1">
                {Object.entries(kpis.perAgent).slice(0, 4).map(([agent, count]) => (
                  <li key={agent}>
                    <span className="truncate max-w-[7rem] inline-block align-bottom">{agent}</span>
                    <span className="ml-2 font-bold">{count}</span>
                  </li>
                ))}
                {Object.keys(kpis.perAgent).length > 4 && (
                  <li>+{Object.keys(kpis.perAgent).length - 4} more</li>
                )}
              </ul>
            </CardContent>
          </Card>
          {/* Calls per Day (last 7 days) */}
          <Card className="bg-white/90 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 mb-1">Last 7 Days</div>
              <ul className="space-y-1">
                {days.map(day => (
                  <li key={day}>
                    <span>{day}</span>
                    <span className="ml-2 font-bold">{kpis.perDay[day]}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>









        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-100">
                    <TableHead className="font-medium text-gray-700">Call ID</TableHead>
                    <TableHead className="font-medium text-gray-700">Phone Number</TableHead>
                    <TableHead className="font-medium text-gray-700">Agent</TableHead>
                    <TableHead className="font-medium text-gray-700">Status</TableHead>
                    <TableHead className="font-medium text-gray-700">Timestamp</TableHead>
                    <TableHead className="font-medium text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading call logs...
                      </TableCell>
                    </TableRow>
                  ) : callLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No call logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    callLogs.map((log) => (
                      <TableRow key={log.id} className="border-gray-50 hover:bg-green-50/30">
                        <TableCell className="font-mono text-sm">{log.call_id || log.id}</TableCell>
                        <TableCell className="font-medium text-gray-900">{log.phone || "-"}</TableCell>
                        <TableCell className="text-gray-600">{log.agent_name || log.agent_id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusBadge(log.status || "")}>
                            {log.status || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600 font-mono text-sm">{formatTimestamp(log.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 hover:text-green-700"
                              onClick={() => handleShowDetails(log.call_id || log.id)}
                              disabled={detailsLoading}
                            >
                              Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        {/* Details Dialog */}
        <CallDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} callDetails={callDetails} />
      </div>
    </div>
  );
};

export default CallLogs;
