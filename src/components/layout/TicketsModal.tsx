
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Ticket, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageCircle
} from "lucide-react";

interface TicketsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TicketItem {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
}

export const TicketsModal = ({ open, onOpenChange }: TicketsModalProps) => {
  const [tickets] = useState<TicketItem[]>([
    {
      id: "T-001",
      title: "Phone number not receiving calls",
      description: "Our main business line (555) 123-4567 stopped receiving calls yesterday",
      status: "open",
      priority: "urgent",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: "T-002",
      title: "Agent response time too slow",
      description: "Voice AI agent taking more than 5 seconds to respond during peak hours",
      status: "in-progress",
      priority: "high",
      createdAt: "2024-01-14",
      updatedAt: "2024-01-15",
    },
    {
      id: "T-003",
      title: "Billing question about usage",
      description: "Need clarification on last month's usage charges",
      status: "resolved",
      priority: "medium",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-12",
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Ticket className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const openTickets = tickets.filter(t => t.status !== "resolved");
  const resolvedTickets = tickets.filter(t => t.status === "resolved");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Ticket className="h-6 w-6" />
              Support Tickets
            </DialogTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="open" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="open" className="flex items-center gap-2">
              Open Tickets
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                {openTickets.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved Tickets
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="open" className="space-y-4 max-h-96 overflow-y-auto">
            {openTickets.length > 0 ? (
              openTickets.map((ticket) => (
                <Card key={ticket.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(ticket.status)}
                        <div>
                          <CardTitle className="text-lg">{ticket.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">#{ticket.id}</span>
                            <Badge 
                              variant="secondary" 
                              className={`text-white ${getPriorityColor(ticket.priority)}`}
                            >
                              {ticket.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={getStatusColor(ticket.status)}
                      >
                        {ticket.status.replace("-", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm mb-3">
                      {ticket.description}
                    </CardDescription>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Created: {ticket.createdAt}</span>
                      <span>Updated: {ticket.updatedAt}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No open tickets. You're all set! 🎉
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="resolved" className="space-y-4 max-h-96 overflow-y-auto">
            {resolvedTickets.map((ticket) => (
              <Card key={ticket.id} className="opacity-75">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(ticket.status)}
                      <div>
                        <CardTitle className="text-lg">{ticket.title}</CardTitle>
                        <span className="text-sm text-gray-500">#{ticket.id}</span>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={getStatusColor(ticket.status)}
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm mb-3">
                    {ticket.description}
                  </CardDescription>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created: {ticket.createdAt}</span>
                    <span>Resolved: {ticket.updatedAt}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
