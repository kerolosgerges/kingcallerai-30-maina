
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Book, 
  Video, 
  Mail, 
  ExternalLink,
  Clock,
  CheckCircle
} from "lucide-react";

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SupportModal = ({ open, onOpenChange }: SupportModalProps) => {
  const supportOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      status: "Available",
      statusColor: "bg-green-500",
      action: () => console.log("Opening live chat..."),
    },
    {
      title: "Documentation",
      description: "Browse our comprehensive guides and tutorials",
      icon: Book,
      status: "24/7",
      statusColor: "bg-blue-500",
      action: () => window.open("https://docs.kingcaller.ai", "_blank"),
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      icon: Video,
      status: "Updated",
      statusColor: "bg-purple-500",
      action: () => window.open("https://youtube.com/kingcaller", "_blank"),
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: Mail,
      status: "24h Response",
      statusColor: "bg-orange-500",
      action: () => window.open("mailto:support@kingcaller.ai", "_blank"),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">How can we help you?</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {supportOptions.map((option, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={option.action}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <option.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-white ${option.statusColor}`}
                  >
                    {option.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {option.description}
                </CardDescription>
                <div className="flex items-center mt-3 text-sm text-blue-600">
                  <span>Learn more</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium">Current Status</span>
          </div>
          <div className="text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>System Status:</span>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                All Systems Operational
              </Badge>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>Support Hours:</span>
              <span className="text-gray-500">24/7 for Enterprise, 9AM-6PM PT for Pro</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
