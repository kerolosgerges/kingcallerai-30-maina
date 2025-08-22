
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Star, Award, Activity } from 'lucide-react';

export const AgentPerformanceKPIs = () => {
  const kpis = [
    {
      title: "Active Agents",
      value: "8",
      description: "Currently online",
      icon: Users
    },
    {
      title: "Average Rating",
      value: "4.8/5",
      description: "Customer satisfaction",
      icon: Star
    },
    {
      title: "Top Performer",
      value: "Sales Agent",
      description: "Highest conversion",
      icon: Award
    },
    {
      title: "Utilization Rate",
      value: "89.3%",
      description: "Agent efficiency",
      icon: Activity
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{kpi.value}</div>
            <p className="text-xs text-orange-600">{kpi.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
