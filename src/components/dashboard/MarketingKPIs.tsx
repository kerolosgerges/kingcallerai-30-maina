
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, MousePointer, TrendingUp } from 'lucide-react';

export const MarketingKPIs = () => {
  const kpis = [
    {
      title: "Lead Generation",
      value: "2,547",
      description: "New leads this month",
      icon: Target
    },
    {
      title: "Conversion Rate",
      value: "18.4%",
      description: "Lead to customer",
      icon: TrendingUp
    },
    {
      title: "Website Visitors",
      value: "45,231",
      description: "Unique visitors",
      icon: Users
    },
    {
      title: "Click-through Rate",
      value: "3.2%",
      description: "Ad performance",
      icon: MousePointer
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{kpi.value}</div>
            <p className="text-xs text-green-600">{kpi.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
