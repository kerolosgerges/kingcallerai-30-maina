
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Target, Mail, MousePointer, Zap } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const MarketingMetrics = () => {
  const metrics = [
    {
      title: "Marketing ROI",
      value: "312%",
      change: "+23.1%",
      trend: "up",
      icon: DollarSign,
      description: "Return on ad spend"
    },
    {
      title: "Lead Generation",
      value: "2,847",
      change: "+18.7%",
      trend: "up",
      icon: Users,
      description: "New leads this month"
    },
    {
      title: "Conversion Rate",
      value: "23.4%",
      change: "+5.2%",
      trend: "up",
      icon: Target,
      description: "Lead to customer"
    },
    {
      title: "Email Open Rate",
      value: "34.8%",
      change: "-2.3%",
      trend: "down",
      icon: Mail,
      description: "Campaign performance"
    },
    {
      title: "Click-Through Rate",
      value: "4.7%",
      change: "+1.1%",
      trend: "up",
      icon: MousePointer,
      description: "Ad engagement"
    },
    {
      title: "Campaign Efficiency",
      value: "89.2%",
      change: "+7.4%",
      trend: "up",
      icon: Zap,
      description: "Budget utilization"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Marketing Performance</h2>
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
