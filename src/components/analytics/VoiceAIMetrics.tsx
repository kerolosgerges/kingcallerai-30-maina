
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Clock, TrendingUp, TrendingDown, Users, MessageSquare } from 'lucide-react';

export const VoiceAIMetrics = () => {
  const metrics = [
    {
      title: "Total Calls",
      value: "12,847",
      change: "+12.5%",
      trend: "up",
      icon: Phone,
      description: "Last 30 days"
    },
    {
      title: "Average Call Duration",
      value: "4m 32s",
      change: "+8.2%",
      trend: "up",
      icon: Clock,
      description: "Avg duration per call"
    },
    {
      title: "Call Success Rate",
      value: "87.3%",
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
      description: "Successful completions"
    },
    {
      title: "Active Agents",
      value: "24",
      change: "+4",
      trend: "up",
      icon: Users,
      description: "Currently deployed"
    },
    {
      title: "Avg Response Time",
      value: "1.2s",
      change: "-15.3%",
      trend: "up",
      icon: MessageSquare,
      description: "Agent response latency"
    },
    {
      title: "Customer Satisfaction",
      value: "4.6/5",
      change: "+0.3",
      trend: "up",
      icon: TrendingUp,
      description: "Based on post-call surveys"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Voice AI Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === "up";
          
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Badge 
                    variant={isPositive ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {metric.change}
                  </Badge>
                  <span>{metric.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
